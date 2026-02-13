import { describe, expect, it } from 'vitest';
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '../color';

describe('studio color utils', () => {
  it('parses hex in short/long forms and throws for invalid input', () => {
    expect(hexToRgb('#abc')).toEqual([170, 187, 204]);
    expect(hexToRgb('A1b2c3')).toEqual([161, 178, 195]);
    expect(hexToRgb('#00FF7f')).toEqual([0, 255, 127]);
    expect(() => hexToRgb('#12')).toThrow();
    expect(() => hexToRgb('zzzzzz')).toThrow();
  });

  it('formats rgb to uppercase hex and clamps/rounds channel values', () => {
    expect(rgbToHex(255, 128, 0)).toBe('#FF8000');
    expect(rgbToHex(260.4, -2.1, 12.5)).toBe('#FF000D');
  });

  it('converts HSL to RGB for canonical colors', () => {
    expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
    expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
    expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);
    expect(hslToRgb(0, 0, 50)).toEqual([128, 128, 128]);
  });

  it('converts RGB to HSL for canonical colors', () => {
    const [h1, s1, l1] = rgbToHsl(255, 0, 0);
    expect(h1).toBeCloseTo(0, 5);
    expect(s1).toBeCloseTo(100, 5);
    expect(l1).toBeCloseTo(50, 5);

    const [h2, s2, l2] = rgbToHsl(0, 255, 0);
    expect(h2).toBeCloseTo(120, 5);
    expect(s2).toBeCloseTo(100, 5);
    expect(l2).toBeCloseTo(50, 5);

    const [h3, s3, l3] = rgbToHsl(0, 0, 255);
    expect(h3).toBeCloseTo(240, 5);
    expect(s3).toBeCloseTo(100, 5);
    expect(l3).toBeCloseTo(50, 5);

    const [h4, s4, l4] = rgbToHsl(128, 128, 128);
    expect(h4).toBeCloseTo(0, 5);
    expect(s4).toBeCloseTo(0, 5);
    expect(l4).toBeCloseTo(50.196078, 5);
  });

  it('round-trips RGB -> HSL -> RGB within tolerance', () => {
    const samples: Array<[number, number, number]> = [
      [0, 0, 0],
      [255, 255, 255],
      [17, 34, 51],
      [98, 175, 220],
      [255, 127, 33],
      [12, 200, 140]
    ];

    for (const [r, g, b] of samples) {
      const [h, s, l] = rgbToHsl(r, g, b);
      const [rr, gg, bb] = hslToRgb(h, s, l);
      expect(Math.abs(rr - r)).toBeLessThanOrEqual(1);
      expect(Math.abs(gg - g)).toBeLessThanOrEqual(1);
      expect(Math.abs(bb - b)).toBeLessThanOrEqual(1);
    }
  });
});
