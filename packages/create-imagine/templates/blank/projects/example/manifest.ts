import type { FigureManifestItem } from '../../src/core/manifest';

export const figures: FigureManifestItem[] = [
  {
    id: 'hello-world',
    title: 'Hello world',
    moduleKey: 'hello-world',
    size: { unit: 'px', width: 900, height: 520 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {
          heading: 'Imagine',
          subtitle: 'React components → scientific figures (PNG + SVG)',
          tipHeading: 'Tips',
          tip1: 'Edit the figure component and watch this update live.',
          tip2: 'Use the Controls panel to adjust text, then export via `npm run render`.'
        },
        controls: [
          { kind: 'text', key: 'heading', label: 'Heading' },
          { kind: 'text', key: 'subtitle', label: 'Subtitle' },
          { kind: 'text', key: 'tipHeading', label: 'Tips heading' },
          { kind: 'text', key: 'tip1', label: 'Tip #1' },
          { kind: 'text', key: 'tip2', label: 'Tip #2' }
        ]
      },
      {
        id: 'transparent',
        title: 'Transparent',
        background: 'transparent',
        props: {
          heading: 'Imagine',
          subtitle: 'Transparent background variant',
          tipHeading: 'Notes',
          tip1: 'Checkerboard mode helps preview transparency.',
          tip2: 'PNG export uses omitBackground for transparency.'
        }
      }
    ]
  }
];

