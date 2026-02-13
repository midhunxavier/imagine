import { cn } from './cn';

export type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
  shimmer?: boolean;
};

export function Skeleton({ width, height, variant = 'rect', className, shimmer = false }: SkeletonProps) {
  const shape = variant === 'circle' ? 'rounded-full' : 'rounded-control';
  
  if (shimmer) {
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-studio-panel',
          shape,
          className
        )}
        style={{ width, height }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      </div>
    );
  }
  
  return <div className={cn('animate-pulse bg-studio-panel', shape, className)} style={{ width, height }} />;
}

