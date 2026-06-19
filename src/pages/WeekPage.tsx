import type { AppData } from "../types";
import { getAchievements } from "../utils/analytics";
import { AchievementBadge } from "../components/AchievementBadge";
import { WeeklySummary } from "../components/WeeklySummary";

export const WeekPage = ({ data }: { data: AppData }) => (
  <div className="page">
    <header className="page-title">
      <p>Итоги недели</p>
      <h1>Мини-дашборд без чувства вины</h1>
    </header>
    <section className="panel">
      <WeeklySummary data={data} />
    </section>
    <section className="panel">
      <div className="section-title">
        <h2>Достижения</h2>
        <p>Они выдаются за регулярность, заботу и возвращение к процессу.</p>
      </div>
      <div className="achievement-grid">
        {getAchievements(data).map((achievement) => (
          <AchievementBadge achievement={achievement} key={achievement.id} />
        ))}
      </div>
    </section>
  </div>
);
