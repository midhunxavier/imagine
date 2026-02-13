import type { ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from './cn';
import { focusRing } from './styles';

type CardVariant = 'surface' | 'panel';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

function paddingClasses(padding: CardPadding) {
  if (padding === 'none') return 'p-0';
  if (padding === 'sm') return 'p-3';
  if (padding === 'lg') return 'p-6';
  return 'p-4';
}

function variantClasses(variant: CardVariant) {
  if (variant === 'panel') return 'bg-studio-panel dark:bg-gray-800';
  return 'bg-white dark:bg-gray-800';
}

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  children?: ReactNode;
};

export function Card({ variant = 'surface', padding = 'md', hover = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-studio-border',
        variantClasses(variant),
        paddingClasses(padding),
        hover ? cn('transition duration-80 ease-out hover:-translate-y-[1px] hover:shadow-cardHover') : null,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type CardLinkProps = LinkProps & {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  className?: string;
  children: ReactNode;
};

export function CardLink({ variant = 'surface', padding = 'md', hover = false, className, children, ...rest }: CardLinkProps) {
  return (
    <Link
      className={cn(
        'rounded-card border border-studio-border no-underline',
        focusRing,
        variantClasses(variant),
        paddingClasses(padding),
        hover ? cn('transition duration-80 ease-out hover:-translate-y-[1px] hover:shadow-cardHover') : null,
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

