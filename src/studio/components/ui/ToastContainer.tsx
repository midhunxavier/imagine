import { useToast } from '../../hooks/useToast';
import { cn } from './cn';
import { ToastItem } from './ToastItem';

interface ToastContainerProps {
  className?: string;
}

export function ToastContainer({ className }: ToastContainerProps) {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex flex-col gap-2',
        'max-h-screen overflow-hidden',
        className
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
}
