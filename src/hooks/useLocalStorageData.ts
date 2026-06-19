import { useEffect, useMemo, useState } from "react";
import type { AppData, DailyEntry, Goals, ProgressPhoto, WorkoutEntry } from "../types";
import { emptyData, getDemoData, loadAppData, saveAppData } from "../utils/storage";

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useLocalStorageData = () => {
  const [data, setData] = useState<AppData>(() => loadAppData());

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const actions = useMemo(
    () => ({
      addDailyEntry: (entry: Omit<DailyEntry, "id">) => {
        setData((current) => ({
          ...current,
          dailyEntries: [
            ...current.dailyEntries.filter((item) => item.date !== entry.date),
            { ...entry, id: createId() },
          ],
        }));
      },
      addWorkout: (entry: Omit<WorkoutEntry, "id">) => {
        setData((current) => ({
          ...current,
          workouts: [...current.workouts, { ...entry, id: createId() }],
        }));
      },
      updateGoals: (goals: Goals) => {
        setData((current) => ({ ...current, goals }));
      },
      addPhoto: (photo: Omit<ProgressPhoto, "id">) => {
        setData((current) => ({
          ...current,
          photos: [...current.photos, { ...photo, id: createId() }],
        }));
      },
      loadDemo: () => setData(getDemoData()),
      clearAll: () => setData(emptyData),
    }),
    [],
  );

  return { data, actions };
};
