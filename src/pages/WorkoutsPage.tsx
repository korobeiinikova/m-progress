import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AppData } from "../types";
import {
  buildWeeklySeries,
  getWeeklyWorkoutCount,
  getWeeklyWorkoutMinutes,
} from "../utils/analytics";
import { formatDateRu, sortByDateDesc } from "../utils/date";
import { workoutTypeLabels } from "../utils/labels";
import { ChartCard } from "../components/ChartCard";
import { EmptyState } from "../components/EmptyState";
import { MetricCard } from "../components/MetricCard";
import { ProgressBar } from "../components/ProgressBar";
import { WorkoutForm } from "../components/WorkoutForm";

type WorkoutsPageProps = {
  data: AppData;
  onSubmit: Parameters<typeof WorkoutForm>[0]["onSubmit"];
  onDelete: (id: string) => void;
};

export const WorkoutsPage = ({ data, onSubmit, onDelete }: WorkoutsPageProps) => {
  const latest = sortByDateDesc(data.workouts)[0];
  const series = buildWeeklySeries(data);

  return (
    <div className="page">
      <header className="page-title">
        <p>Тренировки</p>
        <h1>Движение, которое поддерживает, а не давит</h1>
      </header>

      <div className="split-grid">
        <section className="panel">
          <h2>Добавить тренировку</h2>
          <WorkoutForm onSubmit={onSubmit} />
        </section>
        <section className="panel">
          <div className="metric-grid">
            <MetricCard label="Тренировок за неделю" value={`${getWeeklyWorkoutCount(data.workouts)}`} />
            <MetricCard label="Минут за неделю" value={`${getWeeklyWorkoutMinutes(data.workouts)}`} />
          </div>
          <ProgressBar value={getWeeklyWorkoutMinutes(data.workouts)} max={data.goals.targetMinutesPerWeek} label="Цель 150 минут" />
          {latest ? (
            <div className="last-item">
              <span>Последняя тренировка</span>
              <strong>{workoutTypeLabels[latest.type]} - {latest.duration} мин</strong>
              <small>{formatDateRu(latest.date)}</small>
            </div>
          ) : (
            <EmptyState title="Пока нет тренировок" text="Добавьте первую тренировку, даже если это короткая прогулка." />
          )}
        </section>
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Минуты активности по неделям">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" name="Минуты" fill="#73a889" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Количество тренировок по неделям">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="workouts" name="Тренировки" fill="#a0b774" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="panel">
        <h2>Последние тренировки</h2>
        <div className="history-list">
          {sortByDateDesc(data.workouts).slice(0, 8).map((workout) => (
            <article className="history-item" key={workout.id}>
              <div>
                <strong>{workoutTypeLabels[workout.type]}</strong>
                <span>{formatDateRu(workout.date)} - {workout.duration} мин - сложность {workout.effort}/10</span>
                {workout.note && <small>{workout.note}</small>}
              </div>
              <button className="button button--danger button--small" type="button" onClick={() => onDelete(workout.id)}>
                Удалить
              </button>
            </article>
          ))}
          {!data.workouts.length && <p className="muted">Пока нет сохраненных тренировок.</p>}
        </div>
      </section>
    </div>
  );
};
