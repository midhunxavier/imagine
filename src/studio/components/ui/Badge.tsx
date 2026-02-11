import type { ReactNode } from 'react';
import { cn } from './cn';

export type BadgeProps = {
  variant?: 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
  className?: string;
};

export function Badge({ variant = 'info', children, className }: BadgeProps) {
  const variantClasses =
    variant === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : variant === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : variant === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-700'
          : 'border-sky-200 bg-sky-50 text-sky-700';

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold', variantClasses, className)}>
      {children}
    </span>
  );
}

