import { Check, Circle } from "lucide-react";
import type { DailyEntry, WorkoutEntry } from "../types";
import { getTodayHabitStats } from "../utils/analytics";

export const HabitTracker = ({
  entries,
  workouts,
}: {
  entries: DailyEntry[];
  workouts: WorkoutEntry[];
}) => {
  const stats = getTodayHabitStats(entries, workouts);

  return (
    <div className="habit-list">
      {stats.items.map((item) => (
        <div className="habit-row" key={item.key}>
          {item.done ? <Check size={18} /> : <Circle size={18} />}
          <span>{item.label}</span>
          <small>{item.done ? "Готово" : "Можно попробовать завтра"}</small>
        </div>
      ))}
    </div>
  );
};
