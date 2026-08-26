"use client";

import { AtSign, Mail, MessageCircle } from "lucide-react";
import { RawAILogo } from "./RawAILogo";
import { useLang, pick } from "@/lib/lang";

const WHATSAPP =
  "https://wa.me/5561998229223?text=" +
  encodeURIComponent("Oi André! Quero um diagnóstico de IA pro meu negócio.");

export function Footer() {
  const { lang } = useLang();
  return (
    <footer id="contato" className="relative px-5 pt-20 pb-10">
      <div className="mx-auto max-w-4xl">
        <div className="glass overflow-hidden rounded-3xl p-8 text-center sm:p-12">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {pick(lang, {
              pt: "Pronto pra ter um funcionário de IA?",
              en: "Ready for an AI employee?",
            })}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            {pick(lang, {
              pt: "Me manda uma mensagem. Eu mostro exatamente onde a IA vai te fazer ganhar (ou parar de perder) dinheiro — de graça.",
              en: "Send me a message. I'll show you exactly where AI makes you money (or stops the leaks) — free.",
            })}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#04121a] transition-transform hover:-translate-y-0.5"
              style={{ backgroundImage: "var(--grad)" }}
            >
              <MessageCircle size={16} />
              {pick(lang, { pt: "Falar no WhatsApp", en: "Chat on WhatsApp" })}
            </a>
            <a
              href="https://www.instagram.com/rawaibrz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-semibold transition-colors hover:border-white/25"
            >
              <AtSign size={16} /> @rawaibrz
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <RawAILogo />
            <span className="text-xs text-dim">
              {pick(lang, {
                pt: "Baseado em Brasília, atendendo o mundo. 🌎",
                en: "Based in Brasília, serving the world. 🌎",
              })}
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs text-dim">
            <a href="mailto:rawandre@gmail.com" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--text)]">
              <Mail size={13} /> rawandre@gmail.com
            </a>
            <span>© {new Date().getFullYear()} Raw AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
