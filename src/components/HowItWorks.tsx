"use client";

import { motion } from "framer-motion";
import { useLang, pick } from "@/lib/lang";

const steps = [
  {
    n: "01",
    pt: { t: "Diagnóstico de IA grátis", d: "Me conta seu maior gargalo. Eu mostro exatamente como a IA resolve — de graça, sem compromisso." },
    en: { t: "Free AI audit", d: "Tell me your biggest bottleneck. I show you exactly how AI fixes it — free, no strings." },
  },
  {
    n: "02",
    pt: { t: "Estratégia personalizada", d: "Desenho um sistema de IA sob medida pro SEU negócio. Nada de receita de bolo." },
    en: { t: "Custom strategy", d: "I design an AI system tailored to YOUR business. No cookie-cutter templates." },
  },
  {
    n: "03",
    pt: { t: "Construção & deploy", d: "Construo seus agentes, integro com suas ferramentas (CRM, email, telefone) e lanço — geralmente em dias." },
    en: { t: "Build & deploy", d: "I build your agents, integrate your tools (CRM, email, phone) and ship — usually in days." },
  },
  {
    n: "04",
    pt: { t: "Otimizar & escalar", d: "Monitoro a performance, ajusto os agentes e escalo o que funciona. Seu negócio cresce no piloto automático." },
    en: { t: "Optimize & scale", d: "I monitor performance, tune the agents and scale what works. Your business grows on autopilot." },
  },
];

export function HowItWorks() {
  const { lang } = useLang();
  return (
    <section id="como" className="relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cyan-bright)]">
            {pick(lang, { pt: "Como funciona", en: "How it works" })}
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {pick(lang, {
              pt: "Do zero ao poder da IA em 4 passos",
              en: "From zero to AI power in 4 steps",
            })}
          </h2>
          <p className="mt-3 text-muted">
            {pick(lang, {
              pt: "Você não precisa saber nada de tecnologia. Eu cuido de tudo.",
              en: "You don't need to know any tech. I handle everything.",
            })}
          </p>
        </div>

        <div className="relative grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="relative rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="grad-text font-display text-4xl font-bold opacity-80">{s.n}</div>
              <h3 className="mt-3 font-display text-base font-semibold">{pick(lang, s).t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{pick(lang, s).d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
