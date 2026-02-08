import { describe, expect, it } from 'vitest';
import { mmToPx, pxToMm, resolveSize, MM_PER_INCH } from '../sizing';

describe('sizing', () => {
  it('converts mm to px at dpi (25.4mm = 1in)', () => {
    expect(mmToPx(MM_PER_INCH, 100)).toBe(100);
    expect(mmToPx(MM_PER_INCH / 2, 200)).toBe(100);
  });

  it('converts px to mm at dpi', () => {
    expect(pxToMm(300, 300)).toBeCloseTo(MM_PER_INCH, 6);
  });

  it('resolves px sizes', () => {
    const r = resolveSize({ unit: 'px', width: 640, height: 480 });
    expect(r.width).toBe(640);
    expect(r.height).toBe(480);
    expect(r.mm).toBeUndefined();
  });

  it('resolves mm+dpi sizes', () => {
    const r = resolveSize({ unit: 'mm', width: MM_PER_INCH, height: MM_PER_INCH, dpi: 150 });
    expect(r.width).toBe(150);
    expect(r.height).toBe(150);
    expect(r.mm?.width).toBe(MM_PER_INCH);
    expect(r.dpi).toBe(150);
  });
});

