export type ProjectId = string;
export type FigureId = string;

export type FigureSize =
  | { unit: 'px'; width: number; height: number }
  | { unit: 'mm'; width: number; height: number; dpi: number };

export type FigureControl =
  | { kind: 'text'; key: string; label?: string; multiline?: boolean; placeholder?: string }
  | { kind: 'number'; key: string; label?: string; min?: number; max?: number; step?: number }
  | { kind: 'boolean'; key: string; label?: string }
  | { kind: 'select'; key: string; label?: string; options: Array<{ label: string; value: string; group?: string }> }
  | { kind: 'color'; key: string; label?: string; presets?: string[] }
  | { kind: 'range'; key: string; label?: string; min: number; max: number; step?: number }
  | { kind: 'font'; key: string; label?: string; fonts?: string[] }
  | { kind: 'size'; key: string; label?: string; lockAspectRatio?: boolean };

export type FigureVariant = {
  id: string;
  title?: string;
  props?: Record<string, unknown>;
  controls?: FigureControl[];
  size?: FigureSize;
  background?: 'white' | 'transparent';
};

export type FigureManifestItem = {
  id: FigureId;
  title: string;
  moduleKey: string;
  size: FigureSize;
  variants: FigureVariant[];
  controls?: FigureControl[];
};

export type ProjectExample = {
  figureId: FigureId;
  variantId: string;
  src: string;
  caption?: string;
};

export type ProjectDefinition = {
  id: ProjectId;
  title: string;
  description?: string;
  examples?: ProjectExample[];
  figures: FigureManifestItem[];
};

export type PropsFileV1 = {
  version: 1;
  overrides: Record<FigureId, Record<string, Record<string, unknown>>>;
};

export const PROJECT_ID_RE = /^[a-zA-Z0-9_-]+$/;

export function emptyPropsFile(): PropsFileV1 {
  return { version: 1, overrides: {} };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

export function validatePropsFileV1(file: unknown): PropsFileV1 {
  if (!isPlainObject(file)) throw new Error('props file must be an object');
  if (file.version !== 1) throw new Error('props file version must be 1');
  if (!isPlainObject(file.overrides)) throw new Error('props file overrides must be an object');
  return file as PropsFileV1;
}

function validateSize(size: FigureSize, label: string) {
  if (size.unit === 'px') {
    if (size.width <= 0 || size.height <= 0) throw new Error(`${label} size must be positive`);
    return;
  }
  if (size.width <= 0 || size.height <= 0 || size.dpi <= 0) throw new Error(`${label} mm/dpi size must be positive`);
}

function validateControls(controls: FigureControl[], label: string) {
  for (const c of controls) {
    if (!c.key.trim()) throw new Error(`${label} control key must be non-empty`);
    if (c.kind === 'select') {
      if (!c.options.length) throw new Error(`${label} select control options must be non-empty`);
      for (const opt of c.options) {
        if (!opt.label.trim()) throw new Error(`${label} select option label must be non-empty`);
        if (!opt.value.trim()) throw new Error(`${label} select option value must be non-empty`);
        if (opt.group !== undefined && !opt.group.trim()) throw new Error(`${label} select option group must be non-empty`);
      }
    }
    if (c.kind === 'range') {
      if (!Number.isFinite(c.min) || !Number.isFinite(c.max)) throw new Error(`${label} range control min/max must be finite`);
      if (c.min >= c.max) throw new Error(`${label} range control min must be less than max`);
      if (c.step !== undefined && (!Number.isFinite(c.step) || c.step <= 0)) throw new Error(`${label} range control step must be positive`);
    }
    if (c.kind === 'color') {
      if (c.presets) {
        for (const preset of c.presets) {
          if (!preset.trim()) throw new Error(`${label} color control presets must be non-empty strings`);
        }
      }
    }
    if (c.kind === 'font') {
      if (c.fonts) {
        for (const font of c.fonts) {
          if (!font.trim()) throw new Error(`${label} font control fonts must be non-empty strings`);
        }
      }
    }
  }
}

export function validateFigures(figures: FigureManifestItem[]): void {
  const seenFigureIds = new Set<string>();

  for (const fig of figures) {
    if (!fig.id.trim()) throw new Error('Figure id must be non-empty');
    if (seenFigureIds.has(fig.id)) throw new Error(`Duplicate figure id: ${fig.id}`);
    seenFigureIds.add(fig.id);

    if (!fig.title.trim()) throw new Error(`Figure ${fig.id} title must be non-empty`);
    if (!fig.moduleKey.trim()) throw new Error(`Figure ${fig.id} moduleKey must be non-empty`);
    validateSize(fig.size, `Figure ${fig.id}`);
    if (fig.controls?.length) validateControls(fig.controls, `Figure ${fig.id}`);

    if (!fig.variants.length) throw new Error(`Figure ${fig.id} must have at least one variant`);
    const seenVariantIds = new Set<string>();
    for (const v of fig.variants) {
      if (!v.id.trim()) throw new Error(`Figure ${fig.id} variant id must be non-empty`);
      if (seenVariantIds.has(v.id)) throw new Error(`Figure ${fig.id} has duplicate variant id: ${v.id}`);
      seenVariantIds.add(v.id);

      if (v.size) validateSize(v.size, `Figure ${fig.id}/${v.id}`);
      if (v.controls?.length) validateControls(v.controls, `Figure ${fig.id}/${v.id}`);
    }
  }
}

export function validateProject(project: ProjectDefinition): void {
  if (!project.id.trim()) throw new Error('Project id must be non-empty');
  if (!PROJECT_ID_RE.test(project.id)) throw new Error(`Project id contains invalid characters: ${project.id}`);
  if (!project.title.trim()) throw new Error(`Project ${project.id} title must be non-empty`);

  validateFigures(project.figures);

  if (project.examples?.length) {
    const byId = new Map(project.figures.map((f) => [f.id, f]));
    for (const ex of project.examples) {
      if (!ex.src.trim()) throw new Error(`Project ${project.id} example src must be non-empty`);
      const fig = byId.get(ex.figureId);
      if (!fig) throw new Error(`Project ${project.id} example references unknown figureId: ${ex.figureId}`);
      const v = fig.variants.find((vv) => vv.id === ex.variantId);
      if (!v) throw new Error(`Project ${project.id} example references unknown variantId: ${ex.figureId}/${ex.variantId}`);
    }
  }
}
