import { describe, expect, it } from 'vitest';
import { normalizeEditableBounds, textAnchorToTextAlign } from '../useEditableElements';

describe('editable element helpers', () => {
  it('normalizes element bounds using preview scale', () => {
    const bounds = normalizeEditableBounds(
      { left: 120, top: 80, width: 60, height: 40 },
      { left: 20, top: 30 },
      2
    );

    expect(bounds).toEqual({
      left: 50,
      top: 25,
      width: 30,
      height: 20
    });
  });

  it('falls back to scale 1 when scale is invalid', () => {
    const bounds = normalizeEditableBounds(
      { left: 12, top: 8, width: 10, height: 6 },
      { left: 2, top: 3 },
      Number.NaN
    );

    expect(bounds).toEqual({
      left: 10,
      top: 5,
      width: 10,
      height: 6
    });
  });

  it('maps SVG text-anchor values to text alignment', () => {
    expect(textAnchorToTextAlign('start')).toBe('left');
    expect(textAnchorToTextAlign('middle')).toBe('center');
    expect(textAnchorToTextAlign('end')).toBe('right');
    expect(textAnchorToTextAlign('unknown')).toBe('left');
  });
});
