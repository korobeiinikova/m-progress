import type { HabitKey, MeasurementKey, WorkoutType } from "../types";

export const measurementLabels: Record<MeasurementKey, string> = {
  weight: "Вес",
  waist: "Талия",
  hips: "Бедра",
  chest: "Грудь",
  belly: "Живот",
  arm: "Рука",
  thigh: "Бедро",
  calf: "Икра",
};

export const measurementUnits: Record<MeasurementKey, string> = {
  weight: "кг",
  waist: "см",
  hips: "см",
  chest: "см",
  belly: "см",
  arm: "см",
  thigh: "см",
  calf: "см",
};

export const habitLabels: Record<HabitKey, string> = {
  movement: "Движение",
  protein: "Белок 2+ раза",
  vegetables: "Овощи / зелень",
  water: "Вода",
  sleep: "Сон 7+ часов",
  noLateSnack: "Без позднего перекуса",
  noOvereating: "Без переедания",
};

export const workoutTypeLabels: Record<WorkoutType, string> = {
  treadmill: "Беговая дорожка",
  walk: "Ходьба",
  strength: "Силовая",
  stretching: "Растяжка",
  other: "Другое",
};
