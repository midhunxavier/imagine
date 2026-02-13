import { Button, Input } from '../ui';
import { ControlField } from './ControlField';

function clampNumber(value: number, min?: number, max?: number) {
  if (typeof min === 'number' && Number.isFinite(min)) value = Math.max(min, value);
  if (typeof max === 'number' && Number.isFinite(max)) value = Math.min(max, value);
  return value;
}

export type NumberControlProps = {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function NumberControl({ label, value, onChange, min, max, step }: NumberControlProps) {
  const hasBounds = Number.isFinite(min) && Number.isFinite(max);
  const metaParts: string[] = [];
  if (Number.isFinite(min)) metaParts.push(`min ${min}`);
  if (Number.isFinite(max)) metaParts.push(`max ${max}`);

  const stepSize = Number.isFinite(step) && step && step > 0 ? step : 1;

  const inputValue = value === undefined ? '' : String(value);
  const sliderValue = hasBounds
    ? clampNumber(typeof value === 'number' && Number.isFinite(value) ? value : (min as number), min as number, max as number)
    : null;

  function applyStep(dir: -1 | 1) {
    const current = typeof value === 'number' && Number.isFinite(value) ? value : null;
    const base = current ?? (Number.isFinite(min) ? (min as number) : 0);
    if (current === null) {
      onChange(clampNumber(base, min, max));
      return;
    }
    onChange(clampNumber(base + dir * stepSize, min, max));
  }

  return (
    <ControlField label={label} meta={metaParts.length ? metaParts.join(' · ') : undefined}>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            aria-label={label}
            type="number"
            value={inputValue}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const s = e.target.value;
              if (!s) onChange(undefined);
              else {
                const n = Number(s);
                onChange(Number.isFinite(n) ? clampNumber(n, min, max) : undefined);
              }
            }}
          />
        </div>
        <div className="inline-flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => applyStep(-1)} aria-label={`Decrease ${label}`}>
            −
          </Button>
          <Button variant="ghost" size="sm" onClick={() => applyStep(1)} aria-label={`Increase ${label}`}>
            +
          </Button>
        </div>
      </div>

      {hasBounds && sliderValue !== null ? (
        <input
          aria-label={`${label} slider`}
          className="w-full accent-studio-blue"
          type="range"
          min={min}
          max={max}
          step={stepSize}
          value={sliderValue}
          onChange={(e) => onChange(clampNumber(Number(e.target.value), min, max))}
        />
      ) : null}
    </ControlField>
  );
}
