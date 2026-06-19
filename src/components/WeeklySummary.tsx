import type { AppData } from "../types";
import {
  formatSigned,
  getCurrentWeekEntries,
  getHabitWeekStats,
  getMeasurementChange,
  getWeeklyAverageWeight,
  getWeeklySummaryText,
  getWeeklyWorkoutCount,
  getWeeklyWorkoutMinutes,
} from "../utils/analytics";
import { ProgressBar } from "./ProgressBar";
import { MetricCard } from "./MetricCard";

export const WeeklySummary = ({ data }: { data: AppData }) => {
  const entries = getCurrentWeekEntries(data.dailyEntries);
  const habits = getHabitWeekStats(data.dailyEntries, data.workouts);
  const minutes = getWeeklyWorkoutMinutes(data.workouts);

  return (
    <div className="weekly-summary">
      <div className="metric-grid">
        <MetricCard label="Средний вес" value={`${getWeeklyAverageWeight(data.dailyEntries) || "-"} кг`} />
        <MetricCard label="Талия" value={formatSigned(getMeasurementChange(data.dailyEntries, "waist", 7) ?? 0, "см")} />
        <MetricCard label="Бедра" value={formatSigned(getMeasurementChange(data.dailyEntries, "hips", 7) ?? 0, "см")} />
        <MetricCard label="Живот" value={formatSigned(getMeasurementChange(data.dailyEntries, "belly", 7) ?? 0, "см")} />
        <MetricCard label="Тренировки" value={`${getWeeklyWorkoutCount(data.workouts)}`} />
        <MetricCard label="Минуты активности" value={`${minutes}`} />
      </div>
      <ProgressBar value={minutes} max={data.goals.targetMinutesPerWeek} label="Цель активности" />
      <div className="habit-pills">
        {habits.stats.map((habit) => (
          <span key={habit.key}>
            {habit.label}: {habit.done}/{Math.max(1, habit.total)}
          </span>
        ))}
      </div>
      <p className="summary-text">{entries.length ? getWeeklySummaryText(data) : "Добавьте записи, чтобы недельный отчет стал точнее."}</p>
    </div>
  );
};
