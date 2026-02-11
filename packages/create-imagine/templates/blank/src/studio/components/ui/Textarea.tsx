import { useEffect, useId, useRef } from 'react';
import { cn } from './cn';
import { fieldError, fieldHint, fieldLabel } from './styles';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  autoResize?: boolean;
  maxRows?: number;
};

function toPxNumber(value: string) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function Textarea({
  label,
  hint,
  error,
  autoResize = true,
  maxRows,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  value,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!autoResize) return;
    const el = ref.current;
    if (!el) return;

    el.style.height = 'auto';
    let next = el.scrollHeight;

    if (maxRows && maxRows > 0) {
      const cs = window.getComputedStyle(el);
      const lineHeight = toPxNumber(cs.lineHeight) || 16;
      const verticalPadding = toPxNumber(cs.paddingTop) + toPxNumber(cs.paddingBottom);
      next = Math.min(next, maxRows * lineHeight + verticalPadding);
    }

    el.style.height = `${next}px`;
  }, [autoResize, maxRows, value]);

  const textareaClasses = cn(
    'w-full rounded-control border bg-white px-2.5 py-2 font-mono text-xs shadow-sm outline-none transition-colors duration-80',
    error
      ? 'border-studio-red focus:border-studio-red focus:ring-2 focus:ring-studio-red/30'
      : 'border-studio-border focus:border-studio-blue focus:ring-2 focus:ring-studio-blue/30',
    autoResize ? 'resize-none overflow-hidden' : null,
    className
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label ? <div className={fieldLabel}>{label}</div> : null}
      <textarea
        ref={ref}
        id={textareaId}
        className={textareaClasses}
        aria-label={ariaLabel ?? (label && !ariaLabelledBy ? label : undefined)}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        value={value}
        {...rest}
      />
      {hint ? (
        <div id={hintId} className={fieldHint}>
          {hint}
        </div>
      ) : null}
      {error ? (
        <div id={errorId} className={fieldError}>
          {error}
        </div>
      ) : null}
    </div>
  );
}
