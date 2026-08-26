"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layout, Check } from "lucide-react";
import { useLang, pick } from "@/lib/lang";
import { websiteTiers } from "@/lib/offerings";

export function WebsiteBuilding() {
  const { lang } = useLang();
  return (
    <section id="sites" className="relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12"
          style={{ background: "linear-gradient(160deg, rgba(62,224,255,0.05), rgba(52,245,160,0.04) 60%, transparent)" }}
        >
          <div className="glow-cyan absolute -left-24 top-1/3 h-72 w-72 rounded-full blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-[var(--cyan-bright)]">
                <Layout size={13} /> {pick(lang, { pt: "Outro serviço", en: "Also on offer" })}
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {pick(lang, { pt: "Eu também construo sites", en: "I also build websites" })}
              </h2>
              <p className="mt-3 max-w-lg text-pretty text-muted">
                {pick(lang, {
                  pt: "Sites premium e cinematográficos — separado dos agentes de IA. Do buffet à imobiliária, do estúdio de tênis ao HVAC, esses aqui são reais e estão no ar.",
                  en: "Premium, cinematic websites — separate from the AI agents. Catering to real estate, tennis studio to HVAC, these are real and live.",
                })}
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {websiteTiers.map((t) => (
                  <div key={t.slug} className={`rounded-xl border p-3 ${t.highlight ? "border-[color:rgba(52,245,160,0.4)] bg-[rgba(52,245,160,0.05)]" : "border-white/10 bg-white/[0.02]"}`}>
                    <div className="text-[0.62rem] uppercase tracking-wide text-dim">{pick(lang, t.name)}</div>
                    <div className="mt-0.5 font-display text-base font-bold">{pick(lang, t.price)}</div>
                    {t.highlight && <div className="mt-1 text-[0.58rem] font-semibold text-[var(--green)]">{pick(lang, { pt: "★ melhor valor", en: "★ best value" })}</div>}
                  </div>
                ))}
              </div>
              <Link
                href="/sites"
                className="group mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#04121a] transition-transform hover:-translate-y-0.5"
                style={{ backgroundImage: "var(--grad)" }}
              >
                {pick(lang, { pt: "Ver planos e templates", en: "See plans & templates" })}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <ul className="space-y-2.5">
              {(pick(lang, {
                pt: ["Design que impressiona no primeiro segundo", "No ar em dias, não meses", "SEO e performance de verdade", "Bilíngue quando precisa", "Feito por quem entende de vendas"],
                en: ["Design that lands in the first second", "Live in days, not months", "Real SEO and performance", "Bilingual when you need it", "Built by someone who gets sales"],
              })).map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[var(--text)]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: "var(--grad-soft)" }}>
                    <Check size={12} className="text-[var(--green)]" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
