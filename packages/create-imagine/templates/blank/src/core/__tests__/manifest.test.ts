import { describe, expect, it } from 'vitest';
import { validateProject, validateFigures } from '../manifest';
import exampleProject from '../../../projects/example/project';

describe('project manifest', () => {
  it('example project validates', () => {
    expect(() => validateProject(exampleProject)).not.toThrow();
  });

  it('rejects duplicate figure ids', () => {
    expect(() =>
      validateFigures([
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

  it('rejects duplicate variant ids', () => {
    expect(() =>
      validateFigures([
        {
          id: 'f',
          title: 'F',
          moduleKey: 'f',
          size: { unit: 'px', width: 1, height: 1 },
          variants: [{ id: 'v' }, { id: 'v' }]
        }
      ])
    ).toThrow(/duplicate variant id/i);
  });
});

