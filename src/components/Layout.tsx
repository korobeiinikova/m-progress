import {
  Activity,
  BarChart3,
  CalendarCheck,
  Dumbbell,
  Home,
  Ruler,
  Settings,
  Target,
  Trophy,
} from "lucide-react";
import type { PageKey } from "../types";

const navItems: { key: PageKey; label: string; icon: React.ElementType }[] = [
  { key: "today", label: "Сегодня", icon: Home },
  { key: "entry", label: "Запись", icon: CalendarCheck },
  { key: "workouts", label: "Тренировки", icon: Dumbbell },
  { key: "measurements", label: "Параметры", icon: Ruler },
  { key: "habits", label: "Привычки", icon: Activity },
  { key: "progress", label: "Прогресс", icon: BarChart3 },
  { key: "week", label: "Неделя", icon: Trophy },
  { key: "goals", label: "Цели", icon: Target },
  { key: "settings", label: "Настройки", icon: Settings },
];

type LayoutProps = {
  page: PageKey;
  onNavigate: (page: PageKey) => void;
  children: React.ReactNode;
};

export const Layout = ({ page, onNavigate, children }: LayoutProps) => (
  <div className="app-shell">
    <aside className="sidebar">
      <div className="brand">
        <span>МП</span>
        <div>
          <strong>Мой прогресс</strong>
          <small>мягкий wellness-трекер</small>
        </div>
      </div>
      <nav className="nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button className={page === item.key ? "is-active" : ""} key={item.key} onClick={() => onNavigate(item.key)}>
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
    <main className="main">{children}</main>
    <nav className="mobile-nav">
      {navItems.slice(0, 5).map((item) => {
        const Icon = item.icon;
        return (
          <button className={page === item.key ? "is-active" : ""} key={item.key} onClick={() => onNavigate(item.key)}>
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  </div>
);
