import { useState } from "react";
import type { DailyEntry } from "../types";
import { todayIso } from "../utils/date";

type DailyEntryFormProps = {
  latest?: DailyEntry;
  onSubmit: (entry: Omit<DailyEntry, "id">) => void;
};

const numberValue = (value: FormDataEntryValue | null, fallback = 0) => Number(value || fallback);

export const DailyEntryForm = ({ latest, onSubmit }: DailyEntryFormProps) => {
  const [date, setDate] = useState(todayIso());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    onSubmit({
      date,
      weight: numberValue(form.get("weight")),
      waist: numberValue(form.get("waist")),
      hips: numberValue(form.get("hips")),
      chest: numberValue(form.get("chest")),
      belly: numberValue(form.get("belly")),
      arm: numberValue(form.get("arm")),
      thigh: numberValue(form.get("thigh")),
      calf: numberValue(form.get("calf")),
      sleepHours: numberValue(form.get("sleepHours")),
      energy: numberValue(form.get("energy"), 3),
      mood: numberValue(form.get("mood"), 3),
      hunger: numberValue(form.get("hunger"), 3),
      proteinDone: form.get("proteinDone") === "on",
      vegetablesDone: form.get("vegetablesDone") === "on",
      waterAmount: numberValue(form.get("waterAmount")),
      lateSnack: form.get("lateSnack") === "on",
      overeating: form.get("overeating") === "on",
      note: String(form.get("note") ?? ""),
    });

    event.currentTarget.reset();
    setDate(todayIso());
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid form-grid--compact">
        <label>
          Дата
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          Вес, кг
          <input name="weight" type="number" step="0.1" defaultValue={latest?.weight ?? ""} required />
        </label>
        <label>
          Талия, см
          <input name="waist" type="number" step="0.1" defaultValue={latest?.waist ?? ""} required />
        </label>
        <label>
          Бедра, см
          <input name="hips" type="number" step="0.1" defaultValue={latest?.hips ?? ""} required />
        </label>
        <label>
          Грудь, см
          <input name="chest" type="number" step="0.1" defaultValue={latest?.chest ?? ""} required />
        </label>
        <label>
          Живот, см
          <input name="belly" type="number" step="0.1" defaultValue={latest?.belly ?? ""} required />
        </label>
      </div>

      <details className="form-section" open>
        <summary>Дополнительные параметры</summary>
        <div className="form-grid">
          <label>
            Рука, см
            <input name="arm" type="number" step="0.1" defaultValue={latest?.arm ?? ""} />
          </label>
          <label>
            Бедро / нога, см
            <input name="thigh" type="number" step="0.1" defaultValue={latest?.thigh ?? ""} />
          </label>
          <label>
            Икра, см
            <input name="calf" type="number" step="0.1" defaultValue={latest?.calf ?? ""} />
          </label>
        </div>
      </details>

      <details className="form-section" open>
        <summary>Самочувствие</summary>
        <div className="form-grid">
          <label>
            Сон, часы
            <input name="sleepHours" type="number" step="0.1" defaultValue={latest?.sleepHours ?? 7} />
          </label>
          <label>
            Энергия: <strong className="range-value">1-5</strong>
            <input name="energy" type="range" min="1" max="5" defaultValue={latest?.energy ?? 3} />
          </label>
          <label>
            Настроение: <strong className="range-value">1-5</strong>
            <input name="mood" type="range" min="1" max="5" defaultValue={latest?.mood ?? 3} />
          </label>
          <label>
            Голод: <strong className="range-value">1-5</strong>
            <input name="hunger" type="range" min="1" max="5" defaultValue={latest?.hunger ?? 3} />
          </label>
        </div>
      </details>

      <details className="form-section" open>
        <summary>Питание и поведение</summary>
        <div className="toggle-grid">
          <label><input name="proteinDone" type="checkbox" defaultChecked /> Белок в 2+ приемах пищи</label>
          <label><input name="vegetablesDone" type="checkbox" defaultChecked /> Овощи / зелень</label>
          <label><input name="lateSnack" type="checkbox" /> Был поздний перекус</label>
          <label><input name="overeating" type="checkbox" /> Было переедание</label>
        </div>
        <label>
          Вода, л
          <input name="waterAmount" type="number" step="0.1" defaultValue={latest?.waterAmount ?? 1.8} />
        </label>
      </details>

      <label>
        Комментарий дня
        <textarea name="note" rows={3} placeholder="Что сегодня помогло? Что хочется заметить без оценки?" />
      </label>

      <button className="button button--primary" type="submit">
        Сохранить запись
      </button>
    </form>
  );
};
