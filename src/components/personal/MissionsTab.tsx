"use client";

import { useState } from "react";
import { Check, Lock, RefreshCw, Trash2 } from "lucide-react";
import type { Activity, HealthData, StravaFeed } from "@/lib/personal/types";
import { dateKey, lastDays, parseNumber, weekMinutes, type GameState, type LogEntry } from "./game";

export type TabProps = {
  data: HealthData;
  state: GameState;
  update: (change: (prev: GameState) => GameState) => void;
  celebrate: (title: string, detail: string) => void;
};

type MissionsProps = TabProps & { stravaStatus: StravaFeed["status"]; syncedCount: number };

const MAX_MINUTES = 600;
const RECENT_LOG_COUNT = 8;
const WEEKDAY = ["D", "S", "T", "Q", "Q", "S", "S"];

export function MissionsTab({ data, state, update, celebrate, stravaStatus, syncedCount }: MissionsProps) {
  const { game } = data;
  const today = dateKey();
  const doneToday = state.habits[today] ?? [];
  const minutes = weekMinutes(state);
  const week = lastDays(7);

  function toggleHabit(id: string, xp: number) {
    const wasDone = doneToday.includes(id);
    update((prev) => {
      const current = prev.habits[today] ?? [];
      const next = wasDone ? current.filter((h) => h !== id) : [...current, id];
      return { ...prev, habits: { ...prev.habits, [today]: next } };
    });
    if (!wasDone) celebrate("Hábito cumprido", `+${xp} XP`);
  }

  function toggleStory(id: string, name: string, xp: number) {
    const wasDone = state.story.includes(id);
    update((prev) => ({ ...prev, story: wasDone ? prev.story.filter((s) => s !== id) : [...prev.story, id] }));
    if (!wasDone) celebrate("Missão cumprida", `${name} · +${xp} XP`);
  }

  function addLog(activity: Activity, mins: number, km: number | null) {
    const entry: LogEntry = { id: `${Date.now()}`, date: today, activity: activity.id, minutes: mins, km };
    update((prev) => ({ ...prev, log: [...prev.log, entry] }));
    celebrate("Missão cumprida", `${activity.name} · ${mins} min · +${Math.round(mins * activity.xpPerMin)} XP`);
  }

  const removeLog = (id: string) => update((prev) => ({ ...prev, log: prev.log.filter((e) => e.id !== id) }));
  const activityName = (id: string) => game.activities.find((a) => a.id === id)?.name ?? id;
  const recent = state.log.slice(-RECENT_LOG_COUNT).reverse();

  return (
    <div className="pz-stack">
      <section>
        <h2 className="pz-poster pz-h2">Rua · registrar atividade</h2>
        <div className="pz-lock-note">
          <Lock size={16} aria-hidden="true" />
          <div>
            <p>{state.cleared ? "Esforço intenso liberado pelo seu médico. Respeite os sinais do corpo." : game.lockNote}</p>
            <ClearanceToggle
              cleared={state.cleared}
              onChange={(cleared) => {
                update((prev) => ({ ...prev, cleared }));
                if (cleared) celebrate("Área destravada", "MTB e treino forte liberados");
              }}
            />
          </div>
        </div>
        <div className="pz-acts">
          {game.activities.map((a) => (
            <ActivityCard key={a.id} activity={a} locked={a.locked && !state.cleared} onLog={(m, km) => addLog(a, m, km)} />
          ))}
        </div>

        <div className="pz-week">
          <div className="pz-week-head">
            <strong>Semana (7 dias)</strong>
            <span>
              {minutes} / {game.weeklyGoalMin} min
            </span>
          </div>
          <div className="pz-bar" role="progressbar" aria-valuemin={0} aria-valuemax={game.weeklyGoalMin} aria-valuenow={Math.min(minutes, game.weeklyGoalMin)} aria-label="Minutos na semana">
            <div className="pz-bar-fill pz-bar-cyan" style={{ width: `${Math.min(100, (minutes / game.weeklyGoalMin) * 100)}%` }} />
          </div>
          <div className="pz-days">
            {week.map((day) => {
              const mins = state.log.filter((e) => e.date === day).reduce((s, e) => s + e.minutes, 0);
              return (
                <div key={day} className={mins > 0 ? "pz-day on" : "pz-day"} title={`${day}: ${mins} min`}>
                  <span>{WEEKDAY[new Date(`${day}T12:00:00`).getDay()]}</span>
                  <b>{mins > 0 ? mins : "·"}</b>
                </div>
              );
            })}
          </div>
          <p className="pz-fine">{game.weeklyGoalNote}</p>
        </div>

        {stravaStatus !== "off" && (
          <p className={stravaStatus === "ok" ? "pz-sync" : "pz-sync bad"}>
            <RefreshCw size={13} aria-hidden="true" />
            {stravaStatus === "ok"
              ? `Strava conectado · ${syncedCount} ${syncedCount === 1 ? "atividade sincronizada" : "atividades sincronizadas"} · entra sozinho, é só recarregar`
              : "Strava não respondeu agora — as atividades sincronizadas voltam ao recarregar."}
          </p>
        )}

        {recent.length > 0 && (
          <ul className="pz-log">
            {recent.map((e) => (
              <li key={e.id}>
                <span>
                  {e.date.slice(8)}/{e.date.slice(5, 7)} · {e.label ?? activityName(e.activity)} · {e.minutes} min{e.km ? ` · ${e.km} km` : ""}
                </span>
                {e.source === "strava" ? (
                  <span className="pz-src">Strava</span>
                ) : (
                  <button type="button" onClick={() => removeLog(e.id)} aria-label="Remover registro" className="pz-icon-btn">
                    <Trash2 size={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="pz-poster pz-h2">
          Rotina de hoje{" "}
          <small>
            {doneToday.length}/{game.habits.length}
          </small>
        </h2>
        <ul className="pz-checks">
          {game.habits.map((h) => {
            const done = doneToday.includes(h.id);
            return (
              <li key={h.id}>
                <button type="button" onClick={() => toggleHabit(h.id, h.xp)} className={done ? "pz-check on" : "pz-check"} aria-pressed={done}>
                  <span className="pz-box">{done && <Check size={14} />}</span>
                  <span className="pz-check-name">{h.name}</span>
                  <span className="pz-xp">+{h.xp}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="pz-poster pz-h2">
          Missões da história{" "}
          <small>
            {state.story.length}/{game.story.length}
          </small>
        </h2>
        <ul className="pz-story">
          {game.story.map((s) => {
            const done = state.story.includes(s.id);
            return (
              <li key={s.id} className={done ? "done" : ""}>
                <button type="button" onClick={() => toggleStory(s.id, s.name, s.xp)} className="pz-box" aria-pressed={done} aria-label={`Marcar ${s.name}`}>
                  {done && <Check size={14} />}
                </button>
                <div>
                  <p className="pz-story-head">
                    <strong>{s.name}</strong>
                    <span className="pz-when">{s.when}</span>
                    <span className="pz-xp">+{s.xp}</span>
                  </p>
                  <p className="pz-story-text">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="pz-panel pz-panel-art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/personal/clinic.webp" alt="" loading="lazy" />
        <div>
          <h2 className="pz-poster pz-h2">Perguntas para a consulta</h2>
          <ol className="pz-questions">
            {game.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

function ClearanceToggle({ cleared, onChange }: { cleared: boolean; onChange: (cleared: boolean) => void }) {
  const [asking, setAsking] = useState(false);
  if (cleared) {
    return (
      <button type="button" className="pz-link" onClick={() => onChange(false)}>
        Trancar de novo
      </button>
    );
  }
  if (!asking) {
    return (
      <button type="button" className="pz-link" onClick={() => setAsking(true)}>
        Meu médico liberou esforço intenso
      </button>
    );
  }
  return (
    <span className="pz-confirm">
      O médico liberou mesmo, depois de revisar seus exames?
      <button
        type="button"
        className="pz-link"
        onClick={() => {
          setAsking(false);
          onChange(true);
        }}
      >
        Sim, destravar
      </button>
      <button type="button" className="pz-link" onClick={() => setAsking(false)}>
        Ainda não
      </button>
    </span>
  );
}

function ActivityCard({ activity, locked, onLog }: { activity: Activity; locked: boolean; onLog: (minutes: number, km: number | null) => void }) {
  const [minutes, setMinutes] = useState("");
  const [km, setKm] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const mins = parseNumber(minutes);
    if (mins === null || mins > MAX_MINUTES) {
      setError(`Minutos entre 1 e ${MAX_MINUTES}.`);
      return;
    }
    const distance = km.trim() ? parseNumber(km) : null;
    if (km.trim() && distance === null) {
      setError("Km inválido.");
      return;
    }
    onLog(Math.round(mins), distance);
    setMinutes("");
    setKm("");
    setError(null);
  }

  return (
    <article className={locked ? "pz-act locked" : "pz-act"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/personal/${activity.art}.webp`} alt="" loading="lazy" />
      <div className="pz-act-body">
        <h3 className="pz-poster">{activity.name}</h3>
        <p className="pz-fine">
          {activity.tip} · {activity.xpPerMin} XP/min
        </p>
        {locked ? (
          <p className="pz-act-locked">
            <Lock size={14} /> Trancado
          </p>
        ) : (
          <form onSubmit={submit} className="pz-act-form">
            <input className="pz-input" inputMode="numeric" placeholder="min" aria-label={`Minutos de ${activity.name}`} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            <input className="pz-input" inputMode="decimal" placeholder="km (opc.)" aria-label={`Quilômetros de ${activity.name}`} value={km} onChange={(e) => setKm(e.target.value)} />
            <button type="submit" className="pz-btn pz-btn-hot">
              Registrar
            </button>
          </form>
        )}
        {error && (
          <p className="pz-err" role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
