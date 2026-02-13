import { describe, expect, it } from 'vitest';
import { validateFigures } from '../manifest';

describe('manifest controls (v3)', () => {
  it('accepts new control kinds and select groups', () => {
    expect(() =>
      validateFigures([
        {
          id: 'f',
          title: 'F',
          moduleKey: 'f',
          size: { unit: 'px', width: 1, height: 1 },
          variants: [
            {
              id: 'v',
              controls: [
                { kind: 'color', key: 'fill', presets: ['#ffffff', '#000000'] },
                { kind: 'range', key: 'opacity', min: 0, max: 1, step: 0.1 },
                { kind: 'font', key: 'fontFamily', fonts: ['Inter', 'Georgia'] },
                { kind: 'size', key: 'size', lockAspectRatio: true },
                {
                  kind: 'select',
                  key: 'mode',
                  options: [
                    { label: 'A', value: 'a', group: 'Group 1' },
                    { label: 'B', value: 'b' }
                  ]
                }
              ]
            }
          ]
        }
      ])
    ).not.toThrow();
  });

  it('rejects invalid range bounds (min >= max)', () => {
    expect(() =>
      validateFigures([
        {
          id: 'f',
          title: 'F',
          moduleKey: 'f',
          size: { unit: 'px', width: 1, height: 1 },
          variants: [{ id: 'v', controls: [{ kind: 'range', key: 'x', min: 5, max: 5 }] }]
        }
      ])
    ).toThrow(/range control min must be less than max/i);
  });

  it('rejects invalid range step (<= 0)', () => {
    expect(() =>
      validateFigures([
        {
          id: 'f',
          title: 'F',
          moduleKey: 'f',
          size: { unit: 'px', width: 1, height: 1 },
          variants: [{ id: 'v', controls: [{ kind: 'range', key: 'x', min: 0, max: 10, step: 0 }] }]
        }
      ])
    ).toThrow(/range control step must be positive/i);
  });

  it('rejects select with empty options', () => {
    expect(() =>
      validateFigures([
        {
          id: 'f',
          title: 'F',
          moduleKey: 'f',
          size: { unit: 'px', width: 1, height: 1 },
          variants: [{ id: 'v', controls: [{ kind: 'select', key: 'x', options: [] }] }]
        }
      ])
    ).toThrow(/select control options must be non-empty/i);
  });

  it('rejects select options with empty label/value or empty group', () => {
    expect(() =>
      validateFigures([
        {
          id: 'f',
          title: 'F',
          moduleKey: 'f',
          size: { unit: 'px', width: 1, height: 1 },
          variants: [
            {
              id: 'v',
              controls: [
                { kind: 'select', key: 'x', options: [{ label: '', value: 'a' }] },
                { kind: 'select', key: 'y', options: [{ label: 'Y', value: '' }] },
                { kind: 'select', key: 'z', options: [{ label: 'Z', value: 'z', group: '   ' }] }
              ]
            }
          ]
        }
      ])
    ).toThrow(/select option (label|value|group) must be non-empty/i);
  });
});

