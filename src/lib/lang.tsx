"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  const toggle = () => setLang((l) => (l === "pt" ? "en" : "pt"));
  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

/** Pick the string for the active language from a { pt, en } pair. */
export function pick<T>(lang: Lang, pair: { pt: T; en: T }): T {
  return pair[lang];
}
