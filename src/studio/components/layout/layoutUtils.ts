import type { FigureControl } from '../../../core/manifest';

export const SIDEBAR_MINI_STORAGE_KEY = 'imagine:studio:sidebar-mini';

export function readSidebarMini(defaultValue: boolean): boolean {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(SIDEBAR_MINI_STORAGE_KEY);
    if (raw == null) return defaultValue;
    if (raw === '1' || raw === 'true') return true;
    if (raw === '0' || raw === 'false') return false;
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

export function writeSidebarMini(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SIDEBAR_MINI_STORAGE_KEY, value ? '1' : '0');
  } catch {
    // no-op
  }
}

export type ControlGroup = {
  title: string;
  items: FigureControl[];
};

function classifyControl(control: FigureControl): 'Text' | 'Numbers' | 'Style' | 'Other' {
  if (control.kind === 'text') return 'Text';
  if (control.kind === 'number' || control.kind === 'range' || control.kind === 'size') return 'Numbers';
  if (control.kind === 'color' || control.kind === 'font' || control.kind === 'boolean' || control.kind === 'select') {
    return 'Style';
  }
  return 'Other';
}

export function groupControls(controls: FigureControl[]): ControlGroup[] {
  const grouped: Record<'Text' | 'Numbers' | 'Style' | 'Other', FigureControl[]> = {
    Text: [],
    Numbers: [],
    Style: [],
    Other: []
  };

  for (const control of controls) {
    grouped[classifyControl(control)].push(control);
  }

  const order: Array<'Text' | 'Numbers' | 'Style' | 'Other'> = ['Text', 'Numbers', 'Style', 'Other'];
  return order
    .map((title) => ({ title, items: grouped[title] }))
    .filter((group) => group.items.length > 0);
}
