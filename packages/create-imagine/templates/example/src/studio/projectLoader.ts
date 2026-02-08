import type { ProjectDefinition } from '../core/manifest';

type ProjectModule = { default: ProjectDefinition };

const modules = import.meta.glob<ProjectModule>('../../projects/*/project.ts');

const byId: Record<string, () => Promise<ProjectModule>> = Object.fromEntries(
  Object.entries(modules)
    .map(([modulePath, loader]) => {
      const match = modulePath.match(/projects\/([^/]+)\/project\.ts$/);
      if (!match) return null;
      return [match[1]!, loader] as const;
    })
    .filter((x): x is readonly [string, () => Promise<ProjectModule>] => Boolean(x))
);

const cache = new Map<string, Promise<ProjectDefinition>>();

export function availableProjectIds(): string[] {
  return Object.keys(byId).sort();
}

export async function loadProject(projectId: string): Promise<ProjectDefinition> {
  const loader = byId[projectId];
  if (!loader) throw new Error(`Unknown projectId "${projectId}". Available: ${availableProjectIds().join(', ')}`);

  const cached = cache.get(projectId);
  if (cached) return cached;

  const promise = loader().then((m) => m.default);
  cache.set(projectId, promise);
  return promise;
}

export async function loadAllProjects(): Promise<ProjectDefinition[]> {
  const ids = availableProjectIds();
  const projects = await Promise.all(ids.map((id) => loadProject(id)));
  return projects.slice().sort((a, b) => a.title.localeCompare(b.title));
}

