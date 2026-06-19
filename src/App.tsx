import { useState } from "react";
import { Layout } from "./components/Layout";
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
import type { PageKey } from "./types";

export const App = () => {
  const { data, actions } = useLocalStorageData();
  const [page, setPage] = useState<PageKey>("today");

  const content = {
    today: <TodayPage data={data} onNavigate={setPage} />,
    entry: <EntryPage data={data} onSubmit={actions.addDailyEntry} />,
    workouts: <WorkoutsPage data={data} onSubmit={actions.addWorkout} />,
    measurements: <MeasurementsPage data={data} onAddPhoto={actions.addPhoto} />,
    habits: <HabitsPage data={data} />,
    progress: <ProgressPage data={data} />,
    week: <WeekPage data={data} />,
    goals: <GoalsPage data={data} onSubmit={actions.updateGoals} />,
    settings: <SettingsPage data={data} onLoadDemo={actions.loadDemo} onClear={actions.clearAll} />,
  } satisfies Record<PageKey, React.ReactNode>;

  return (
    <Layout page={page} onNavigate={setPage}>
      {content[page]}
    </Layout>
  );
};
