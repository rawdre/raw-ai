"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useLang, pick } from "@/lib/lang";

const faqs = [
  {
    pt: { q: "Preciso saber de tecnologia pra usar agentes de IA?", a: "Não. Você não precisa saber nada de tecnologia — eu cuido de tudo, do diagnóstico ao deploy. Você só me conta o problema; eu construo a solução." },
    en: { q: "Do I need to know tech to use AI agents?", a: "No. You don't need any tech knowledge — I handle everything, from audit to deploy. You just tell me the problem; I build the solution." },
  },
  {
    pt: { q: "Quão rápido vejo resultados?", a: "Geralmente em dias. A maioria dos sistemas de resposta a leads e follow-up entra no ar em poucos dias e começa a trabalhar imediatamente." },
    en: { q: "How fast do I see results?", a: "Usually in days. Most lead-response and follow-up systems go live within days and start working immediately." },
  },
  {
    pt: { q: "Com que tipos de negócio você trabalha?", a: "Negócios de serviço com pipeline de leads: buffet, restaurantes, HVAC, paisagismo, prestadores de serviço, imobiliárias, consultorias e agências." },
    en: { q: "What kinds of business do you work with?", a: "Service businesses with a lead pipeline: catering, restaurants, HVAC, landscaping, contractors, real estate, consultancies and agencies." },
  },
  {
    pt: { q: "Isso é só um chatbot?", a: "Não. Chatbots respondem perguntas. Meus agentes qualificam leads, fazem follow-up com NEPQ, atualizam o CRM, agendam e conduzem a venda — como um funcionário de verdade." },
    en: { q: "Is this just a chatbot?", a: "No. Chatbots answer questions. My agents qualify leads, run NEPQ follow-ups, update the CRM, book meetings and drive the sale — like a real employee." },
  },
  {
    pt: { q: "Você atende empresas nos EUA e no Brasil?", a: "Sim. Sou bilíngue e passei mais de 16 anos nos EUA. Atendo negócios nos dois países, em português e inglês." },
    en: { q: "Do you serve businesses in the US and Brazil?", a: "Yes. I'm bilingual and spent 16+ years in the US. I serve businesses in both countries, in Portuguese and English." },
  },
];

export function FAQ() {
  const { lang } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-5 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cyan-bright)]">FAQ</div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {pick(lang, { pt: "Perguntas que todo mundo faz", en: "Questions everyone asks" })}
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const item = pick(lang, f);
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display text-base font-medium">{item.q}</span>
                  <Plus size={18} className={`shrink-0 text-[var(--cyan-bright)] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
