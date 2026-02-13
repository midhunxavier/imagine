import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
  description: string;
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const ctrlPressed = isMac ? event.metaKey : event.ctrlKey;
  
  if (shortcut.ctrl && !ctrlPressed) return false;
  if (!shortcut.ctrl && ctrlPressed) return false;
  
  if (shortcut.shift && !event.shiftKey) return false;
  if (!shortcut.shift && event.shiftKey) return false;
  
  if (shortcut.alt && !event.altKey) return false;
  if (!shortcut.alt && event.altKey) return false;
  
  if (shortcut.meta && !event.metaKey) return false;
  if (!shortcut.meta && event.metaKey && isMac) return false;
  
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) return false;
  
  return true;
}

function isInputElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions): void {
  const { shortcuts, enabled = true } = options;
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    for (const shortcut of shortcutsRef.current) {
      if (matchesShortcut(event, shortcut)) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        
        if (isInputElement(event.target) && shortcut.key !== 'Escape') {
          continue;
        }
        
        shortcut.handler(event);
        return;
      }
    }
  }, [enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export function formatShortcut(shortcut: Omit<KeyboardShortcut, 'handler'>): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const parts: string[] = [];
  
  if (isMac) {
    if (shortcut.meta) parts.push('⌘');
    if (shortcut.shift) parts.push('⇧');
    if (shortcut.alt) parts.push('⌥');
    if (shortcut.ctrl) parts.push('⌃');
  } else {
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
  }
  
  let key = shortcut.key;
  if (key === ' ') key = 'Space';
  else if (key.length === 1) key = key.toUpperCase();
  
  parts.push(key);
  
  return isMac ? parts.join('') : parts.join('+');
}
