import { useState } from "react";
import type { AppData, Goals } from "../types";
import {
  getNearestGoalText,
  getWeeklyWorkoutCount,
  getWeeklyWorkoutMinutes,
  latestDailyEntry,
} from "../utils/analytics";
import { GoalCard } from "../components/GoalCard";

type GoalsPageProps = {
  data: AppData;
  onSubmit: (goals: Goals) => void;
};

export const GoalsPage = ({ data, onSubmit }: GoalsPageProps) => {
  const latest = latestDailyEntry(data.dailyEntries);
  const [goals, setGoals] = useState(data.goals);

  const update = (key: keyof Goals, value: string) => {
    setGoals((current) => ({ ...current, [key]: Number(value) }));
  };

  return (
    <div className="page">
      <header className="page-title">
        <p>Цели</p>
        <h1>Маленькие ориентиры вместо жестких требований</h1>
        <span>{getNearestGoalText(data)}</span>
      </header>

      <div className="dashboard-grid">
        <section className="panel">
          <h2>Настроить цели</h2>
          <form
            className="form"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit(goals);
            }}
          >
            <div className="form-grid">
              {[
                ["currentWeight", "Текущий вес"],
                ["targetWeight", "Желаемый вес"],
                ["targetWaist", "Цель по талии"],
                ["targetHips", "Цель по бедрам"],
                ["targetBelly", "Цель по животу"],
                ["targetWorkoutsPerWeek", "Тренировок в неделю"],
                ["targetMinutesPerWeek", "Минут активности в неделю"],
              ].map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    type="number"
                    step="0.1"
                    value={goals[key as keyof Goals]}
                    onChange={(event) => update(key as keyof Goals, event.target.value)}
                  />
                </label>
              ))}
            </div>
            <button className="button button--primary" type="submit">Сохранить цели</button>
          </form>
        </section>
        <section className="panel">
          <h2>Прогресс к целям</h2>
          <div className="goal-list">
            <GoalCard label="Вес" current={latest?.weight ?? goals.currentWeight} target={goals.targetWeight} unit="кг" inverse />
            <GoalCard label="Талия" current={latest?.waist ?? goals.targetWaist} target={goals.targetWaist} unit="см" inverse />
            <GoalCard label="Бедра" current={latest?.hips ?? goals.targetHips} target={goals.targetHips} unit="см" inverse />
            <GoalCard label="Живот" current={latest?.belly ?? goals.targetBelly} target={goals.targetBelly} unit="см" inverse />
            <GoalCard label="Тренировки" current={getWeeklyWorkoutCount(data.workouts)} target={goals.targetWorkoutsPerWeek} unit="раз" />
            <GoalCard label="Активность" current={getWeeklyWorkoutMinutes(data.workouts)} target={goals.targetMinutesPerWeek} unit="мин" />
          </div>
        </section>
      </div>
    </div>
  );
};
