import { createContext, useContext, useRef, useCallback, type ReactNode } from 'react';

interface SidebarFocusContextValue {
  focusSearch: () => void;
  registerFocusSearch: (focusFn: () => void) => void;
}

const SidebarFocusContext = createContext<SidebarFocusContextValue | null>(null);

export function SidebarFocusProvider({ children }: { children: ReactNode }) {
  const focusSearchRef = useRef<(() => void) | null>(null);

  const focusSearch = useCallback(() => {
    focusSearchRef.current?.();
  }, []);

  const registerFocusSearch = useCallback((focusFn: () => void) => {
    focusSearchRef.current = focusFn;
  }, []);

  return (
    <SidebarFocusContext.Provider value={{ focusSearch, registerFocusSearch }}>
      {children}
    </SidebarFocusContext.Provider>
  );
}

export function useSidebarFocus(): SidebarFocusContextValue {
  const context = useContext(SidebarFocusContext);
  if (!context) {
    throw new Error('useSidebarFocus must be used within a SidebarFocusProvider');
  }
  return context;
}
