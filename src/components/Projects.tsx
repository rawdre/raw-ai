"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Lock, Play } from "lucide-react";
import { useLang, pick } from "@/lib/lang";
import { projects, statusMeta, type Project, type ProjectStatus } from "@/lib/projects";

const toneClass: Record<string, string> = {
  green: "text-[var(--green)] border-[color:rgba(52,245,160,0.3)] bg-[rgba(52,245,160,0.08)]",
  cyan: "text-[var(--cyan-bright)] border-[color:rgba(62,224,255,0.3)] bg-[rgba(62,224,255,0.08)]",
  gold: "text-[var(--gold)] border-[color:rgba(255,207,92,0.3)] bg-[rgba(255,207,92,0.08)]",
  muted: "text-muted border-white/12 bg-white/[0.03]",
};

function StatusBadge({ status, lang }: { status: ProjectStatus; lang: "pt" | "en" }) {
  const m = statusMeta[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-semibold ${toneClass[m.tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {pick(lang, m)}
    </span>
  );
}

// Wide cover-image card for the project we most want visitors to open.
function Spotlight({ p, lang }: { p: Project; lang: "pt" | "en" }) {
  return (
    <motion.a
      href={p.url}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group mb-4 grid overflow-hidden rounded-3xl border border-[color:rgba(255,207,92,0.22)] bg-white/[0.02] transition-colors hover:border-[color:rgba(255,207,92,0.45)] lg:grid-cols-[1.25fr_1fr]"
    >
      <div className="relative aspect-video overflow-hidden lg:aspect-auto lg:min-h-[340px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.cover}
          alt={pick(lang, { pt: `Apresentação ${p.name}`, en: `${p.name} presentation` })}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,13,0.75)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[rgba(5,7,13,0.55)]" />
        <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[rgba(5,7,13,0.55)] text-[var(--gold)] ring-1 ring-[color:rgba(255,207,92,0.5)] backdrop-blur transition-transform group-hover:scale-110">
          <Play size={24} className="ml-1" fill="currentColor" />
        </span>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={p.status} lang={lang} />
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            {pick(lang, { pt: "Projeto em destaque", en: "Featured project" })}
          </span>
        </div>
        <h3 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">{p.name}</h3>
        <div className="mt-1 text-xs text-dim">{pick(lang, p.category)}</div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{pick(lang, p.blurb)}</p>
        {p.tags && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="rounded-md border border-white/8 px-2 py-0.5 text-[0.62rem] text-dim">
                {t}
              </span>
            ))}
          </div>
        )}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)]">
          {pick(lang, { pt: "Ver apresentação + vídeo", en: "Watch the presentation" })}
          <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.a>
  );
}

export function Projects() {
  const { lang } = useLang();
  const spotlight = projects.find((p) => p.featured && p.url);
  const rest = projects.filter((p) => p !== spotlight);

  return (
    <section id="projetos" className="relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cyan-bright)]">
            {pick(lang, { pt: "Trabalhos em andamento", en: "Work in progress" })}
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {pick(lang, {
              pt: "Projetos que estou construindo agora",
              en: "Projects I'm building right now",
            })}
          </h2>
          <p className="mt-3 text-pretty text-muted">
            {pick(lang, {
              pt: "Não é teoria. São negócios reais rodando com IA — do buffet à imobiliária, do HVAC ao caminhoneiro.",
              en: "Not theory. Real businesses running on AI — from catering to real estate, HVAC to trucking.",
            })}
          </p>
        </div>

        {spotlight && <Spotlight p={spotlight} lang={lang} />}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => {
            const href = p.url ?? (p.gated ? "/acesso" : undefined);
            const external = !!p.url && !p.url.startsWith("/");
            const Card = href ? "a" : "div";
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.06 }}
              >
                <Card
                  {...(href ? { href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : {})}
                  className="group relative flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:-translate-y-1 hover:border-[color:rgba(62,224,255,0.28)] hover:bg-white/[0.04]"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <StatusBadge status={p.status} lang={lang} />
                    {p.gated ? (
                      <Lock size={14} className="text-dim" />
                    ) : p.url ? (
                      <ArrowUpRight size={16} className="text-dim transition-colors group-hover:text-[var(--cyan-bright)]" />
                    ) : null}
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-tight">{p.name}</h3>
                  <div className="mt-0.5 text-xs text-dim">{pick(lang, p.category)}</div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{pick(lang, p.blurb)}</p>
                  {p.tags && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-md border border-white/8 px-2 py-0.5 text-[0.6rem] text-dim">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
