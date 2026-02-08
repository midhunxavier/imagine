import type { ReactNode } from 'react';

export type FigureId = string;

export type FigureSize =
  | { unit: 'px'; width: number; height: number }
  | { unit: 'mm'; width: number; height: number; dpi: number };

export type FigureVariant = {
  id: string;
  title?: string;
  props?: unknown;
  size?: FigureSize;
  background?: 'white' | 'transparent';
};

export type FigureManifestItem = {
  id: FigureId;
  title: string;
  moduleKey: string;
  size: FigureSize;
  variants: FigureVariant[];
};

export type FigureComponentBaseProps = {
  width: number;
  height: number;
  background?: 'white' | 'transparent';
};

export type FigureComponent<Props extends Record<string, unknown> = Record<string, unknown>> = (
  props: FigureComponentBaseProps & Props
) => ReactNode;

export type ResolvedSize = {
  width: number;
  height: number;
  dpi?: number;
  mm?: { width: number; height: number };
  source: FigureSize;
};

