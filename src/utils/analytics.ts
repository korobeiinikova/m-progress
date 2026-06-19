import type {
  Achievement,
  AppData,
  DailyEntry,
  HabitKey,
  MeasurementKey,
  WorkoutEntry,
} from "../types";
import { habitLabels, measurementLabels } from "./labels";
import {
  addDays,
  daysBetween,
  isWithinLastDays,
  sortByDateAsc,
  sortByDateDesc,
  startOfWeekIso,
  todayIso,
} from "./date";

const bodyKeys: MeasurementKey[] = ["waist", "hips", "chest", "belly", "arm", "thigh", "calf"];
export const measurementKeys: MeasurementKey[] = ["weight", ...bodyKeys];

export const latestDailyEntry = (entries: DailyEntry[]) => sortByDateDesc(entries)[0];

export const average = (values: number[]) => {
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
};

export const formatSigned = (value: number, unit = "", precision = 1) => {
  if (!Number.isFinite(value) || value === 0) return `0${unit ? ` ${unit}` : ""}`;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(precision)}${unit ? ` ${unit}` : ""}`;
};

export const getEntriesInLastDays = (entries: DailyEntry[], days: number) =>
  sortByDateAsc(entries).filter((entry) => isWithinLastDays(entry.date, days));

export const getWorkoutsInLastDays = (workouts: WorkoutEntry[], days: number) =>
  sortByDateAsc(workouts).filter((entry) => isWithinLastDays(entry.date, days));

export const getCurrentWeekEntries = (entries: DailyEntry[], base = todayIso()) => {
  const start = startOfWeekIso(base);
  const end = addDays(start, 7);
  return entries.filter((entry) => entry.date >= start && entry.date < end);
};

export const getCurrentWeekWorkouts = (workouts: WorkoutEntry[], base = todayIso()) => {
  const start = startOfWeekIso(base);
  const end = addDays(start, 7);
  return workouts.filter((entry) => entry.date >= start && entry.date < end);
};

export const getPreviousWeekEntries = (entries: DailyEntry[], base = todayIso()) => {
  const start = addDays(startOfWeekIso(base), -7);
  const end = addDays(start, 7);
  return entries.filter((entry) => entry.date >= start && entry.date < end);
};

export const getMeasurementChange = (
  entries: DailyEntry[],
  key: MeasurementKey,
  days: number,
): number | null => {
  const sorted = sortByDateAsc(entries).filter((entry) => entry[key] !== undefined);
  const latest = sorted.at(-1);
  if (!latest) return null;
  const previous = [...sorted]
    .reverse()
    .find((entry) => entry.date < latest.date && daysBetween(entry.date, latest.date) >= days);
  if (!previous) return null;
  return Number(((latest[key] ?? 0) - (previous[key] ?? 0)).toFixed(1));
};

export const getStartChange = (entries: DailyEntry[], key: MeasurementKey): number | null => {
  const sorted = sortByDateAsc(entries).filter((entry) => entry[key] !== undefined);
  if (sorted.length < 2) return null;
  const first = sorted[0][key] ?? 0;
  const last = sorted.at(-1)![key] ?? 0;
  return Number((last - first).toFixed(1));
};

export const getWeeklyAverageWeight = (entries: DailyEntry[]) =>
  Number(average(getCurrentWeekEntries(entries).map((entry) => entry.weight)).toFixed(1));

export const getWeeklyWorkoutMinutes = (workouts: WorkoutEntry[]) =>
  getCurrentWeekWorkouts(workouts).reduce((sum, workout) => sum + workout.duration, 0);

export const getWeeklyWorkoutCount = (workouts: WorkoutEntry[]) => getCurrentWeekWorkouts(workouts).length;

export const habitDone = (entry: DailyEntry, key: HabitKey, movementToday = false) => {
  const map: Record<HabitKey, boolean> = {
    movement: movementToday,
    protein: entry.proteinDone,
    vegetables: entry.vegetablesDone,
    water: entry.waterAmount >= 1.8,
    sleep: entry.sleepHours >= 7,
    noLateSnack: !entry.lateSnack,
    noOvereating: !entry.overeating,
  };
  return map[key];
};

export const getTodayHabitStats = (entries: DailyEntry[], workouts: WorkoutEntry[]) => {
  const today = todayIso();
  const entry = entries.find((item) => item.date === today) ?? latestDailyEntry(entries);
  if (!entry) return { done: 0, total: 7, items: [] as { key: HabitKey; label: string; done: boolean }[] };
  const movementToday = workouts.some((workout) => workout.date === entry.date);
  const keys = Object.keys(habitLabels) as HabitKey[];
  const items = keys.map((key) => ({ key, label: habitLabels[key], done: habitDone(entry, key, movementToday) }));
  return { done: items.filter((item) => item.done).length, total: items.length, items };
};

export const getHabitWeekStats = (entries: DailyEntry[], workouts: WorkoutEntry[]) => {
  const weekEntries = getCurrentWeekEntries(entries);
  const keys = Object.keys(habitLabels) as HabitKey[];
  const stats = keys.map((key) => {
    const done = weekEntries.filter((entry) =>
      habitDone(entry, key, workouts.some((workout) => workout.date === entry.date)),
    ).length;
    const percent = weekEntries.length ? Math.round((done / weekEntries.length) * 100) : 0;
    return { key, label: habitLabels[key], done, total: weekEntries.length, percent };
  });
  const overall = stats.length ? Math.round(average(stats.map((item) => item.percent))) : 0;
  return { stats, overall };
};

export const getStreak = (entries: DailyEntry[]) => {
  const dates = new Set(entries.map((entry) => entry.date));
  let pointer = todayIso();
  if (!dates.has(pointer)) pointer = sortByDateDesc(entries)[0]?.date ?? pointer;
  let streak = 0;
  while (dates.has(pointer)) {
    streak += 1;
    pointer = addDays(pointer, -1);
  }
  return streak;
};

export const buildWeeklySeries = (data: AppData) => {
  const map = new Map<
    string,
    { week: string; weightValues: number[]; minutes: number; workouts: number; waistValues: number[] }
  >();

  data.dailyEntries.forEach((entry) => {
    const week = startOfWeekIso(entry.date);
    const existing = map.get(week) ?? { week, weightValues: [], minutes: 0, workouts: 0, waistValues: [] };
    existing.weightValues.push(entry.weight);
    existing.waistValues.push(entry.waist);
    map.set(week, existing);
  });

  data.workouts.forEach((workout) => {
    const week = startOfWeekIso(workout.date);
    const existing = map.get(week) ?? { week, weightValues: [], minutes: 0, workouts: 0, waistValues: [] };
    existing.minutes += workout.duration;
    existing.workouts += 1;
    map.set(week, existing);
  });

  return [...map.values()]
    .sort((a, b) => a.week.localeCompare(b.week))
    .map((item) => ({
      week: item.week.slice(5),
      avgWeight: Number(average(item.weightValues).toFixed(1)),
      avgWaist: Number(average(item.waistValues).toFixed(1)),
      minutes: item.minutes,
      workouts: item.workouts,
    }));
};

export const buildMeasurementSeries = (entries: DailyEntry[], keys: MeasurementKey[]) =>
  sortByDateAsc(entries).map((entry) => {
    const point: Record<string, string | number | undefined> = { date: entry.date.slice(5) };
    keys.forEach((key) => {
      point[measurementLabels[key]] = entry[key];
    });
    return point;
  });

export const getClosestComparisonEntry = (
  entries: DailyEntry[],
  period: "week" | "month" | "start",
) => {
  const sorted = sortByDateAsc(entries);
  const current = sorted.at(-1);
  if (!current || sorted.length < 2) return { current, previous: undefined };
  if (period === "start") return { current, previous: sorted[0] };
  const targetDays = period === "week" ? 7 : 30;
  const previous =
    [...sorted]
      .reverse()
      .find((entry) => entry.date < current.date && daysBetween(entry.date, current.date) >= targetDays) ??
    sorted[0];
  return { current, previous };
};

export const getAchievements = (data: AppData): Achievement[] => {
  const entries = sortByDateAsc(data.dailyEntries);
  const workouts = data.workouts;
  const weeklyMinutes = getWeeklyWorkoutMinutes(workouts);
  const weeklyWorkouts = getWeeklyWorkoutCount(workouts);
  const streak = getStreak(entries);
  const startBodyChanges = bodyKeys.filter((key) => (getStartChange(entries, key) ?? 0) < 0).length;
  const hasReturn =
    entries.some((entry, index) => index > 0 && daysBetween(entries[index - 1].date, entry.date) > 5) &&
    entries.length > 1;

  const all: Achievement[] = [
    {
      id: "first-step",
      title: "Первый шаг",
      description: "Добавлена первая запись.",
      unlockedAt: entries[0]?.date,
    },
    {
      id: "week",
      title: "Неделя наблюдений",
      description: "Есть 7 дней записей.",
      unlockedAt: entries[6]?.date,
    },
    {
      id: "rhythm",
      title: "Вошла в ритм",
      description: "3 тренировки за неделю.",
      unlockedAt: weeklyWorkouts >= 3 ? todayIso() : undefined,
    },
    {
      id: "minutes-150",
      title: "150 минут",
      description: "Достигнута цель активности.",
      unlockedAt: weeklyMinutes >= data.goals.targetMinutesPerWeek ? todayIso() : undefined,
    },
    {
      id: "measure-care",
      title: "Забота о теле",
      description: "Замеры ведутся несколько недель подряд.",
      unlockedAt: entries.length >= 28 ? todayIso() : undefined,
    },
    {
      id: "return",
      title: "Возвращение",
      description: "Запись после паузы.",
      unlockedAt: hasReturn ? todayIso() : undefined,
    },
    {
      id: "volume",
      title: "Объемы меняются",
      description: "Уменьшились хотя бы 2 параметра тела.",
      unlockedAt: startBodyChanges >= 2 ? todayIso() : undefined,
    },
    {
      id: "stability",
      title: "Стабильность",
      description: "14 дней подряд есть записи.",
      unlockedAt: streak >= 14 ? todayIso() : undefined,
    },
  ];

  return all.map((item) => (item.unlockedAt ? item : { ...item, unlockedAt: undefined }));
};

export const getSupportMessage = (data: AppData) => {
  const waistMonth = getMeasurementChange(data.dailyEntries, "waist", 30) ?? 0;
  const weightMonth = getMeasurementChange(data.dailyEntries, "weight", 30) ?? 0;
  const minutes = getWeeklyWorkoutMinutes(data.workouts);
  const habits = getHabitWeekStats(data.dailyEntries, data.workouts);

  if (Math.abs(weightMonth) < 0.5 && waistMonth < -0.8) {
    return "Вес почти не изменился, но талия уменьшилась. Объемы тоже важны - это реальный прогресс.";
  }
  if (minutes >= data.goals.targetMinutesPerWeek) {
    return "На этой неделе движение уже набрало хороший темп. Главное - регулярность, а не идеальность.";
  }
  if (habits.overall >= 75) {
    return "Привычки держатся стабильно. Даже маленький шаг сегодня засчитывается.";
  }
  return "Смотрим не на один день, а на общую динамику. Мягкий темп тоже ведет вперед.";
};

export const getInfluenceNotes = (data: AppData) => {
  const notes: string[] = [];
  const minutes = getWeeklyWorkoutMinutes(data.workouts);
  const prevEntries = getPreviousWeekEntries(data.dailyEntries);
  const weekEntries = getCurrentWeekEntries(data.dailyEntries);
  const sleepNow = average(weekEntries.map((entry) => entry.sleepHours));
  const sleepPrev = average(prevEntries.map((entry) => entry.sleepHours));
  const waistMonth = getMeasurementChange(data.dailyEntries, "waist", 30);

  if (minutes > 0) notes.push(`На этой неделе уже есть ${minutes} минут движения.`);
  if (sleepNow && sleepPrev && sleepNow > sleepPrev) notes.push("Сон улучшился по сравнению с прошлой неделей.");
  if ((waistMonth ?? 0) < 0) notes.push("Объем талии уменьшился, даже если вес идет не идеально ровно.");
  if (!notes.length) notes.push("Пока собираем наблюдения. Пара записей уже поможет увидеть первые связи.");
  return notes.slice(0, 3);
};

export const getNearestGoalText = (data: AppData) => {
  const latest = latestDailyEntry(data.dailyEntries);
  const weeklyMinutes = getWeeklyWorkoutMinutes(data.workouts);
  const weeklyWorkouts = getWeeklyWorkoutCount(data.workouts);
  if (weeklyMinutes < data.goals.targetMinutesPerWeek) {
    return `До цели недели осталось ${data.goals.targetMinutesPerWeek - weeklyMinutes} минут активности.`;
  }
  if (weeklyWorkouts < data.goals.targetWorkoutsPerWeek) {
    return `Осталась ${data.goals.targetWorkoutsPerWeek - weeklyWorkouts} тренировка до цели.`;
  }
  if (latest && latest.weight > data.goals.targetWeight) {
    return `Следующая маленькая цель: еще ${Math.min(1, latest.weight - data.goals.targetWeight).toFixed(1)} кг в спокойном темпе.`;
  }
  return "Ближайшая цель выполнена. Можно закрепить ритм без спешки.";
};

export const getWeeklySummaryText = (data: AppData) => {
  const minutes = getWeeklyWorkoutMinutes(data.workouts);
  const count = getWeeklyWorkoutCount(data.workouts);
  const remaining = Math.max(0, data.goals.targetMinutesPerWeek - minutes);
  const habits = getHabitWeekStats(data.dailyEntries, data.workouts).stats;
  const bestHabit = [...habits].sort((a, b) => b.percent - a.percent)[0];
  const softImprove = [...habits].sort((a, b) => a.percent - b.percent)[0];

  return `На этой неделе было ${count} тренировки и ${minutes} минут активности. ${
    remaining === 0
      ? "Цель по движению уже закрыта - это сильная опора для недели."
      : `До цели 150 минут осталось ${remaining} минут, это можно добрать короткой прогулкой.`
  } Лучше всего получается "${bestHabit?.label ?? "движение"}". На следующей неделе можно мягко поддержать зону "${
    softImprove?.label ?? "сон"
  }" без жестких требований.`;
};

export const getSimpleInsights = (data: AppData) => {
  const insights: string[] = [];
  const weightMonth = getMeasurementChange(data.dailyEntries, "weight", 30) ?? 0;
  const waistMonth = getMeasurementChange(data.dailyEntries, "waist", 30) ?? 0;
  const bellyMonth = getMeasurementChange(data.dailyEntries, "belly", 30) ?? 0;
  const series = buildWeeklySeries(data);
  const firstWorkoutWeek = series.find((item) => item.workouts > 0)?.workouts ?? 0;
  const lastWorkoutWeek = series.at(-1)?.workouts ?? 0;
  const habits = getHabitWeekStats(data.dailyEntries, data.workouts).stats;
  const best = [...habits].sort((a, b) => b.percent - a.percent)[0];

  if (Math.abs(weightMonth) < 0.7 && (waistMonth < 0 || bellyMonth < 0)) {
    insights.push("Вес почти не изменился, но талия или живот уменьшились - это хороший прогресс.");
  }
  if (lastWorkoutWeek >= firstWorkoutWeek && lastWorkoutWeek > 0) {
    insights.push("Регулярные тренировки стали стабильнее.");
  }
  if (best) insights.push(`Лучше всего получается соблюдать: ${best.label.toLowerCase()}.`);
  if (!insights.length) insights.push("Динамика уже собирается. Скоро здесь появятся более точные выводы.");
  return insights;
};
