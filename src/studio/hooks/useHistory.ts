import { useCallback, useRef, useState } from 'react';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export interface UseHistoryReturn<T> {
  state: T;
  set: (value: T | ((prev: T) => T)) => void;
  setDebounced: (value: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (initialState: T) => void;
}

const MAX_HISTORY_SIZE = 50;
const DEBOUNCE_MS = 300;

export function useHistory<T>(initialState: T): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const debounceTimer = useRef<number | null>(null);
  const pendingUpdate = useRef<T | null>(null);

  const flushPending = useCallback(() => {
    if (pendingUpdate.current !== null) {
      setHistory((prev) => {
        const newPast = [...prev.past, prev.present];
        if (newPast.length > MAX_HISTORY_SIZE) {
          newPast.shift();
        }
        return {
          past: newPast,
          present: pendingUpdate.current as T,
          future: []
        };
      });
      pendingUpdate.current = null;
    }
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
  }, []);

  const set = useCallback(
    (value: T | ((prev: T) => T)) => {
      flushPending();

      setHistory((prev) => {
        const nextState = typeof value === 'function' 
          ? (value as (prev: T) => T)(prev.present) 
          : value;
        
        const newPast = [...prev.past, prev.present];
        if (newPast.length > MAX_HISTORY_SIZE) {
          newPast.shift();
        }

        return {
          past: newPast,
          present: nextState,
          future: []
        };
      });
    },
    [flushPending]
  );

  const setDebounced = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }

      const nextState = typeof value === 'function'
        ? (value as (prev: T) => T)(history.present)
        : value;

      pendingUpdate.current = nextState;

      debounceTimer.current = window.setTimeout(() => {
        flushPending();
      }, DEBOUNCE_MS);
    },
    [history.present, flushPending]
  );

  const undo = useCallback(() => {
    flushPending();

    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, [flushPending]);

  const redo = useCallback(() => {
    flushPending();

    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, [flushPending]);

  const reset = useCallback((initialState: T) => {
    flushPending();

    setHistory({
      past: [],
      present: initialState,
      future: []
    });
  }, [flushPending]);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return {
    state: history.present,
    set,
    setDebounced,
    undo,
    redo,
    canUndo,
    canRedo,
    reset
  };
}
