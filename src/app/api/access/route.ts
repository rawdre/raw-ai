import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Verify the access code for the gated tool areas. The real code lives ONLY in the
// env var RAW_AI_ACCESS_CODE (server-side) — never shipped to the browser.
export async function POST(req: Request) {
  const expected = process.env.RAW_AI_ACCESS_CODE || "";
  let code = "";
  try {
    const body = await req.json();
    code = String(body?.code || "").trim();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ok = !!expected && code === expected;
  return NextResponse.json({ ok });
}
