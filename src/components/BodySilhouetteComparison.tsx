import { useState } from "react";
import type { DailyEntry } from "../types";
import { getClosestComparisonEntry } from "../utils/analytics";
import { formatDateRu } from "../utils/date";

type Period = "week" | "month" | "start";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const buildPath = (entry: DailyEntry) => {
  const chest = clamp(entry.chest / 2.5, 32, 49);
  const waist = clamp(((entry.waist + entry.belly) / 2) / 2.7, 27, 43);
  const hips = clamp(entry.hips / 2.45, 34, 53);
  const thigh = clamp((entry.thigh ?? 60) / 4.7, 10, 16);
  const calf = clamp((entry.calf ?? 38) / 6, 5, 9);

  return `
    M 100 18
    C ${100 - chest * 0.55} 28, ${100 - chest} 42, ${100 - chest} 74
    C ${100 - waist} 92, ${100 - waist} 124, ${100 - hips} 145
    C ${100 - hips * 0.8} 169, ${100 - thigh} 190, ${100 - calf} 230
    M 100 18
    C ${100 + chest * 0.55} 28, ${100 + chest} 42, ${100 + chest} 74
    C ${100 + waist} 92, ${100 + waist} 124, ${100 + hips} 145
    C ${100 + hips * 0.8} 169, ${100 + thigh} 190, ${100 + calf} 230
  `;
};

export const BodySilhouetteComparison = ({ entries }: { entries: DailyEntry[] }) => {
  const [period, setPeriod] = useState<Period>("month");
  const { current, previous } = getClosestComparisonEntry(entries, period);

  if (!current || !previous || entries.length < 2) {
    return (
      <div className="silhouette silhouette--empty">
        Пока недостаточно данных для сравнения силуэта. Добавьте хотя бы две записи параметров.
      </div>
    );
  }

  return (
    <div className="silhouette">
      <div className="segmented" aria-label="Период сравнения силуэта">
        {[
          ["week", "Неделя"],
          ["month", "Месяц"],
          ["start", "Старт"],
        ].map(([value, label]) => (
          <button
            className={period === value ? "is-active" : ""}
            key={value}
            onClick={() => setPeriod(value as Period)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 200 252" role="img" aria-label="Сравнение параметров тела">
        <circle cx="100" cy="18" r="13" className="silhouette__head" />
        <path d={buildPath(previous)} className="silhouette__previous" />
        <path d={buildPath(current)} className="silhouette__current" />
        <line x1="100" y1="32" x2="100" y2="232" className="silhouette__center" />
      </svg>
      <div className="silhouette__legend">
        <span><i className="legend-current" /> Сейчас: {formatDateRu(current.date)}</span>
        <span><i className="legend-previous" /> Сравнение: {formatDateRu(previous.date)}</span>
      </div>
    </div>
  );
};
