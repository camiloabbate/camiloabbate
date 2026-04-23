import { getStore } from "@netlify/blobs";

const store = getStore({ name: "meditation-tracker", consistency: "strong" });
const STATE_KEY = "shared-state";
const ADMIN_EMAIL = (process.env.MEDITATION_ADMIN_EMAIL || "camello187@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = String(process.env.MEDITATION_ADMIN_PASSWORD || "arruabarrena").trim();
const ALLOWED_NAMES = ["Anna", "Joselyn", "Maria Jose", "Camilo"];
const ALLOWED_NAME_SET = new Set(ALLOWED_NAMES);

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function normalizeName(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function makeEntryKey(name, date) {
  return String(name || "").toLowerCase() + "|" + String(date || "");
}

async function readState() {
  const saved = await store.get(STATE_KEY, { type: "json", consistency: "strong" });
  if (saved && typeof saved === "object") {
    return saved;
  }
  return { entries: {} };
}

async function writeState(state) {
  await store.setJSON(STATE_KEY, state);
}

function sortedEntriesFromState(state) {
  return Object.values(state.entries || {})
    .sort((left, right) => {
      if (left.date !== right.date) {
        return left.date.localeCompare(right.date);
      }
      return left.name.localeCompare(right.name);
    });
}

function buildPayload(state) {
  return {
    allowedNames: ALLOWED_NAMES,
    entries: sortedEntriesFromState(state),
  };
}

function parseWeekRange(dateString) {
  const [year, month, day] = String(dateString).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.getDay();
  const offset = weekday === 0 ? 6 : weekday - 1;
  date.setDate(date.getDate() - offset);
  date.setHours(0, 0, 0, 0);
  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 6);
  const toKey = (value) => {
    const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  return { start: toKey(start), end: toKey(end) };
}

function isAdmin(email) {
  return normalizeEmail(email) === ADMIN_EMAIL;
}

function hasAdminPassword(password) {
  return String(password || "").trim() === ADMIN_PASSWORD;
}

async function handleUpsert(body) {
  const name = normalizeName(body.name);
  const date = String(body.date || "").trim();
  const minutes = Number(body.minutes);
  const source = String(body.source || "manual").trim();

  if (!ALLOWED_NAME_SET.has(name)) {
    return jsonResponse(400, { error: "Name must match one of the allowed names exactly." });
  }

  if (!isValidDate(date)) {
    return jsonResponse(400, { error: "Date must be in YYYY-MM-DD format." });
  }

  if (!Number.isFinite(minutes) || minutes < 0 || minutes > 420) {
    return jsonResponse(400, { error: "Minutes must be between 0 and 420." });
  }

  const state = await readState();
  const key = makeEntryKey(name, date);
  const timestamp = new Date().toISOString();

  state.entries[key] = {
    id: key,
    name,
    date,
    minutes: Math.round(minutes),
    source,
    updatedAt: timestamp,
  };

  await writeState(state);
  return jsonResponse(200, buildPayload(state));
}

async function handleBulkUpsert(body) {
  if (!isAdmin(body.adminEmail) || !hasAdminPassword(body.adminPassword)) {
    return jsonResponse(403, { error: "Admin access denied." });
  }

  const incomingEntries = Array.isArray(body.entries) ? body.entries : [];

  if (!incomingEntries.length) {
    return jsonResponse(400, { error: "No entries were provided for import." });
  }

  const state = await readState();
  const timestamp = new Date().toISOString();

  for (const item of incomingEntries) {
    const name = normalizeName(item.name);
    const date = String(item.date || "").trim();
    const minutes = Number(item.minutes);

    if (!ALLOWED_NAME_SET.has(name) || !isValidDate(date) || !Number.isFinite(minutes)) {
      continue;
    }

    const key = makeEntryKey(name, date);
    state.entries[key] = {
      id: key,
      name,
      date,
      minutes: Math.max(0, Math.min(420, Math.round(minutes))),
      source: "whatsapp-import",
      updatedAt: timestamp,
    };
  }

  await writeState(state);
  return jsonResponse(200, buildPayload(state));
}

async function handleResetDay(body) {
  if (!isAdmin(body.adminEmail) || !hasAdminPassword(body.adminPassword)) {
    return jsonResponse(403, { error: "Admin access denied." });
  }

  const date = String(body.date || "").trim();
  if (!isValidDate(date)) {
    return jsonResponse(400, { error: "Select a valid date to clear." });
  }

  const state = await readState();
  for (const key of Object.keys(state.entries || {})) {
    if (state.entries[key].date === date) {
      delete state.entries[key];
    }
  }

  await writeState(state);
  return jsonResponse(200, buildPayload(state));
}

async function handleResetWeek(body) {
  if (!isAdmin(body.adminEmail) || !hasAdminPassword(body.adminPassword)) {
    return jsonResponse(403, { error: "Admin access denied." });
  }

  const anchorDate = String(body.date || "").trim();
  if (!isValidDate(anchorDate)) {
    return jsonResponse(400, { error: "Select a valid date to clear the week." });
  }

  const { start, end } = parseWeekRange(anchorDate);
  const state = await readState();

  for (const key of Object.keys(state.entries || {})) {
    const value = state.entries[key];
    if (value.date >= start && value.date <= end) {
      delete state.entries[key];
    }
  }

  await writeState(state);
  return jsonResponse(200, buildPayload(state));
}

export default async (request) => {
  if (request.method === "GET") {
    const state = await readState();
    return jsonResponse(200, buildPayload(state));
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  let body;
  try {
    body = await request.json();
  } catch (_error) {
    return jsonResponse(400, { error: "Invalid JSON body." });
  }

  const action = String(body.action || "upsert").trim();

  if (action === "upsert") {
    return handleUpsert(body);
  }

  if (action === "bulkUpsert") {
    return handleBulkUpsert(body);
  }

  if (action === "resetDay") {
    return handleResetDay(body);
  }

  if (action === "resetWeek") {
    return handleResetWeek(body);
  }

  return jsonResponse(400, { error: "Unknown action." });
};
