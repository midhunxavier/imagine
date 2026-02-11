import type { ReactNode } from 'react';
import { useId } from 'react';
import { cn } from './cn';
import { fieldError, fieldHint, fieldLabel, focusRing } from './styles';

type InputSize = 'sm' | 'md' | 'lg';

function sizeClasses(uiSize: InputSize) {
  if (uiSize === 'sm') return 'py-2 text-xs';
  if (uiSize === 'lg') return 'py-2.5 text-sm';
  return 'py-2 text-sm';
}

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  uiSize?: InputSize;
  label?: string;
  hint?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
};

export function Input({
  uiSize = 'md',
  label,
  hint,
  error,
  prefix,
  suffix,
  clearable = false,
  onClear,
  containerClassName,
  className,
  id,
  disabled,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  value,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;
  const hasValue = value != null && String(value) !== '';

  const wrapperClasses = error
    ? 'border-studio-red focus-within:border-studio-red focus-within:ring-2 focus-within:ring-studio-red/30'
    : 'border-studio-border focus-within:border-studio-blue focus-within:ring-2 focus-within:ring-studio-blue/30';

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label ? <div className={fieldLabel}>{label}</div> : null}
      <div
        className={cn(
          'flex items-center gap-2 rounded-control border bg-white px-2.5 shadow-sm transition-colors duration-80',
          focusRing,
          wrapperClasses,
          disabled ? 'bg-studio-panel opacity-70' : null
        )}
      >
        {prefix ? <div className="text-studio-subtle">{prefix}</div> : null}
        <input
          id={inputId}
          className={cn(
            'min-w-0 flex-1 bg-transparent outline-none placeholder:text-studio-subtle/70',
            sizeClasses(uiSize),
            className
          )}
          disabled={disabled}
          aria-label={ariaLabel ?? (label && !ariaLabelledBy ? label : undefined)}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          value={value}
          {...rest}
        />
        {clearable && !disabled && hasValue ? (
          <button
            type="button"
            className={cn('rounded-control p-1 text-studio-subtle hover:bg-studio-panel', focusRing)}
            aria-label="Clear"
            onClick={() => onClear?.()}
          >
            ×
          </button>
        ) : null}
        {suffix ? <div className="text-studio-subtle">{suffix}</div> : null}
      </div>
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
