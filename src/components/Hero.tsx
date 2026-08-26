"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLang, pick } from "@/lib/lang";

const WHATSAPP =
  "https://wa.me/5561998229223?text=" +
  encodeURIComponent("Oi André! Quero um diagnóstico de IA pro meu negócio.");

const ease = [0.16, 1, 0.3, 1] as const;
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay: 0.15 + i * 0.09 },
  }),
};

const stats = [
  { value: "24/7", pt: "Sempre trabalhando", en: "Always working" },
  { value: "3h", pt: "Responde às 3 da manhã", en: "Replies at 3am" },
  { value: "0", pt: "Leads esquecidos", en: "Leads forgotten" },
];

export function Hero() {
  const { lang } = useLang();

  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center px-5 pt-28 pb-20">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-muted"
        >
          <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
          {pick(lang, {
            pt: "Agentes de IA trabalhando 24/7 agora mesmo",
            en: "AI agents working 24/7 right now",
          })}
        </motion.div>

        <motion.h1
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          {pick(lang, {
            pt: (
              <>
                Seu negócio merece um{" "}
                <span className="grad-text">Funcionário&nbsp;IA</span> que nunca
                dorme
              </>
            ),
            en: (
              <>
                Your business deserves an{" "}
                <span className="grad-text">AI&nbsp;Employee</span> that never
                sleeps
              </>
            ),
          })}
        </motion.h1>

        <motion.p
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted sm:text-lg"
        >
          {pick(lang, {
            pt: "Eu crio agentes de IA que respondem seus leads às 3 da manhã, fazem follow-up como seu melhor vendedor e cuidam de todo o seu pipeline — pra você focar no que importa.",
            en: "I build AI agents that answer your leads at 3am, follow up like your best salesperson, and run your entire pipeline — so you focus on what matters.",
          })}
        </motion.p>

        <motion.div
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#04121a] shadow-[0_12px_34px_-10px_rgba(52,245,160,0.7)] transition-transform hover:-translate-y-0.5"
            style={{ backgroundImage: "var(--grad)" }}
          >
            <Sparkles size={16} />
            {pick(lang, { pt: "Diagnóstico de IA grátis", en: "Get a free AI audit" })}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#projetos"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[var(--text)] transition-colors hover:border-white/25"
          >
            {pick(lang, { pt: "Ver o que estou construindo", en: "See what I'm building" })}
          </a>
        </motion.div>

        <motion.div
          custom={4}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/8 glass"
        >
          {stats.map((s) => (
            <div key={s.value} className="px-3 py-5">
              <div className="grad-text font-display text-2xl font-bold sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-[0.68rem] leading-tight text-dim sm:text-xs">
                {pick(lang, s)}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
