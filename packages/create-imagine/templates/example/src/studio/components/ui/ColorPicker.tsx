import { useEffect, useMemo, useRef, useState } from 'react';
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '../../utils/color';
import { cn } from './cn';
import { focusRing } from './styles';

const DEFAULT_COLOR = '#000000';
const MAX_RECENT_COLORS = 8;

type HslColor = { h: number; s: number; l: number };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(value: string): string | null {
  try {
    const [r, g, b] = hexToRgb(value);
    return rgbToHex(r, g, b);
  } catch {
    return null;
  }
}

function toHsl(hex: string): HslColor {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  return { h, s, l };
}

function dedupeColors(colors: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const color of colors) {
    if (seen.has(color)) continue;
    seen.add(color);
    next.push(color);
  }
  return next;
}

function readRecentColors(storageKey: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const normalized = parsed
      .map((item) => normalizeHex(String(item)))
      .filter((item): item is string => Boolean(item));
    return dedupeColors(normalized).slice(0, MAX_RECENT_COLORS);
  } catch {
    return [];
  }
}

function writeRecentColors(storageKey: string, colors: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(colors));
  } catch {
    // no-op
  }
}

export type ColorPickerProps = {
  value: string;
  onChange: (next: string) => void;
  presets?: string[];
  disabled?: boolean;
  recentStorageKey?: string;
};

export function ColorPicker({
  value,
  onChange,
  presets,
  disabled = false,
  recentStorageKey = 'imagine:studio:recent-colors'
}: ColorPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pickingRef = useRef(false);
  const wasOpenRef = useRef(false);

  const normalizedValue = normalizeHex(value) ?? DEFAULT_COLOR;
  const [hsl, setHsl] = useState<HslColor>(() => toHsl(normalizedValue));
  const [open, setOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState(normalizedValue);
  const [editingHex, setEditingHex] = useState(false);
  const [editingRgb, setEditingRgb] = useState<null | 'r' | 'g' | 'b'>(null);
  const [recentColors, setRecentColors] = useState<string[]>(() => readRecentColors(recentStorageKey));

  const [currentR, currentG, currentB] = hslToRgb(hsl.h, hsl.s, hsl.l);
  const currentHex = rgbToHex(currentR, currentG, currentB);

  const [rgbDraft, setRgbDraft] = useState<{ r: string; g: string; b: string }>({
    r: String(currentR),
    g: String(currentG),
    b: String(currentB)
  });

  const normalizedPresets = useMemo(() => {
    const parsed = (presets ?? [])
      .map((item) => normalizeHex(item))
      .filter((item): item is string => Boolean(item));
    return dedupeColors(parsed);
  }, [presets]);

  useEffect(() => {
    setRecentColors(readRecentColors(recentStorageKey));
  }, [recentStorageKey]);

  useEffect(() => {
    if (normalizedValue === currentHex) return;
    setHsl(toHsl(normalizedValue));
  }, [currentHex, normalizedValue]);

  useEffect(() => {
    if (editingHex) return;
    setHexDraft(currentHex);
  }, [currentHex, editingHex]);

  useEffect(() => {
    if (editingRgb) return;
    setRgbDraft({ r: String(currentR), g: String(currentG), b: String(currentB) });
  }, [currentB, currentG, currentR, editingRgb]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (event.target instanceof Node && !el.contains(event.target)) setOpen(false);
    };
    const onFocusIn = (event: FocusEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (event.target instanceof Node && !el.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      setRecentColors((prev) => {
        const next = [currentHex, ...prev.filter((item) => item !== currentHex)].slice(0, MAX_RECENT_COLORS);
        writeRecentColors(recentStorageKey, next);
        return next;
      });
    }
    wasOpenRef.current = open;
  }, [currentHex, open, recentStorageKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `hsl(${hsl.h}, 100%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
    whiteGradient.addColorStop(0, '#FFFFFF');
    whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, width, height);

    const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
    blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    blackGradient.addColorStop(1, '#000000');
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, width, height);
  }, [hsl.h]);

  function applyHsl(next: HslColor) {
    const resolved: HslColor = {
      h: ((next.h % 360) + 360) % 360,
      s: clamp(next.s, 0, 100),
      l: clamp(next.l, 0, 100)
    };
    setHsl(resolved);
    const [r, g, b] = hslToRgb(resolved.h, resolved.s, resolved.l);
    onChange(rgbToHex(r, g, b));
  }

  function applyHex(next: string): boolean {
    const normalized = normalizeHex(next);
    if (!normalized) return false;
    const [r, g, b] = hexToRgb(normalized);
    const [h, s, l] = rgbToHsl(r, g, b);
    setHsl({ h, s, l });
    onChange(normalized);
    return true;
  }

  function commitHexDraft() {
    if (applyHex(hexDraft)) return;
    setHexDraft(currentHex);
  }

  function commitRgbDraft() {
    const r = Number.parseInt(rgbDraft.r, 10);
    const g = Number.parseInt(rgbDraft.g, 10);
    const b = Number.parseInt(rgbDraft.b, 10);
    if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) {
      setRgbDraft({ r: String(currentR), g: String(currentG), b: String(currentB) });
      return;
    }
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      setRgbDraft({ r: String(currentR), g: String(currentG), b: String(currentB) });
      return;
    }
    applyHex(rgbToHex(r, g, b));
  }

  function updateSaturationLightness(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    const nextS = (x / rect.width) * 100;
    const nextL = 100 - (y / rect.height) * 100;
    applyHsl({ h: hsl.h, s: nextS, l: nextL });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-label="Select color"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          'inline-flex items-center gap-2 rounded-control border border-studio-border bg-white px-2.5 py-2 text-xs shadow-sm transition-colors duration-80',
          'text-studio-text hover:bg-studio-panel disabled:cursor-not-allowed disabled:opacity-60',
          focusRing
        )}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
      >
        <span className="h-4 w-4 rounded-control border border-studio-border" style={{ backgroundColor: currentHex }} />
        <span className="text-xs font-medium">Pick</span>
        <svg className="h-3.5 w-3.5 text-studio-subtle" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M5.47 7.53a.75.75 0 0 1 1.06 0L10 11l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06Z" />
        </svg>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Color picker"
          className="absolute left-0 top-full z-50 mt-2 w-[296px] rounded-control border border-studio-border bg-white p-3 shadow-cardHover"
        >
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={240}
              height={140}
              className="h-[140px] w-full cursor-crosshair rounded-control border border-studio-border touch-none"
              onPointerDown={(event) => {
                if (disabled) return;
                pickingRef.current = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                updateSaturationLightness(event.clientX, event.clientY);
              }}
              onPointerMove={(event) => {
                if (!pickingRef.current) return;
                updateSaturationLightness(event.clientX, event.clientY);
              }}
              onPointerUp={(event) => {
                if (!pickingRef.current) return;
                pickingRef.current = false;
                event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={(event) => {
                if (!pickingRef.current) return;
                pickingRef.current = false;
                event.currentTarget.releasePointerCapture(event.pointerId);
              }}
            />
            <div
              className="pointer-events-none absolute h-3.5 w-3.5 rounded-full border-2 border-white shadow"
              style={{ left: `${hsl.s}%`, top: `${100 - hsl.l}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>

          <div className="mt-3">
            <input
              aria-label="Hue"
              type="range"
              min={0}
              max={360}
              step={1}
              value={Math.round(hsl.h)}
              className="w-full accent-studio-blue"
              onChange={(event) => {
                const hue = Number.parseFloat(event.target.value);
                applyHsl({ h: hue, s: hsl.s, l: hsl.l });
              }}
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <div className="col-span-4">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Hex</div>
              <input
                aria-label="Hex color"
                value={hexDraft}
                className="w-full rounded-control border border-studio-border bg-white px-2.5 py-2 font-mono text-xs shadow-sm outline-none transition-colors duration-80 focus:border-studio-blue focus:ring-2 focus:ring-studio-blue/30"
                onFocus={() => setEditingHex(true)}
                onChange={(event) => setHexDraft(event.target.value)}
                onBlur={() => {
                  setEditingHex(false);
                  commitHexDraft();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    setEditingHex(false);
                    commitHexDraft();
                    (event.target as HTMLInputElement).blur();
                  }
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setEditingHex(false);
                    setHexDraft(currentHex);
                    (event.target as HTMLInputElement).blur();
                  }
                }}
              />
            </div>

            {(['r', 'g', 'b'] as const).map((channel) => (
              <div key={channel}>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{channel}</div>
                <input
                  aria-label={`${channel.toUpperCase()} channel`}
                  inputMode="numeric"
                  value={rgbDraft[channel]}
                  className="w-full rounded-control border border-studio-border bg-white px-2 py-1.5 text-xs shadow-sm outline-none transition-colors duration-80 focus:border-studio-blue focus:ring-2 focus:ring-studio-blue/30"
                  onFocus={() => setEditingRgb(channel)}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/[^0-9]/g, '');
                    setRgbDraft((prev) => ({ ...prev, [channel]: digits }));
                  }}
                  onBlur={() => {
                    setEditingRgb(null);
                    commitRgbDraft();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      setEditingRgb(null);
                      commitRgbDraft();
                      (event.target as HTMLInputElement).blur();
                    }
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      setEditingRgb(null);
                      setRgbDraft({ r: String(currentR), g: String(currentG), b: String(currentB) });
                      (event.target as HTMLInputElement).blur();
                    }
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              className={cn(
                'rounded-control border border-studio-border bg-white px-2 py-1.5 text-xs text-studio-subtle shadow-sm hover:bg-studio-panel',
                focusRing
              )}
              onClick={() => {
                setHexDraft(currentHex);
                setRgbDraft({ r: String(currentR), g: String(currentG), b: String(currentB) });
                setOpen(false);
              }}
            >
              Close
            </button>
          </div>

          {normalizedPresets.length ? (
            <div className="mt-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Presets</div>
              <div className="flex flex-wrap gap-1.5">
                {normalizedPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={cn('h-6 w-6 rounded-control border border-studio-border', focusRing)}
                    style={{ backgroundColor: preset }}
                    aria-label={`Set color to ${preset}`}
                    title={preset}
                    onClick={() => applyHex(preset)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {recentColors.length ? (
            <div className="mt-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Recent</div>
              <div className="flex flex-wrap gap-1.5">
                {recentColors.map((recent) => (
                  <button
                    key={recent}
                    type="button"
                    className={cn('h-6 w-6 rounded-control border border-studio-border', focusRing)}
                    style={{ backgroundColor: recent }}
                    aria-label={`Set color to ${recent}`}
                    title={recent}
                    onClick={() => applyHex(recent)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
