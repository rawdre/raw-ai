"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, Star } from "lucide-react";
import { LangProvider, useLang, pick } from "@/lib/lang";
import { TechBackground } from "@/components/TechBackground";
import { RawAILogo } from "@/components/RawAILogo";
import { Footer } from "@/components/Footer";
import { Jarvis } from "@/components/Jarvis";
import { websiteTiers } from "@/lib/offerings";
import { projects } from "@/lib/projects";

const WHATSAPP = (msg: string) =>
  "https://wa.me/5561998229223?text=" + encodeURIComponent(msg);

function TopBar() {
  const { lang, toggle } = useLang();
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft size={15} className="text-dim" />
          <RawAILogo />
        </Link>
        <button onClick={toggle} className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-semibold text-muted hover:text-[var(--text)]">
          {lang === "pt" ? "PT · EN" : "EN · PT"}
        </button>
      </nav>
    </header>
  );
}

function SitesContent() {
  const { lang } = useLang();
  const templates = projects.filter((p) => p.url && p.status === "live");

  return (
    <main className="flex-1 px-5 pb-10 pt-28">
      <div className="mx-auto max-w-6xl">
        {/* hero */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cyan-bright)]">
            {pick(lang, { pt: "Criação de sites", en: "Website building" })}
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {pick(lang, { pt: "Sites que vendem por você", en: "Websites that sell for you" })}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted">
            {pick(lang, {
              pt: "Um site premium, rápido e feito por quem entende de vendas. Escolha o plano — ou me chama que a gente conversa.",
              en: "A premium, fast site built by someone who gets sales. Pick a plan — or message me and let's talk.",
            })}
          </p>
        </div>

        {/* tiers */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {websiteTiers.map((t, i) => (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
              className={`relative flex flex-col rounded-3xl border p-7 ${t.highlight ? "border-[color:rgba(52,245,160,0.45)] bg-[rgba(52,245,160,0.04)]" : "border-white/10 bg-white/[0.02]"}`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[0.6rem] font-bold text-[#04121a]" style={{ backgroundImage: "var(--grad)" }}>
                  <Star size={10} className="mb-0.5 mr-1 inline" />
                  {pick(lang, { pt: "MELHOR VALOR", en: "BEST VALUE" })}
                </div>
              )}
              <div className="font-display text-lg font-semibold">{pick(lang, t.name)}</div>
              <div className="mt-2 grad-text font-display text-3xl font-bold">{pick(lang, t.price)}</div>
              <p className="mt-2 text-sm text-muted">{pick(lang, t.tagline)}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f.en} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                    <Check size={15} className="mt-0.5 shrink-0 text-[var(--green)]" />
                    {pick(lang, f)}
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP(
                  pick(lang, {
                    pt: `Oi André! Quero um site no plano ${t.name.pt} (${t.price.pt}).`,
                    en: `Hi André! I want a website on the ${t.name.en} plan (${t.price.en}).`,
                  })
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${t.highlight ? "text-[#04121a]" : "border border-white/15 text-[var(--text)]"}`}
                style={t.highlight ? { backgroundImage: "var(--grad)" } : undefined}
              >
                {pick(lang, { pt: "Quero este", en: "I want this" })}
              </a>
            </motion.div>
          ))}
        </div>

        {/* templates / proof */}
        <div className="mt-20">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
            {pick(lang, { pt: "Sites que já construí", en: "Sites I've built" })}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted">
            {pick(lang, { pt: "Clientes reais, no ar. Clique pra visitar.", en: "Real clients, live. Click to visit." })}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((p) => (
              <a
                key={p.slug}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:-translate-y-1 hover:border-[color:rgba(62,224,255,0.3)]"
              >
                <div>
                  <div className="font-display font-semibold">{p.name}</div>
                  <div className="mt-0.5 text-xs text-dim">{pick(lang, p.category)}</div>
                </div>
                <ArrowUpRight size={18} className="text-dim transition-colors group-hover:text-[var(--cyan-bright)]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SitesPage() {
  return (
    <LangProvider>
      <TechBackground />
      <TopBar />
      <SitesContent />
      <Footer />
      <Jarvis />
    </LangProvider>
  );
}
