type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: "good" | "soft" | "plain";
};

export const MetricCard = ({ label, value, hint, tone = "plain" }: MetricCardProps) => (
  <article className={`metric metric--${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
    {hint && <small>{hint}</small>}
  </article>
);
