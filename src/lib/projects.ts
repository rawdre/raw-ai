// ─────────────────────────────────────────────────────────────────────────────
//  Raw AI — Projects knowledge base (curated, André-maintained).
//  Single source of truth for BOTH the public "Projetos" portfolio section AND
//  what the website Jarvis knows when a visitor asks "what are you building?".
//  Keep statuses honest; this is client-facing.
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectStatus = "live" | "active" | "demo" | "building" | "proposal";

export type Project = {
  slug: string;
  name: string;
  category: { pt: string; en: string };
  status: ProjectStatus;
  blurb: { pt: string; en: string };
  url?: string; // public link, only when it's safe/ready to show
  gated?: boolean; // behind the password gate (a tool being prepared for sale)
  tags?: string[];
};

export const statusMeta: Record<ProjectStatus, { pt: string; en: string; tone: "green" | "cyan" | "gold" | "muted" }> = {
  live: { pt: "No ar", en: "Live", tone: "green" },
  active: { pt: "Cliente ativo", en: "Active client", tone: "cyan" },
  demo: { pt: "Demo ao vivo", en: "Live demo", tone: "cyan" },
  building: { pt: "Em construção", en: "Building", tone: "gold" },
  proposal: { pt: "Proposta", en: "Proposal", tone: "muted" },
};

export const projects: Project[] = [
  {
    slug: "comeketo",
    name: "Comeketo — Command Center",
    category: { pt: "Automação de vendas", en: "Sales automation" },
    status: "active",
    blurb: {
      pt: "Sistema de vendas autônomo para uma empresa de buffet: responde leads, faz follow-up com NEPQ, cuida do pipeline no Close CRM e entrega relatórios diários.",
      en: "Autonomous sales system for a catering company: answers leads, NEPQ follow-ups, runs the Close CRM pipeline and delivers daily reports.",
    },
    tags: ["Close CRM", "SMS/email", "cron", "NEPQ"],
  },
  {
    slug: "top-imobiliaria",
    name: "Top Imobiliária",
    category: { pt: "Imobiliária", en: "Real estate" },
    status: "live",
    blurb: {
      pt: "Site e Hub de Inteligência de Brasília para uma imobiliária: guias de regiões, simuladores e um assistente de IA — construído em Next.js.",
      en: "Website + Brasília Intelligence Hub for a real-estate agency: regional guides, simulators and an AI assistant — built in Next.js.",
    },
    url: "https://www.topimobiliaria.com",
  },
  {
    slug: "raw-truck-dispatcher",
    name: "Raw Truck Dispatcher",
    category: { pt: "Logística", en: "Logistics" },
    status: "live",
    blurb: {
      pt: "Serviço bilíngue de dispatch para caminhoneiros com taxa fixa de 6% — plataforma completa no ar.",
      en: "Bilingual truck-dispatch service at a flat 6% — full platform live.",
    },
    url: "https://raw-truck-dispatcher.vercel.app",
  },
  {
    slug: "ventic-hvac",
    name: "Ventic HVAC",
    category: { pt: "HVAC / Geração de leads", en: "HVAC / Lead-gen" },
    status: "live",
    blurb: {
      pt: "Site de captação para HVAC com um consultor de IA, fluxos de heat-pump/mini-split e rebates — no ar em ventichvac.com.",
      en: "HVAC lead-gen site with an AI advisor, heat-pump/mini-split flows and rebates — live at ventichvac.com.",
    },
    url: "https://ventichvac.com",
  },
  {
    slug: "jaciel-bike",
    name: "Jaciel Bike Studio",
    category: { pt: "Varejo local", en: "Local retail" },
    status: "building",
    blurb: {
      pt: "Landing para uma bicicletaria em Sobradinho-DF — identidade, catálogo e captação por WhatsApp.",
      en: "Landing for a bike shop in Sobradinho-DF — brand, catalog and WhatsApp capture.",
    },
  },
  {
    slug: "raw-tennis",
    name: "RAW Tennis Club",
    category: { pt: "Esporte / Aulas", en: "Sports / Coaching" },
    status: "live",
    blurb: {
      pt: "Site do RAW Tennis Club (Prof. Luciano Raw) no Clube da Aeronáutica de Brasília.",
      en: "Site for RAW Tennis Club (coach Luciano Raw) at Brasília's Air Force Club.",
    },
    url: "https://rawtennisclub.vercel.app",
  },
  {
    slug: "diana-nails",
    name: "Diana Nails",
    category: { pt: "Beleza / Agendamento", en: "Beauty / Booking" },
    status: "live",
    blurb: {
      pt: "Site de manicure & pedicure com agendamento — Diana Alves.",
      en: "Manicure & pedicure site with booking — Diana Alves.",
    },
    url: "https://diana-nails.vercel.app",
  },
  {
    slug: "mtb-book",
    name: "MTB Brasília — Livro",
    category: { pt: "Conteúdo / Amazon", en: "Content / Amazon" },
    status: "live",
    blurb: {
      pt: "Livro sobre trilhas de mountain bike em Brasília, publicado na Amazon com campanha de lançamento.",
      en: "A mountain-bike trails book for Brasília, published on Amazon with a launch campaign.",
    },
    url: "https://www.amazon.com/dp/B0GQJGGFWS",
  },
  {
    slug: "tool-school",
    name: "Tool School",
    category: { pt: "Curso de IA", en: "AI course" },
    status: "building",
    gated: true,
    blurb: {
      pt: "Espaço do curso Raw AI: ferramentas de IA, projetos e implementação prática — acesso restrito.",
      en: "Raw AI course space: AI tools, projects and hands-on implementation — restricted access.",
    },
  },
  {
    slug: "raw-ai-brasil",
    name: "RAW AI Brasil",
    category: { pt: "Crescimento local", en: "Local growth" },
    status: "building",
    gated: true,
    blurb: {
      pt: "Central do avanço em negócios locais no Brasil: landing + templates de nicho + pipeline dos primeiros prospects — acesso restrito.",
      en: "Hub for the Brazil local-business push: landing + niche templates + first-prospects pipeline — restricted access.",
    },
  },
];

/** Compact context string the website Jarvis uses to answer "what are you building?". */
export function projectsContext(): string {
  return projects
    .map((p) => `- ${p.name} [${p.category.en} · ${statusMeta[p.status].en}]: ${p.blurb.en}${p.url ? ` (${p.url})` : ""}`)
    .join("\n");
}
