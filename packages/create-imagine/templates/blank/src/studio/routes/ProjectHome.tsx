import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ProjectDefinition } from '../../core/manifest';
import { resolveSize } from '../../framework/sizing';
import { Card, CardLink } from '../components/ui';
import { loadProject } from '../projectLoader';

export function ProjectHome() {
  const params = useParams();
  const projectId = params.projectId ?? '';
  const [project, setProject] = useState<ProjectDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    setProject(null);
    setError(null);
    loadProject(projectId).then(setProject, (err) => setError(String(err?.message ?? err)));
  }, [projectId]);

  const examples = project?.examples ?? [];

  const figures = useMemo(() => project?.figures ?? [], [project]);

  if (error) {
    return (
      <div className="flex flex-1 min-w-0 flex-col">
        <Card className="m-10" padding="lg">
          <div className="mb-1.5 font-extrabold">Failed to load project</div>
          <div className="font-mono text-xs text-studio-subtle">{error}</div>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-1 min-w-0 flex-col">
        <div className="p-4 text-sm text-studio-subtle">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-w-0 flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-studio-border bg-white px-4 py-4">
        <div>
          <div className="text-base font-extrabold">{project.title}</div>
          <div className="mt-1 text-sm text-studio-subtle">
            <span className="font-mono">{project.id}</span>
            {project.description ? ` • ${project.description}` : ''}
          </div>
        </div>
      </div>

      {examples.length ? (
        <div className="p-4">
          <div className="mb-3 text-[13px] font-extrabold text-gray-700">Gallery</div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
            {examples.map((ex) => (
              <CardLink
                key={`${ex.figureId}/${ex.variantId}`}
                padding="none"
                hover
                className="overflow-hidden"
                to={`/project/${encodeURIComponent(project.id)}/figure/${encodeURIComponent(ex.figureId)}/${encodeURIComponent(
                  ex.variantId
                )}`}
              >
                <img
                  className="block h-40 w-full bg-studio-panel object-cover"
                  src={ex.src}
                  alt={ex.caption ?? `${ex.figureId}/${ex.variantId}`}
                  loading="lazy"
                />
                <div className="px-3 py-2 text-[13px] font-bold text-gray-700">
                  {ex.caption ?? `${ex.figureId}/${ex.variantId}`}
                </div>
              </CardLink>
            ))}
          </div>
        </div>
      ) : null}

      <div className="p-4">
        <div className="mb-3 text-[13px] font-extrabold text-gray-700">Figures</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
          {figures.map((f) => {
            const r = resolveSize(f.size);
            const mmText = r.mm && r.dpi ? ` (${r.mm.width}×${r.mm.height} mm @ ${r.dpi}dpi)` : '';
            return (
              <CardLink
                key={f.id}
                to={`/project/${encodeURIComponent(project.id)}/figure/${encodeURIComponent(f.id)}`}
                hover
              >
                <div className="font-extrabold">{f.title}</div>
                <div className="mt-1 text-[13px] text-gray-700">
                  <div className="mt-0.5 text-xs text-studio-subtle">
                    <span className="font-mono">{f.id}</span>
                  </div>
                  <div className="mt-1 text-xs text-studio-subtle">
                    {r.width}×{r.height} px{mmText}
                  </div>
                  <div className="mt-1 text-xs text-studio-subtle">
                    {f.variants.length} variant{f.variants.length === 1 ? '' : 's'}
                  </div>
                </div>
              </CardLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
