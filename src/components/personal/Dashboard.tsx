"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flame, Lock, Star, TriangleAlert } from "lucide-react";
import type { HealthData } from "@/lib/personal/types";
import { levelInfo, streak, totalXp, wantedStars, weekMinutes } from "./game";
import { useGameState } from "./useGameState";
import { MissionsTab } from "./MissionsTab";
import { BossesTab } from "./BossesTab";
import { FoodTab } from "./FoodTab";
import { DossierTab } from "./DossierTab";

const TABS = [
  { id: "missions", label: "Missões" },
  { id: "bosses", label: "Chefões" },
  { id: "food", label: "Abastecimento" },
  { id: "dossier", label: "Dossiê" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const TOAST_MS = 2600;
const MAX_STARS = 5;

export function Dashboard({ data }: { data: HealthData }) {
  const router = useRouter();
  const { state, update, ready, saveFailed } = useGameState();
  const [tab, setTab] = useState<TabId>("missions");
  const [toast, setToast] = useState<{ title: string; detail: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const { game, bosses, meta } = data;
  const xp = useMemo(() => totalXp(state, game), [state, game]);
  const { level, into, span } = levelInfo(xp);
  const rank = game.ranks[Math.min(level - 1, game.ranks.length - 1)];
  const stars = wantedStars(bosses, state);
  const days = streak(state);
  const minutes = weekMinutes(state);

  async function lock() {
    try {
      await fetch("/api/personal/session", { method: "DELETE" });
    } finally {
      router.refresh();
    }
  }

  const celebrate = (title: string, detail: string) => setToast({ title, detail });

  const tabsRef = useRef<HTMLElement>(null);
  function openTab(id: TabId) {
    setTab(id);
    // Each tab is a different length: bring the reader back to its top.
    tabsRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <main className="pz-shell">
      <header className="pz-hero">
        <div className="pz-hero-top">
          <Link href="/" className="pz-back">
            <ArrowLeft size={14} /> Raw AI
          </Link>
          <button type="button" onClick={lock} className="pz-back">
            <Lock size={13} /> Trancar
          </button>
        </div>
        <div className="pz-hero-copy">
          <p className="pz-kicker">{game.subtitle}</p>
          <h1 className="pz-poster pz-hero-title">{game.title}</h1>
          <p className="pz-hero-sub">
            Dossiê de {meta.period} · atualizado em {meta.updated}
          </p>
        </div>
      </header>

      <section className="pz-hud" aria-label="Status do jogador">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/personal/portrait.webp" alt="" className="pz-hud-face" />
        <div className="pz-hud-main">
          <div className="pz-hud-name">
            <span className="pz-poster">{meta.alias}</span>
            <span className="pz-chip">Nível {level}</span>
            <span className="pz-rank">{rank}</span>
          </div>
          <div className="pz-bar" role="progressbar" aria-valuemin={0} aria-valuemax={span} aria-valuenow={into} aria-label="XP do nível">
            <div className="pz-bar-fill pz-bar-xp" style={{ width: `${(into / span) * 100}%` }} />
          </div>
          <p className="pz-hud-xp">
            {ready ? `${into} / ${span} XP para o nível ${level + 1}` : "Carregando progresso…"} · total {xp} XP
          </p>
        </div>
        <dl className="pz-hud-stats">
          <div>
            <dt>Procurado</dt>
            <dd className="pz-stars" aria-label={`${stars} de ${MAX_STARS} estrelas`}>
              {Array.from({ length: MAX_STARS }, (_, i) => (
                <Star key={i} size={17} className={i < stars ? "on" : ""} fill={i < stars ? "currentColor" : "none"} />
              ))}
            </dd>
          </div>
          <div>
            <dt>Sequência</dt>
            <dd>
              <Flame size={16} className="pz-flame" /> {days} {days === 1 ? "dia" : "dias"}
            </dd>
          </div>
          <div>
            <dt>Semana</dt>
            <dd>
              {minutes} / {game.weeklyGoalMin} min
            </dd>
          </div>
        </dl>
      </section>

      <p className="pz-emergency">
        <TriangleAlert size={16} aria-hidden="true" />
        <span>{data.emergency}</span>
      </p>

      {saveFailed && <p className="pz-warn-line">Não consegui salvar neste navegador — o progresso pode se perder ao fechar a aba.</p>}

      <nav ref={tabsRef} className="pz-tabs" aria-label="Seções">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => openTab(t.id)} className={tab === t.id ? "pz-tab on" : "pz-tab"} aria-current={tab === t.id}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "missions" && <MissionsTab data={data} state={state} update={update} celebrate={celebrate} />}
      {tab === "bosses" && <BossesTab data={data} state={state} update={update} celebrate={celebrate} />}
      {tab === "food" && <FoodTab data={data} />}
      {tab === "dossier" && <DossierTab data={data} />}

      <footer className="pz-foot">{meta.disclaimer} O progresso do jogo fica salvo só neste navegador.</footer>

      {toast && (
        <div className="pz-toast" role="status">
          <span className="pz-poster">{toast.title}</span>
          <span>{toast.detail}</span>
        </div>
      )}
    </main>
  );
}
