import { useEffect, useRef, useState } from 'react';
import { Input, Switch } from '../ui';
import { ControlField } from './ControlField';

type SizeValue = { width: number; height: number };

function parsePositiveNumber(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export type SizeControlProps = {
  label: string;
  value: SizeValue | undefined;
  onChange: (value: SizeValue) => void;
  lockAspectRatio?: boolean;
};

export function SizeControl({ label, value, onChange, lockAspectRatio }: SizeControlProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const ratioRef = useRef<number | null>(null);
  const [locked, setLocked] = useState(Boolean(lockAspectRatio));
  const [editing, setEditing] = useState(false);

  const [widthText, setWidthText] = useState(value ? String(value.width) : '');
  const [heightText, setHeightText] = useState(value ? String(value.height) : '');

  useEffect(() => {
    if (editing) return;
    setWidthText(value ? String(value.width) : '');
    setHeightText(value ? String(value.height) : '');
  }, [editing, value?.height, value?.width]);

  useEffect(() => {
    if (!locked) return;
    if (ratioRef.current !== null) return;
    if (value && value.width > 0 && value.height > 0) ratioRef.current = value.width / value.height;
  }, [locked, value]);

  function captureRatio() {
    const w = parsePositiveNumber(widthText);
    const h = parsePositiveNumber(heightText);
    if (w && h) ratioRef.current = w / h;
    else if (value && value.width > 0 && value.height > 0) ratioRef.current = value.width / value.height;
  }

  function maybeCommit(nextWidthText: string, nextHeightText: string) {
    const w = parsePositiveNumber(nextWidthText);
    const h = parsePositiveNumber(nextHeightText);
    if (!w || !h) return;
    onChange({ width: w, height: h });
  }

  return (
    <div
      ref={wrapperRef}
      onFocusCapture={() => setEditing(true)}
      onBlurCapture={() => {
        window.setTimeout(() => {
          const el = wrapperRef.current;
          if (!el) return;
          if (document.activeElement && el.contains(document.activeElement)) return;
          setEditing(false);
        }, 0);
      }}
    >
      <ControlField
        label={label}
        meta={
          <Switch
            checked={locked}
            onCheckedChange={(next) => {
              setLocked(next);
              if (next) captureRatio();
            }}
            label="Lock"
          />
        }
      >
        <div className="grid grid-cols-2 gap-2">
          <Input
            aria-label={`${label} width`}
            type="number"
            placeholder="W"
            value={widthText}
            onChange={(e) => {
              const nextWidth = e.target.value;
              setWidthText(nextWidth);
              if (locked && ratioRef.current) {
                const w = parsePositiveNumber(nextWidth);
                if (w) {
                  const nextHeight = Math.round(w / ratioRef.current);
                  const nextHeightText = String(nextHeight);
                  setHeightText(nextHeightText);
                  maybeCommit(nextWidth, nextHeightText);
                  return;
                }
              }
              maybeCommit(nextWidth, heightText);
            }}
          />
          <Input
            aria-label={`${label} height`}
            type="number"
            placeholder="H"
            value={heightText}
            onChange={(e) => {
              const nextHeight = e.target.value;
              setHeightText(nextHeight);
              if (locked && ratioRef.current) {
                const h = parsePositiveNumber(nextHeight);
                if (h) {
                  const nextWidth = Math.round(h * ratioRef.current);
                  const nextWidthText = String(nextWidth);
                  setWidthText(nextWidthText);
                  maybeCommit(nextWidthText, nextHeight);
                  return;
                }
              }
              maybeCommit(widthText, nextHeight);
            }}
          />
        </div>
      </ControlField>
    </div>
  );
}

