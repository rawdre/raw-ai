"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Volume2, VolumeX, X } from "lucide-react";
import { useLang, pick } from "@/lib/lang";

type Msg = { role: "you" | "jarvis"; text: string };

export function Jarvis() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const chips = pick(lang, {
    pt: ["O que você está construindo?", "Como a IA responde meus leads?", "Quanto custa?"],
    en: ["What are you building?", "How does the AI answer my leads?", "How much is it?"],
  });

  async function speak(text: string) {
    if (muted) return;
    try {
      audioRef.current?.pause();
      const r = await fetch("/api/jarvis/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) return;
      const url = URL.createObjectURL(await r.blob());
      const a = new Audio(url);
      audioRef.current = a;
      a.play().catch(() => {});
    } catch {
      /* voice is a bonus; ignore */
    }
  }

  async function ask(question?: string) {
    const text = (question ?? q).trim();
    if (!text || thinking) return;
    setQ("");
    setMsgs((m) => [...m, { role: "you", text }]);
    setThinking(true);
    try {
      const r = await fetch("/api/jarvis/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text }),
      });
      const d = await r.json();
      const answer =
        d?.answer ||
        pick(lang, { pt: "Tive um problema agora — tenta de novo?", en: "I hit a snag — try again?" });
      setMsgs((m) => [...m, { role: "jarvis", text: answer }]);
      speak(answer);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "jarvis", text: pick(lang, { pt: "Erro de conexão.", en: "Connection error." }) },
      ]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <>
      {/* Floating orb */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Jarvis"
        className="group fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full"
      >
        <span className="absolute inset-0 animate-pulse-dot rounded-full" style={{ background: "var(--grad)", opacity: 0.35, filter: "blur(6px)" }} />
        <span className="relative grid h-14 w-14 place-items-center rounded-full border border-white/15" style={{ background: "radial-gradient(circle at 30% 30%, #17324a, #0a1420)" }}>
          <span className="h-5 w-5 rounded-full" style={{ background: "var(--grad)", boxShadow: "0 0 16px rgba(52,245,160,0.7)" }} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="glass fixed bottom-24 right-5 z-50 flex h-[30rem] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--grad)", boxShadow: "0 0 10px rgba(52,245,160,0.8)" }} />
                <div>
                  <div className="font-display text-sm font-semibold leading-none">Jarvis</div>
                  <div className="mt-0.5 text-[0.6rem] text-dim">
                    {pick(lang, { pt: "assistente da Raw AI", en: "Raw AI assistant" })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMuted((m) => !m)} aria-label="mute" className="rounded-full p-1.5 text-dim hover:text-[var(--text)]">
                  {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <button onClick={() => setOpen(false)} aria-label="close" className="rounded-full p-1.5 text-dim hover:text-[var(--text)]">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* conversation */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.length === 0 && (
                <div className="text-sm text-muted">
                  {pick(lang, {
                    pt: "Oi! Sou o Jarvis. Pergunta o que quiser sobre a Raw AI e os projetos que o André está construindo.",
                    en: "Hi! I'm Jarvis. Ask me anything about Raw AI and the projects André is building.",
                  })}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {chips.map((c) => (
                      <button key={c} onClick={() => ask(c)} className="rounded-full border border-white/12 px-2.5 py-1 text-[0.68rem] text-muted transition-colors hover:border-[color:rgba(62,224,255,0.4)] hover:text-[var(--text)]">
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={m.role === "you" ? "text-right" : ""}>
                  <div className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === "you" ? "bg-white/[0.06] text-[var(--text)]" : "border-l-2 border-[var(--green)] bg-white/[0.03] text-[var(--text)]"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="text-xs text-[var(--cyan-bright)] opacity-80">
                  {pick(lang, { pt: "Jarvis está pensando…", en: "Jarvis is thinking…" })}
                </div>
              )}
            </div>

            {/* input */}
            <div className="border-t border-white/8 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && ask()}
                  placeholder={pick(lang, { pt: "Pergunta pro Jarvis…", en: "Ask Jarvis…" })}
                  className="flex-1 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-[var(--text)] outline-none placeholder:text-dim focus:border-[color:rgba(62,224,255,0.5)]"
                />
                <button onClick={() => ask()} aria-label="send" className="grid h-9 w-9 place-items-center rounded-full text-[#04121a]" style={{ backgroundImage: "var(--grad)" }}>
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
