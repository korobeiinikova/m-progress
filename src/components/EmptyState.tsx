type EmptyStateProps = {
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({ title, text, actionLabel, onAction }: EmptyStateProps) => (
  <section className="empty-state">
    <div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
    {actionLabel && onAction && (
      <button className="button button--primary" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </section>
);
