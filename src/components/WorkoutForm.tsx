import { useState } from "react";
import type { WorkoutEntry, WorkoutType } from "../types";
import { todayIso } from "../utils/date";
import { workoutTypeLabels } from "../utils/labels";

type WorkoutFormProps = {
  onSubmit: (entry: Omit<WorkoutEntry, "id">) => void;
};

const numberValue = (value: FormDataEntryValue | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const WorkoutForm = ({ onSubmit }: WorkoutFormProps) => {
  const [type, setType] = useState<WorkoutType>("treadmill");
  const [date, setDate] = useState(todayIso());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit({
      date,
      type,
      duration: Number(form.get("duration") || 0),
      speed: numberValue(form.get("speed")),
      incline: numberValue(form.get("incline")),
      distance: numberValue(form.get("distance")),
      effort: Number(form.get("effort") || 5),
      note: String(form.get("note") ?? ""),
    });
    event.currentTarget.reset();
    setDate(todayIso());
    setType("treadmill");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Дата
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          Тип тренировки
          <select value={type} onChange={(event) => setType(event.target.value as WorkoutType)}>
            {Object.entries(workoutTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Длительность, мин
          <input name="duration" type="number" min="1" required />
        </label>
        <label>
          Сложность: 1-10
          <input name="effort" type="range" min="1" max="10" defaultValue="5" />
        </label>
        {type === "treadmill" && (
          <>
            <label>
              Скорость
              <input name="speed" type="number" step="0.1" />
            </label>
            <label>
              Наклон
              <input name="incline" type="number" step="0.5" />
            </label>
          </>
        )}
        <label>
          Расстояние, км
          <input name="distance" type="number" step="0.1" />
        </label>
      </div>
      <label>
        Комментарий
        <textarea name="note" rows={3} placeholder="Как ощущалась тренировка?" />
      </label>
      <button className="button button--primary" type="submit">
        Добавить тренировку
      </button>
    </form>
  );
};
