export type WorkoutType = "treadmill" | "walk" | "strength" | "stretching" | "other";

export type DailyEntry = {
  id: string;
  date: string;
  weight: number;
  waist: number;
  hips: number;
  chest: number;
  belly: number;
  arm?: number;
  thigh?: number;
  calf?: number;
  sleepHours: number;
  energy: number;
  mood: number;
  hunger: number;
  proteinDone: boolean;
  vegetablesDone: boolean;
  waterAmount: number;
  lateSnack: boolean;
  overeating: boolean;
  note?: string;
};

export type WorkoutEntry = {
  id: string;
  date: string;
  type: WorkoutType;
  duration: number;
  speed?: number;
  incline?: number;
  distance?: number;
  effort: number;
  note?: string;
};

export type Goals = {
  currentWeight: number;
  targetWeight: number;
  targetWaist: number;
  targetHips: number;
  targetBelly: number;
  targetWorkoutsPerWeek: number;
  targetMinutesPerWeek: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
};

export type ProgressPhoto = {
  id: string;
  date: string;
  front?: string;
  side?: string;
  note?: string;
};

export type AppData = {
  dailyEntries: DailyEntry[];
  workouts: WorkoutEntry[];
  goals: Goals;
  photos: ProgressPhoto[];
};

export type PageKey =
  | "today"
  | "entry"
  | "workouts"
  | "measurements"
  | "habits"
  | "progress"
  | "week"
  | "goals"
  | "settings";

export type HabitKey =
  | "movement"
  | "protein"
  | "vegetables"
  | "water"
  | "sleep"
  | "noLateSnack"
  | "noOvereating";

export type MeasurementKey =
  | "weight"
  | "waist"
  | "hips"
  | "chest"
  | "belly"
  | "arm"
  | "thigh"
  | "calf";
