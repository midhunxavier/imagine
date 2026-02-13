import { describe, expect, it } from 'vitest';
import {
  coerceEditableValue,
  createEditableState,
  reduceEditableState,
  type EditableElementInfo
} from '../EditableContext';

function makeInfo(key: string): EditableElementInfo {
  return {
    key,
    bounds: { left: 10, top: 20, width: 30, height: 40 },
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'Inter, sans-serif',
    fill: '#111111',
    textAnchor: 'start'
  };
}

describe('editable context state', () => {
  it('coerces editable values to string', () => {
    expect(coerceEditableValue(undefined)).toBe('');
    expect(coerceEditableValue(null)).toBe('');
    expect(coerceEditableValue('hello')).toBe('hello');
    expect(coerceEditableValue(42)).toBe('42');
    expect(coerceEditableValue(false)).toBe('false');
  });

  it('resets active key and elements when edit mode is disabled', () => {
    let state = createEditableState();
    state = reduceEditableState(state, { type: 'register', key: 'heading', info: makeInfo('heading') });
    state = reduceEditableState(state, { type: 'set_active', key: 'heading' });

    const next = reduceEditableState(state, { type: 'reset_for_mode' });
    expect(next.activeKey).toBeNull();
    expect(next.editableElements.size).toBe(0);
  });

  it('registers and unregisters elements while keeping active key valid', () => {
    let state = createEditableState();
    state = reduceEditableState(state, { type: 'register', key: 'a', info: makeInfo('a') });
    state = reduceEditableState(state, { type: 'register', key: 'b', info: makeInfo('b') });
    state = reduceEditableState(state, { type: 'set_active', key: 'b' });

    const afterRemoveA = reduceEditableState(state, { type: 'unregister', key: 'a' });
    expect(afterRemoveA.editableElements.has('a')).toBe(false);
    expect(afterRemoveA.activeKey).toBe('b');

    const afterRemoveB = reduceEditableState(afterRemoveA, { type: 'unregister', key: 'b' });
    expect(afterRemoveB.editableElements.has('b')).toBe(false);
    expect(afterRemoveB.activeKey).toBeNull();
  });
});
