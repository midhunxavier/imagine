import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectDefinition } from '../../core/manifest';
import { loadAllProjects } from '../projectLoader';

export function ProjectsHome() {
  const [projects, setProjects] = useState<ProjectDefinition[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllProjects().then(setProjects, (err) => setError(String(err?.message ?? err)));
  }, []);

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Projects</div>
          <div className="pageSubtitle">
            Create a folder in <span className="mono">{'projects/<id>'}</span> to add a new project (restart dev server).
          </div>
        </div>
      </div>

      {error ? (
        <div className="empty">
          <div className="emptyTitle">Failed to load projects</div>
          <div className="emptyBody mono">{error}</div>
        </div>
      ) : null}

      <div className="cardGrid">
        {(projects ?? []).map((p) => (
          <Link key={p.id} to={`/project/${encodeURIComponent(p.id)}`} className="card projectCard">
            <div className="cardTitle">{p.title}</div>
            <div className="cardBody">
              <div className="cardMeta">
                <span className="mono">{p.id}</span>
                <span className="dot">•</span>
                <span>{p.figures.length} figures</span>
              </div>
              {p.description ? <div className="cardMeta">{p.description}</div> : null}
              {p.examples?.length ? (
                <div className="thumbRow" aria-label="Example previews">
                  {p.examples.slice(0, 3).map((ex) => (
                    <img
                      key={`${ex.figureId}/${ex.variantId}`}
                      className="thumb"
                      src={ex.src}
                      alt={ex.caption ?? `${ex.figureId}/${ex.variantId}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
        {!projects && !error ? <div className="loading">Loading…</div> : null}
      </div>
    </div>
  );
}
