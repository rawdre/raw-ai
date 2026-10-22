import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { AUDIT_INBOX, STEPS, fieldError, type Answers } from "@/lib/auditForm";

export const runtime = "nodejs";

// Free-audit intake → André's Gmail. Sent server-side through his own Gmail
// (env GMAIL_USER + GMAIL_APP_PASSWORD) — no third-party form service. The
// subject keeps "AI Audit Request" so the intake protocol picks it up.

const MAX_FIELD = 2000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.set(ip, [...recent, now]);
  return recent.length >= RATE_MAX;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Keep only known fields, coerce types, cap lengths. */
function clean(raw: unknown): Answers {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Answers = {};
  for (const step of STEPS) {
    for (const f of step.fields) {
      const v = src[f.id];
      if (Array.isArray(v)) out[f.id] = v.map((x) => String(x).slice(0, 200)).slice(0, 20);
      else if (v != null) out[f.id] = String(v).slice(0, MAX_FIELD);
    }
  }
  return out;
}

function renderEmail(a: Answers): { html: string; text: string } {
  let html = `<div style="font-family:Arial,sans-serif;max-width:680px">`;
  let text = "";
  for (const step of STEPS) {
    html += `<h3 style="margin:22px 0 8px;color:#0a7f8f">${esc(step.title.pt)}</h3><table style="border-collapse:collapse;width:100%">`;
    text += `\n== ${step.title.pt} ==\n`;
    for (const f of step.fields) {
      const v = a[f.id];
      const val = Array.isArray(v) ? v.join(", ") : (v || "").trim();
      html += `<tr><td style="border:1px solid #ddd;padding:6px 10px;width:40%;background:#f6f8fa;vertical-align:top"><b>${esc(f.label.pt)}</b></td><td style="border:1px solid #ddd;padding:6px 10px;white-space:pre-wrap">${esc(val || "-")}</td></tr>`;
      text += `${f.label.pt}: ${val || "-"}\n`;
    }
    html += `</table>`;
  }
  return { html: html + `</div>`, text };
}

export async function POST(req: Request) {
  const user = process.env.GMAIL_USER || AUDIT_INBOX;
  const pass = process.env.GMAIL_APP_PASSWORD || "";
  if (!pass) {
    console.error("[audit] GMAIL_APP_PASSWORD not configured");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: { answers?: unknown; honey?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (body.honey) return NextResponse.json({ ok: true }); // bot — pretend success

  const answers = clean(body.answers);
  const invalid = STEPS.flatMap((s) => s.fields).find((f) => fieldError(f, answers[f.id]));
  if (invalid) return NextResponse.json({ ok: false, error: "invalid", field: invalid.id }, { status: 400 });

  const biz = String(answers.bizName).replace(/[\r\n]+/g, " ").slice(0, 120);
  const { html, text } = renderEmail(answers);
  try {
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transport.sendMail({
      from: `"Raw AI — Diagnóstico" <${user}>`,
      to: AUDIT_INBOX,
      replyTo: String(answers.email),
      subject: `🚀 AI Audit Request — Diagnóstico grátis — ${biz}`,
      text,
      html,
    });
  } catch (e) {
    console.error("[audit] send failed", e instanceof Error ? e.message : e);
    // Expose only the SMTP error code (e.g. EAUTH/535) — never the message — so setup issues are diagnosable.
    const err = e as { code?: string; responseCode?: number };
    const code = [err.code, err.responseCode].filter(Boolean).join("/") || "unknown";
    return NextResponse.json({ ok: false, error: "send_failed", code }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
