import type { FigureSize, ResolvedSize } from './types';

export const MM_PER_INCH = 25.4;

export function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm / MM_PER_INCH) * dpi);
}

export function pxToMm(px: number, dpi: number): number {
  return (px / dpi) * MM_PER_INCH;
}

export function resolveSize(size: FigureSize): ResolvedSize {
  if (size.unit === 'px') {
    return { width: size.width, height: size.height, source: size };
  }

  const width = mmToPx(size.width, size.dpi);
  const height = mmToPx(size.height, size.dpi);
  return {
    width,
    height,
    dpi: size.dpi,
    mm: { width: size.width, height: size.height },
    source: size
  };
}

