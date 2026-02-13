import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

export type EditableBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type EditableElementInfo = {
  key: string;
  bounds: EditableBounds;
  fontSize: string;
  fontWeight: string | number;
  fontFamily: string;
  fill: string;
  textAnchor: string;
};

export type EditableContextValue = {
  isEditMode: boolean;
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
  getValue: (key: string) => string;
  setValue: (key: string, value: string) => void;
  editableElements: Map<string, EditableElementInfo>;
  registerElement: (key: string, info: EditableElementInfo) => void;
  unregisterElement: (key: string) => void;
};

export type EditableState = {
  activeKey: string | null;
  editableElements: Map<string, EditableElementInfo>;
};

export type EditableStateAction =
  | { type: 'set_active'; key: string | null }
  | { type: 'register'; key: string; info: EditableElementInfo }
  | { type: 'unregister'; key: string }
  | { type: 'reset_for_mode' };

export function coerceEditableValue(value: unknown): string {
  if (value == null) return '';
  return String(value);
}

export function createEditableState(): EditableState {
  return { activeKey: null, editableElements: new Map() };
}

export function reduceEditableState(state: EditableState, action: EditableStateAction): EditableState {
  if (action.type === 'set_active') {
    if (state.activeKey === action.key) return state;
    return { ...state, activeKey: action.key };
  }

  if (action.type === 'register') {
    const nextMap = new Map(state.editableElements);
    nextMap.set(action.key, action.info);
    return { ...state, editableElements: nextMap };
  }

  if (action.type === 'unregister') {
    if (!state.editableElements.has(action.key)) return state;
    const nextMap = new Map(state.editableElements);
    nextMap.delete(action.key);
    return {
      activeKey: state.activeKey === action.key ? null : state.activeKey,
      editableElements: nextMap
    };
  }

  if (state.activeKey == null && state.editableElements.size === 0) return state;
  return createEditableState();
}

type EditableProviderProps = {
  isEditMode: boolean;
  values: Record<string, unknown>;
  onSetValue: (key: string, value: string) => void;
  children: ReactNode;
};

const EditableContext = createContext<EditableContextValue | null>(null);

export function EditableProvider({ isEditMode, values, onSetValue, children }: EditableProviderProps) {
  const [state, dispatch] = useReducer(reduceEditableState, undefined, createEditableState);

  useEffect(() => {
    if (!isEditMode) dispatch({ type: 'reset_for_mode' });
  }, [isEditMode]);

  useEffect(() => {
    if (!state.activeKey) return;
    if (state.editableElements.has(state.activeKey)) return;
    dispatch({ type: 'set_active', key: null });
  }, [state.activeKey, state.editableElements]);

  const setActiveKey = useCallback((key: string | null) => {
    dispatch({ type: 'set_active', key });
  }, []);

  const registerElement = useCallback((key: string, info: EditableElementInfo) => {
    dispatch({ type: 'register', key, info });
  }, []);

  const unregisterElement = useCallback((key: string) => {
    dispatch({ type: 'unregister', key });
  }, []);

  const getValue = useCallback(
    (key: string) => {
      return coerceEditableValue(values[key]);
    },
    [values]
  );

  const setValue = useCallback(
    (key: string, value: string) => {
      onSetValue(key, value);
    },
    [onSetValue]
  );

  const contextValue = useMemo<EditableContextValue>(
    () => ({
      isEditMode,
      activeKey: state.activeKey,
      setActiveKey,
      getValue,
      setValue,
      editableElements: state.editableElements,
      registerElement,
      unregisterElement
    }),
    [getValue, isEditMode, registerElement, setActiveKey, setValue, state.activeKey, state.editableElements, unregisterElement]
  );

  return <EditableContext.Provider value={contextValue}>{children}</EditableContext.Provider>;
}

export function useEditableContext(): EditableContextValue {
  const value = useContext(EditableContext);
  if (!value) throw new Error('useEditableContext must be used within EditableProvider');
  return value;
}
