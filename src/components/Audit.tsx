"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useLang, pick } from "@/lib/lang";

const WHATSAPP =
  "https://wa.me/5561998229223?text=" +
  encodeURIComponent("Oi André! Quero o diagnóstico de IA grátis pro meu negócio.");

const includes = [
  { pt: "Análise do seu tempo de resposta a leads", en: "Your lead response-time analysis" },
  { pt: "Escaneamento de vazamento de leads", en: "Lead-leakage scan" },
  { pt: "Auditoria dos seus canais de comunicação", en: "Communication-channel audit" },
  { pt: "Avaliação de CRM e follow-up", en: "CRM & follow-up assessment" },
  { pt: "Mapa de oportunidades de automação", en: "Automation opportunity map" },
  { pt: "Estimativa de impacto na receita", en: "Revenue-impact estimate" },
];

export function Audit() {
  const { lang } = useLang();
  return (
    <section id="audit" className="relative px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[color:rgba(62,224,255,0.18)] p-8 sm:p-12"
          style={{ background: "linear-gradient(150deg, rgba(62,224,255,0.06), rgba(52,245,160,0.05) 55%, transparent)" }}
        >
          <div className="glow-green absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-[var(--green)]">
                <Sparkles size={13} /> {pick(lang, { pt: "100% grátis", en: "100% free" })}
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {pick(lang, { pt: "Diagnóstico de IA grátis", en: "Free AI audit" })}
              </h2>
              <p className="mt-3 text-pretty text-muted">
                {pick(lang, {
                  pt: "Eu analiso onde seu negócio perde tempo e dinheiro — e te mostro exatamente onde a IA resolve. Sem compromisso.",
                  en: "I analyze where your business loses time and money — and show you exactly where AI fixes it. No strings.",
                })}
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#04121a] transition-transform hover:-translate-y-0.5"
                style={{ backgroundImage: "var(--grad)" }}
              >
                {pick(lang, { pt: "Quero meu diagnóstico", en: "Get my audit" })}
              </a>
            </div>
            <ul className="space-y-2.5">
              {includes.map((it) => (
                <li key={it.en} className="flex items-start gap-3 text-sm text-[var(--text)]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: "var(--grad-soft)" }}>
                    <Check size={12} className="text-[var(--green)]" />
                  </span>
                  {pick(lang, it)}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
