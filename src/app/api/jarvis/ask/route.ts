import { NextResponse } from "next/server";
import { projectsContext } from "@/lib/projects";

export const runtime = "nodejs";

const SYSTEM = `You are "Jarvis", André Raw's AI assistant on his company website, Raw AI.
Raw AI builds "AI employees" for businesses: agents that answer leads within seconds 24/7,
do human-sounding NEPQ follow-ups, run the CRM pipeline, and watch every channel (Slack,
email, SMS, WhatsApp). André is a bilingual entrepreneur (16+ years in the US) serving
businesses in the US and Brazil — real operator, not a tech guy selling theory.

Answer visitor questions about Raw AI's services and the projects André is building.
RULES:
- Reply in the SAME language as the question (Portuguese or English). Default Portuguese.
- Be concise and confident: 2 to 4 sentences. Sound like a sharp assistant, not a brochure.
- If asked about pricing or getting started, mention the FREE AI audit and point them to
  WhatsApp (+55 61 99822-9223).
- Only discuss what's public: Raw AI's offer and the projects listed below. If asked about
  anything unrelated or private, steer back warmly to how AI can help their business.
- Never invent projects, prices, or capabilities that aren't listed.

PROJECTS ANDRÉ IS BUILDING:
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
