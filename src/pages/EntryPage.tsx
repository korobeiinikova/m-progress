import type { AppData } from "../types";
import { DailyEntryForm } from "../components/DailyEntryForm";
import { latestDailyEntry } from "../utils/analytics";
import { formatDateRu, sortByDateDesc } from "../utils/date";

type EntryPageProps = {
  data: AppData;
  onSubmit: Parameters<typeof DailyEntryForm>[0]["onSubmit"];
  onDelete: (id: string) => void;
};

export const EntryPage = ({ data, onSubmit, onDelete }: EntryPageProps) => (
  <div className="page page--narrow">
    <header className="page-title">
      <p>Ежедневная запись</p>
      <h1>Быстрый дневник без жесткого контроля</h1>
      <span>Заполните только то, что актуально сегодня. Если день не идеальный, это не отменяет весь путь.</span>
    </header>
    <DailyEntryForm latest={latestDailyEntry(data.dailyEntries)} onSubmit={onSubmit} />

    <section className="panel">
      <div className="section-title">
        <h2>Последние записи</h2>
        <p>Тестовые или лишние записи можно удалить здесь.</p>
      </div>
      <div className="history-list">
        {sortByDateDesc(data.dailyEntries).slice(0, 10).map((entry) => (
          <article className="history-item" key={entry.id}>
            <div>
              <strong>{formatDateRu(entry.date)}</strong>
              <span>
                Вес {entry.weight} кг · талия {entry.waist} см · живот {entry.belly} см · бедра {entry.hips} см
              </span>
              {entry.note && <small>{entry.note}</small>}
            </div>
            <button className="button button--danger button--small" type="button" onClick={() => onDelete(entry.id)}>
              Удалить
            </button>
          </article>
        ))}
        {!data.dailyEntries.length && <p className="muted">Пока нет сохраненных записей.</p>}
      </div>
    </section>
  </div>
);
