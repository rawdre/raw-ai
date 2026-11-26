// Server-only helpers for the private /personal area: password check, signed session
// cookie, and decryption of the health dossier. Nothing here may be imported by a
// client component — the repo is public and the dossier must never reach the bundle.
import "server-only";
import { createDecipheriv, createHash, createHmac, timingSafeEqual } from "node:crypto";
import encrypted from "./health.enc.json";
import type { HealthData } from "./types";

export const SESSION_COOKIE = "raw_personal";
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days

function dataKey(): Buffer | null {
  const hex = (process.env.PERSONAL_DATA_KEY || "").trim();
  return /^[0-9a-f]{64}$/i.test(hex) ? Buffer.from(hex, "hex") : null;
}

function safeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ab.length === bb.length && ab.length > 0 && timingSafeEqual(ab, bb);
}

/** True when the area is fully configured (key + at least one accepted password hash). */
export function isConfigured(): boolean {
  return dataKey() !== null && acceptedHashes().length > 0;
}

function acceptedHashes(): string[] {
  return (process.env.PERSONAL_PASS_SHA256 || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter((h) => /^[0-9a-f]{64}$/.test(h));
}

export function checkPassword(password: string): boolean {
  const hash = createHash("sha256").update(password, "utf8").digest("hex");
  // Compare against every accepted hash without short-circuiting.
  return acceptedHashes().reduce((ok, h) => safeEqualHex(hash, h) || ok, false);
}

// Sessions are signed with a key derived from the data key, never the data key itself.
function sign(payload: string, key: Buffer): string {
  const sessionKey = createHmac("sha256", key).update("personal-session-key-v1").digest();
  return createHmac("sha256", sessionKey).update(payload).digest("hex");
}

export function createSessionToken(now = Date.now()): string | null {
  const key = dataKey();
  if (!key) return null;
  const expires = String(now + SESSION_MAX_AGE_S * 1000);
  return `${expires}.${sign(expires, key)}`;
}

export function isValidSession(token: string | undefined, now = Date.now()): boolean {
  const key = dataKey();
  if (!key || !token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires) || !/^[0-9a-f]{64}$/.test(signature)) return false;
  if (Number(expires) < now) return false;
  return safeEqualHex(signature, sign(expires, key));
}

export function loadHealthData(): HealthData {
  const key = dataKey();
  if (!key) throw new Error("PERSONAL_DATA_KEY is not configured");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(encrypted.iv, "base64"));
  decipher.setAuthTag(Buffer.from(encrypted.tag, "base64"));
  const plain = Buffer.concat([decipher.update(Buffer.from(encrypted.data, "base64")), decipher.final()]);
  return JSON.parse(plain.toString("utf8")) as HealthData;
}
