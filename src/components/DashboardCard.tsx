import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export const DashboardCard = ({ title, icon, children, className = "" }: DashboardCardProps) => (
  <section className={`card ${className}`}>
    <div className="card__header">
      <h2>{title}</h2>
      {icon && <div className="card__icon">{icon}</div>}
    </div>
    {children}
  </section>
);
