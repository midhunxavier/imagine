import type { ComponentType } from 'react';

type FigureModule = { default: ComponentType<any> };

const modules = import.meta.glob<FigureModule>('../../projects/*/figures/*.tsx');

const byProject: Record<string, Record<string, () => Promise<FigureModule>>> = {};
for (const [modulePath, loader] of Object.entries(modules)) {
  const match = modulePath.match(/projects\/([^/]+)\/figures\/([^/]+)\.tsx$/);
  if (!match) continue;
  const projectId = match[1]!;
  const moduleKey = match[2]!;
  byProject[projectId] = byProject[projectId] ?? {};
  byProject[projectId]![moduleKey] = loader;
}

export function availableFigureModuleKeys(projectId: string): string[] {
  return Object.keys(byProject[projectId] ?? {}).sort();
}

export async function loadFigureComponent(projectId: string, moduleKey: string): Promise<ComponentType<any>> {
  const loader = byProject[projectId]?.[moduleKey];
  if (!loader) {
    throw new Error(
      `Unknown moduleKey "${moduleKey}" for project "${projectId}". Available: ${availableFigureModuleKeys(projectId).join(', ')}`
    );
  }
  const mod = await loader();
  return mod.default;
}
