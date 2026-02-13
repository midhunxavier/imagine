import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { inferControlsFromProps } from '../../core/controls';
import type { FigureControl, FigureVariant, ProjectDefinition } from '../../core/manifest';
import { resolveSize } from '../../framework/sizing';
import { ControlsPanel, Header, PreviewCanvas } from '../components/layout';
import { EditableOverlay, EditableProvider } from '../editing';
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
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

  const controls = useMemo<FigureControl[]>(() => {
    const explicit = [...(fig.controls ?? []), ...(variant.controls ?? [])];
    if (explicit.length) return explicit;
    return inferControlsFromProps(variant.props ?? {});
  }, [fig.controls, variant.controls, variant.props]);

  const textControlMetaByKey = useMemo(() => {
    const map: Record<string, { multiline?: boolean }> = {};
    for (const control of controls) {
      if (control.kind !== 'text') continue;
      map[control.key] = { multiline: Boolean(control.multiline) };
    }
    return map;
  }, [controls]);

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
  const sizeLabel = `${size.width}×${size.height} px${mmText ? ` • ${mmText}` : ''}`;
  const zoomValue = zoom.kind === 'percent' ? zoom.value : Math.round(scale * 100);
  const renderRouteTo = `/render/${encodeURIComponent(projectId)}/${encodeURIComponent(fig.id)}/${encodeURIComponent(variant.id)}`;
  const figureRootRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-1 min-w-0 flex-col">
      <Header
        projectId={projectId}
        figureId={fig.id}
        figureTitle={fig.title}
        sizeLabel={sizeLabel}
        variants={fig.variants.map((v) => ({ id: v.id, title: v.title }))}
        activeVariantId={variant.id}
        onVariantChange={(nextVariantId) =>
          navigate(`/project/${encodeURIComponent(projectId)}/figure/${encodeURIComponent(fig.id)}/${encodeURIComponent(nextVariantId)}`)
        }
        zoomValue={zoomValue}
        onZoomInput={(value) => setZoom({ kind: 'percent', value: coerceZoomValue(value) })}
        onFit={() => setZoom({ kind: 'fit' })}
        onZoom100={() => setZoom({ kind: 'percent', value: 100 })}
        onZoom200={() => setZoom({ kind: 'percent', value: 200 })}
        checker={checker}
        onCheckerChange={setChecker}
        isEditMode={isEditMode}
        onEditModeChange={setIsEditMode}
        renderRouteTo={renderRouteTo}
        controlsCollapsed={controlsCollapsed}
        onToggleControlsCollapse={() => setControlsCollapsed((current) => !current)}
      />

      <div className="flex flex-1 min-h-0">
        <EditableProvider
          isEditMode={isEditMode}
          values={effectiveVariantProps as Record<string, unknown>}
          onSetValue={(key, value) => propsState.setVariantOverride(fig.id, variant.id, key, value)}
        >
          <PreviewCanvas
            surfaceRef={surfaceRef}
            figureRootRef={figureRootRef}
            scale={scale}
            checker={checker}
            size={size}
            figureNode={FigureComponent ? <FigureComponent {...props} /> : <div className="p-4 text-sm text-studio-subtle">Loading…</div>}
            overlayNode={<EditableOverlay rootRef={figureRootRef} scale={scale} textControlMetaByKey={textControlMetaByKey} />}
          />
        </EditableProvider>

        <ControlsPanel
          controls={controls}
          effectiveVariantProps={effectiveVariantProps as Record<string, unknown>}
          variantOverrides={variantOverrides}
          onControlChange={(key, value) => propsState.setVariantOverride(fig.id, variant.id, key, value)}
          onReset={() => propsState.resetVariantOverrides(fig.id, variant.id)}
          onCopyJson={async () => {
            const json = JSON.stringify(variantOverrides, null, 2);
            try {
              await navigator.clipboard.writeText(json);
            } catch {
              window.prompt('Copy overrides JSON:', json);
            }
          }}
          saveStatus={propsState.saveStatus}
          saveError={propsState.saveError}
          readOnly={propsState.readOnly}
          loadError={propsState.loadError}
          collapsed={controlsCollapsed}
          onToggleCollapsed={() => setControlsCollapsed((current) => !current)}
        />
      </div>
    </div>
  );
}
