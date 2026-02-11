import { cn } from './cn';
import { focusRing } from './styles';

export type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function Switch({ checked, onCheckedChange, label, disabled = false, className }: SwitchProps) {
  return (
    <div className={cn('inline-flex select-none items-center gap-2 text-xs font-medium text-studio-subtle', className)}>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-5 w-9 items-center rounded-full border transition-colors duration-80',
          focusRing,
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'border-studio-blue bg-studio-blue' : 'border-studio-border bg-studio-panel'
        )}
        onClick={() => onCheckedChange(!checked)}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition duration-80',
            checked ? 'translate-x-4' : 'translate-x-1'
          )}
        />
      </button>
      {label ? <div>{label}</div> : null}
    </div>
  );
}
