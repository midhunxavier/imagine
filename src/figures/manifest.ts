export type FigureId = string;

export type FigureSize =
  | { unit: 'px'; width: number; height: number }
  | { unit: 'mm'; width: number; height: number; dpi: number };

export type FigureVariant = {
  id: string;
  title?: string;
  props?: unknown;
  size?: FigureSize;
  background?: 'white' | 'transparent';
};

export type FigureManifestItem = {
  id: FigureId;
  title: string;
  moduleKey: string;
  size: FigureSize;
  variants: FigureVariant[];
};

export function validateFiguresManifest(items: FigureManifestItem[]): void {
  const seenFigureIds = new Set<string>();

  for (const fig of items) {
    if (!fig.id.trim()) throw new Error('Figure id must be non-empty');
    if (seenFigureIds.has(fig.id)) throw new Error(`Duplicate figure id: ${fig.id}`);
    seenFigureIds.add(fig.id);

    if (!fig.title.trim()) throw new Error(`Figure ${fig.id} title must be non-empty`);
    if (!fig.moduleKey.trim()) throw new Error(`Figure ${fig.id} moduleKey must be non-empty`);

    if (fig.size.unit === 'px') {
      if (fig.size.width <= 0 || fig.size.height <= 0) throw new Error(`Figure ${fig.id} size must be positive`);
    } else {
      if (fig.size.width <= 0 || fig.size.height <= 0 || fig.size.dpi <= 0)
        throw new Error(`Figure ${fig.id} mm/dpi size must be positive`);
    }

    if (!fig.variants.length) throw new Error(`Figure ${fig.id} must have at least one variant`);
    const seenVariantIds = new Set<string>();
    for (const v of fig.variants) {
      if (!v.id.trim()) throw new Error(`Figure ${fig.id} variant id must be non-empty`);
      if (seenVariantIds.has(v.id)) throw new Error(`Figure ${fig.id} has duplicate variant id: ${v.id}`);
      seenVariantIds.add(v.id);

      if (v.size) {
        if (v.size.unit === 'px') {
          if (v.size.width <= 0 || v.size.height <= 0) throw new Error(`Figure ${fig.id}/${v.id} size must be positive`);
        } else {
          if (v.size.width <= 0 || v.size.height <= 0 || v.size.dpi <= 0)
            throw new Error(`Figure ${fig.id}/${v.id} mm/dpi size must be positive`);
        }
      }
    }
  }
}

export const figures: FigureManifestItem[] = [
  {
    id: 'hello-world',
    title: 'Hello world',
    moduleKey: 'hello-world',
    size: { unit: 'px', width: 900, height: 520 },
    variants: [
      { id: 'default', title: 'Default', background: 'white' },
      { id: 'transparent', title: 'Transparent', background: 'transparent' }
    ]
  },
  {
    id: 'line-chart',
    title: 'Line chart',
    moduleKey: 'line-chart',
    size: { unit: 'mm', width: 85, height: 60, dpi: 600 },
    variants: [{ id: 'default', title: 'Default', background: 'white' }]
  },
  {
    id: 'pipeline-diagram',
    title: 'Pipeline diagram',
    moduleKey: 'pipeline-diagram',
    size: { unit: 'px', width: 1000, height: 380 },
    variants: [{ id: 'default', title: 'Default', background: 'white' }]
  },
  {
    id: 'multi-panel',
    title: 'Multi-panel layout',
    moduleKey: 'multi-panel',
    size: { unit: 'px', width: 1100, height: 650 },
    variants: [{ id: 'default', title: 'Default', background: 'white' }]
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
          tex: String.raw`\\hat{\\beta}=\\arg\\min_{\\beta}\\;\\|y-X\\beta\\|_2^2+\\lambda\\|\\beta\\|_1`
        }
      }
    ]
  }
];

validateFiguresManifest(figures);

