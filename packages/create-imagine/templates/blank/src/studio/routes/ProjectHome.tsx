import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ProjectDefinition } from '../../core/manifest';
import { resolveSize } from '../../framework/sizing';
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
      <div className="page">
        <div className="empty">
          <div className="emptyTitle">Failed to load project</div>
          <div className="emptyBody mono">{error}</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page">
        <div className="loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">{project.title}</div>
          <div className="pageSubtitle">
            <span className="mono">{project.id}</span>
            {project.description ? ` • ${project.description}` : ''}
          </div>
        </div>
      </div>

      {examples.length ? (
        <div className="section">
          <div className="sectionTitle">Gallery</div>
          <div className="galleryGrid">
            {examples.map((ex) => (
              <Link
                key={`${ex.figureId}/${ex.variantId}`}
                className="galleryItem"
                to={`/project/${encodeURIComponent(project.id)}/figure/${encodeURIComponent(ex.figureId)}/${encodeURIComponent(
                  ex.variantId
                )}`}
              >
                <img className="galleryImg" src={ex.src} alt={ex.caption ?? `${ex.figureId}/${ex.variantId}`} loading="lazy" />
                <div className="galleryCaption">{ex.caption ?? `${ex.figureId}/${ex.variantId}`}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="section">
        <div className="sectionTitle">Figures</div>
        <div className="cardGrid">
          {figures.map((f) => {
            const r = resolveSize(f.size);
            const mmText = r.mm && r.dpi ? ` (${r.mm.width}×${r.mm.height} mm @ ${r.dpi}dpi)` : '';
            return (
              <Link
                key={f.id}
                to={`/project/${encodeURIComponent(project.id)}/figure/${encodeURIComponent(f.id)}`}
                className="card"
              >
                <div className="cardTitle">{f.title}</div>
                <div className="cardBody">
                  <div className="cardMeta">
                    <span className="mono">{f.id}</span>
                  </div>
                  <div className="cardMeta">
                    {r.width}×{r.height} px{mmText}
                  </div>
                  <div className="cardMeta">
                    {f.variants.length} variant{f.variants.length === 1 ? '' : 's'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

