"use client";

import { motion } from "framer-motion";
import { Zap, MessageSquareText, Database, Radar, FileText, Clock } from "lucide-react";
import { useLang, pick } from "@/lib/lang";

const items = [
  {
    icon: Zap,
    pt: { t: "Resposta instantânea a leads", d: "Todo lead recebe resposta em segundos — de dia, de madrugada, no fim de semana. Nunca mais um lead frio por demora." },
    en: { t: "Instant lead response", d: "Every lead gets an answer in seconds — day, 3am, weekend. No more cold leads from slow replies." },
  },
  {
    icon: MessageSquareText,
    pt: { t: "Follow-up inteligente (NEPQ)", d: "Sequências de follow-up que soam humanas e usam NEPQ pra qualificar e avançar a venda — como seu melhor vendedor." },
    en: { t: "Smart follow-ups (NEPQ)", d: "Follow-up sequences that sound human and use NEPQ to qualify and move the sale — like your best rep." },
  },
  {
    icon: Database,
    pt: { t: "CRM no piloto automático", d: "Atualiza status, cria tarefas e mantém o pipeline limpo sozinho. Seu CRM finalmente fica em dia." },
    en: { t: "CRM on autopilot", d: "Updates statuses, creates tasks and keeps the pipeline clean by itself. Your CRM finally stays current." },
  },
  {
    icon: Radar,
    pt: { t: "Todos os canais monitorados", d: "Slack, email, SMS e WhatsApp num só cérebro. Nada cai no vácuo." },
    en: { t: "Every channel watched", d: "Slack, email, SMS and WhatsApp in one brain. Nothing slips through." },
  },
  {
    icon: FileText,
    pt: { t: "Orçamentos & agendamentos", d: "Gera orçamentos, agenda reuniões e degustações, e conduz o cliente até o próximo passo." },
    en: { t: "Quotes & scheduling", d: "Generates quotes, books meetings and tastings, and walks the client to the next step." },
  },
  {
    icon: Clock,
    pt: { t: "Operação 24/7/365", d: "Não tira férias, não fica doente, não esquece. Trabalha mais que qualquer um na sua folha." },
    en: { t: "24/7/365 operation", d: "No vacations, no sick days, never forgets. Works harder than anyone on your payroll." },
  },
];

export function Capabilities() {
  const { lang } = useLang();
  return (
    <section id="servicos" className="relative px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cyan-bright)]">
            {pick(lang, { pt: "O que eu construo pra você", en: "What I build for you" })}
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {pick(lang, {
              pt: "Não são chatbots. São funcionários de IA.",
              en: "Not chatbots. AI employees.",
            })}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.article
              key={it.en.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-[color:rgba(62,224,255,0.25)]"
            >
              <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-[image:var(--grad)] transition-transform duration-500 group-hover:scale-x-100" />
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--cyan-bright)]">
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
