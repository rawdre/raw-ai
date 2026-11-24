"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Target, Megaphone, Clapperboard, Filter, PenTool, LineChart } from "lucide-react";
import { useLang, pick } from "@/lib/lang";
import { WHATSAPP_MARKETING } from "@/lib/contact";


// Sample creatives generated with Higgsfield for fictional brands (labelled as examples).
const creatives = [
  { src: "/hf/ad-burger.jpg", pt: "Hamburgueria", en: "Burger bar" },
  { src: "/hf/ad-realestate.jpg", pt: "Imobiliária", en: "Real estate" },
  { src: "/hf/ad-gym.jpg", pt: "Academia", en: "Gym" },
  { src: "/hf/ad-coffee.jpg", pt: "Cafeteria", en: "Coffee shop" },
  { src: "/hf/marketing.jpg", pt: "Funil de vendas", en: "Sales funnel" },
];

const services = [
  { icon: Target, pt: { t: "Estratégia & posicionamento", d: "Quem é seu cliente, o que ele quer ouvir e por que escolher você." }, en: { t: "Strategy & positioning", d: "Who your buyer is, what they need to hear and why they pick you." } },
  { icon: Megaphone, pt: { t: "Tráfego pago", d: "Campanhas no Meta e Google com orçamento sob controle e foco em lead." }, en: { t: "Paid ads", d: "Meta and Google campaigns with budget under control and a lead focus." } },
  { icon: Clapperboard, pt: { t: "Criativos com IA", d: "Fotos e vídeos de nível de produtora, gerados com IA em horas." }, en: { t: "AI creative", d: "Production-grade photos and videos, generated with AI in hours." } },
  { icon: Filter, pt: { t: "Funis & landing pages", d: "Do anúncio ao WhatsApp, cada passo pensado pra converter." }, en: { t: "Funnels & landing pages", d: "From ad to WhatsApp, every step built to convert." } },
  { icon: PenTool, pt: { t: "Conteúdo & redes", d: "Calendário, roteiros e posts que mantêm sua marca viva." }, en: { t: "Content & social", d: "Calendar, scripts and posts that keep your brand alive." } },
  { icon: LineChart, pt: { t: "Métricas que importam", d: "Custo por lead, taxa de resposta e vendas — não curtidas." }, en: { t: "Metrics that matter", d: "Cost per lead, reply rate and sales — not likes." } },
];

const RING_SLOTS = 8; // enough cards that the ring always looks full

function CreativeRing() {
  const { lang } = useLang();
  const step = 360 / RING_SLOTS;
  const slots = Array.from({ length: RING_SLOTS }, (_, i) => creatives[i % creatives.length]);
  return (
    <div className="ring-pause relative mx-auto h-[26rem] w-full overflow-hidden [--ring-r:215px] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)] [perspective:1400px] sm:h-[30rem] sm:[--ring-r:290px]">
      <div className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d] [transform:rotateX(-6deg)]">
        <div className="animate-ring [transform-style:preserve-3d]">
          {slots.map((c, i) => (
            <figure
              key={i}
              className="absolute -left-[5.5rem] -top-[7rem] h-56 w-44 overflow-hidden rounded-xl border border-white/15 shadow-[0_20px_60px_-20px_rgba(62,224,255,0.45)] [backface-visibility:hidden] sm:-left-[6.5rem] sm:-top-[8.1rem] sm:h-[16.25rem] sm:w-[13rem]"
              style={{ transform: `rotateY(${i * step}deg) translateZ(var(--ring-r))` }}
            >
              <Image src={c.src} alt="" fill sizes="220px" className="object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/85">
                {pick(lang, c)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-0)] to-transparent" />
    </div>
  );
}

export function Marketing() {
  const { lang } = useLang();
  return (
    <section id="marketing" className="relative overflow-hidden px-5 py-24">
      <div className="glow-green pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyan-bright)]">
              {pick(lang, { pt: "// Motor 02 · Marketing", en: "// Engine 02 · Marketing" })}
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
              {pick(lang, {
                pt: "Estratégia de verdade. Criativos de cinema. Feitos com IA.",
                en: "Real strategy. Cinema-grade creative. Made with AI.",
              })}
            </h2>
            <p className="mt-4 max-w-lg text-pretty text-muted">
              {pick(lang, {
                pt: "Eu monto o plano, crio os anúncios e ligo tudo no robô que atende o lead. O que antes pedia agência + produtora + SDR, agora é um sistema só.",
                en: "I build the plan, create the ads and wire it all to the robot that answers the lead. What used to take an agency + a studio + an SDR is now one system.",
              })}
            </p>
            <a
              href={WHATSAPP_MARKETING}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#04121a] transition-transform hover:-translate-y-0.5"
              style={{ backgroundImage: "var(--grad)" }}
            >
              {pick(lang, { pt: "Quero uma estratégia", en: "Get a strategy" })}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div>
            <CreativeRing />
            <p className="mt-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              {pick(lang, {
                pt: "Exemplos de criativos gerados com IA · marcas fictícias",
                en: "Sample AI-generated creative · fictional brands",
              })}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.en.t}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group bg-[var(--bg-0)] p-6 transition-colors hover:bg-[var(--bg-1)]"
            >
              <s.icon size={20} className="text-[var(--green)] transition-transform group-hover:scale-110" />
              <h3 className="mt-4 font-display text-lg font-semibold">{pick(lang, s).t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{pick(lang, s).d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
