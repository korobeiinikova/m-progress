import type { AppData } from "../types";
import { MetricCard } from "../components/MetricCard";

type SettingsPageProps = {
  data: AppData;
  onLoadDemo: () => void;
  onClear: () => void;
};

export const SettingsPage = ({ data, onLoadDemo, onClear }: SettingsPageProps) => (
  <div className="page page--narrow">
    <header className="page-title">
      <p>Настройки</p>
      <h1>Данные хранятся только в этом браузере</h1>
      <span>Можно загрузить демо-данные, чтобы посмотреть приложение живым, или очистить все и начать заново.</span>
    </header>

    <section className="panel">
      <div className="metric-grid">
        <MetricCard label="Записей" value={`${data.dailyEntries.length}`} />
        <MetricCard label="Тренировок" value={`${data.workouts.length}`} />
        <MetricCard label="Фото" value={`${data.photos.length}`} />
      </div>
      <div className="settings-actions">
        <button className="button button--primary" onClick={onLoadDemo}>Загрузить демо-данные</button>
        <button className="button button--ghost" onClick={onClear}>Очистить все данные</button>
      </div>
    </section>
  </div>
);
