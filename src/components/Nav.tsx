"use client";

import { RawAILogo } from "./RawAILogo";
import { useLang, pick } from "@/lib/lang";

const WHATSAPP =
  "https://wa.me/5561998229223?text=" +
  encodeURIComponent("Oi André! Quero saber sobre IA pro meu negócio.");

export function Nav() {
  const { lang, toggle } = useLang();
  const links = [
    { href: "#servicos", pt: "IA", en: "AI" },
    { href: "#sites", pt: "Sites", en: "Websites" },
    { href: "#projetos", pt: "Projetos", en: "Projects" },
    { href: "#faq", pt: "FAQ", en: "FAQ" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 sm:px-5">
        <a href="#top" className="flex items-center gap-2">
          <RawAILogo />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-[var(--text)]"
            >
              {pick(lang, l)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-semibold text-muted transition-colors hover:text-[var(--text)]"
          >
            {lang === "pt" ? "PT · EN" : "EN · PT"}
          </button>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-1.5 text-sm font-semibold text-[#04121a] shadow-[0_8px_24px_-8px_rgba(52,245,160,0.6)] transition-transform hover:-translate-y-0.5"
            style={{ backgroundImage: "var(--grad)" }}
          >
            {pick(lang, { pt: "Diagnóstico grátis", en: "Free audit" })}
          </a>
        </div>
      </nav>
    </header>
  );
}
