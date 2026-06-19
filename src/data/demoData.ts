import type { AppData, DailyEntry, Goals, WorkoutEntry } from "../types";

const dayMs = 24 * 60 * 60 * 1000;

const isoDaysAgo = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setTime(date.getTime() - days * dayMs);
  return date.toISOString().slice(0, 10);
};

export const defaultGoals: Goals = {
  currentWeight: 82.4,
  targetWeight: 74,
  targetWaist: 78,
  targetHips: 103,
  targetBelly: 88,
  targetWorkoutsPerWeek: 3,
  targetMinutesPerWeek: 150,
};

export const demoDailyEntries: DailyEntry[] = Array.from({ length: 32 }, (_, index) => {
  const daysAgo = 31 - index;
  const wave = Math.sin(index / 2.8) * 0.25;
  const softness = index > 18 ? -0.25 : 0;
  const skipped = [5, 12, 19, 25].includes(index);

  return {
    id: `demo-day-${index}`,
    date: isoDaysAgo(daysAgo),
    weight: Number((84.2 - index * 0.06 + wave + softness).toFixed(1)),
    waist: Number((91.5 - index * 0.12 + Math.sin(index / 3) * 0.2).toFixed(1)),
    hips: Number((109.2 - index * 0.06 + Math.cos(index / 4) * 0.25).toFixed(1)),
    chest: Number((101.8 - index * 0.025 + Math.sin(index / 5) * 0.15).toFixed(1)),
    underBust: Number((88.6 - index * 0.06 + Math.sin(index / 4) * 0.12).toFixed(1)),
    belly: Number((99.8 - index * 0.13 + Math.cos(index / 4) * 0.25).toFixed(1)),
    arm: Number((32.4 - index * 0.02).toFixed(1)),
    thigh: Number((64.1 - index * 0.035).toFixed(1)),
    calf: Number((40.2 - index * 0.01).toFixed(1)),
    sleepHours: skipped ? 6.3 : Number((6.7 + (index % 5) * 0.15).toFixed(1)),
    energy: skipped ? 3 : ((index % 4) + 2),
    mood: skipped ? 3 : ((index % 3) + 3),
    hunger: skipped ? 4 : ((index % 4) + 2),
    proteinDone: ![4, 12, 21].includes(index),
    vegetablesDone: ![6, 13, 22, 28].includes(index),
    waterAmount: Number((1.6 + (index % 5) * 0.2).toFixed(1)),
    lateSnack: [7, 14, 26].includes(index),
    overeating: [10, 24].includes(index),
    note: index % 9 === 0 ? "Спокойный день, без гонки за идеальностью." : "",
  };
});

export const demoWorkouts: WorkoutEntry[] = [
  {
    id: "demo-workout-1",
    date: isoDaysAgo(28),
    type: "walk",
    duration: 35,
    distance: 3.1,
    effort: 4,
    note: "Легкая прогулка после работы",
  },
  {
    id: "demo-workout-2",
    date: isoDaysAgo(24),
    type: "treadmill",
    duration: 42,
    speed: 5.6,
    incline: 3,
    distance: 3.8,
    effort: 6,
    note: "Дорожка в комфортном темпе",
  },
  {
    id: "demo-workout-3",
    date: isoDaysAgo(20),
    type: "strength",
    duration: 38,
    effort: 7,
    note: "Ноги и спина, без перегруза",
  },
  {
    id: "demo-workout-4",
    date: isoDaysAgo(15),
    type: "walk",
    duration: 47,
    distance: 4.2,
    effort: 5,
    note: "Длинная прогулка",
  },
  {
    id: "demo-workout-5",
    date: isoDaysAgo(10),
    type: "stretching",
    duration: 25,
    effort: 3,
    note: "Растяжка и спокойное дыхание",
  },
  {
    id: "demo-workout-6",
    date: isoDaysAgo(6),
    type: "treadmill",
    duration: 45,
    speed: 5.8,
    incline: 4,
    distance: 4.1,
    effort: 6,
    note: "Хороший ровный темп",
  },
  {
    id: "demo-workout-7",
    date: isoDaysAgo(3),
    type: "strength",
    duration: 40,
    effort: 7,
    note: "Короткая силовая",
  },
  {
    id: "demo-workout-8",
    date: isoDaysAgo(1),
    type: "walk",
    duration: 32,
    distance: 2.9,
    effort: 4,
    note: "Прогулка без спешки",
  },
];

export const demoData: AppData = {
  dailyEntries: demoDailyEntries,
  workouts: demoWorkouts,
  goals: defaultGoals,
  photos: [],
};
