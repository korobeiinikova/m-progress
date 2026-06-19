import { demoData, defaultGoals } from "../data/demoData";
import type { AppData } from "../types";

const storageKey = "soft-progress-data-v1";

export const emptyData: AppData = {
  dailyEntries: [],
  workouts: [],
  goals: defaultGoals,
  photos: [],
};

export const loadAppData = (): AppData => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      dailyEntries: parsed.dailyEntries ?? [],
      workouts: parsed.workouts ?? [],
      goals: { ...defaultGoals, ...parsed.goals },
      photos: parsed.photos ?? [],
    };
  } catch {
    return emptyData;
  }
};

export const saveAppData = (data: AppData) => {
  localStorage.setItem(storageKey, JSON.stringify(data));
};

export const getDemoData = () => JSON.parse(JSON.stringify(demoData)) as AppData;
