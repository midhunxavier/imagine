import type { ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from './cn';
import { focusRing } from './styles';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

function sizeClasses(size: ButtonSize) {
  if (size === 'md') return 'px-3.5 py-2.5 text-sm';
  if (size === 'lg') return 'px-4 py-3 text-sm';
  return 'px-2.5 py-2 text-xs';
}

function variantClasses(variant: ButtonVariant) {
  if (variant === 'primary') return 'border-transparent bg-studio-blue text-white hover:bg-studio-blue/90 active:bg-studio-blue/95';
  if (variant === 'ghost') return 'border-transparent bg-transparent text-studio-text hover:bg-studio-panel active:bg-studio-panel/80';
  if (variant === 'danger') return 'border-transparent bg-studio-red text-white hover:bg-studio-red/90 active:bg-studio-red/95';
  return 'border-studio-border bg-white text-studio-text hover:bg-studio-panel active:bg-studio-panel/80';
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
};

export function Button({ variant = 'secondary', size = 'sm', loading = false, disabled, className, type, children, ...rest }: ButtonProps) {
  const isDisabled = Boolean(disabled) || loading;
  return (
    <button
      type={type ?? 'button'}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-control border font-medium shadow-sm transition duration-80 ease-out',
        focusRing,
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses(size),
        variantClasses(variant),
        className
      )}
      disabled={isDisabled}
      aria-busy={loading ? true : undefined}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}

export type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  variant = 'secondary',
  size = 'sm',
  loading = false,
  disabled = false,
  className,
  children,
  onClick,
  tabIndex,
  ...rest
}: ButtonLinkProps) {
  const isDisabled = disabled || loading;
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-control border font-medium shadow-sm transition duration-80 ease-out',
        focusRing,
        sizeClasses(size),
        variantClasses(variant),
        isDisabled ? 'cursor-not-allowed opacity-50' : null,
        className
      )}
      aria-disabled={isDisabled ? true : undefined}
      tabIndex={isDisabled ? -1 : tabIndex}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

