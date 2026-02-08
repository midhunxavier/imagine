import { loadAllProjects, loadProjectDefinition } from './projects';

function hasFlag(name: string) {
  return process.argv.includes(name);
}

function getFlag(name: string): string | undefined {
  const idx = process.argv.findIndex((a) => a === name || a.startsWith(`${name}=`));
  if (idx === -1) return undefined;
  const a = process.argv[idx]!;
  if (a.startsWith(`${name}=`)) return a.slice(name.length + 1);
  return process.argv[idx + 1];
}

if (hasFlag('--json')) {
  const projectId = getFlag('--project');
  if (projectId) {
    const project = await loadProjectDefinition(projectId);
    process.stdout.write(JSON.stringify({ project }, null, 2) + '\n');
    process.exit(0);
  } else {
    const projects = await loadAllProjects();
    process.stdout.write(JSON.stringify({ projects }, null, 2) + '\n');
    process.exit(0);
  }
}

const projectId = getFlag('--project');
if (!projectId) {
  const projects = await loadAllProjects();
  for (const p of projects) {
    // eslint-disable-next-line no-console
    console.log(`${p.id}  —  ${p.title}  (${p.figures.length} figure${p.figures.length === 1 ? '' : 's'})`);
  }
  process.exit(0);
}

const project = await loadProjectDefinition(projectId);
for (const fig of project.figures) {
  // eslint-disable-next-line no-console
  console.log(`${fig.id}  —  ${fig.title}  (${fig.variants.length} variant${fig.variants.length === 1 ? '' : 's'})`);
  for (const v of fig.variants) {
    // eslint-disable-next-line no-console
    console.log(`  - ${v.id}${v.title ? `  —  ${v.title}` : ''}`);
  }
}
