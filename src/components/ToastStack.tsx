export type ToastMessage = {
  id: string;
  title: string;
  message?: string;
  tone?: "success" | "achievement" | "soft";
};

type ToastStackProps = {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
};

export const ToastStack = ({ toasts, onClose }: ToastStackProps) => (
  <div className="toast-stack" role="status" aria-live="polite" aria-atomic="false">
    {toasts.map((toast) => (
      <article className={`toast toast--${toast.tone ?? "success"}`} key={toast.id}>
        <div>
          <strong>{toast.title}</strong>
          {toast.message && <span>{toast.message}</span>}
        </div>
        <button type="button" aria-label="Закрыть уведомление" onClick={() => onClose(toast.id)}>
          x
        </button>
      </article>
    ))}
  </div>
);
