import type { ProjectDefinition } from '../../src/core/manifest';
import { validateProject } from '../../src/core/manifest';
import { figures } from './manifest';

const project: ProjectDefinition = {
  id: 'example',
  title: 'Example project',
  description: 'Starter figures (charts/diagrams/layout/math) with editable text controls.',
  examples: [
    {
      figureId: 'hello-world',
      variantId: 'default',
      src: '/projects/example/previews/hello-world--default.png',
      caption: 'Hello world'
    },
    { figureId: 'line-chart', variantId: 'default', src: '/projects/example/previews/line-chart--default.png', caption: 'Line chart' },
    {
      figureId: 'pipeline-diagram',
      variantId: 'default',
      src: '/projects/example/previews/pipeline-diagram--default.png',
      caption: 'Pipeline diagram'
    },
    { figureId: 'multi-panel', variantId: 'default', src: '/projects/example/previews/multi-panel--default.png', caption: 'Multi-panel' },
    { figureId: 'equation', variantId: 'default', src: '/projects/example/previews/equation--default.png', caption: 'Equation' }
  ],
  figures
};

validateProject(project);

export default project;
