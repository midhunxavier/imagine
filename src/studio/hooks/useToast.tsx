import { createContext, useContext, useCallback, useRef, useState, type ReactNode } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  success: (message: string, description?: string) => string;
  error: (message: string, description?: string) => string;
  warning: (message: string, description?: string) => string;
  info: (message: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${++toastIdRef.current}`;
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const success = useCallback(
    (message: string, description?: string) =>
      show({ message, description, variant: 'success', duration: 3000 }),
    [show]
  );

  const error = useCallback(
    (message: string, description?: string) =>
      show({ message, description, variant: 'error', duration: 5000 }),
    [show]
  );

  const warning = useCallback(
    (message: string, description?: string) =>
      show({ message, description, variant: 'warning', duration: 4000 }),
    [show]
  );

  const info = useCallback(
    (message: string, description?: string) =>
      show({ message, description, variant: 'info', duration: 3000 }),
    [show]
  );

  const value: ToastContextValue = {
    toasts,
    show,
    dismiss,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}
