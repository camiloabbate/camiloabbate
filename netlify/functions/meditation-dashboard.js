const fs = require("fs");
const path = require("path");

const dashboardPath = path.resolve(
  __dirname,
  "..",
  "..",
  "data",
  "meditation-dashboard.json"
);

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function readDashboard() {
  const raw = fs.readFileSync(dashboardPath, "utf8");
  return JSON.parse(raw);
}

exports.handler = async function handler(_event, context) {
  const user = context && context.clientContext && context.clientContext.user;

  if (!user) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Authentication required.",
      }),
    };
  }

  const configuredEmails = (process.env.MEDITATION_ALLOWED_EMAILS || "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);

  const email = normalizeEmail(user.email);

  if (configuredEmails.length > 0 && !configuredEmails.includes(email)) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Your account is signed in, but it is not on the meditation dashboard allowlist.",
      }),
    };
  }

  const dashboard = readDashboard();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...dashboard,
      viewer: {
        email: user.email || "",
        name:
          (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
          user.email ||
          "Member",
      },
    }),
  };
};
