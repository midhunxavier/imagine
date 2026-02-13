import type { FigureControl } from '../../../core/manifest';
import { BooleanControl } from './BooleanControl';
import { ColorControl } from './ColorControl';
import { FontControl } from './FontControl';
import { MultilineControl } from './MultilineControl';
import { NumberControl } from './NumberControl';
import { RangeControl } from './RangeControl';
import { SelectControl } from './SelectControl';
import { SizeControl } from './SizeControl';
import { TextControl } from './TextControl';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

function coerceSize(value: unknown): { width: number; height: number } | undefined {
  if (!isPlainObject(value)) return undefined;
  const w = (value as any).width;
  const h = (value as any).height;
  if (typeof w !== 'number' || !Number.isFinite(w)) return undefined;
  if (typeof h !== 'number' || !Number.isFinite(h)) return undefined;
  return { width: w, height: h };
}

export type ControlsRendererProps = {
  control: FigureControl;
  value: unknown;
  onChange: (value: unknown) => void;
};

export function ControlsRenderer({ control, value, onChange }: ControlsRendererProps) {
  const label = control.label ?? control.key;

  if (control.kind === 'text') {
    const str = typeof value === 'string' ? value : value == null ? '' : String(value);
    if (control.multiline) {
      return (
        <MultilineControl label={label} value={str} placeholder={control.placeholder} onChange={(v) => onChange(v)} />
      );
    }
    return <TextControl label={label} value={str} placeholder={control.placeholder} onChange={(v) => onChange(v)} />;
  }

  if (control.kind === 'number') {
    const n = typeof value === 'number' && Number.isFinite(value) ? value : undefined;
    return (
      <NumberControl
        label={label}
        value={n}
        min={control.min}
        max={control.max}
        step={control.step}
        onChange={(v) => onChange(v)}
      />
    );
  }

  if (control.kind === 'boolean') {
    const checked = Boolean(value);
    return <BooleanControl label={label} checked={checked} onChange={(v) => onChange(v)} />;
  }

  if (control.kind === 'select') {
    const str = typeof value === 'string' ? value : value == null ? '' : String(value);
    return (
      <SelectControl
        label={label}
        value={str}
        options={control.options.map((opt) => ({ label: opt.label, value: opt.value, group: opt.group }))}
        onChange={(v) => onChange(v)}
      />
    );
  }

  if (control.kind === 'color') {
    const str = typeof value === 'string' ? value : '';
    return <ColorControl label={label} value={str} presets={control.presets} onChange={(v) => onChange(v)} />;
  }

  if (control.kind === 'range') {
    const n = typeof value === 'number' && Number.isFinite(value) ? value : undefined;
    return (
      <RangeControl
        label={label}
        value={n}
        min={control.min}
        max={control.max}
        step={control.step}
        onChange={(v) => onChange(v)}
      />
    );
  }

  if (control.kind === 'font') {
    const str = typeof value === 'string' ? value : '';
    return <FontControl label={label} value={str} fonts={control.fonts} onChange={(v) => onChange(v)} />;
  }

  if (control.kind === 'size') {
    const size = coerceSize(value);
    return (
      <SizeControl label={label} value={size} lockAspectRatio={control.lockAspectRatio} onChange={(v) => onChange(v)} />
    );
  }

  return null;
}

