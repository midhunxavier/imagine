import { cn } from './cn';

export type DividerProps = {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
};

export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  if (orientation === 'vertical') return <div className={cn('w-px self-stretch bg-studio-border', className)} />;

  if (!label) return <div className={cn('h-px w-full bg-studio-border', className)} />;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-px flex-1 bg-studio-border" />
      <div className="text-xs font-semibold text-studio-subtle">{label}</div>
      <div className="h-px flex-1 bg-studio-border" />
    </div>
  );
}

