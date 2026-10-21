"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, MessageSquareText, Database, Radar, FileText, Clock, Bot } from "lucide-react";
import { useLang, pick } from "@/lib/lang";
import { WHATSAPP_ROBOT } from "@/lib/contact";
import { RobotAssembly } from "./RobotAssembly";
import { RobotTerminal } from "./RobotTerminal";

const items = [
  {
    icon: Zap,
    pt: { t: "Resposta instantânea a leads", d: "Todo lead recebe resposta em segundos — de dia, de madrugada, no fim de semana." },
    en: { t: "Instant lead response", d: "Every lead gets an answer in seconds — day, 3am, weekend." },
  },
  {
    icon: MessageSquareText,
    pt: { t: "Follow-up inteligente (NEPQ)", d: "Sequências que soam humanas e usam NEPQ pra qualificar e avançar a venda." },
    en: { t: "Smart follow-ups (NEPQ)", d: "Sequences that sound human and use NEPQ to qualify and move the sale." },
  },
  {
    icon: Database,
    pt: { t: "CRM no piloto automático", d: "Atualiza status, cria tarefas e mantém o pipeline limpo sozinho." },
    en: { t: "CRM on autopilot", d: "Updates statuses, creates tasks and keeps the pipeline clean by itself." },
  },
  {
    icon: Radar,
    pt: { t: "Todos os canais", d: "Slack, email, SMS e WhatsApp num só cérebro. Nada cai no vácuo." },
    en: { t: "Every channel", d: "Slack, email, SMS and WhatsApp in one brain. Nothing slips through." },
  },
  {
    icon: FileText,
    pt: { t: "Orçamentos & agendamentos", d: "Gera orçamentos, agenda reuniões e conduz o cliente até o próximo passo." },
    en: { t: "Quotes & scheduling", d: "Generates quotes, books meetings and walks the client to the next step." },
  },
  {
    icon: Clock,
    pt: { t: "Operação 24/7/365", d: "Não tira férias, não fica doente, não esquece." },
    en: { t: "24/7/365 operation", d: "No vacations, no sick days, never forgets." },
  },
];

export function Robots() {
  const { lang } = useLang();
  return (
    <section id="robos" className="relative">
      <div className="mx-auto max-w-6xl px-5 pt-24 pb-10">
        <div className="max-w-2xl">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyan-bright)]">
            {pick(lang, { pt: "// Motor 03 · Robôs de IA", en: "// Engine 03 · AI Robots" })}
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            {pick(lang, { pt: "Não são chatbots. São robôs que trabalham.", en: "Not chatbots. Robots that work." })}
          </h2>
          <p className="mt-4 text-pretty text-muted">
            {pick(lang, {
              pt: "Role a página e veja um robô ser montado — é assim que eu construo o seu, peça por peça.",
              en: "Scroll and watch a robot get built — that's how I build yours, piece by piece.",
            })}
          </p>
        </div>
      </div>

      <RobotAssembly />

      <div className="mx-auto max-w-6xl px-5 pt-16 pb-24">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hud relative min-h-[22rem] overflow-hidden rounded-2xl border border-white/10"
          >
            <Image src="/hf/robots.jpg" alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-0)] via-transparent to-transparent" />
            <div className="scan-beam absolute inset-x-0 top-0" />
            <div className="absolute inset-x-5 bottom-5">
              <a
                href={WHATSAPP_ROBOT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#04121a] transition-transform hover:-translate-y-0.5"
                style={{ backgroundImage: "var(--grad)" }}
              >
                <Bot size={16} />
                {pick(lang, { pt: "Quero meu robô", en: "Build my robot" })}
              </a>
            </div>
          </motion.div>
          <RobotTerminal />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.article
              key={it.en.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-[color:rgba(62,224,255,0.3)]"
            >
              <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-[image:var(--grad)] transition-transform duration-500 group-hover:scale-x-100" />
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--cyan-bright)] transition-shadow group-hover:shadow-[0_0_24px_rgba(62,224,255,0.35)]">
                <it.icon size={20} />
              </div>
              <h3 className="font-display text-lg font-semibold">{pick(lang, it).t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{pick(lang, it).d}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
