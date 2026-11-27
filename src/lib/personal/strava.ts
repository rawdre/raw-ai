// Server-only Strava sync for /personal: trades the long-lived refresh token for a
// short-lived access token and reads the athlete's activities on each page load.
// Nothing is stored — Strava stays the source of truth, so new activities simply appear.
import "server-only";
import type { Activity, StravaFeed, SyncedActivity } from "./types";

const TOKEN_URL = "https://www.strava.com/oauth/token";
const ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";
const REQUEST_TIMEOUT_MS = 4000;
const PAGE_SIZE = 200; // Strava's maximum
const MAX_PAGES = 5;
const TOKEN_SAFETY_MARGIN_S = 120;
const MAX_LABEL_LENGTH = 80;
const DEFAULT_SINCE = "2026-11-20"; // a week before the dashboard went live

// Strava sport_type → dashboard activity id. Anything unlisted counts as the fallback activity.
const SPORT_TO_ACTIVITY: Record<string, string> = {
  Walk: "walk",
  Hike: "walk",
  Ride: "bike",
  VirtualRide: "bike",
  EBikeRide: "bike",
  GravelRide: "bike",
  MountainBikeRide: "mtb",
  EMountainBikeRide: "mtb",
};
const FALLBACK_ACTIVITY = "walk";

type Credentials = { clientId: string; clientSecret: string; refreshToken: string };
type AccessToken = { value: string; expiresAt: number };

let cachedToken: AccessToken | null = null;

function credentials(): Credentials | null {
  const clientId = (process.env.STRAVA_CLIENT_ID || "").trim();
  const clientSecret = (process.env.STRAVA_CLIENT_SECRET || "").trim();
  const refreshToken = (process.env.STRAVA_REFRESH_TOKEN || "").trim();
  return clientId && clientSecret && refreshToken ? { clientId, clientSecret, refreshToken } : null;
}

function sinceEpochSeconds(): number {
  const raw = (process.env.STRAVA_SINCE || "").trim();
  const day = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : DEFAULT_SINCE;
  return Math.floor(new Date(`${day}T00:00:00Z`).getTime() / 1000);
}

async function accessToken(creds: Credentials): Promise<string> {
  const nowS = Date.now() / 1000;
  if (cachedToken && cachedToken.expiresAt - TOKEN_SAFETY_MARGIN_S > nowS) return cachedToken.value;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: creds.refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Strava token refresh failed: HTTP ${res.status}`);
  const body: unknown = await res.json();
  const token = (body as { access_token?: unknown }).access_token;
  const expiresAt = (body as { expires_at?: unknown }).expires_at;
  if (typeof token !== "string" || typeof expiresAt !== "number") throw new Error("Strava token response malformed");
  cachedToken = { value: token, expiresAt };
  return token;
}

/** Validates one raw Strava activity; returns null for anything that is not a usable workout. */
function toSynced(raw: unknown, knownIds: Set<string>): SyncedActivity | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;
  const { id, moving_time: movingTime, start_date_local: startLocal, distance, name } = a;
  if (typeof id !== "number" || typeof movingTime !== "number" || typeof startLocal !== "string") return null;
  if (!/^\d{4}-\d{2}-\d{2}/.test(startLocal)) return null;

  const minutes = Math.round(movingTime / 60);
  if (minutes < 1) return null;

  const sport = typeof a.sport_type === "string" ? a.sport_type : typeof a.type === "string" ? a.type : "";
  const mapped = SPORT_TO_ACTIVITY[sport] ?? FALLBACK_ACTIVITY;
  const km = typeof distance === "number" && distance > 0 ? Math.round(distance / 100) / 10 : null;

  return {
    id: `strava-${id}`,
    date: startLocal.slice(0, 10), // start_date_local is already the athlete's wall-clock time
    activity: knownIds.has(mapped) ? mapped : FALLBACK_ACTIVITY,
    minutes,
    km,
    label: (typeof name === "string" && name.trim() ? name.trim() : sport || "Strava").slice(0, MAX_LABEL_LENGTH),
  };
}

async function fetchActivities(token: string, knownIds: Set<string>): Promise<SyncedActivity[]> {
  const after = sinceEpochSeconds();
  const all: SyncedActivity[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(`${ACTIVITIES_URL}?after=${after}&per_page=${PAGE_SIZE}&page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Strava activities failed: HTTP ${res.status}`);
    const rows: unknown = await res.json();
    if (!Array.isArray(rows)) throw new Error("Strava activities response malformed");
    all.push(...rows.map((r) => toSynced(r, knownIds)).filter((r): r is SyncedActivity => r !== null));
    if (rows.length < PAGE_SIZE) break;
  }
  return all.sort((x, y) => x.date.localeCompare(y.date));
}

/** Never throws: a Strava outage must not take the dashboard down with it. */
export async function loadStravaFeed(activities: Activity[]): Promise<StravaFeed> {
  const creds = credentials();
  if (!creds) return { status: "off", activities: [] };
  try {
    const token = await accessToken(creds);
    const knownIds = new Set(activities.map((a) => a.id));
    return { status: "ok", activities: await fetchActivities(token, knownIds) };
  } catch (err) {
    cachedToken = null;
    console.error("[personal/strava]", err instanceof Error ? err.message : err);
    return { status: "error", activities: [] };
  }
}
