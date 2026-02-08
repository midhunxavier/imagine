import type { ComponentType } from 'react';

type FigureModule = { default: ComponentType<any> };

const modules = import.meta.glob<FigureModule>('../figures/*.tsx');

const byKey: Record<string, () => Promise<FigureModule>> = Object.fromEntries(
  Object.entries(modules).map(([path, loader]) => {
    const file = path.split('/').at(-1) ?? path;
    const key = file.replace(/\.tsx$/, '');
    return [key, loader];
  })
);

export function availableFigureModuleKeys(): string[] {
  return Object.keys(byKey).sort();
}

export async function loadFigureComponent(moduleKey: string): Promise<ComponentType<any>> {
  const loader = byKey[moduleKey];
  if (!loader) throw new Error(`Unknown moduleKey "${moduleKey}". Available: ${availableFigureModuleKeys().join(', ')}`);
  const mod = await loader();
  return mod.default;
}

