// One-time Strava authorization for /personal.
// Reads STRAVA_CLIENT_ID + STRAVA_CLIENT_SECRET from .env.local, waits for the OAuth
// redirect on localhost, and saves STRAVA_REFRESH_TOKEN back into .env.local.
// The Strava API app's "Authorization Callback Domain" must be: localhost
// Usage: node scripts/strava-connect.mjs   → open the printed URL and click Authorize.
import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";

const ENV_FILE = ".env.local";
const PORT = 8723;
const SCOPE = "read,activity:read_all"; // read-only, includes private activities
const WAIT_MS = 10 * 60 * 1000;

function readEnv(name) {
  const line = readFileSync(ENV_FILE, "utf8").split(/\r?\n/).find((l) => l.startsWith(`${name}=`));
  const value = line ? line.slice(name.length + 1).trim() : "";
  if (!value) throw new Error(`${name} is missing in ${ENV_FILE}`);
  return value;
}

function saveEnv(name, value) {
  const lines = readFileSync(ENV_FILE, "utf8").split(/\r?\n/).filter((l) => !l.startsWith(`${name}=`));
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  writeFileSync(ENV_FILE, [...lines, `${name}=${value}`, ""].join("\n"));
}

const clientId = readEnv("STRAVA_CLIENT_ID");
const clientSecret = readEnv("STRAVA_CLIENT_SECRET");
const redirectUri = `http://localhost:${PORT}/callback`;

async function exchange(code) {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, grant_type: "authorization_code" }),
  });
  const body = await res.json();
  if (!res.ok || typeof body.refresh_token !== "string") throw new Error(`token exchange failed: HTTP ${res.status}`);
  return body.refresh_token;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", redirectUri);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const finish = (status, text, exitCode) => {
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" }).end(text);
    console.log(text);
    server.close(() => process.exit(exitCode));
  };
  const code = url.searchParams.get("code");
  const granted = url.searchParams.get("scope") ?? "";
  if (!code) return finish(400, `Strava returned no code (${url.searchParams.get("error") ?? "unknown error"}).`, 1);
  if (!granted.includes("activity:read")) return finish(400, "Activity access was not granted — run again and leave the boxes ticked.", 1);
  try {
    saveEnv("STRAVA_REFRESH_TOKEN", await exchange(code));
    finish(200, "Strava connected. STRAVA_REFRESH_TOKEN saved to .env.local — you can close this tab.", 0);
  } catch (err) {
    finish(500, `Could not finish the Strava connection: ${err instanceof Error ? err.message : err}`, 1);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const authorize = new URL("https://www.strava.com/oauth/authorize");
  authorize.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    approval_prompt: "auto",
    scope: SCOPE,
  }).toString();
  console.log(`Open this URL and click Authorize:\n${authorize}`);
});

setTimeout(() => {
  console.error("Timed out waiting for the Strava redirect.");
  process.exit(1);
}, WAIT_MS).unref();
