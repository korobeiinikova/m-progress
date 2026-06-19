import { Activity, HeartPulse, Ruler, Scale, Sparkles } from "lucide-react";
import type { AppData, PageKey } from "../types";
import {
  formatSigned,
  getHabitWeekStats,
  getInfluenceNotes,
  getMeasurementChange,
  getNearestGoalText,
  getSupportMessage,
  getTodayHabitStats,
  getWeeklyAverageWeight,
  getWeeklyWorkoutCount,
  getWeeklyWorkoutMinutes,
  latestDailyEntry,
} from "../utils/analytics";
import { BodySilhouetteComparison } from "../components/BodySilhouetteComparison";
import { DashboardCard } from "../components/DashboardCard";
import { EmptyState } from "../components/EmptyState";
import { HabitTracker } from "../components/HabitTracker";
import { MetricCard } from "../components/MetricCard";
import { ProgressBar } from "../components/ProgressBar";
import { SupportMessageCard } from "../components/SupportMessageCard";

type TodayPageProps = {
  data: AppData;
  onNavigate: (page: PageKey) => void;
};

export const TodayPage = ({ data, onNavigate }: TodayPageProps) => {
  const latest = latestDailyEntry(data.dailyEntries);
  const minutes = getWeeklyWorkoutMinutes(data.workouts);
  const habitStats = getTodayHabitStats(data.dailyEntries, data.workouts);
  const weekHabits = getHabitWeekStats(data.dailyEntries, data.workouts);

  if (!data.dailyEntries.length) {
    return (
      <EmptyState
        title="Добро пожаловать!"
        text="Это приложение поможет отслеживать прогресс мягко и без давления. Здесь важны не только килограммы, но и объемы тела, активность, привычки и самочувствие."
        actionLabel="Добавить первую запись"
        onAction={() => onNavigate("entry")}
      />
    );
  }

  return (
    <div className="page">
      <header className="page-hero">
        <div>
          <p>Сегодня</p>
          <h1>Смотрим на общую динамику, не на один день.</h1>
        </div>
        <button className="button button--primary" onClick={() => onNavigate("entry")}>
          Добавить запись
        </button>
      </header>

      <SupportMessageCard message={getSupportMessage(data)} />

      <div className="dashboard-grid">
        <DashboardCard title="Вес" icon={<Scale size={20} />}>
          <div className="metric-grid">
            <MetricCard label="Текущий" value={`${latest?.weight ?? "-"} кг`} tone="soft" />
            <MetricCard label="Средний за неделю" value={`${getWeeklyAverageWeight(data.dailyEntries) || "-"} кг`} />
            <MetricCard label="За 7 дней" value={formatSigned(getMeasurementChange(data.dailyEntries, "weight", 7) ?? 0, "кг")} />
            <MetricCard label="За 30 дней" value={formatSigned(getMeasurementChange(data.dailyEntries, "weight", 30) ?? 0, "кг")} />
          </div>
        </DashboardCard>

        <DashboardCard title="Параметры тела" icon={<Ruler size={20} />}>
          <div className="body-change-list">
            {(["waist", "hips", "belly", "chest"] as const).map((key) => (
              <div key={key}>
                <span>{key === "waist" ? "Талия" : key === "hips" ? "Бедра" : key === "belly" ? "Живот" : "Грудь"}</span>
                <strong>{latest?.[key] ?? "-"} см</strong>
                <small>{formatSigned(getMeasurementChange(data.dailyEntries, key, 30) ?? 0, "см")} за месяц</small>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Активность" icon={<Activity size={20} />}>
          <div className="metric-grid">
            <MetricCard label="Тренировок за неделю" value={`${getWeeklyWorkoutCount(data.workouts)}`} />
            <MetricCard label="Минут активности" value={`${minutes}`} />
          </div>
          <ProgressBar value={minutes} max={data.goals.targetMinutesPerWeek} label="150 минут в неделю" />
          <p className="muted">{getNearestGoalText(data)}</p>
        </DashboardCard>

        <DashboardCard title="Привычки" icon={<Sparkles size={20} />}>
          <MetricCard label="Сегодня" value={`${habitStats.done}/${habitStats.total}`} hint={`За неделю: ${weekHabits.overall}%`} tone="good" />
          <HabitTracker entries={data.dailyEntries} workouts={data.workouts} />
        </DashboardCard>

        <DashboardCard title="Самочувствие" icon={<HeartPulse size={20} />}>
          <div className="metric-grid">
            <MetricCard label="Энергия" value={`${latest?.energy ?? "-"}/5`} />
            <MetricCard label="Настроение" value={`${latest?.mood ?? "-"}/5`} />
            <MetricCard label="Голод" value={`${latest?.hunger ?? "-"}/5`} />
            <MetricCard label="Сон" value={`${latest?.sleepHours ?? "-"} ч`} />
          </div>
        </DashboardCard>

        <DashboardCard title="Силуэт тела" className="card--wide">
          <BodySilhouetteComparison entries={data.dailyEntries} />
        </DashboardCard>

        <DashboardCard title="Что влияет на результат" className="card--wide">
          <div className="note-list">
            {getInfluenceNotes(data).map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
