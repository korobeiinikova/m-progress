import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AppData } from "../types";
import {
  average,
  buildMeasurementSeries,
  buildWeeklySeries,
  formatSigned,
  getHabitWeekStats,
  getMeasurementChange,
  getSimpleInsights,
} from "../utils/analytics";
import { ChartCard } from "../components/ChartCard";
import { MetricCard } from "../components/MetricCard";

export const ProgressPage = ({ data }: { data: AppData }) => {
  const measurementSeries = buildMeasurementSeries(data.dailyEntries, ["weight", "waist", "hips", "chest", "belly"]);
  const weeklySeries = buildWeeklySeries(data);
  const bestHabit = [...getHabitWeekStats(data.dailyEntries, data.workouts).stats].sort((a, b) => b.percent - a.percent)[0];
  const avgWorkouts = average(weeklySeries.map((item) => item.workouts));
  const waistMonth = getMeasurementChange(data.dailyEntries, "waist", 30) ?? 0;
  const bellyMonth = getMeasurementChange(data.dailyEntries, "belly", 30) ?? 0;

  return (
    <div className="page">
      <header className="page-title">
        <p>Прогресс</p>
        <h1>Графики и спокойные выводы</h1>
      </header>

      <div className="metric-grid metric-grid--wide">
        <MetricCard label="Лучший прогресс за месяц" value={waistMonth < bellyMonth ? formatSigned(waistMonth, "см") : formatSigned(bellyMonth, "см")} hint="по талии или животу" />
        <MetricCard label="Чаще всего получается" value={bestHabit?.label ?? "-"} />
        <MetricCard label="Среднее тренировок в неделю" value={avgWorkouts.toFixed(1)} />
        <MetricCard label="Вес за месяц" value={formatSigned(getMeasurementChange(data.dailyEntries, "weight", 30) ?? 0, "кг")} />
        <MetricCard label="Талия за месяц" value={formatSigned(waistMonth, "см")} />
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Вес и средний вес за неделю">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={measurementSeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Вес" stroke="#5f8d72" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Объемы тела">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={measurementSeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Талия" stroke="#8aa35f" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="Бедра" stroke="#c29f62" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="Грудь" stroke="#6d9ca0" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="Живот" stroke="#b77978" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Минуты активности">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklySeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#73a889" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Тренировки по неделям">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklySeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="workouts" fill="#a0b774" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="panel">
        <h2>Простые выводы</h2>
        <div className="note-list">
          {getSimpleInsights(data).map((insight) => (
            <p key={insight}>{insight}</p>
          ))}
        </div>
      </section>
    </div>
  );
};
