import { describe, expect, it } from 'vitest';
import { mergeProps } from '../props';

describe('props merge', () => {
  it('overrides win over defaults', () => {
    expect(mergeProps({ title: 'A', n: 1 }, { title: 'B' })).toEqual({ title: 'B', n: 1 });
  });
});

