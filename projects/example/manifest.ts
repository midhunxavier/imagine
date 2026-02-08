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
  },
  {
    id: 'line-chart',
    title: 'Line chart',
    moduleKey: 'line-chart',
    size: { unit: 'mm', width: 85, height: 60, dpi: 600 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {
          title: 'Example: signal over time',
          xLabel: 'Time (a.u.)',
          yLabel: 'Response',
          seriesALabel: 'Condition A',
          seriesBLabel: 'Condition B'
        }
      }
    ]
  },
  {
    id: 'pipeline-diagram',
    title: 'Pipeline diagram',
    moduleKey: 'pipeline-diagram',
    size: { unit: 'px', width: 1000, height: 380 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {
          title: 'Example: analysis pipeline',
          subtitle: 'Pure-SVG boxes/arrows + theme tokens',
          step1: 'Ingest',
          step2: 'Process',
          step3: 'Publish',
          callout: 'Edit labels in Controls'
        }
      }
    ]
  },
  {
    id: 'multi-panel',
    title: 'Multi-panel layout',
    moduleKey: 'multi-panel',
    size: { unit: 'px', width: 1100, height: 650 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {
          title: 'Example: multi-panel figure',
          subtitle: 'Use PanelGrid to compose sub-panels (a, b, c…)',
          panelA: 'Panel: raw',
          panelB: 'Panel: processed',
          panelC: 'Panel: ablation',
          panelD: 'Panel: summary'
        }
      }
    ]
  },
  {
    id: 'equation',
    title: 'Equation (MathJax SVG)',
    moduleKey: 'equation',
    size: { unit: 'px', width: 900, height: 260 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {
          title: 'Example: equation (MathJax SVG)',
          subtitle: 'Uses MathJax tex2svg (pure SVG; no foreignObject)',
          tex: String.raw`\\hat{\\beta}=\\arg\\min_{\\beta}\\;\\|y-X\\beta\\|_2^2+\\lambda\\|\\beta\\|_1`
        },
        controls: [{ kind: 'text', key: 'tex', label: 'LaTeX', multiline: true }]
      }
    ]
  },
  {
    id: 'ai-agent-architecture',
    title: 'AI Agent Architecture',
    moduleKey: 'ai-agent-architecture',
    size: { unit: 'px', width: 1100, height: 700 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {
          title: 'AI Agent Architecture',
          subtitle: 'Multi-agent system with tool use and memory',
          userInput: 'User Input',
          orchestrator: 'Orchestrator',
          memory: 'Memory / Context',
          llm: 'LLM / Model',
          tools1: 'Tool A',
          tools2: 'Tool B',
          tools3: 'Tool C',
          output: 'Response',
          notes: 'Components communicate via function calling'
        },
        controls: [
          { kind: 'text', key: 'userInput', label: 'User Input Label' },
          { kind: 'text', key: 'orchestrator', label: 'Orchestrator Label' },
          { kind: 'text', key: 'llm', label: 'LLM Label' },
          { kind: 'text', key: 'memory', label: 'Memory Label' },
          { kind: 'text', key: 'tools1', label: 'Tool 1 Label' },
          { kind: 'text', key: 'tools2', label: 'Tool 2 Label' },
          { kind: 'text', key: 'tools3', label: 'Tool 3 Label' },
          { kind: 'text', key: 'output', label: 'Output Label' }
        ]
      }
    ]
  },
  {
    id: 'simple-line-chart',
    title: 'Simple Line Chart (v2)',
    moduleKey: 'simple-line-chart',
    size: { unit: 'px', width: 800, height: 500 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {}
      }
    ]
  },
  {
    id: 'simple-bar-chart',
    title: 'Simple Bar Chart (v2)',
    moduleKey: 'simple-bar-chart',
    size: { unit: 'px', width: 700, height: 450 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {}
      }
    ]
  },
  {
    id: 'boxplot-demo',
    title: 'Box Plot (v2)',
    moduleKey: 'boxplot-demo',
    size: { unit: 'px', width: 800, height: 500 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {}
      }
    ]
  },
  {
    id: 'violinplot-demo',
    title: 'Violin Plot (v2)',
    moduleKey: 'violinplot-demo',
    size: { unit: 'px', width: 800, height: 500 },
    variants: [
      {
        id: 'default',
        title: 'Default',
        background: 'white',
        props: {}
      }
    ]
  }
];

