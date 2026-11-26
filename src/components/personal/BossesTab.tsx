"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import type { Boss } from "@/lib/personal/types";
import { bossStatus, dateKey, formatNumber, parseNumber, type GameState } from "./game";
import type { TabProps } from "./MissionsTab";

const TIERS: { id: Boss["tier"]; title: string; blurb: string }[] = [
  { id: "urgent", title: "Chefões urgentes", blurb: "Quem resolve é o médico. Sua parte: ligar, ir à consulta e não forçar o corpo." },
  { id: "main", title: "Chefões principais", blurb: "Estes caem com rotina: movimento, prato certo, remédio no horário." },
  { id: "side", title: "Missões secundárias", blurb: "Para acompanhar nos próximos exames." },
];

const BP_MIN = 50;
const BP_MAX = 260;

export function BossesTab({ data, state, update, celebrate }: TabProps) {
  function addReading(boss: Boss, value: number) {
    update((prev) => ({ ...prev, labs: { ...prev.labs, [boss.id]: [...(prev.labs[boss.id] ?? []), { date: dateKey(), value }] } }));
    const beaten = boss.target !== null && (boss.dir === "down" ? value <= boss.target : value >= boss.target);
    celebrate(beaten ? "Chefão derrotado" : "Resultado registrado", `${boss.name}: ${formatNumber(value)} ${boss.unit}`);
  }

  function addBp(sys: number, dia: number) {
    const today = dateKey();
    update((prev) => {
      const habitsToday = prev.habits[today] ?? [];
      const habits = habitsToday.includes("bp") ? prev.habits : { ...prev.habits, [today]: [...habitsToday, "bp"] };
      return { ...prev, bp: [...prev.bp, { date: today, sys, dia }], habits };
    });
    celebrate("Pressão registrada", `${sys}/${dia} mmHg`);
  }

  return (
    <div className="pz-stack">
      {TIERS.map((tier) => (
        <section key={tier.id}>
          <h2 className="pz-poster pz-h2">{tier.title}</h2>
          <p className="pz-fine pz-tier-blurb">{tier.blurb}</p>
          <div className="pz-bosses">
            {data.bosses
              .filter((b) => b.tier === tier.id)
              .map((boss) => (
                <BossCard
                  key={boss.id}
                  boss={boss}
                  state={state}
                  onReading={(v) => addReading(boss, v)}
                  onBp={addBp}
                  onWeightTarget={(kg) => update((prev) => ({ ...prev, weightTarget: kg }))}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function BossCard({
  boss,
  state,
  onReading,
  onBp,
  onWeightTarget,
}: {
  boss: Boss;
  state: GameState;
  onReading: (value: number) => void;
  onBp: (sys: number, dia: number) => void;
  onWeightTarget: (kg: number) => void;
}) {
  const status = bossStatus(boss, state);
  const isBp = boss.id === "bp";
  const isWeight = boss.id === "peso";
  const [value, setValue] = useState("");
  const [second, setSecond] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const first = parseNumber(value);
    if (first === null) {
      setError("Valor inválido.");
      return;
    }
    if (isBp) {
      const dia = parseNumber(second);
      if (dia === null || first < BP_MIN || first > BP_MAX || dia < 30 || dia >= first) {
        setError("Confira sistólica/diastólica (ex.: 126 e 81).");
        return;
      }
      onBp(Math.round(first), Math.round(dia));
    } else {
      onReading(first);
    }
    setValue("");
    setSecond("");
    setError(null);
  }

  function submitTarget(e: React.FormEvent) {
    e.preventDefault();
    const kg = parseNumber(second);
    if (kg === null || kg >= boss.start) {
      setError("Meta deve ser menor que o peso inicial.");
      return;
    }
    onWeightTarget(kg);
    setSecond("");
    setError(null);
  }

  const pct = status.progress === null ? 0 : Math.round(status.progress * 100);
  const targetText = isWeight && status.target !== null ? `meta ${formatNumber(status.target)} kg` : boss.targetLabel;

  return (
    <article className={`pz-boss ${boss.tier}${status.beaten ? " beaten" : ""}`}>
      <header>
        <h3>{boss.name}</h3>
        {status.beaten && (
          <span className="pz-chip pz-chip-win">
            <Trophy size={12} /> Derrotado
          </span>
        )}
      </header>
      <p className="pz-boss-now">
        <b>{formatNumber(status.current)}</b> {boss.unit}
        {status.updated && <small> · atualizado {status.updated.slice(8)}/{status.updated.slice(5, 7)}</small>}
      </p>
      <p className="pz-fine">
        Início {formatNumber(boss.start)} → laudo de novembro {formatNumber(boss.current)} · {targetText}
      </p>
      {status.progress !== null ? (
        <div className="pz-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`Progresso contra ${boss.name}`}>
          <div className={`pz-bar-fill ${status.beaten ? "pz-bar-win" : "pz-bar-hot"}`} style={{ width: `${Math.max(pct, 3)}%` }} />
        </div>
      ) : (
        <div className="pz-bar pz-bar-empty" aria-hidden="true" />
      )}
      <p className="pz-boss-how">{boss.how}</p>

      <form onSubmit={submit} className="pz-boss-form">
        <input
          className="pz-input"
          inputMode="decimal"
          placeholder={isBp ? "sistólica" : `novo valor${boss.unit ? ` (${boss.unit})` : ""}`}
          aria-label={isBp ? "Pressão sistólica" : `Novo valor de ${boss.name}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {isBp && <input className="pz-input" inputMode="decimal" placeholder="diastólica" aria-label="Pressão diastólica" value={second} onChange={(e) => setSecond(e.target.value)} />}
        <button type="submit" className="pz-btn">
          Registrar
        </button>
      </form>
      {isWeight && status.target === null && (
        <form onSubmit={submitTarget} className="pz-boss-form">
          <input className="pz-input" inputMode="decimal" placeholder="meta de peso (kg)" aria-label="Meta de peso em kg" value={second} onChange={(e) => setSecond(e.target.value)} />
          <button type="submit" className="pz-btn">
            Definir meta
          </button>
        </form>
      )}
      {error && (
        <p className="pz-err" role="alert">
          {error}
        </p>
      )}
    </article>
  );
}
