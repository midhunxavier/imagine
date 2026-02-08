import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ProjectDefinition } from '../src/core/manifest';
import { PROJECT_ID_RE } from '../src/core/manifest';

async function fileExists(filePath: string): Promise<boolean> {
  return fs
    .stat(filePath)
    .then((s) => s.isFile())
    .catch(() => false);
}

export async function discoverProjectIds(): Promise<string[]> {
  const projectsDir = path.resolve(process.cwd(), 'projects');
  const entries = await fs.readdir(projectsDir, { withFileTypes: true }).catch(() => []);
  const ids: string[] = [];

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (!PROJECT_ID_RE.test(e.name)) continue;
    const p = path.join(projectsDir, e.name, 'project.ts');
    if (await fileExists(p)) ids.push(e.name);
  }

  return ids.sort();
}

export async function loadProjectDefinition(projectId: string): Promise<ProjectDefinition> {
  if (!PROJECT_ID_RE.test(projectId)) throw new Error(`Invalid project id: ${projectId}`);
  const projectPath = path.resolve(process.cwd(), 'projects', projectId, 'project.ts');
  const mod = await import(pathToFileURL(projectPath).href);
  const project = (mod as any).default as ProjectDefinition | undefined;
  if (!project) throw new Error(`Project did not default-export a ProjectDefinition: ${projectPath}`);
  return project;
}

export async function loadAllProjects(): Promise<ProjectDefinition[]> {
  const ids = await discoverProjectIds();
  const projects = await Promise.all(ids.map((id) => loadProjectDefinition(id)));
  return projects.slice().sort((a, b) => a.title.localeCompare(b.title));
}

