import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { inferControlsFromProps } from '../../core/controls';
import type { FigureControl, FigureVariant, ProjectDefinition } from '../../core/manifest';
import { resolveSize } from '../../framework/sizing';
import { Button, ButtonLink, Input, Select, Switch, Textarea } from '../components/ui';
import { loadFigureComponent } from '../figureLoader';
import { loadProject } from '../projectLoader';
import { useProjectProps } from '../useProjectProps';

type ZoomMode = { kind: 'fit' } | { kind: 'percent'; value: number };

function useElementSize(ref: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}

function coerceZoomValue(value: number) {
  if (!Number.isFinite(value)) return 100;
  return Math.max(5, Math.min(800, Math.round(value)));
}

export function FigureView() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId ?? '';
  const figureId = params.figureId ?? '';
  const variantId = params.variantId;
  const [FigureComponent, setFigureComponent] = useState<React.ComponentType<any> | null>(null);
  const [zoom, setZoom] = useState<ZoomMode>({ kind: 'fit' });
  const [checker, setChecker] = useState(false);
  const [project, setProject] = useState<ProjectDefinition | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    setProject(null);
    setProjectError(null);
    loadProject(projectId).then(setProject, (err) => setProjectError(String(err?.message ?? err)));
  }, [projectId]);

  const fig = project?.figures.find((f) => f.id === figureId);
  const variant: FigureVariant | undefined = useMemo(() => {
    if (!fig) return undefined;
    if (variantId) return fig.variants.find((v) => v.id === variantId) ?? fig.variants[0];
    return fig.variants[0];
  }, [fig, variantId]);

  const propsState = useProjectProps(projectId);

  useEffect(() => {
    if (!fig) return;
    setFigureComponent(null);
    loadFigureComponent(projectId, fig.moduleKey).then((Component) => setFigureComponent(() => Component), (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      setFigureComponent(() => () => (
        <div className="m-4 rounded-card border border-studio-border bg-white p-6">
          <div className="mb-1.5 font-extrabold">Failed to load figure module</div>
          <div className="font-mono text-xs text-studio-subtle">{String(err?.message ?? err)}</div>
        </div>
      ));
    });
  }, [projectId, fig?.moduleKey]);

  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const surfaceSize = useElementSize(surfaceRef);

  const size = useMemo(() => {
    if (!fig || !variant) return { width: 100, height: 100, source: { unit: 'px' as const, width: 100, height: 100 } };
    return resolveSize(variant.size ?? fig.size);
  }, [fig, variant]);

  const scale = useMemo(() => {
    if (zoom.kind === 'percent') return zoom.value / 100;
    const pad = 24;
    const w = Math.max(1, surfaceSize.width - pad * 2);
    const h = Math.max(1, surfaceSize.height - pad * 2);
    return Math.max(0.05, Math.min(8, Math.min(w / size.width, h / size.height)));
  }, [zoom, surfaceSize.width, surfaceSize.height, size.width, size.height]);

  if (projectError) {
    return (
      <div className="flex flex-1 min-w-0 flex-col">
        <div className="m-10 rounded-card border border-studio-border bg-white p-6">
          <div className="mb-1.5 font-extrabold">Failed to load project</div>
          <div className="font-mono text-xs text-studio-subtle">{projectError}</div>
        </div>
      </div>
    );
  }

  if (!fig || !variant) {
    return (
      <div className="flex flex-1 min-w-0 flex-col">
        <div className="m-10 rounded-card border border-studio-border bg-white p-6">
          <div className="mb-1.5 font-extrabold">Figure not found</div>
          <div className="text-sm text-studio-subtle">
            Go back to{' '}
            <Link
              className="font-medium text-studio-blue underline underline-offset-4 hover:opacity-90"
              to={`/project/${encodeURIComponent(projectId)}`}
            >
              project
            </Link>
            .
          </div>
        </div>
      </div>
    );
  }

  const controls: FigureControl[] = (() => {
    const explicit = [...(fig.controls ?? []), ...(variant.controls ?? [])];
    if (explicit.length) return explicit;
    return inferControlsFromProps(variant.props ?? {});
  })();

  // const size = ... (already defined above)
  const background = variant.background ?? 'white';
  const variantOverrides = propsState.getVariantOverrides(fig.id, variant.id);
  const effectiveVariantProps = { ...(variant.props ?? {}), ...variantOverrides };

  const props = {
    width: size.width,
    height: size.height,
    background,
    ...(effectiveVariantProps as any)
  };

  const mmText = size.mm && size.dpi ? `${size.mm.width}×${size.mm.height} mm @ ${size.dpi}dpi` : null;

  return (
    <div className="flex flex-1 min-w-0 flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-studio-border bg-white px-4 py-4">
        <div className="min-w-0">
          <div className="text-base font-extrabold">{fig.title}</div>
          <div className="mt-1 text-sm text-studio-subtle">
            <span className="font-mono">{fig.id}</span> • {size.width}×{size.height} px{mmText ? ` • ${mmText}` : ''}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-2.5">
          <Select
            label="Variant"
            className="min-w-[160px]"
            value={variant.id}
            onChange={(e) =>
              navigate(
                `/project/${encodeURIComponent(projectId)}/figure/${encodeURIComponent(fig.id)}/${encodeURIComponent(
                  e.target.value
                )}`
              )
            }
            options={fig.variants.map((v) => ({ value: v.id, label: v.title ? `${v.title} (${v.id})` : v.id }))}
          />

          <div className="inline-flex gap-2">
            <Button size="sm" onClick={() => setZoom({ kind: 'fit' })}>
              Fit
            </Button>
            <Button size="sm" onClick={() => setZoom({ kind: 'percent', value: 100 })}>
              100%
            </Button>
            <Button size="sm" onClick={() => setZoom({ kind: 'percent', value: 200 })}>
              200%
            </Button>
          </div>

          <Input
            containerClassName="min-w-[110px]"
            label="Zoom"
            type="number"
            min={5}
            max={800}
            step={5}
            value={zoom.kind === 'percent' ? zoom.value : Math.round(scale * 100)}
            onChange={(e) => setZoom({ kind: 'percent', value: coerceZoomValue(Number(e.target.value)) })}
          />

          <Switch checked={checker} onCheckedChange={setChecker} label="Checkerboard" />

          <ButtonLink
            to={`/render/${encodeURIComponent(projectId)}/${encodeURIComponent(fig.id)}/${encodeURIComponent(variant.id)}`}
            target="_blank"
          >
            Render route
          </ButtonLink>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div
          className={`flex-1 min-w-0 overflow-auto bg-studio-bg p-4 ${checker ? 'studio-checkerboard' : ''}`}
          ref={surfaceRef}
        >
          <div className="origin-top-left inline-block" style={{ transform: `scale(${scale})` }}>
            <div id="figure-root" className="shadow-figure" style={{ width: size.width, height: size.height }}>
              {FigureComponent ? <FigureComponent {...props} /> : <div className="p-4 text-sm text-studio-subtle">Loading…</div>}
            </div>
          </div>
        </div>

        <aside className="w-[360px] shrink-0 overflow-auto border-l border-studio-border bg-white p-4" aria-label="Controls">
          <div className="mb-2 flex items-center justify-between gap-2.5">
            <div className="font-extrabold">Controls</div>
            <div className="inline-flex gap-2">
              <Button
                size="sm"
                onClick={() => propsState.resetVariantOverrides(fig.id, variant.id)}
                title="Clear saved overrides for this variant"
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  const json = JSON.stringify(variantOverrides, null, 2);
                  try {
                    await navigator.clipboard.writeText(json);
                  } catch {
                    window.prompt('Copy overrides JSON:', json);
                  }
                }}
                title="Copy overrides JSON"
              >
                Copy JSON
              </Button>
            </div>
          </div>

          <div className="mb-3 text-xs text-studio-subtle">
            {propsState.readOnly ? (
              <span title={propsState.loadError ?? undefined}>Saving disabled</span>
            ) : propsState.saveStatus === 'saving' ? (
              <span>Saving…</span>
            ) : propsState.saveStatus === 'saved' ? (
              <span className="font-semibold text-emerald-700">Saved</span>
            ) : propsState.saveStatus === 'error' ? (
              <span className="font-semibold text-studio-red">Save failed</span>
            ) : (
              <span>Edits auto-save</span>
            )}
            {propsState.saveError ? <div className="mt-2 font-mono text-xs text-studio-red">{propsState.saveError}</div> : null}
          </div>

          {controls.length ? (
            <div className="flex flex-col gap-2.5">
              {controls.map((c, idx) => {
                const key = c.key;
                const label = c.label ?? key;
                const currentValue = (effectiveVariantProps as any)[key];

                if (c.kind === 'text') {
                  const value = typeof currentValue === 'string' ? currentValue : currentValue == null ? '' : String(currentValue);
                  if (c.multiline) {
                    return (
                      <Textarea
                        key={`${key}:${idx}`}
                        label={label}
                        rows={5}
                        autoResize
                        maxRows={12}
                        placeholder={c.placeholder}
                        value={value}
                        onChange={(e) => propsState.setVariantOverride(fig.id, variant.id, key, e.target.value)}
                      />
                    );
                  }
                  return (
                    <Input
                      key={`${key}:${idx}`}
                      label={label}
                      type="text"
                      placeholder={c.placeholder}
                      value={value}
                      onChange={(e) => propsState.setVariantOverride(fig.id, variant.id, key, e.target.value)}
                    />
                  );
                }

                if (c.kind === 'number') {
                  const value = typeof currentValue === 'number' && Number.isFinite(currentValue) ? String(currentValue) : '';
                  return (
                    <Input
                      key={`${key}:${idx}`}
                      label={label}
                      type="number"
                      min={c.min}
                      max={c.max}
                      step={c.step}
                      value={value}
                      onChange={(e) => {
                        const s = e.target.value;
                        if (!s) propsState.setVariantOverride(fig.id, variant.id, key, undefined);
                        else {
                          const n = Number(s);
                          propsState.setVariantOverride(fig.id, variant.id, key, Number.isFinite(n) ? n : undefined);
                        }
                      }}
                    />
                  );
                }

                if (c.kind === 'boolean') {
                  const checked = Boolean(currentValue);
                  return (
                    <Switch
                      key={`${key}:${idx}`}
                      checked={checked}
                      onCheckedChange={(next) => propsState.setVariantOverride(fig.id, variant.id, key, next)}
                      label={label}
                    />
                  );
                }

                if (c.kind === 'select') {
                  const value = typeof currentValue === 'string' ? currentValue : currentValue == null ? '' : String(currentValue);
                  return (
                    <Select
                      key={`${key}:${idx}`}
                      label={label}
                      value={value}
                      onChange={(e) => propsState.setVariantOverride(fig.id, variant.id, key, e.target.value)}
                      options={c.options.map((opt) => ({ value: opt.value, label: opt.label }))}
                    />
                  );
                }

                return null;
              })}
            </div>
          ) : (
            <div className="py-3 text-sm text-studio-subtle">No editable props found.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
