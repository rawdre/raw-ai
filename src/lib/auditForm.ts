// Free-audit intake form — every question needed to diagnose a business across
// the 7 audit areas (site, marketing, response time, lead leakage, CRM/follow-up,
// automation, revenue impact). On submit the lead's WhatsApp opens with every
// answer pre-typed to André's number — they tap Send, he gets it in WhatsApp.

export type T = { pt: string; en: string };
export type Option = { value: string; label: T };

export type Field = {
  id: string;
  label: T;
  kind: "text" | "email" | "tel" | "url" | "textarea" | "single" | "multi";
  required?: boolean;
  placeholder?: T;
  options?: Option[];
  wide?: boolean;
};

export type Step = { id: string; title: T; hint: T; fields: Field[] };

export const WHATSAPP_NUMBER = "5561998229223";

const o = (pt: string, en: string = pt): Option => ({ value: pt, label: { pt, en } });
const YES_NO_SOMETIMES = [o("Sim", "Yes"), o("Não", "No"), o("Às vezes", "Sometimes")];

export const STEPS: Step[] = [
  {
    id: "business",
    title: { pt: "Seu negócio", en: "Your business" },
    hint: { pt: "O básico pra eu saber com quem estou falando.", en: "The basics so I know who I'm talking to." },
    fields: [
      { id: "bizName", label: { pt: "Nome do negócio", en: "Business name" }, kind: "text", required: true },
      { id: "name", label: { pt: "Seu nome", en: "Your name" }, kind: "text", required: true },
      { id: "whatsapp", label: { pt: "WhatsApp", en: "WhatsApp" }, kind: "tel", required: true, placeholder: { pt: "(61) 99999-9999", en: "+1 555 123 4567" } },
      { id: "email", label: { pt: "Email", en: "Email" }, kind: "email", required: true },
      { id: "city", label: { pt: "Cidade / Estado", en: "City / State" }, kind: "text" },
      { id: "role", label: { pt: "Seu cargo", en: "Your role" }, kind: "single", options: [o("Dono(a)", "Owner"), o("Sócio(a)", "Partner"), o("Gerente", "Manager"), o("Marketing"), o("Outro", "Other")] },
      { id: "industry", label: { pt: "Setor", en: "Industry" }, kind: "single", required: true, wide: true, options: [
        o("Alimentação / Restaurante", "Food / Restaurant"), o("Beleza / Estética", "Beauty / Aesthetics"), o("Saúde / Clínica", "Health / Clinic"),
        o("Imobiliária", "Real estate"), o("Serviços residenciais", "Home services"), o("Eventos", "Events"), o("Varejo / Loja", "Retail"),
        o("Educação", "Education"), o("Advocacia / Contabilidade", "Legal / Accounting"), o("Automotivo", "Automotive"), o("Outro", "Other"),
      ] },
      { id: "age", label: { pt: "Tempo de mercado", en: "Time in business" }, kind: "single", options: [o("Menos de 1 ano", "Under 1 year"), o("1–3 anos", "1–3 years"), o("3–10 anos", "3–10 years"), o("10+ anos", "10+ years")] },
      { id: "team", label: { pt: "Tamanho da equipe", en: "Team size" }, kind: "single", options: [o("Só eu", "Just me"), o("2–5"), o("6–20"), o("21–50"), o("50+")] },
      { id: "revenue", label: { pt: "Faturamento mensal (aprox.)", en: "Monthly revenue (approx.)" }, kind: "single", wide: true, options: [
        o("Até R$ 20 mil", "Under $5k"), o("R$ 20–50 mil", "$5–15k"), o("R$ 50–150 mil", "$15–50k"), o("R$ 150–500 mil", "$50–150k"), o("R$ 500 mil+", "$150k+"), o("Prefiro não dizer", "Rather not say"),
      ] },
    ],
  },
  {
    id: "online",
    title: { pt: "Presença online", en: "Online presence" },
    hint: { pt: "Pro raio-X do seu site e redes.", en: "For the X-ray of your site and socials." },
    fields: [
      { id: "site", label: { pt: "Site (se tiver)", en: "Website (if any)" }, kind: "url", placeholder: { pt: "www.seunegocio.com.br", en: "www.yourbusiness.com" } },
      { id: "instagram", label: { pt: "Instagram", en: "Instagram" }, kind: "text", placeholder: { pt: "@seunegocio", en: "@yourbusiness" } },
      { id: "otherSocial", label: { pt: "Outras redes / links (Facebook, TikTok, iFood…)", en: "Other socials / links" }, kind: "text", wide: true },
      { id: "gbp", label: { pt: "Tem perfil no Google (Google Meu Negócio)?", en: "Google Business Profile?" }, kind: "single", options: [o("Sim", "Yes"), o("Não", "No"), o("Não sei", "Not sure")] },
      { id: "siteResult", label: { pt: "Seu site traz clientes hoje?", en: "Does your site bring customers today?" }, kind: "single", options: [o("Sim, bastante", "Yes, plenty"), o("Alguns", "A few"), o("Quase nenhum", "Barely any"), o("Não tenho site", "No website")] },
    ],
  },
  {
    id: "marketing",
    title: { pt: "Marketing e anúncios", en: "Marketing & ads" },
    hint: { pt: "De onde vêm seus clientes e quanto custa trazer cada um.", en: "Where customers come from and what each one costs." },
    fields: [
      { id: "sources", label: { pt: "De onde vêm seus clientes? (marque todos)", en: "Where do customers come from? (all that apply)" }, kind: "multi", required: true, wide: true, options: [
        o("Indicação", "Referrals"), o("Instagram"), o("Facebook"), o("Google (busca)", "Google search"), o("Google Maps"), o("Anúncios pagos", "Paid ads"),
        o("WhatsApp"), o("Site", "Website"), o("TikTok"), o("Marketplaces / apps", "Marketplaces / apps"), o("Passantes / loja física", "Walk-ins"), o("Outro", "Other"),
      ] },
      { id: "adSpend", label: { pt: "Investimento mensal em anúncios", en: "Monthly ad spend" }, kind: "single", wide: true, options: [
        o("Não invisto", "None"), o("Até R$ 1 mil", "Under $250"), o("R$ 1–5 mil", "$250–1k"), o("R$ 5–20 mil", "$1–5k"), o("R$ 20 mil+", "$5k+"),
      ] },
      { id: "whoMarketing", label: { pt: "Quem cuida do marketing?", en: "Who runs marketing?" }, kind: "single", options: [o("Eu mesmo", "Me"), o("Alguém da equipe", "Someone on the team"), o("Agência / freelancer", "Agency / freelancer"), o("Ninguém", "Nobody")] },
      { id: "mktSatisfaction", label: { pt: "Satisfeito com o retorno do marketing?", en: "Happy with marketing results?" }, kind: "single", options: [o("Muito", "Very"), o("Mais ou menos", "Somewhat"), o("Nada", "Not at all"), o("Não meço", "I don't track it")] },
    ],
  },
  {
    id: "response",
    title: { pt: "Atendimento e leads", en: "Leads & response" },
    hint: { pt: "Aqui é onde a maioria dos negócios perde dinheiro sem ver.", en: "This is where most businesses quietly lose money." },
    fields: [
      { id: "leadVolume", label: { pt: "Contatos novos por mês", en: "New inquiries per month" }, kind: "single", options: [o("Até 20", "Under 20"), o("20–50"), o("50–150"), o("150–500"), o("500+"), o("Não sei", "Not sure")] },
      { id: "channels", label: { pt: "Por onde chegam? (marque todos)", en: "Which channels? (all that apply)" }, kind: "multi", options: [o("WhatsApp"), o("Direct do Instagram", "Instagram DMs"), o("Telefone", "Phone"), o("Email"), o("Formulário do site", "Website form"), o("Messenger"), o("Pessoalmente", "In person")] },
      { id: "responseTime", label: { pt: "Quanto tempo leva pra responder um contato novo?", en: "How fast do you reply to a new inquiry?" }, kind: "single", wide: true, options: [o("Menos de 5 min", "Under 5 min"), o("5–30 min"), o("30 min–2 h"), o("2–24 h"), o("Mais de 1 dia", "1 day+"), o("Não sei", "Not sure")] },
      { id: "whoReplies", label: { pt: "Quem responde?", en: "Who replies?" }, kind: "single", options: [o("Eu", "Me"), o("Atendente / recepção", "Front desk"), o("Vendedor", "Salesperson"), o("Cada hora um", "Whoever's free"), o("Robô / automação", "Bot / automation")] },
      { id: "afterHours", label: { pt: "Atende fora do horário e fim de semana?", en: "Covered after hours & weekends?" }, kind: "single", options: YES_NO_SOMETIMES },
      { id: "lostLeads", label: { pt: "Quantos contatos ficam sem resposta ou esfriam?", en: "How many inquiries go cold or unanswered?" }, kind: "single", options: [o("Quase nenhum", "Almost none"), o("Alguns", "Some"), o("Muitos", "A lot"), o("Não faço ideia", "No idea")] },
    ],
  },
  {
    id: "crm",
    title: { pt: "CRM e follow-up", en: "CRM & follow-up" },
    hint: { pt: "Como você acompanha quem ainda não fechou.", en: "How you track people who haven't bought yet." },
    fields: [
      { id: "tracking", label: { pt: "Onde você registra seus clientes e contatos?", en: "Where do you track customers & leads?" }, kind: "single", wide: true, options: [o("CRM"), o("Planilha", "Spreadsheet"), o("Caderno / papel", "Notebook"), o("Só no WhatsApp", "Only in WhatsApp"), o("Em lugar nenhum", "Nowhere")] },
      { id: "crmName", label: { pt: "Qual sistema/CRM usa? (se usar)", en: "Which system/CRM? (if any)" }, kind: "text" },
      { id: "followups", label: { pt: "Quantas vezes você volta a falar com quem não fechou?", en: "How many follow-ups per lead?" }, kind: "single", options: [o("Nenhuma", "None"), o("1"), o("2–3"), o("4+"), o("Depende", "It depends")] },
      { id: "autoFollowup", label: { pt: "Tem follow-up automático?", en: "Any automated follow-up?" }, kind: "single", options: [o("Sim", "Yes"), o("Não", "No"), o("Não sei o que é", "Not sure what that is")] },
      { id: "repeat", label: { pt: "Você chama clientes antigos pra voltar a comprar?", en: "Do you bring past customers back?" }, kind: "single", options: YES_NO_SOMETIMES },
    ],
  },
  {
    id: "sales",
    title: { pt: "Vendas e receita", en: "Sales & revenue" },
    hint: { pt: "Pra calcular quanto dinheiro está ficando na mesa.", en: "To estimate how much money is left on the table." },
    fields: [
      { id: "ticket", label: { pt: "Valor médio por cliente / venda", en: "Average sale per customer" }, kind: "text", placeholder: { pt: "ex: R$ 350", en: "e.g. $350" } },
      { id: "conversion", label: { pt: "De cada 10 contatos, quantos fecham?", en: "Out of 10 inquiries, how many buy?" }, kind: "single", options: [o("0–1"), o("2–3"), o("4–5"), o("6+"), o("Não sei", "Not sure")] },
      { id: "whyNot", label: { pt: "Principal motivo de quem NÃO fecha", en: "#1 reason people DON'T buy" }, kind: "single", wide: true, options: [o("Preço", "Price"), o("Demora no atendimento", "Slow response"), o("Some / para de responder", "They ghost"), o("Foi pro concorrente", "Went to a competitor"), o("Não era o momento", "Bad timing"), o("Não sei", "Not sure")] },
      { id: "goal", label: { pt: "Meta pros próximos 12 meses", en: "Goal for the next 12 months" }, kind: "textarea", wide: true, placeholder: { pt: "ex: dobrar o faturamento, abrir 2ª unidade…", en: "e.g. double revenue, open a 2nd location…" } },
    ],
  },
  {
    id: "priorities",
    title: { pt: "Suas prioridades", en: "Your priorities" },
    hint: { pt: "Onde dói mais — é por aqui que eu começo.", en: "Where it hurts most — that's where I start." },
    fields: [
      { id: "pains", label: { pt: "O que mais te atrapalha hoje? (marque todos)", en: "What's hurting most? (all that apply)" }, kind: "multi", required: true, wide: true, options: [
        o("Poucos clientes novos", "Not enough new customers"), o("Demoro pra responder", "Slow replies"), o("Perco contatos no WhatsApp", "Leads lost in WhatsApp"),
        o("Sem tempo pro marketing", "No time for marketing"), o("Anúncio não dá retorno", "Ads don't pay off"), o("Site fraco ou inexistente", "Weak or no website"),
        o("Tarefas repetitivas", "Repetitive tasks"), o("Não sei meus números", "Don't know my numbers"), o("Equipe sobrecarregada", "Team overloaded"),
      ] },
      { id: "repetitive", label: { pt: "Que tarefa repetitiva come seu tempo toda semana?", en: "Which repetitive task eats your time every week?" }, kind: "textarea", wide: true },
      { id: "oneFix", label: { pt: "Se eu pudesse resolver UMA coisa amanhã, qual seria?", en: "If I could fix ONE thing tomorrow, what would it be?" }, kind: "textarea", required: true, wide: true },
      { id: "interest", label: { pt: "Tem interesse em", en: "Interested in" }, kind: "multi", options: [o("Site novo", "New website"), o("Marketing / anúncios", "Marketing / ads"), o("Robô de IA (atendimento)", "AI robot (customer service)"), o("Automação / CRM", "Automation / CRM"), o("Ainda não sei", "Not sure yet")] },
      { id: "bestTime", label: { pt: "Melhor horário pra eu te chamar", en: "Best time to reach you" }, kind: "single", options: [o("Manhã", "Morning"), o("Tarde", "Afternoon"), o("Noite", "Evening"), o("Qualquer horário", "Anytime")] },
    ],
  },
];

export type Answers = Record<string, string | string[]>;

export function isFilled(v: string | string[] | undefined): boolean {
  return Array.isArray(v) ? v.length > 0 : !!(v && v.trim());
}

/** Field-level validation → error key or null. */
export function fieldError(f: Field, v: string | string[] | undefined): "required" | "email" | "phone" | null {
  if (!isFilled(v)) return f.required ? "required" : null;
  const s = String(v).trim();
  if (f.kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return "email";
  if (f.kind === "tel" && s.replace(/\D/g, "").length < 8) return "phone";
  return null;
}

/** The WhatsApp message André receives — PT labels, only answered fields, grouped by step. */
export function buildWhatsAppMessage(a: Answers): string {
  const lines = [`🚀 *Diagnóstico grátis — ${String(a.bizName || "").trim() || "novo negócio"}*`];
  for (const step of STEPS) {
    const rows = step.fields
      .filter((f) => isFilled(a[f.id]))
      .map((f) => {
        const v = a[f.id];
        const label = f.label.pt.replace(/\s*\([^)]*\)/, ""); // drop "(marque todos)"-style hints
        return `• ${label}: ${Array.isArray(v) ? v.join(", ") : String(v).trim()}`;
      });
    if (rows.length) lines.push("", `*${step.title.pt}*`, ...rows);
  }
  return lines.join("\n");
}

export function whatsAppUrl(a: Answers): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(a))}`;
}
