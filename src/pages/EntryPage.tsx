import type { AppData } from "../types";
import { DailyEntryForm } from "../components/DailyEntryForm";
import { latestDailyEntry } from "../utils/analytics";

type EntryPageProps = {
  data: AppData;
  onSubmit: Parameters<typeof DailyEntryForm>[0]["onSubmit"];
};

export const EntryPage = ({ data, onSubmit }: EntryPageProps) => (
  <div className="page page--narrow">
    <header className="page-title">
      <p>Ежедневная запись</p>
      <h1>Быстрый дневник без жесткого контроля</h1>
      <span>Заполните только то, что актуально сегодня. Если день не идеальный, это не отменяет весь путь.</span>
    </header>
    <DailyEntryForm latest={latestDailyEntry(data.dailyEntries)} onSubmit={onSubmit} />
  </div>
);
