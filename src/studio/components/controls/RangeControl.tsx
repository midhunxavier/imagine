import { useEffect, useState } from 'react';
import { Input } from '../ui';
import { ControlField } from './ControlField';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export type RangeControlProps = {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
};

export function RangeControl({ label, value, onChange, min, max, step }: RangeControlProps) {
  const stepSize = Number.isFinite(step) && step && step > 0 ? step : 1;
  const v = Number.isFinite(value) ? clamp(value as number, min, max) : min;
  const [draft, setDraft] = useState(String(v));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) return;
    setDraft(String(v));
  }, [editing, v]);

  function commit(next: string) {
    const n = Number(next);
    if (!Number.isFinite(n)) {
      setDraft(String(v));
      return;
    }
    const clamped = clamp(n, min, max);
    onChange(clamped);
    setDraft(String(clamped));
  }

  return (
    <ControlField label={label} meta={String(v)}>
      <div className="flex items-center gap-2">
        <input
          aria-label={`${label} slider`}
          className="w-full flex-1 accent-studio-blue"
          type="range"
          min={min}
          max={max}
          step={stepSize}
          value={v}
          onChange={(e) => {
            const next = clamp(Number(e.target.value), min, max);
            onChange(next);
            setDraft(String(next));
          }}
        />
        <div className="w-[110px]">
          <Input
            aria-label={label}
            type="number"
            value={draft}
            min={min}
            max={max}
            step={stepSize}
            onFocus={() => setEditing(true)}
            onBlur={() => {
              setEditing(false);
              commit(draft);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
              if (e.key === 'Escape') {
                setDraft(String(v));
                (e.target as HTMLInputElement).blur();
              }
            }}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-studio-subtle">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </ControlField>
  );
}

