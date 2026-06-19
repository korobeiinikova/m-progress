import { useMemo, useState } from "react";
import type { DailyEntry, MeasurementKey } from "../types";
import { getClosestComparisonEntry } from "../utils/analytics";
import { formatDateRu } from "../utils/date";
import { measurementLabels, measurementUnits } from "../utils/labels";

type Period = "week" | "month" | "start";
type BodyView = "front" | "side";

type FrontGuide = {
  label: string;
  y: number;
  left: number;
  right: number;
};

type SideGuide = {
  label: string;
  y: number;
  back: number;
  front: number;
};

const center = 92;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const scale = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  const ratio = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + ratio * (outMax - outMin);
};

const valueOf = (entry: DailyEntry, key: MeasurementKey, fallback: number) => entry[key] ?? fallback;

const soften = (value: number, anchor: number, maxDelta: number) => clamp(value, anchor - maxDelta, anchor + maxDelta);

const frontMeasures = (entry: DailyEntry) => {
  const chest = valueOf(entry, "chest", 96);
  const waist = valueOf(entry, "waist", 78);
  const underBust = entry.underBust ?? Math.max(waist + 4, chest - 13);
  const belly = valueOf(entry, "belly", waist);
  const hips = valueOf(entry, "hips", 104);
  const thigh = valueOf(entry, "thigh", 58);
  const calf = valueOf(entry, "calf", 37);

  const hipsHalf = scale(hips, 84, 136, 37, 54);
  const waistHalfRaw = scale(waist, 58, 112, 23, 39);
  const chestHalfRaw = scale(chest, 78, 126, 32, 48);
  const underBustHalfRaw = scale(underBust, 68, 118, 28, 43);

  const waistHalf = clamp(waistHalfRaw, 23, hipsHalf - 7);
  const chestHalf = clamp(chestHalfRaw, waistHalf + 4, hipsHalf + 3);
  const underBustHalf = clamp(underBustHalfRaw, waistHalf + 2, chestHalf - 1);
  const bellyHalf = clamp(
    Math.max(scale(belly, 68, 130, 29, 48), waistHalf + scale(Math.max(0, belly - waist), 0, 28, 2, 8)),
    waistHalf + 2,
    hipsHalf + 2,
  );
  const shoulderHalf = clamp(chestHalf + 8, 38, Math.min(57, chestHalf + 12));
  const upperThighHalf = clamp(scale(thigh, 44, 82, 13.5, 21), 13, Math.min(22, hipsHalf * 0.44));
  const kneeHalf = clamp(upperThighHalf * 0.64, 9, 14);
  const calfHalf = clamp(scale(calf, 29, 52, 8.5, 14), kneeHalf * 0.9, upperThighHalf * 0.82);
  const ankleHalf = clamp(calfHalf * 0.58, 5.5, 8);

  return {
    shoulderHalf,
    chestHalf: soften(chestHalf, underBustHalf, 12),
    underBustHalf,
    waistHalf,
    bellyHalf: soften(bellyHalf, waistHalf, 15),
    hipsHalf: soften(hipsHalf, bellyHalf, 16),
    upperThighHalf,
    kneeHalf,
    calfHalf,
    ankleHalf,
  };
};

const frontPath = (entry: DailyEntry) => {
  const m = frontMeasures(entry);
  const legGap = 5.5;
  const leftLegCenter = center - legGap - m.upperThighHalf * 0.62;
  const rightLegCenter = center + legGap + m.upperThighHalf * 0.62;

  const path = `
    M ${center - 9} 44
    C ${center - 18} 47, ${center - m.shoulderHalf} 51, ${center - m.shoulderHalf} 61
    C ${center - m.chestHalf} 75, ${center - m.chestHalf} 90, ${center - m.underBustHalf} 105
    C ${center - m.underBustHalf} 116, ${center - m.waistHalf} 121, ${center - m.waistHalf} 132
    C ${center - m.bellyHalf} 147, ${center - m.bellyHalf} 160, ${center - m.hipsHalf} 179
    C ${center - m.hipsHalf} 190, ${leftLegCenter - m.upperThighHalf * 0.92} 195, ${leftLegCenter - m.upperThighHalf} 207
    C ${leftLegCenter - m.upperThighHalf * 0.86} 228, ${leftLegCenter - m.kneeHalf} 245, ${leftLegCenter - m.kneeHalf} 263
    C ${leftLegCenter - m.calfHalf} 282, ${leftLegCenter - m.calfHalf * 0.95} 303, ${leftLegCenter - m.ankleHalf} 329
    C ${leftLegCenter - m.ankleHalf * 0.62} 337, ${leftLegCenter + m.ankleHalf * 0.62} 337, ${leftLegCenter + m.ankleHalf} 329
    C ${leftLegCenter + m.calfHalf * 0.68} 302, ${leftLegCenter + m.kneeHalf * 0.55} 279, ${center - legGap * 0.62} 209
    C ${center - legGap * 0.32} 203, ${center + legGap * 0.32} 203, ${center + legGap * 0.62} 209
    C ${rightLegCenter - m.kneeHalf * 0.55} 279, ${rightLegCenter - m.calfHalf * 0.68} 302, ${rightLegCenter - m.ankleHalf} 329
    C ${rightLegCenter - m.ankleHalf * 0.62} 337, ${rightLegCenter + m.ankleHalf * 0.62} 337, ${rightLegCenter + m.ankleHalf} 329
    C ${rightLegCenter + m.calfHalf * 0.95} 303, ${rightLegCenter + m.calfHalf} 282, ${rightLegCenter + m.kneeHalf} 263
    C ${rightLegCenter + m.kneeHalf} 245, ${rightLegCenter + m.upperThighHalf * 0.86} 228, ${rightLegCenter + m.upperThighHalf} 207
    C ${rightLegCenter + m.upperThighHalf * 0.92} 195, ${center + m.hipsHalf} 190, ${center + m.hipsHalf} 179
    C ${center + m.bellyHalf} 160, ${center + m.bellyHalf} 147, ${center + m.waistHalf} 132
    C ${center + m.waistHalf} 121, ${center + m.underBustHalf} 116, ${center + m.underBustHalf} 105
    C ${center + m.chestHalf} 90, ${center + m.chestHalf} 75, ${center + m.shoulderHalf} 61
    C ${center + m.shoulderHalf} 51, ${center + 18} 47, ${center + 9} 44
    C ${center + 5} 40, ${center - 5} 40, ${center - 9} 44
    Z
  `;

  const guides: FrontGuide[] = [
    { label: "грудь", y: 84, left: center - m.chestHalf, right: center + m.chestHalf },
    { label: "под грудью", y: 106, left: center - m.underBustHalf, right: center + m.underBustHalf },
    { label: "талия", y: 132, left: center - m.waistHalf, right: center + m.waistHalf },
    { label: "живот", y: 154, left: center - m.bellyHalf, right: center + m.bellyHalf },
    { label: "бедра", y: 179, left: center - m.hipsHalf, right: center + m.hipsHalf },
    { label: "бедро", y: 228, left: leftLegCenter - m.upperThighHalf, right: rightLegCenter + m.upperThighHalf },
    { label: "икра", y: 289, left: leftLegCenter - m.calfHalf, right: rightLegCenter + m.calfHalf },
  ];

  return { path, guides, head: { cx: center, cy: 25, r: 13 } };
};

const sideMeasures = (entry: DailyEntry) => {
  const chest = valueOf(entry, "chest", 96);
  const waist = valueOf(entry, "waist", 78);
  const underBust = entry.underBust ?? Math.max(waist + 4, chest - 13);
  const belly = valueOf(entry, "belly", waist);
  const hips = valueOf(entry, "hips", 104);
  const thigh = valueOf(entry, "thigh", 58);
  const calf = valueOf(entry, "calf", 37);

  const chestFront = scale(chest + Math.max(0, chest - underBust) * 0.7, 82, 140, 18, 35);
  const underBustFront = scale(underBust, 68, 118, 13, 24);
  const waistFront = scale(waist, 58, 112, 10, 21);
  const bellyFront = clamp(scale(belly + Math.max(0, belly - waist), 72, 145, 17, 39), waistFront + 4, 41);
  const hipFront = scale(hips, 84, 136, 18, 35);
  const backHip = scale(hips - waist, -2, 38, 11, 25);
  const backWaist = scale(hips - waist, -2, 38, 4, 11);
  const thighDepth = scale(thigh, 44, 82, 15, 24);
  const kneeDepth = clamp(thighDepth * 0.64, 10, 16);
  const calfDepth = clamp(scale(calf, 29, 52, 9, 15), kneeDepth * 0.9, thighDepth * 0.82);
  const ankleDepth = clamp(calfDepth * 0.6, 5.5, 8);

  return {
    chestFront,
    underBustFront,
    waistFront,
    bellyFront,
    hipFront,
    backHip,
    backWaist,
    thighDepth,
    kneeDepth,
    calfDepth,
    ankleDepth,
  };
};

const sidePath = (entry: DailyEntry) => {
  const m = sideMeasures(entry);
  const back = 83;
  const base = 97;
  const path = `
    M ${back} 45
    C ${back - 5} 58, ${back - 8} 83, ${back - 7} 104
    C ${back - m.backWaist} 119, ${back - m.backWaist} 137, ${back - 3} 154
    C ${back - m.backHip} 169, ${back - m.backHip} 183, ${back - m.backHip * 0.58} 195
    C ${back - m.thighDepth * 0.9} 221, ${back - m.kneeDepth} 244, ${back - m.kneeDepth * 0.82} 264
    C ${back - m.calfDepth} 284, ${back - m.calfDepth * 0.78} 306, ${back - m.ankleDepth} 329
    C ${back - m.ankleDepth * 0.25} 337, ${base + m.ankleDepth * 0.9} 337, ${base + m.ankleDepth} 329
    C ${base + m.calfDepth} 303, ${base + m.calfDepth} 284, ${base + m.kneeDepth} 264
    C ${base + m.thighDepth} 238, ${base + m.thighDepth} 212, ${base + m.hipFront} 190
    C ${base + m.hipFront + 4} 178, ${base + m.bellyFront} 169, ${base + m.bellyFront} 154
    C ${base + m.bellyFront} 139, ${base + m.waistFront} 128, ${base + m.waistFront} 116
    C ${base + m.underBustFront} 107, ${base + m.underBustFront} 99, ${base + m.chestFront} 87
    C ${base + m.chestFront} 72, ${base + 19} 60, ${base + 12} 50
    C ${base + 4} 42, ${back + 6} 39, ${back} 45
    Z
  `;

  const guides: SideGuide[] = [
    { label: "грудь", y: 86, back: back - 7, front: base + m.chestFront },
    { label: "под грудью", y: 106, back: back - 7, front: base + m.underBustFront },
    { label: "талия", y: 127, back: back - m.backWaist, front: base + m.waistFront },
    { label: "живот", y: 154, back: back - 4, front: base + m.bellyFront },
    { label: "бедра", y: 184, back: back - m.backHip, front: base + m.hipFront },
    { label: "бедро", y: 226, back: back - m.thighDepth, front: base + m.thighDepth },
    { label: "икра", y: 289, back: back - m.calfDepth, front: base + m.calfDepth },
  ];

  return { path, guides, head: { cx: 91, cy: 25, r: 13 } };
};

const diffText = (current: DailyEntry, previous?: DailyEntry) => {
  if (!previous) return ["Сейчас показана первая форма. История сравнения появится после второй записи."];

  const keys: MeasurementKey[] = ["chest", "waist", "belly", "hips", "thigh", "calf"];
  return keys
    .map((key) => ({
      key,
      change: Number(((current[key] ?? 0) - (previous[key] ?? 0)).toFixed(1)),
    }))
    .filter((item) => item.change !== 0)
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 4)
    .map((item) => {
      const sign = item.change > 0 ? "+" : "";
      return `${measurementLabels[item.key]}: ${sign}${item.change} ${measurementUnits[item.key]}`;
    });
};

const BodyShape = ({
  entry,
  view,
  variant,
}: {
  entry: DailyEntry;
  view: BodyView;
  variant: "current" | "previous";
}) => {
  const geometry = view === "front" ? frontPath(entry) : sidePath(entry);

  return (
    <g className={`measure-shape measure-shape--${variant}`}>
      <circle cx={geometry.head.cx} cy={geometry.head.cy} r={geometry.head.r} className="measure-shape__head" />
      <path d={geometry.path} className="measure-shape__body" />
      {variant === "current" && (
        <g className="measure-shape__guides">
          {geometry.guides.map((guide) => {
            const start = "left" in guide ? guide.left : guide.back;
            const end = "right" in guide ? guide.right : guide.front;
            return (
              <g key={`${guide.label}-${guide.y}`}>
                <line x1={start} x2={end} y1={guide.y} y2={guide.y} />
                <line x1={end} x2={164} y1={guide.y} y2={guide.y} className="measure-shape__leader" />
                <text x={168} y={guide.y + 3}>{guide.label}</text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};

export const BodySilhouetteComparison = ({ entries }: { entries: DailyEntry[] }) => {
  const [period, setPeriod] = useState<Period>("month");
  const [view, setView] = useState<BodyView>("front");
  const { current, previous } = getClosestComparisonEntry(entries, period);
  const changes = useMemo(() => (current ? diffText(current, previous) : []), [current, previous]);

  if (!current) {
    return (
      <div className="silhouette silhouette--empty">
        Пока нет данных для силуэта. Добавьте первую запись параметров.
      </div>
    );
  }

  return (
    <div className="silhouette body-visualization">
      <div className="body-visualization__controls">
        <div className="segmented" aria-label="Вид тела">
          {[
            ["front", "Спереди"],
            ["side", "Сбоку"],
          ].map(([value, label]) => (
            <button
              className={view === value ? "is-active" : ""}
              key={value}
              onClick={() => setView(value as BodyView)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
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
      </div>

      <div className="body-visualization__stage body-visualization__stage--clean">
        <svg viewBox="0 0 200 356" role="img" aria-label="Мерочный силуэт по параметрам тела">
          {previous && <BodyShape entry={previous} view={view} variant="previous" />}
          <BodyShape entry={current} view={view} variant="current" />
        </svg>
      </div>

      <div className="silhouette__legend body-visualization__legend">
        <span>
          <i className="legend-current" /> Сейчас: {formatDateRu(current.date)}
        </span>
        {previous ? (
          <span>
            <i className="legend-previous" /> Сравнение: {formatDateRu(previous.date)}
          </span>
        ) : (
          <span className="silhouette__hint">Сравнение появится после второй записи параметров.</span>
        )}
      </div>

      <div className="body-visualization__details">
        <div>
          <strong>На форму влияют</strong>
          <p>грудь, под грудью, талия, живот, бедра, бедро ноги и икра.</p>
        </div>
        <div>
          <strong>Что изменилось</strong>
          <p>{changes.length ? changes.join(" · ") : "Пока изменения не рассчитаны."}</p>
        </div>
      </div>
    </div>
  );
};
