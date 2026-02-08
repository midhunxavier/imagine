import type { FigureControl } from './manifest';

export function inferControlsFromProps(props: Record<string, unknown>): FigureControl[] {
  return Object.keys(props)
    .sort()
    .flatMap((key): FigureControl[] => {
      const value = props[key];
      if (typeof value === 'string') return [{ kind: 'text', key }];
      if (typeof value === 'number' && Number.isFinite(value)) return [{ kind: 'number', key }];
      if (typeof value === 'boolean') return [{ kind: 'boolean', key }];
      return [];
    });
}

