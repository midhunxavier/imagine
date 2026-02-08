import type { ProjectDefinition } from '../../src/core/manifest';
import { validateProject } from '../../src/core/manifest';
import { figures } from './manifest';

const project: ProjectDefinition = {
  id: 'example',
  title: 'My project',
  description: 'A minimal starter project.',
  examples: [],
  figures
};

validateProject(project);

export default project;

