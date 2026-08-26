import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Text → speech in Jarvis's voice (Eric). Returns mp3 bytes for the browser to play.
export async function POST(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "no tts key" }, { status: 400 });

  let text = "";
  try {
    const body = await req.json();
    text = String(body?.text || "").replace(/\s+/g, " ").trim().slice(0, 900);
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  if (!text) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });

  const voice = process.env.JARVIS_VOICE_ID || "cjVigY5qzO86Huf0OWal"; // Eric
  const model = process.env.JARVIS_TTS_MODEL || "eleven_multilingual_v2";

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
        }),
      }
    );
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return NextResponse.json({ ok: false, error: `tts ${r.status}`, detail: detail.slice(0, 160) }, { status: 502 });
    }
    const buf = Buffer.from(await r.arrayBuffer());
    return new NextResponse(buf, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
