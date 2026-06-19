import { useCallback, useState } from "react";
import { Layout } from "./components/Layout";
import { ToastStack, type ToastMessage } from "./components/ToastStack";
import { useLocalStorageData } from "./hooks/useLocalStorageData";
import { EntryPage } from "./pages/EntryPage";
import { GoalsPage } from "./pages/GoalsPage";
import { HabitsPage } from "./pages/HabitsPage";
import { MeasurementsPage } from "./pages/MeasurementsPage";
import { ProgressPage } from "./pages/ProgressPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TodayPage } from "./pages/TodayPage";
import { WeekPage } from "./pages/WeekPage";
import { WorkoutsPage } from "./pages/WorkoutsPage";
import type { AppData, DailyEntry, Goals, PageKey, ProgressPhoto, WorkoutEntry } from "./types";
import { getAchievements } from "./utils/analytics";

const unlockedAchievementIds = (data: AppData) =>
  new Set(getAchievements(data).filter((achievement) => achievement.unlockedAt).map((achievement) => achievement.id));

export const App = () => {
  const { data, actions } = useLocalStorageData();
  const [page, setPage] = useState<PageKey>("today");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const closeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((current) => [...current.slice(-3), { ...toast, id }]);
      window.setTimeout(() => closeToast(id), toast.tone === "achievement" ? 7000 : 4200);
    },
    [closeToast],
  );

  const showNewAchievements = useCallback(
    (nextData: AppData) => {
      const previousIds = unlockedAchievementIds(data);
      getAchievements(nextData)
        .filter((achievement) => achievement.unlockedAt && !previousIds.has(achievement.id))
        .forEach((achievement) => {
          showToast({
            title: `Новое достижение: ${achievement.title}`,
            message: achievement.description,
            tone: "achievement",
          });
        });
    },
    [data, showToast],
  );

  const addDailyEntry = (entry: Omit<DailyEntry, "id">) => {
    const nextData = {
      ...data,
      dailyEntries: [
        ...data.dailyEntries.filter((item) => item.date !== entry.date),
        { ...entry, id: "preview" },
      ],
    };
    actions.addDailyEntry(entry);
    showToast({ title: "Запись за день сохранена", message: "Данные уже обновились на главной.", tone: "success" });
    showNewAchievements(nextData);
  };

  const addWorkout = (entry: Omit<WorkoutEntry, "id">) => {
    const nextData = { ...data, workouts: [...data.workouts, { ...entry, id: "preview" }] };
    actions.addWorkout(entry);
    showToast({ title: "Тренировка сохранена", message: "Активность учтена в прогрессе недели.", tone: "success" });
    showNewAchievements(nextData);
  };

  const deleteDailyEntry = (id: string) => {
    if (!window.confirm("Удалить эту ежедневную запись?")) return;
    actions.deleteDailyEntry(id);
    showToast({ title: "Запись удалена", message: "Графики и силуэт уже пересчитаны.", tone: "soft" });
  };

  const deleteWorkout = (id: string) => {
    if (!window.confirm("Удалить эту тренировку?")) return;
    actions.deleteWorkout(id);
    showToast({ title: "Тренировка удалена", message: "Активность недели обновлена.", tone: "soft" });
  };

  const updateGoals = (goals: Goals) => {
    const nextData = { ...data, goals };
    actions.updateGoals(goals);
    showToast({ title: "Цели сохранены", message: "Ориентиры обновлены.", tone: "success" });
    showNewAchievements(nextData);
  };

  const addPhoto = (photo: Omit<ProgressPhoto, "id">) => {
    actions.addPhoto(photo);
    showToast({ title: "Фото сохранено", message: "Оно появится в сравнении старт / сейчас.", tone: "success" });
  };

  const loadDemo = () => {
    actions.loadDemo();
    showToast({ title: "Демо-данные загружены", message: "Теперь можно посмотреть приложение с живыми графиками.", tone: "soft" });
  };

  const clearAll = () => {
    actions.clearAll();
    showToast({ title: "Данные очищены", message: "Можно начать заново с первой записи.", tone: "soft" });
  };

  const content = {
    today: <TodayPage data={data} onNavigate={setPage} />,
    entry: <EntryPage data={data} onSubmit={addDailyEntry} onDelete={deleteDailyEntry} />,
    workouts: <WorkoutsPage data={data} onSubmit={addWorkout} onDelete={deleteWorkout} />,
    measurements: <MeasurementsPage data={data} onAddPhoto={addPhoto} onDeleteEntry={deleteDailyEntry} />,
    habits: <HabitsPage data={data} />,
    progress: <ProgressPage data={data} />,
    week: <WeekPage data={data} />,
    goals: <GoalsPage data={data} onSubmit={updateGoals} />,
    settings: <SettingsPage data={data} onLoadDemo={loadDemo} onClear={clearAll} />,
  } satisfies Record<PageKey, React.ReactNode>;

  return (
    <>
      <Layout page={page} onNavigate={setPage}>
        {content[page]}
      </Layout>
      <ToastStack toasts={toasts} onClose={closeToast} />
    </>
  );
};
