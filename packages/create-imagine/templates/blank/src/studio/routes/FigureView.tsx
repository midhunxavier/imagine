import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { inferControlsFromProps } from '../../core/controls';
import type { FigureControl, FigureVariant, ProjectDefinition } from '../../core/manifest';
import { resolveSize } from '../../framework/sizing';
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
        <div className="empty">
          <div className="emptyTitle">Failed to load figure module</div>
          <div className="emptyBody mono">{String(err?.message ?? err)}</div>
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
      <div className="page">
        <div className="empty">
          <div className="emptyTitle">Failed to load project</div>
          <div className="emptyBody mono">{projectError}</div>
        </div>
      </div>
    );
  }

  if (!fig || !variant) {
    return (
      <div className="page">
        <div className="empty">
          <div className="emptyTitle">Figure not found</div>
          <div className="emptyBody">
            Go back to <Link to={`/project/${encodeURIComponent(projectId)}`}>project</Link>.
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
    <div className="page figurePage">
      <div className="pageHeader figureHeader">
        <div className="figureHeaderLeft">
          <div className="pageTitle">{fig.title}</div>
          <div className="pageSubtitle">
            <span className="mono">{fig.id}</span> • {size.width}×{size.height} px{mmText ? ` • ${mmText}` : ''}
          </div>
        </div>
        <div className="figureHeaderRight">
          <label className="label">
            Variant
            <select
              className="select"
              value={variant.id}
              onChange={(e) =>
                navigate(
                  `/project/${encodeURIComponent(projectId)}/figure/${encodeURIComponent(fig.id)}/${encodeURIComponent(
                    e.target.value
                  )}`
                )
              }
            >
              {fig.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title ? `${v.title} (${v.id})` : v.id}
                </option>
              ))}
            </select>
          </label>

          <div className="toolbarGroup">
            <button className="btn btnSmall" onClick={() => setZoom({ kind: 'fit' })}>
              Fit
            </button>
            <button className="btn btnSmall" onClick={() => setZoom({ kind: 'percent', value: 100 })}>
              100%
            </button>
            <button className="btn btnSmall" onClick={() => setZoom({ kind: 'percent', value: 200 })}>
              200%
            </button>
          </div>

          <label className="label">
            Zoom
            <input
              className="input"
              type="number"
              min={5}
              max={800}
              step={5}
              value={zoom.kind === 'percent' ? zoom.value : Math.round(scale * 100)}
              onChange={(e) => setZoom({ kind: 'percent', value: coerceZoomValue(Number(e.target.value)) })}
            />
          </label>

          <label className="checkbox">
            <input type="checkbox" checked={checker} onChange={(e) => setChecker(e.target.checked)} /> Checkerboard
          </label>

          <Link
            className="btn btnSmall"
            to={`/render/${encodeURIComponent(projectId)}/${encodeURIComponent(fig.id)}/${encodeURIComponent(variant.id)}`}
            target="_blank"
          >
            Render route
          </Link>
        </div>
      </div>

      <div className="figureBody">
        <div className={`previewSurface ${checker ? 'checker' : ''}`} ref={surfaceRef}>
          <div className="previewScale" style={{ transform: `scale(${scale})` }}>
            <div id="figure-root" style={{ width: size.width, height: size.height }}>
              {FigureComponent ? <FigureComponent {...props} /> : <div className="loading">Loading…</div>}
            </div>
          </div>
        </div>

        <aside className="controlsPanel" aria-label="Controls">
          <div className="controlsHeader">
            <div className="controlsTitle">Controls</div>
            <div className="controlsActions">
              <button
                className="btn btnSmall"
                onClick={() => propsState.resetVariantOverrides(fig.id, variant.id)}
                title="Clear saved overrides for this variant"
              >
                Reset
              </button>
              <button
                className="btn btnSmall"
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
              </button>
            </div>
          </div>

          <div className="controlsStatus">
            {propsState.readOnly ? (
              <span className="statusMuted" title={propsState.loadError ?? undefined}>
                Saving disabled
              </span>
            ) : propsState.saveStatus === 'saving' ? (
              <span className="statusMuted">Saving…</span>
            ) : propsState.saveStatus === 'saved' ? (
              <span className="statusOk">Saved</span>
            ) : propsState.saveStatus === 'error' ? (
              <span className="statusErr">Save failed</span>
            ) : (
              <span className="statusMuted">Edits auto-save</span>
            )}
            {propsState.saveError ? <div className="statusErr mono">{propsState.saveError}</div> : null}
          </div>

          {controls.length ? (
            <div className="controlsGrid">
              {controls.map((c, idx) => {
                const key = c.key;
                const label = c.label ?? key;
                const currentValue = (effectiveVariantProps as any)[key];

                if (c.kind === 'text') {
                  const value = typeof currentValue === 'string' ? currentValue : currentValue == null ? '' : String(currentValue);
                  return (
                    <label key={`${key}:${idx}`} className="control">
                      <div className="controlLabel">{label}</div>
                      {c.multiline ? (
                        <textarea
                          className="textarea"
                          rows={5}
                          placeholder={c.placeholder}
                          value={value}
                          onChange={(e) => propsState.setVariantOverride(fig.id, variant.id, key, e.target.value)}
                        />
                      ) : (
                        <input
                          className="input"
                          type="text"
                          placeholder={c.placeholder}
                          value={value}
                          onChange={(e) => propsState.setVariantOverride(fig.id, variant.id, key, e.target.value)}
                        />
                      )}
                    </label>
                  );
                }

                if (c.kind === 'number') {
                  const value = typeof currentValue === 'number' && Number.isFinite(currentValue) ? String(currentValue) : '';
                  return (
                    <label key={`${key}:${idx}`} className="control">
                      <div className="controlLabel">{label}</div>
                      <input
                        className="input"
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
                    </label>
                  );
                }

                if (c.kind === 'boolean') {
                  const checked = Boolean(currentValue);
                  return (
                    <label key={`${key}:${idx}`} className="control controlCheckbox">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => propsState.setVariantOverride(fig.id, variant.id, key, e.target.checked)}
                      />
                      <div className="controlLabel">{label}</div>
                    </label>
                  );
                }

                if (c.kind === 'select') {
                  const value = typeof currentValue === 'string' ? currentValue : currentValue == null ? '' : String(currentValue);
                  return (
                    <label key={`${key}:${idx}`} className="control">
                      <div className="controlLabel">{label}</div>
                      <select
                        className="select"
                        value={value}
                        onChange={(e) => propsState.setVariantOverride(fig.id, variant.id, key, e.target.value)}
                      >
                        {c.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                return null;
              })}
            </div>
          ) : (
            <div className="controlsEmpty">No editable props found.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
