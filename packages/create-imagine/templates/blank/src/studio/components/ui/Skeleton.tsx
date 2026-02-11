import { cn } from './cn';

export type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
};

export function Skeleton({ width, height, variant = 'rect', className }: SkeletonProps) {
  const shape = variant === 'circle' ? 'rounded-full' : 'rounded-control';
  return <div className={cn('animate-pulse bg-studio-panel', shape, className)} style={{ width, height }} />;
}

