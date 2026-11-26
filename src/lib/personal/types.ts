// Shape of the decrypted private health dossier (see private/health-data.json).
export type Level = "ok" | "warn" | "bad";

export type Boss = {
  id: string;
  name: string;
  unit: string;
  start: number;
  current: number;
  target: number | null;
  dir: "up" | "down";
  targetLabel: string;
  tier: "urgent" | "main" | "side";
  how: string;
};

export type Activity = { id: string; name: string; xpPerMin: number; art: string; locked: boolean; tip: string };
export type Habit = { id: string; name: string; xp: number };
export type StoryMission = { id: string; name: string; when: string; xp: number; text: string };
export type LabRow = [name: string, july: string, november: string, note: string, level: Level];

export type HealthData = {
  meta: { name: string; alias: string; updated: string; period: string; age: string; disclaimer: string };
  emergency: string;
  priorities: { title: string; text: string; level: Level }[];
  favorable: string;
  patientNote: string;
  bosses: Boss[];
  game: {
    title: string;
    subtitle: string;
    lockNote: string;
    weeklyGoalMin: number;
    weeklyGoalNote: string;
    ranks: string[];
    activities: Activity[];
    habits: Habit[];
    story: StoryMission[];
    questions: string[];
    food: { go: string[]; stop: string[]; never: string[]; note: string };
  };
  timeline: [date: string, text: string][];
  body: { date: string; rows: [string, string][]; note: string };
  cardio: { title: string; text: string }[];
  homeBp: { summary: string; readings: [when: string, sys: number, dia: number][]; history: string; reading: string };
  meds: { note: string; rows: [string, string, string][]; extra: { title: string; text: string }; pending: string[]; review: string };
  supplements: { note: string; rows: [string, string][]; points: string[] };
  plan: { who: string; appointments: [string, string][]; apptNote: string };
  labs: { title: string; rows: LabRow[]; note: string }[];
};
