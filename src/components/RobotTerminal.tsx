"use client";

import { useEffect, useState } from "react";
import { useLang, pick } from "@/lib/lang";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const LINE_MS = 900;

// Illustrative run of a lead-response robot (labelled "simulação" in the UI).
const script = {
  pt: [
    ["03:12:04", "lead.novo", "WhatsApp · “quanto fica pra 80 pessoas?”"],
    ["03:12:06", "robo.qualifica", "data, local, nº de convidados ✓"],
    ["03:12:09", "robo.responde", "resposta enviada em 5s"],
    ["03:12:10", "crm.atualiza", "lead → “Qualificado” · tarefa criada"],
    ["09:00:00", "followup.nepq", "follow-up agendado"],
    ["09:14:31", "agenda.marca", "ligação marcada · 14h"],
  ],
  en: [
    ["03:12:04", "lead.new", "WhatsApp · “how much for 80 guests?”"],
    ["03:12:06", "robot.qualify", "date, venue, guest count ✓"],
    ["03:12:09", "robot.reply", "answer sent in 5s"],
    ["03:12:10", "crm.update", "lead → “Qualified” · task created"],
    ["09:00:00", "followup.nepq", "follow-up scheduled"],
    ["09:14:31", "calendar.book", "call booked · 2pm"],
  ],
};

/** A looping terminal that "types" a robot's night shift. */
export function RobotTerminal() {
  const { lang } = useLang();
  const reduced = usePrefersReducedMotion();
  const lines = pick(lang, script);
  const [tick, setTick] = useState(0);
  const shown = reduced ? lines.length : Math.min(tick, lines.length);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setTick((n) => (n >= lines.length + 3 ? 0 : n + 1)), LINE_MS);
    return () => clearTimeout(t);
  }, [tick, reduced, lines.length]);

  return (
    <div className="hud overflow-hidden rounded-2xl border border-white/10 bg-[#04060b] font-mono text-xs">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5 text-dim">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2">robo-vendas.log</span>
        <span className="ml-auto text-[0.6rem] uppercase tracking-wider">{pick(lang, { pt: "simulação", en: "simulation" })}</span>
      </div>
      <div className="min-h-[14rem] space-y-1.5 p-4">
        {lines.slice(0, shown).map(([time, ev, msg]) => (
          <div key={time + ev} className="flex flex-wrap gap-x-3">
            <span className="text-dim">{time}</span>
            <span className="text-[var(--cyan-bright)]">{ev}</span>
            <span className="text-[var(--text)]/80">{msg}</span>
          </div>
        ))}
        <div className="text-[var(--green)]">
          $ <span className="caret">▮</span>
        </div>
      </div>
    </div>
  );
}
