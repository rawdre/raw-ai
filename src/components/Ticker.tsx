"use client";

import { useLang, pick } from "@/lib/lang";

const events = {
  pt: ["Novo lead → respondido em segundos", "Follow-up NEPQ enviado", "Site publicado", "Criativo de IA gerado", "CRM atualizado sozinho", "Campanha no ar", "Orçamento enviado", "Reunião agendada"],
  en: ["New lead → answered in seconds", "NEPQ follow-up sent", "Website shipped", "AI creative generated", "CRM updated itself", "Campaign live", "Quote sent", "Meeting booked"],
};

/** Endless "system log" tape between hero and the engines. */
export function Ticker() {
  const { lang } = useLang();
  const items = pick(lang, events);
  const row = [...items, ...items];
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-white/8 bg-[rgba(10,14,24,0.7)] py-3">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.16em] text-muted">
        {row.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)] shadow-[0_0_10px_var(--green)]" />
            {t}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--bg-0)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--bg-0)] to-transparent" />
    </div>
  );
}
