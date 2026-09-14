import { getStore } from "@netlify/blobs";

/*
 * ECON 57 prep tracker — server-side state + auth.
 * Mirrors the meditation-tracker pattern: Netlify Blobs for storage,
 * env-var credentials, POST actions returning the full state.
 *
 * Credentials — shared across the whole Cameli's Dashboard portal.
 * REQUIRED: set both in Netlify → Site settings → Environment variables.
 *   CAMELIS_DASHBOARD_USER
 *   CAMELIS_DASHBOARD_PASSWORD
 * If either is unset the function fails closed (all sign-ins denied) —
 * there is deliberately no fallback password in this source.
 *
 * Every request is a POST with { user, password, action, ... }.
 * The page shell is public, but no data is returned or written without
 * the correct password, so the actual prep data stays private.
 *
 * Brute-force protection: after MAX_FAILS wrong sign-ins from one IP the
 * IP is locked for LOCK_MS. Enforced here (server-side), so it can't be
 * bypassed by a bot that ignores the page.
 */

const store = getStore({ name: "econ57-tracker", consistency: "strong" });
const STATE_KEY = "shared-state";

const AUTH_USER = String(process.env.CAMELIS_DASHBOARD_USER || "").trim().toLowerCase();
const AUTH_PASSWORD = String(process.env.CAMELIS_DASHBOARD_PASSWORD || "").trim();

const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000; // 15 minutes

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function emptyState() {
  return { items: {}, counters: {}, lists: {}, achievements: {}, meta: { lastUpdated: null } };
}

async function readState() {
  const saved = await store.get(STATE_KEY, { type: "json", consistency: "strong" });
  if (saved && typeof saved === "object") {
    return {
      items: saved.items && typeof saved.items === "object" ? saved.items : {},
      counters: saved.counters && typeof saved.counters === "object" ? saved.counters : {},
      lists: saved.lists && typeof saved.lists === "object" ? saved.lists : {},
      achievements: saved.achievements && typeof saved.achievements === "object" ? saved.achievements : {},
      meta: saved.meta && typeof saved.meta === "object" ? saved.meta : { lastUpdated: null },
    };
  }
  return emptyState();
}

async function writeState(state) {
  state.meta = { lastUpdated: new Date().toISOString() };
  await store.setJSON(STATE_KEY, state);
  return state;
}

function isAuthorized(body) {
  if (!AUTH_USER || !AUTH_PASSWORD) return false; // not configured → deny everyone
  const user = String(body.user || "").trim().toLowerCase();
  const password = String(body.password || "").trim();
  return user === AUTH_USER && password === AUTH_PASSWORD;
}

// item keys look like "<module>|<itemId>", e.g. "chores|couch", "finances|experian", "3|tue"
function isValidKey(key) {
  return /^[a-z0-9]{1,16}\|[a-z0-9_-]{1,32}$/i.test(String(key || ""));
}
function isValidCounterKey(key) {
  return /^[a-z0-9_]{1,32}$/i.test(String(key || ""));
}
function isValidCat(cat) {
  return /^[a-z0-9]{1,16}$/i.test(String(cat || ""));
}
function genId() {
  return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ---- Per-IP brute-force lockout (stored in the same blob store) ---- */
function clientIP(request, context) {
  return request.headers.get("x-nf-client-connection-ip")
    || (context && context.ip)
    || (request.headers.get("x-forwarded-for") || "").split(",")[0].trim()
    || "unknown";
}
function rlKey(ip) { return "rl-" + String(ip).replace(/[^a-zA-Z0-9]/g, "_"); }
async function getRL(ip) {
  const r = await store.get(rlKey(ip), { type: "json" });
  return (r && typeof r === "object") ? r : { fails: 0, lockedUntil: 0 };
}
async function setRL(ip, rec) { await store.setJSON(rlKey(ip), rec); }
async function clearRL(ip) { try { await store.delete(rlKey(ip)); } catch (_e) {} }

export default async (request, context) => {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  let body;
  try {
    body = await request.json();
  } catch (_error) {
    return jsonResponse(400, { error: "Invalid JSON body." });
  }

  const ip = clientIP(request, context);
  const rl = await getRL(ip);
  const now = Date.now();

  // Currently locked out?
  if (rl.lockedUntil && now < rl.lockedUntil) {
    return jsonResponse(429, { error: "Too many attempts. Try again later.", lockedUntil: rl.lockedUntil });
  }
  // Lock has expired → start fresh
  if (rl.lockedUntil && now >= rl.lockedUntil) { rl.fails = 0; rl.lockedUntil = 0; }

  if (!isAuthorized(body)) {
    rl.fails = (rl.fails || 0) + 1;
    if (rl.fails >= MAX_FAILS) {
      rl.lockedUntil = now + LOCK_MS;
      await setRL(ip, rl);
      return jsonResponse(429, { error: "Too many attempts. Try again later.", lockedUntil: rl.lockedUntil });
    }
    await setRL(ip, rl);
    return jsonResponse(403, { error: "Incorrect username or password.", attemptsLeft: MAX_FAILS - rl.fails });
  }

  // Correct credentials → clear any failed-attempt record for this IP
  if (rl.fails || rl.lockedUntil) await clearRL(ip);

  const action = String(body.action || "get").trim();

  // Read-only
  if (action === "get") {
    const state = await readState();
    return jsonResponse(200, state);
  }

  // Toggle a single prep item
  if (action === "toggle") {
    if (!isValidKey(body.key)) {
      return jsonResponse(400, { error: "Invalid item key." });
    }
    const state = await readState();
    if (body.done) {
      state.items[body.key] = { done: true, ts: new Date().toISOString() };
    } else {
      delete state.items[body.key];
    }
    return jsonResponse(200, await writeState(state));
  }

  // Increment/decrement a numeric counter (e.g. papers read)
  if (action === "counter") {
    if (!isValidCounterKey(body.key)) {
      return jsonResponse(400, { error: "Invalid counter key." });
    }
    const delta = Math.trunc(Number(body.delta));
    if (!Number.isFinite(delta) || Math.abs(delta) > 1000) {
      return jsonResponse(400, { error: "Invalid delta." });
    }
    const state = await readState();
    const current = Number(state.counters[body.key]) || 0;
    state.counters[body.key] = Math.max(0, current + delta);
    return jsonResponse(200, await writeState(state));
  }

  // Add a custom to-do item to a category list
  if (action === "addItem") {
    if (!isValidCat(body.cat)) {
      return jsonResponse(400, { error: "Invalid category." });
    }
    const label = String(body.label || "").trim();
    if (!label) return jsonResponse(400, { error: "Item can't be empty." });
    if (label.length > 140) return jsonResponse(400, { error: "Item is too long." });
    const state = await readState();
    if (!Array.isArray(state.lists[body.cat])) state.lists[body.cat] = [];
    if (state.lists[body.cat].length >= 200) {
      return jsonResponse(400, { error: "That list is full." });
    }
    state.lists[body.cat].push({ id: genId(), label });
    return jsonResponse(200, await writeState(state));
  }

  // Remove a custom to-do item (and clear its checkbox state)
  if (action === "removeItem") {
    if (!isValidCat(body.cat)) {
      return jsonResponse(400, { error: "Invalid category." });
    }
    const id = String(body.id || "");
    const state = await readState();
    if (Array.isArray(state.lists[body.cat])) {
      state.lists[body.cat] = state.lists[body.cat].filter((x) => x.id !== id);
    }
    delete state.items[body.cat + "|" + id];
    return jsonResponse(200, await writeState(state));
  }

  // Record an earned achievement (once)
  if (action === "achieve") {
    const id = String(body.id || "").trim();
    if (!/^[a-z0-9-]{1,40}$/.test(id)) {
      return jsonResponse(400, { error: "Invalid achievement id." });
    }
    const state = await readState();
    if (!state.achievements[id]) {
      state.achievements[id] = { ts: new Date().toISOString() };
      return jsonResponse(200, await writeState(state));
    }
    return jsonResponse(200, state);
  }

  // Clear one week's items
  if (action === "resetWeek") {
    const week = String(parseInt(body.week, 10));
    if (!/^\d{1,2}$/.test(week)) {
      return jsonResponse(400, { error: "Invalid week." });
    }
    const state = await readState();
    for (const key of Object.keys(state.items)) {
      if (key.split("|")[0] === week) delete state.items[key];
    }
    return jsonResponse(200, await writeState(state));
  }

  // Wipe everything (kept for manual resets)
  if (action === "resetAll") {
    return jsonResponse(200, await writeState(emptyState()));
  }

  return jsonResponse(400, { error: "Unknown action." });
};
