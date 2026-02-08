import type { ReactNode } from 'react';
import { theme } from './theme';

export type FigureProps = {
  width: number;
  height: number;
  background?: 'white' | 'transparent';
  viewBox?: string;
  children: ReactNode;
  title?: string;
};

export function Figure({ width, height, background = 'white', viewBox, children, title }: FigureProps) {
  const vb = viewBox ?? `0 0 ${width} ${height}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={vb}
      role="img"
      aria-label={title}
      style={{
        fontFamily: theme.fontFamily,
        color: theme.colors.text
      }}
    >
      {background === 'white' ? <rect x={0} y={0} width={width} height={height} fill={theme.colors.bg} /> : null}
      {children}
    </svg>
  );
}

