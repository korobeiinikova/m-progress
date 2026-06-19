type ProgressBarProps = {
  value: number;
  max: number;
  label?: string;
};

export const ProgressBar = ({ value, max, label }: ProgressBarProps) => {
  const percent = max ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="progress">
      <div className="progress__top">
        {label && <span>{label}</span>}
        <strong>{percent}%</strong>
      </div>
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};
