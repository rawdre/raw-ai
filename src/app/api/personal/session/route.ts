import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE_S, checkPassword, createSessionToken, isConfigured } from "@/lib/personal/server";

export const runtime = "nodejs";

const FAIL_DELAY_MS = 700; // slows down online guessing
const MAX_PASSWORD_LENGTH = 200;

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

// POST { password } → sets the signed, httpOnly session cookie for /personal.
export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const token = password && password.length <= MAX_PASSWORD_LENGTH && checkPassword(password) ? createSessionToken() : null;
  if (!token) {
    await new Promise((resolve) => setTimeout(resolve, FAIL_DELAY_MS));
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, { ...cookieBase, maxAge: SESSION_MAX_AGE_S });
  return res;
}

// DELETE → lock the area again on this device.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...cookieBase, maxAge: 0 });
  return res;
}
