import { ProgressBar } from "./ProgressBar";

type GoalCardProps = {
  label: string;
  current: number;
  target: number;
  unit: string;
  inverse?: boolean;
};

export const GoalCard = ({ label, current, target, unit, inverse }: GoalCardProps) => {
  const progress = inverse ? Math.max(0, current - target) : current;
  const max = inverse ? Math.max(1, current) : target;
  const left = inverse ? Math.max(0, current - target) : Math.max(0, target - current);

  return (
    <article className="goal-card">
      <div>
        <span>{label}</span>
        <strong>
          {current} / {target} {unit}
        </strong>
      </div>
      <ProgressBar value={inverse ? max - progress : progress} max={max} />
      <small>{left > 0 ? `Осталось ${left.toFixed(1)} ${unit}` : "Цель достигнута или закрепляется"}</small>
    </article>
  );
};
