import { useId } from 'react';
import { cn } from './cn';
import { fieldError, fieldHint, fieldLabel } from './styles';

export type SelectOption = { value: string; label: string; disabled?: boolean };

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  value,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  const selectClasses = cn(
    'w-full appearance-none rounded-control border bg-white px-2.5 py-2 pr-9 text-sm shadow-sm outline-none transition-colors duration-80',
    error
      ? 'border-studio-red focus:border-studio-red focus:ring-2 focus:ring-studio-red/30'
      : 'border-studio-border focus:border-studio-blue focus:ring-2 focus:ring-studio-blue/30',
    className
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label ? <div className={fieldLabel}>{label}</div> : null}
      <div className="relative">
        <select
          id={selectId}
          className={selectClasses}
          aria-label={ariaLabel ?? (label && !ariaLabelledBy ? label : undefined)}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          value={value}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-subtle"
          fill="currentColor"
        >
          <path d="M5.25 7.5l4.5 4.5 4.5-4.5H5.25z" />
        </svg>
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
