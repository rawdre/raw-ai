"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang, pick } from "@/lib/lang";
import { TiltCard } from "./TiltCard";

const pillars = [
  {
    n: "01",
    href: "#sites",
    img: "/hf/websites.jpg",
    pt: { t: "Sites", k: "Construção de sites", d: "Sites cinematográficos que carregam rápido, rankeiam no Google e transformam visita em conversa no WhatsApp." },
    en: { t: "Websites", k: "Website building", d: "Cinematic sites that load fast, rank on Google and turn visits into WhatsApp conversations." },
  },
  {
    n: "02",
    href: "#marketing",
    img: "/hf/marketing.jpg",
    pt: { t: "Marketing", k: "Estratégia & criativos", d: "Posicionamento, tráfego pago, funis e criativos em foto e vídeo gerados com IA — o que antes custava uma produtora." },
    en: { t: "Marketing", k: "Strategy & creative", d: "Positioning, paid ads, funnels and AI-generated photo and video creative — what used to need a production house." },
  },
  {
    n: "03",
    href: "#robos",
    img: "/hf/robots.jpg",
    pt: { t: "Robôs de IA", k: "Agentes que trabalham", d: "Robôs que respondem leads às 3 da manhã, fazem follow-up, atualizam o CRM e agendam — sem folga." },
    en: { t: "AI Robots", k: "Agents that work", d: "Robots that answer leads at 3am, follow up, update the CRM and book meetings — no days off." },
  },
];

export function Pillars() {
  const { lang } = useLang();
  return (
    <section id="motores" className="relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyan-bright)]">
            {pick(lang, { pt: "// Os 3 motores", en: "// The 3 engines" })}
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            {pick(lang, {
              pt: "Um sistema. Três motores ligados no mesmo cérebro.",
              en: "One system. Three engines wired to the same brain.",
            })}
          </h2>
          <p className="mt-4 text-pretty text-muted">
            {pick(lang, {
              pt: "O site atrai, o marketing traz gente certa, o robô atende e fecha. Você contrata um, ou liga os três.",
              en: "The site attracts, the marketing brings the right people, the robot answers and closes. Hire one, or switch on all three.",
            })}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.a
              key={p.n}
              href={p.href}
              initial={{ opacity: 0, y: 40, rotateX: 12 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
              className="block"
            >
              <TiltCard className="hud overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-1)]">
                <div className="relative aspect-[4/5]">
                  <Image src={p.img} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-0)] via-[rgba(5,7,13,0.35)] to-transparent" />
                  <div className="scanlines absolute inset-0 opacity-60" />
                  <div className="absolute left-5 top-5 font-mono text-xs tracking-[0.2em] text-[var(--cyan-bright)]">{p.n}</div>
                  <ArrowUpRight className="absolute right-5 top-5 text-white/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--green)]" size={20} />
                  <div className="absolute inset-x-5 bottom-5" style={{ transform: "translateZ(40px)" }}>
                    <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--green)]">{pick(lang, p).k}</div>
                    <h3 className="glitch mt-1 font-display text-3xl font-bold">{pick(lang, p).t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text)]/75">{pick(lang, p).d}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
