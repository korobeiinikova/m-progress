import type { AppData } from "../types";
import { getHabitWeekStats, getTodayHabitStats } from "../utils/analytics";
import { HabitTracker } from "../components/HabitTracker";
import { MetricCard } from "../components/MetricCard";

export const HabitsPage = ({ data }: { data: AppData }) => {
  const today = getTodayHabitStats(data.dailyEntries, data.workouts);
  const week = getHabitWeekStats(data.dailyEntries, data.workouts);
  const sorted = [...week.stats].sort((a, b) => b.percent - a.percent);

  return (
    <div className="page">
      <header className="page-title">
        <p>Привычки</p>
        <h1>Маленькие действия, которые складываются в устойчивость</h1>
      </header>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="metric-grid">
            <MetricCard label="Сегодня выполнено" value={`${today.done}/${today.total}`} tone="good" />
            <MetricCard label="За неделю" value={`${week.overall}%`} />
          </div>
          <HabitTracker entries={data.dailyEntries} workouts={data.workouts} />
        </section>
        <section className="panel">
          <h2>Что получается чаще всего</h2>
          <div className="habit-pills">
            {sorted.slice(0, 3).map((habit) => (
              <span key={habit.key}>{habit.label}: {habit.percent}%</span>
            ))}
          </div>
          <h2>Зона для мягкого улучшения</h2>
          <div className="habit-pills">
            {[...sorted].reverse().slice(0, 3).map((habit) => (
              <span key={habit.key}>{habit.label}: можно попробовать завтра</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
