import { describe, expect, it } from 'vitest';
import { figures, validateFiguresManifest } from '../manifest';

describe('figures manifest', () => {
  it('current manifest validates', () => {
    expect(() => validateFiguresManifest(figures)).not.toThrow();
  });

  it('rejects duplicate figure ids', () => {
    expect(() =>
      validateFiguresManifest([
        {
          id: 'dup',
          title: 'A',
          moduleKey: 'a',
          size: { unit: 'px', width: 1, height: 1 },
          variants: [{ id: 'v' }]
        },
        {
          id: 'dup',
          title: 'B',
          moduleKey: 'b',
          size: { unit: 'px', width: 1, height: 1 },
          variants: [{ id: 'v' }]
        }
      ])
    ).toThrow(/Duplicate figure id/);
  });
});

