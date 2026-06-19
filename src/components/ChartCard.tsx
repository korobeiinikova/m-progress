import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  hint?: string;
  children: ReactNode;
};

export const ChartCard = ({ title, hint, children }: ChartCardProps) => (
  <section className="chart-card">
    <div className="chart-card__header">
      <h2>{title}</h2>
      {hint && <span>{hint}</span>}
    </div>
    <div className="chart-card__body">{children}</div>
  </section>
);
