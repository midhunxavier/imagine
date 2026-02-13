import { useEffect, useCallback, useState } from 'react';
import { cn } from './cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Toast } from '../../hooks/useToast';

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastIcon({ variant }: { variant: Toast['variant'] }) {
  switch (variant) {
    case 'success':
      return <span className="text-lg">✅</span>;
    case 'error':
      return <span className="text-lg">❌</span>;
    case 'warning':
      return <span className="text-lg">⚠️</span>;
    case 'info':
      return <span className="text-lg">ℹ️</span>;
    default:
      return null;
  }
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (isPaused || !toast.duration) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), reducedMotion ? 0 : 200);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, isPaused, onDismiss, reducedMotion]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onDismiss(toast.id), reducedMotion ? 0 : 200);
  }, [toast.id, onDismiss, reducedMotion]);

  const variantStyles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-blue-200 bg-blue-50 text-blue-900',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-card border shadow-lg',
        'transition-all duration-200',
        variantStyles[toast.variant],
        isVisible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0',
        reducedMotion && 'transition-none'
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="shrink-0">
          <ToastIcon variant={toast.variant} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{toast.message}</div>
          {toast.description ? (
            <div className="mt-1 text-sm opacity-90">{toast.description}</div>
          ) : null}
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded p-1 hover:bg-black/5 transition-colors"
          aria-label="Dismiss notification"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>
      
      {/* Progress bar */}
      {toast.duration && !isPaused && !reducedMotion && (
        <div className="h-1 bg-black/10">
          <div
            className="h-full bg-current opacity-30"
            style={{
              animation: `toast-progress ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}
