import { describe, expect, it } from 'vitest';
import { groupControls, readSidebarMini, SIDEBAR_MINI_STORAGE_KEY, writeSidebarMini } from '../layoutUtils';
import type { FigureControl } from '../../../../core/manifest';

type StorageStub = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

function withWindow(storage: StorageStub | null, fn: () => void) {
  const prevWindow = (globalThis as any).window;
  if (storage) (globalThis as any).window = { localStorage: storage };
  else (globalThis as any).window = undefined;
  try {
    fn();
  } finally {
    (globalThis as any).window = prevWindow;
  }
}

describe('layout utils', () => {
  it('readSidebarMini falls back safely', () => {
    withWindow(null, () => {
      expect(readSidebarMini(false)).toBe(false);
      expect(readSidebarMini(true)).toBe(true);
    });

    withWindow(
      {
        getItem: () => 'unexpected',
        setItem: () => undefined
      },
      () => {
        expect(readSidebarMini(true)).toBe(true);
      }
    );
  });

  it('writeSidebarMini stores normalized values', () => {
    const saved = new Map<string, string>();
    withWindow(
      {
        getItem: (key) => saved.get(key) ?? null,
        setItem: (key, value) => {
          saved.set(key, value);
        }
      },
      () => {
        writeSidebarMini(true);
        expect(saved.get(SIDEBAR_MINI_STORAGE_KEY)).toBe('1');
        writeSidebarMini(false);
        expect(saved.get(SIDEBAR_MINI_STORAGE_KEY)).toBe('0');
      }
    );
  });

  it('groups controls by ordered categories', () => {
    const controls: FigureControl[] = [
      { kind: 'boolean', key: 'bool' },
      { kind: 'text', key: 'text' },
      { kind: 'number', key: 'num' },
      { kind: 'select', key: 'sel', options: [{ label: 'A', value: 'a' }] },
      { kind: 'range', key: 'rng', min: 0, max: 10 },
      { kind: 'font', key: 'font' },
      { kind: 'size', key: 'size' },
      { kind: 'color', key: 'color' }
    ];

    const grouped = groupControls(controls);
    expect(grouped.map((g) => g.title)).toEqual(['Text', 'Numbers', 'Style']);
    expect(grouped[0]?.items.map((c) => c.key)).toEqual(['text']);
    expect(grouped[1]?.items.map((c) => c.key)).toEqual(['num', 'rng', 'size']);
    expect(grouped[2]?.items.map((c) => c.key)).toEqual(['bool', 'sel', 'font', 'color']);
  });
});
