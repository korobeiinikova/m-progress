import { useState } from "react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AppData, MeasurementKey } from "../types";
import {
  buildMeasurementSeries,
  formatSigned,
  getMeasurementChange,
  getStartChange,
  latestDailyEntry,
  measurementKeys,
} from "../utils/analytics";
import { formatDateRu, sortByDateDesc } from "../utils/date";
import { measurementLabels, measurementUnits } from "../utils/labels";
import { BodySilhouetteComparison } from "../components/BodySilhouetteComparison";
import { ChartCard } from "../components/ChartCard";
import { MetricCard } from "../components/MetricCard";
import { PhotoProgress } from "../components/PhotoProgress";

const colors = ["#5f8d72", "#8aa35f", "#c29f62", "#6d9ca0", "#b77978", "#8f84a7", "#d58c6b", "#7d8f6b"];

export const MeasurementsPage = ({
  data,
  onAddPhoto,
}: {
  data: AppData;
  onAddPhoto: Parameters<typeof PhotoProgress>[0]["onAdd"];
}) => {
  const latest = latestDailyEntry(data.dailyEntries);
  const [selected, setSelected] = useState<MeasurementKey[]>(["weight", "waist", "hips", "belly"]);
  const series = buildMeasurementSeries(data.dailyEntries, selected);

  return (
    <div className="page">
      <header className="page-title">
        <p>Параметры тела</p>
        <h1>Объемы тоже важны - это реальный прогресс</h1>
      </header>

      <section className="info-band">
        Даже если вес меняется медленно, уменьшение объемов - это важный прогресс.
      </section>

      <div className="metric-grid metric-grid--wide">
        {measurementKeys.map((key) => (
          <MetricCard
            key={key}
            label={measurementLabels[key]}
            value={latest?.[key] ? `${latest[key]} ${measurementUnits[key]}` : "-"}
            hint={`7 дн: ${formatSigned(getMeasurementChange(data.dailyEntries, key, 7) ?? 0, measurementUnits[key])} · старт: ${formatSigned(getStartChange(data.dailyEntries, key) ?? 0, measurementUnits[key])}`}
          />
        ))}
      </div>

      <section className="panel">
        <div className="section-title">
          <h2>Графики параметров</h2>
          <p>Выберите показатели, которые хочется видеть сейчас.</p>
        </div>
        <div className="chip-grid">
          {measurementKeys.map((key) => (
            <button
              className={selected.includes(key) ? "chip is-active" : "chip"}
              key={key}
              onClick={() =>
                setSelected((current) =>
                  current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
                )
              }
              type="button"
            >
              {measurementLabels[key]}
            </button>
          ))}
        </div>
        <ChartCard title="Динамика выбранных параметров">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {selected.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={measurementLabels[key]}
                  stroke={colors[index % colors.length]}
                  strokeWidth={3}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <h2>Изменение объемов</h2>
          <div className="body-change-list">
            {(["waist", "hips", "belly", "chest"] as MeasurementKey[]).map((key) => (
              <div key={key}>
                <span>{measurementLabels[key]}</span>
                <strong>{formatSigned(getStartChange(data.dailyEntries, key) ?? 0, measurementUnits[key])}</strong>
                <small>от стартовой точки</small>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <h2>Визуальное сравнение со стартом</h2>
          <BodySilhouetteComparison entries={data.dailyEntries} />
        </section>
      </div>

      <section className="panel">
        <h2>История измерений</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                {measurementKeys.map((key) => (
                  <th key={key}>{measurementLabels[key]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortByDateDesc(data.dailyEntries).slice(0, 12).map((entry) => (
                <tr key={entry.id}>
                  <td>{formatDateRu(entry.date)}</td>
                  {measurementKeys.map((key) => (
                    <td key={key}>{entry[key] ?? "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PhotoProgress photos={data.photos} onAdd={onAddPhoto} />
    </div>
  );
};
