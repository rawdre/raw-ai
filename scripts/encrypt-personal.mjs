// Encrypts private/health-data.json (gitignored plaintext) into
// src/lib/personal/health.enc.json (safe to commit: AES-256-GCM, random 256-bit key).
// Usage: node scripts/encrypt-personal.mjs   (reads PERSONAL_DATA_KEY from env or .env.local)
import { readFileSync, writeFileSync } from "node:fs";
import { createCipheriv, randomBytes } from "node:crypto";

function readKey() {
  if (process.env.PERSONAL_DATA_KEY) return process.env.PERSONAL_DATA_KEY.trim();
  const line = readFileSync(".env.local", "utf8").split(/\r?\n/).find((l) => l.startsWith("PERSONAL_DATA_KEY="));
  if (!line) throw new Error("PERSONAL_DATA_KEY not found in env or .env.local");
  return line.slice("PERSONAL_DATA_KEY=".length).trim();
}

const key = Buffer.from(readKey(), "hex");
if (key.length !== 32) throw new Error("PERSONAL_DATA_KEY must be 64 hex chars (32 bytes)");

const plain = JSON.stringify(JSON.parse(readFileSync("private/health-data.json", "utf8")));
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", key, iv);
const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
const out = { v: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") };
writeFileSync("src/lib/personal/health.enc.json", JSON.stringify(out) + "\n");
console.log(`encrypted ${plain.length} chars -> src/lib/personal/health.enc.json`);
