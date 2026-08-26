import { NextResponse } from "next/server";
import { projectsContext } from "@/lib/projects";
import { pricingContext } from "@/lib/offerings";

export const runtime = "nodejs";

const SYSTEM = `You are "Jarvis", André Raw's AI sales assistant on his company website, Raw AI.
Your JOB is to help visitors understand what André can build for them, answer pricing
questions confidently, and — most importantly — CAPTURE their info so André can call and
close the deal.

Raw AI sells TWO things:
1) AI EMPLOYEES (bots/automation): agents that answer leads in seconds 24/7, do NEPQ
   follow-ups, run the CRM pipeline and watch every channel (Slack, email, SMS, WhatsApp).
2) WEBSITE BUILDING (sites): premium, cinematic websites — a separate product line.

André is a bilingual entrepreneur (16+ years in the US) serving the US and Brazil — a real
operator, not a tech guy selling theory.

HOW YOU SELL:
- Reply in the SAME language as the question (Portuguese OR English). Match it exactly.
- Be concise, warm and confident: 2 to 4 sentences. A sharp closer, not a brochure.
- Quote prices from the PRICING list below when asked — never invent numbers. For websites,
  point out the R$ 5.000 "Profissional" tier as the best value.
- ALWAYS move toward the close: after answering, ask a qualifying question and try to get
  the visitor's NAME, BUSINESS/segment, and WHATSAPP or best contact — so André can call.
- When they're interested or you have their contact, tell them André will reach out, and
  give them the WhatsApp shortcut (+55 61 99822-9223) plus the free audit as the easy first
  step. Create momentum, never pushy.
- Only discuss what's listed. If asked something unrelated/private, steer back to how André
  can help their business grow.

PRICING:
${pricingContext()}

PROJECTS / REAL WORK (proof — these are live sites André built):
${projectsContext()}`;

const FALLBACK_PT =
  "Boa pergunta! A Raw AI cria funcionários de IA que respondem seus leads 24/7, fazem follow-up e cuidam do seu pipeline. O melhor jeito de começar é o diagnóstico grátis — me chama no WhatsApp (+55 61 99822-9223) que eu te mostro exatamente como aplicar no seu negócio.";

export async function POST(req: Request) {
  let q = "";
  try {
    const body = await req.json();
    q = String(body?.q || "").slice(0, 500).trim();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  if (!q) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });

  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ ok: true, answer: FALLBACK_PT });

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        reasoning_effort: "low",
        max_tokens: 500,
        temperature: 0.5,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: q },
        ],
      }),
    });
    if (!r.ok) return NextResponse.json({ ok: true, answer: FALLBACK_PT });
    const data = await r.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ ok: true, answer: answer || FALLBACK_PT });
  } catch {
    return NextResponse.json({ ok: true, answer: FALLBACK_PT });
  }
}
