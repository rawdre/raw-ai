"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useLang, pick } from "@/lib/lang";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

// Frame sequence extracted from the Higgsfield (Kling 3.0 Pro) assembly film.
export const ASSEMBLY_FRAMES = 96;
const KEYFRAME_STEP = 8;
const SMALL_SCREEN = "(max-width: 767px)";
const frameSrc = (i: number) => `/hf/assembly/f${String(i + 1).padStart(3, "0")}.webp`;

const stages = [
  { pt: { t: "Projeto", d: "Mapeio seu processo de vendas e desenho o robô sob medida." }, en: { t: "Blueprint", d: "I map your sales process and design the robot to fit." } },
  { pt: { t: "Montagem", d: "Cérebro de IA, roteiros NEPQ, regras de segurança." }, en: { t: "Assembly", d: "AI brain, NEPQ scripts, safety rules." } },
  { pt: { t: "Integração", d: "Ligado no seu CRM, WhatsApp, SMS, email e agenda." }, en: { t: "Wiring", d: "Plugged into your CRM, WhatsApp, SMS, email and calendar." } },
  { pt: { t: "Ligado. 24/7.", d: "Responde, faz follow-up e agenda — enquanto você dorme." }, en: { t: "Online. 24/7.", d: "Answers, follows up and books — while you sleep." } },
];

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const { width: cw, height: ch } = ctx.canvas;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}

/** Apple-style scroll-scrubbed film: the robot assembles itself as you scroll. */
export function RobotAssembly() {
  const { lang } = useLang();
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | undefined)[]>([]);
  const current = useRef(0);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Draw frame i — or, while the sequence is still streaming in, the nearest frame that has loaded.
  const paint = (i: number) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const ready = (k: number) => {
      const img = frames.current[k];
      return img?.complete && img.naturalWidth ? img : null;
    };
    for (let d = 0; d < ASSEMBLY_FRAMES; d++) {
      const img = ready(i - d) ?? ready(i + d);
      if (img) {
        drawCover(ctx, img);
        return;
      }
    }
  };

  // Lazy-load the frames once the section is near the viewport.
  useEffect(() => {
    if (reduced || !wrap.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || frames.current.length) return;
        // Phones get every 2nd frame (half the decoded memory); paint() fills gaps with the nearest frame.
        const stride = window.matchMedia(SMALL_SCREEN).matches ? 2 : 1;
        const imgs: (HTMLImageElement | undefined)[] = Array.from({ length: ASSEMBLY_FRAMES }, (_, i) =>
          i % stride === 0 ? new Image() : undefined,
        );
        frames.current = imgs;
        // Keyframes first (every 8th), then fill the gaps — the scrub works coarse-to-fine.
        const order = [...imgs.keys()].sort((a, b) => Number(b % KEYFRAME_STEP === 0) - Number(a % KEYFRAME_STEP === 0));
        for (const i of order) {
          const img = imgs[i];
          if (!img) continue;
          img.decoding = "async";
          img.onload = () => paint(current.current);
          img.src = frameSrc(i);
        }
        io.disconnect();
      },
      { rootMargin: "120% 0px" },
    );
    io.observe(wrap.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Keep the canvas sized to its box (device-pixel aware).
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      paint(current.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(ASSEMBLY_FRAMES - 1, Math.max(0, Math.round(p * (ASSEMBLY_FRAMES - 1))));
    if (i !== current.current) {
      current.current = i;
      requestAnimationFrame(() => paint(i));
    }
    setStage(Math.min(stages.length - 1, Math.floor(p * stages.length)));
  });

  if (reduced) {
    return (
      <div className="relative mx-auto max-w-6xl px-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={frameSrc(ASSEMBLY_FRAMES - 1)} alt="" className="aspect-video w-full rounded-2xl object-cover" />
      </div>
    );
  }

  return (
    <div ref={wrap} data-scrub className="relative h-[320vh]">
      <div
        className="sticky top-0 flex h-[100svh] items-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${frameSrc(0)})` }}
      >
        <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
        <div className="scanlines absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--bg-0)_0%,transparent_22%,transparent_60%,var(--bg-0)_100%)]" />

        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-5 pb-16">
          <div className="hud max-w-md rounded-xl border border-white/10 bg-[rgba(5,7,13,0.6)] p-5 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--cyan-bright)]">
              <span>{pick(lang, { pt: "Construindo seu robô", en: "Building your robot" })}</span>
              <span>{String(stage + 1).padStart(2, "0")}/04</span>
            </div>
            <motion.div key={`${lang}-${stage}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="font-display text-2xl font-bold sm:text-3xl">{pick(lang, stages[stage]).t}</div>
              <p className="mt-1 text-sm text-[var(--text)]/75">{pick(lang, stages[stage]).d}</p>
            </motion.div>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full" style={{ width: bar, backgroundImage: "var(--grad)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
