import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { figures } from '../../figures/manifest';
import { resolveSize } from '../../framework/sizing';
import type { FigureVariant } from '../../figures/manifest';
import { loadFigureComponent } from '../figureLoader';

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
  const figureId = params.figureId ?? '';
  const variantId = params.variantId;
  const [FigureComponent, setFigureComponent] = useState<React.ComponentType<any> | null>(null);
  const [zoom, setZoom] = useState<ZoomMode>({ kind: 'fit' });
  const [checker, setChecker] = useState(false);

  const fig = figures.find((f) => f.id === figureId);
  const variant: FigureVariant | undefined = useMemo(() => {
    if (!fig) return undefined;
    if (variantId) return fig.variants.find((v) => v.id === variantId) ?? fig.variants[0];
    return fig.variants[0];
  }, [fig, variantId]);

  useEffect(() => {
    if (!fig) return;
    setFigureComponent(null);
    loadFigureComponent(fig.moduleKey).then((Component) => setFigureComponent(() => Component), (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      setFigureComponent(() => () => (
        <div className="empty">
          <div className="emptyTitle">Failed to load figure module</div>
          <div className="emptyBody mono">{String(err?.message ?? err)}</div>
        </div>
      ));
    });
  }, [fig?.moduleKey]);

  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const surfaceSize = useElementSize(surfaceRef);

  if (!fig || !variant) {
    return (
      <div className="page">
        <div className="empty">
          <div className="emptyTitle">Figure not found</div>
          <div className="emptyBody">
            Go back to <Link to="/">home</Link>.
          </div>
        </div>
      </div>
    );
  }

  const size = resolveSize(variant.size ?? fig.size);
  const background = variant.background ?? 'white';

  const scale = useMemo(() => {
    if (zoom.kind === 'percent') return zoom.value / 100;
    const pad = 24;
    const w = Math.max(1, surfaceSize.width - pad * 2);
    const h = Math.max(1, surfaceSize.height - pad * 2);
    return Math.max(0.05, Math.min(8, Math.min(w / size.width, h / size.height)));
  }, [zoom, surfaceSize.width, surfaceSize.height, size.width, size.height]);

  const props = {
    width: size.width,
    height: size.height,
    background,
    ...(variant.props as any)
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
              onChange={(e) => navigate(`/figure/${encodeURIComponent(fig.id)}/${encodeURIComponent(e.target.value)}`)}
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

          <Link className="btn btnSmall" to={`/render/${encodeURIComponent(fig.id)}/${encodeURIComponent(variant.id)}`} target="_blank">
            Render route
          </Link>
        </div>
      </div>

      <div className={`previewSurface ${checker ? 'checker' : ''}`} ref={surfaceRef}>
        <div className="previewScale" style={{ transform: `scale(${scale})` }}>
          <div id="figure-root" style={{ width: size.width, height: size.height }}>
            {FigureComponent ? <FigureComponent {...props} /> : <div className="loading">Loading…</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
