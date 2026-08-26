// ─────────────────────────────────────────────────────────────────────────────
//  Raw AI — offerings & pricing (curated). Powers the pricing sections AND what
//  Jarvis quotes when a visitor asks "how much?". Two DISTINCT product lines:
//    1) AI Employees (bots/automation)   2) Website building (sites)
// ─────────────────────────────────────────────────────────────────────────────

export type Tier = {
  slug: string;
  name: { pt: string; en: string };
  price: { pt: string; en: string };
  tagline: { pt: string; en: string };
  features: { pt: string; en: string }[];
  highlight?: boolean; // best value
};

// ── Website building (separate from the AI bots) ──
export const websiteTiers: Tier[] = [
  {
    slug: "essencial",
    name: { pt: "Essencial", en: "Essential" },
    price: { pt: "R$ 2.000", en: "R$ 2,000" },
    tagline: { pt: "Uma landing page profissional que converte.", en: "A professional landing page that converts." },
    features: [
      { pt: "Landing page única, sob medida", en: "Single custom landing page" },
      { pt: "Design premium e 100% responsivo", en: "Premium, fully responsive design" },
      { pt: "Botão de WhatsApp + captação de leads", en: "WhatsApp button + lead capture" },
      { pt: "SEO básico + deploy na sua conta", en: "Basic SEO + deploy to your account" },
    ],
  },
  {
    slug: "profissional",
    name: { pt: "Profissional", en: "Professional" },
    price: { pt: "R$ 5.000", en: "R$ 5,000" },
    tagline: { pt: "O melhor custo-benefício. Site completo pro seu negócio.", en: "Best value. A full site for your business." },
    features: [
      { pt: "Site multi-página com animações cinematográficas", en: "Multi-page site with cinematic motion" },
      { pt: "SEO avançado + performance de ponta", en: "Advanced SEO + top performance" },
      { pt: "Formulários, integrações e portfólio/blog", en: "Forms, integrations and portfolio/blog" },
      { pt: "Bilíngue (PT/EN) se precisar", en: "Bilingual (PT/EN) if needed" },
      { pt: "Painel simples pra você editar", en: "Simple panel for you to edit" },
    ],
    highlight: true,
  },
  {
    slug: "premium",
    name: { pt: "Premium", en: "Premium" },
    price: { pt: "a partir de R$ 9.000", en: "from R$ 9,000" },
    tagline: { pt: "Site + IA integrada. A experiência completa.", en: "Site + integrated AI. The full experience." },
    features: [
      { pt: "Tudo do Profissional, sem limites", en: "Everything in Professional, uncapped" },
      { pt: "Assistente de IA (Jarvis) no seu site", en: "AI assistant (Jarvis) on your site" },
      { pt: "E-commerce, reservas ou painel sob medida", en: "E-commerce, booking or custom dashboard" },
      { pt: "Automação de leads integrada ao seu CRM", en: "Lead automation wired to your CRM" },
      { pt: "Arquitetura sob medida pro seu setor", en: "Architecture tailored to your industry" },
    ],
  },
];

// ── AI Employees (bots/automation) — the other product line ──
export const aiTiers: Tier[] = [
  {
    slug: "setup",
    name: { pt: "Setup de Funcionário IA", en: "AI Employee Setup" },
    price: { pt: "a partir de R$ 15.400", en: "from $2,997" },
    tagline: { pt: "Seu agente de IA completo, no ar 24/7.", en: "Your full AI agent, live 24/7." },
    features: [
      { pt: "Resposta a leads + follow-up automatizado", en: "Lead response + automated follow-up" },
      { pt: "Gestão de CRM e agendamentos", en: "CRM management and scheduling" },
      { pt: "Todos os canais (Slack, email, SMS, WhatsApp)", en: "All channels (Slack, email, SMS, WhatsApp)" },
    ],
    highlight: true,
  },
  {
    slug: "gestao",
    name: { pt: "Gestão IA Mensal", en: "Monthly AI Management" },
    price: { pt: "sob consulta", en: "custom" },
    tagline: { pt: "Otimização e suporte contínuos.", en: "Ongoing optimization and support." },
    features: [
      { pt: "Monitoramento e ajuste dos agentes", en: "Agent monitoring and tuning" },
      { pt: "Melhoria contínua de performance", en: "Continuous performance improvement" },
    ],
  },
  {
    slug: "custom",
    name: { pt: "Soluções Personalizadas", en: "Custom Solutions" },
    price: { pt: "vamos conversar", en: "let's talk" },
    tagline: { pt: "Automação total do negócio, de A a Z.", en: "Full business automation, A to Z." },
    features: [
      { pt: "Arquitetura de IA sob medida", en: "Custom AI architecture" },
      { pt: "Integrações e fluxos específicos do setor", en: "Industry-specific integrations and flows" },
    ],
  },
];

/** Pricing context Jarvis uses to answer "how much?" honestly. */
export function pricingContext(): string {
  const line = (t: Tier) => `  - ${t.name.en} — ${t.price.en}: ${t.tagline.en}`;
  return [
    "WEBSITE BUILDING (sites — separate from the AI bots):",
    ...websiteTiers.map(line),
    "AI EMPLOYEES (bots / automation):",
    ...aiTiers.map(line),
  ].join("\n");
}
