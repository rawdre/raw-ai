// Pure game rules for the /personal dashboard. No personal content lives here —
// everything specific comes from the decrypted dossier passed in as arguments.
import type { Boss, HealthData } from "@/lib/personal/types";

export type LogEntry = { id: string; date: string; activity: string; minutes: number; km: number | null };
export type Reading = { date: string; value: number };
export type BpReading = { date: string; sys: number; dia: number };

export type GameState = {
  v: 1;
  log: LogEntry[];
  habits: Record<string, string[]>; // date → habit ids done that day
  story: string[]; // completed story mission ids
  cleared: boolean; // doctor cleared intense effort
  labs: Record<string, Reading[]>; // boss id → new readings
  bp: BpReading[];
  weightTarget: number | null;
};

export const EMPTY_STATE: GameState = {
  v: 1,
  log: [],
  habits: {},
  story: [],
  cleared: false,
  labs: {},
  bp: [],
  weightTarget: null,
};

const XP_PER_LAB_READING = 50;
const XP_PER_LEVEL_STEP = 150;
const BP_AVERAGE_WINDOW = 7;
const MAX_STARS = 5;
const DAY_MS = 86_400_000;

export function dateKey(d: Date = new Date()): string {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Date keys for the last `n` days, oldest first, ending today. */
export function lastDays(n: number, today: Date = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => dateKey(new Date(today.getTime() - (n - 1 - i) * DAY_MS)));
}

export function totalXp(state: GameState, game: HealthData["game"]): number {
  const rate = new Map(game.activities.map((a) => [a.id, a.xpPerMin]));
  const habitXp = new Map(game.habits.map((h) => [h.id, h.xp]));
  const storyXp = new Map(game.story.map((s) => [s.id, s.xp]));

  const fromLog = state.log.reduce((sum, e) => sum + e.minutes * (rate.get(e.activity) ?? 0), 0);
  const fromHabits = Object.values(state.habits)
    .flat()
    .reduce((sum, id) => sum + (habitXp.get(id) ?? 0), 0);
  const fromStory = state.story.reduce((sum, id) => sum + (storyXp.get(id) ?? 0), 0);
  const fromLabs = Object.values(state.labs).flat().length * XP_PER_LAB_READING;
  return Math.round(fromLog + fromHabits + fromStory + fromLabs);
}

/** Level n starts at 150·(n−1)² XP, so each level takes a little longer than the last. */
export function levelInfo(xp: number): { level: number; into: number; span: number } {
  const level = Math.floor(Math.sqrt(xp / XP_PER_LEVEL_STEP)) + 1;
  const floor = XP_PER_LEVEL_STEP * (level - 1) ** 2;
  const ceil = XP_PER_LEVEL_STEP * level ** 2;
  return { level, into: xp - floor, span: ceil - floor };
}

function isActiveDay(state: GameState, day: string): boolean {
  return state.log.some((e) => e.date === day) || (state.habits[day]?.length ?? 0) > 0;
}

/** Consecutive active days ending today (or yesterday, so the streak survives until midnight). */
export function streak(state: GameState, today: Date = new Date()): number {
  const days = lastDays(366, today).reverse();
  const startAt = isActiveDay(state, days[0]) ? 0 : 1;
  let count = 0;
  for (let i = startAt; i < days.length && isActiveDay(state, days[i]); i++) count++;
  return count;
}

export function weekMinutes(state: GameState, today: Date = new Date()): number {
  const week = new Set(lastDays(7, today));
  return state.log.filter((e) => week.has(e.date)).reduce((sum, e) => sum + e.minutes, 0);
}

export type BossStatus = { current: number; target: number | null; progress: number | null; beaten: boolean; updated: string | null };

export function bossStatus(boss: Boss, state: GameState): BossStatus {
  const readings = state.labs[boss.id] ?? [];
  const latest = readings.length > 0 ? readings[readings.length - 1] : null;
  let current = latest?.value ?? boss.current;
  let updated = latest?.date ?? null;

  if (boss.id === "bp" && state.bp.length > 0) {
    const recent = state.bp.slice(-BP_AVERAGE_WINDOW);
    current = Math.round(recent.reduce((sum, r) => sum + r.sys, 0) / recent.length);
    updated = recent[recent.length - 1].date;
  }

  const target = boss.id === "peso" ? state.weightTarget : boss.target;
  if (target === null) return { current, target, progress: null, beaten: false, updated };

  const down = boss.dir === "down";
  const base = down ? Math.max(boss.start, boss.current) : Math.min(boss.start, boss.current);
  const span = down ? base - target : target - base;
  const done = down ? base - current : current - base;
  const progress = span <= 0 ? 1 : Math.min(1, Math.max(0, done / span));
  const beaten = down ? current <= target : current >= target;
  return { current, target, progress, beaten, updated };
}

/** "Wanted" stars: how much heat the main bosses still put on you (5 = all still standing). */
export function wantedStars(bosses: Boss[], state: GameState): number {
  const main = bosses.filter((b) => b.tier !== "side");
  if (main.length === 0) return 0;
  const standing = main.filter((b) => !bossStatus(b, state).beaten).length;
  return Math.min(MAX_STARS, Math.ceil((standing * MAX_STARS) / main.length));
}

export function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

/** Parses "72,5" or "72.5"; returns null when not a positive finite number. */
export function parseNumber(raw: string): number | null {
  const n = Number(raw.trim().replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}
