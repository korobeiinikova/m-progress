const dayMs = 24 * 60 * 60 * 1000;

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const parseIso = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export const daysBetween = (older: string, newer: string) =>
  Math.round((parseIso(newer).getTime() - parseIso(older).getTime()) / dayMs);

export const addDays = (date: string, amount: number) => {
  const next = parseIso(date);
  next.setDate(next.getDate() + amount);
  return next.toISOString().slice(0, 10);
};

export const startOfWeekIso = (value = todayIso()) => {
  const date = parseIso(value);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
};

export const isWithinLastDays = (date: string, days: number, base = todayIso()) =>
  daysBetween(date, base) >= 0 && daysBetween(date, base) < days;

export const formatDateRu = (value: string) =>
  new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(parseIso(value));

export const formatWeekRu = (value: string) => {
  const start = startOfWeekIso(value);
  const end = addDays(start, 6);
  return `${formatDateRu(start)} - ${formatDateRu(end)}`;
};

export const sortByDateAsc = <T extends { date: string }>(items: T[]) =>
  [...items].sort((a, b) => a.date.localeCompare(b.date));

export const sortByDateDesc = <T extends { date: string }>(items: T[]) =>
  [...items].sort((a, b) => b.date.localeCompare(a.date));
