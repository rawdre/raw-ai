"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLang, pick } from "@/lib/lang";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { ScrambleText } from "./ScrambleText";
import { WHATSAPP_AUDIT } from "@/lib/contact";

const ease = [0.16, 1, 0.3, 1] as const;
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay: 0.25 + i * 0.1 },
  }),
};

const stats = [
  { value: { pt: "3", en: "3" }, label: { pt: "Motores: sites, marketing, robôs", en: "Engines: sites, marketing, robots" } },
  { value: { pt: "24/7", en: "24/7" }, label: { pt: "Robôs trabalhando", en: "Robots on shift" } },
  { value: { pt: "dias", en: "days" }, label: { pt: "Não meses, pra ir ao ar", en: "Not months, to go live" } },
];

export function Hero() {
  const { lang } = useLang();
  const reduced = usePrefersReducedMotion();
  // Picked in JS (not <source media>) so the poster and film always match; null until hydrated.
  const portrait = useMediaQuery("(orientation: portrait)");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const filmOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const words = pick(lang, {
    pt: ["Sites que vendem.", "Marketing que converte.", "Robôs que nunca dormem."],
    en: ["Websites that sell.", "Marketing that converts.", "Robots that never sleep."],
  });

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-end overflow-hidden md:items-center">
      {/* cinematic film — Higgsfield (Nano Banana Pro still → Kling 3.0 Pro), portrait cut on phones */}
      <motion.div aria-hidden style={reduced ? undefined : { scale: filmScale, opacity: filmOpacity }} className="absolute inset-0">
        <picture>
          <source media="(orientation: portrait)" srcSet="/hf/hero-tall.jpg" />
          <img src="/hf/hero-wide.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        {!reduced && portrait !== null && (
          <video
            key={portrait ? "tall" : "wide"}
            src={portrait ? "/hf/hero-tall.mp4" : "/hf/hero-wide.mp4"}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="scanlines absolute inset-0" />
        <div className="scan-beam absolute inset-x-0 top-0" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,13,0.92)_0%,rgba(5,7,13,0.65)_38%,rgba(5,7,13,0.05)_70%)] max-md:bg-[linear-gradient(180deg,rgba(5,7,13,0.2)_0%,rgba(5,7,13,0.55)_45%,rgba(5,7,13,0.95)_80%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg-0)] to-transparent" />
      </motion.div>

      {/* HUD readouts */}
      <div aria-hidden className="pointer-events-none absolute inset-x-5 top-24 hidden justify-between font-mono text-[0.62rem] tracking-[0.2em] text-[var(--cyan-bright)]/70 md:flex">
        <span>RAW-AI // SYS.ONLINE <span className="caret">▮</span></span>
        <span>BSB −15.79 −47.88 · REC ●</span>
      </div>

      <motion.div style={reduced ? undefined : { y: textY }} className="relative mx-auto w-full max-w-6xl px-5 pt-28 pb-16 md:pb-20">
        <div className="max-w-2xl">
          <motion.div custom={0} variants={rise} initial="hidden" animate="show"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:rgba(62,224,255,0.3)] bg-[rgba(5,7,13,0.55)] px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--cyan-bright)] backdrop-blur"
          >
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
            {pick(lang, { pt: "Sites · Marketing · Robôs de IA", en: "Websites · Marketing · AI Robots" })}
          </motion.div>

          <motion.h1 custom={1} variants={rise} initial="hidden" animate="show"
            className="text-balance text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
          >
            {pick(lang, { pt: "Eu construo a máquina que faz seu negócio crescer.", en: "I build the machine that grows your business." })}
          </motion.h1>

          <motion.div custom={2} variants={rise} initial="hidden" animate="show"
            className="mt-4 min-h-[1.3em] font-mono text-2xl font-semibold sm:text-4xl"
          >
            <span className="text-dim">&gt; </span>
            <ScrambleText words={words} className="grad-text" />
          </motion.div>

          <motion.p custom={3} variants={rise} initial="hidden" animate="show"
            className="mt-6 max-w-xl text-pretty text-base text-[var(--text)]/80 sm:text-lg"
          >
            {pick(lang, {
              pt: "Sites cinematográficos, estratégia de marketing com criativos feitos por IA e robôs que respondem, fazem follow-up e vendem 24/7 — tudo construído por quem vive de vendas.",
              en: "Cinematic websites, marketing strategy with AI-made creative, and robots that answer, follow up and sell 24/7 — all built by someone who lives in sales.",
            })}
          </motion.p>

          <motion.div custom={4} variants={rise} initial="hidden" animate="show" className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP_AUDIT} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#04121a] shadow-[0_12px_34px_-10px_rgba(52,245,160,0.7)] transition-transform hover:-translate-y-0.5"
              style={{ backgroundImage: "var(--grad)" }}
            >
              <Sparkles size={16} />
              {pick(lang, { pt: "Diagnóstico grátis", en: "Free audit" })}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#motores"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-[rgba(5,7,13,0.45)] px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:border-white/30"
            >
              {pick(lang, { pt: "Ver os 3 motores", en: "See the 3 engines" })}
            </a>
          </motion.div>

          <motion.div custom={5} variants={rise} initial="hidden" animate="show"
            className="hud mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-[rgba(5,7,13,0.55)] backdrop-blur"
          >
            {stats.map((s) => (
              <div key={s.label.en} className="px-3 py-4">
                <div className="grad-text font-display text-2xl font-bold sm:text-3xl">{pick(lang, s.value)}</div>
                <div className="mt-1 text-[0.68rem] leading-tight text-muted sm:text-xs">{pick(lang, s.label)}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
