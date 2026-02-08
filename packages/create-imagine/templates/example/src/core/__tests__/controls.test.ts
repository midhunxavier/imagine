import { describe, expect, it } from 'vitest';
import { inferControlsFromProps } from '../controls';

describe('controls', () => {
  it('infers text/number/boolean controls from top-level props', () => {
    const controls = inferControlsFromProps({ title: 'x', count: 1, show: true, other: { a: 1 } });
    expect(controls).toEqual([
      { kind: 'number', key: 'count' },
      { kind: 'boolean', key: 'show' },
      { kind: 'text', key: 'title' }
    ]);
  });
});

