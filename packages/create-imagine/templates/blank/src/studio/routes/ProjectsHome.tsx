import { useEffect, useState } from 'react';
import type { ProjectDefinition } from '../../core/manifest';
import { CardLink } from '../components/ui';
import { loadAllProjects } from '../projectLoader';

export function ProjectsHome() {
  const [projects, setProjects] = useState<ProjectDefinition[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllProjects().then(setProjects, (err) => setError(String(err?.message ?? err)));
  }, []);

  return (
    <div className="flex flex-1 min-w-0 flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-studio-border bg-white px-4 py-4">
        <div>
          <div className="text-base font-extrabold">Projects</div>
          <div className="mt-1 text-sm text-studio-subtle">
            Create a folder in <span className="font-mono">{'projects/<id>'}</span> to add a new project (restart dev server).
          </div>
        </div>
      </div>

      {error ? (
        <div className="m-10 rounded-card border border-studio-border bg-white p-6">
          <div className="mb-1.5 font-extrabold">Failed to load projects</div>
          <div className="font-mono text-xs text-studio-subtle">{error}</div>
        </div>
      ) : null}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3 p-4">
        {(projects ?? []).map((p) => (
          <CardLink key={p.id} to={`/project/${encodeURIComponent(p.id)}`} hover className="flex flex-col gap-1">
            <div className="font-extrabold">{p.title}</div>
            <div className="text-[13px] text-gray-700">
              <div className="mt-0.5 flex items-center gap-2 text-xs text-studio-subtle">
                <span className="font-mono">{p.id}</span>
                <span className="opacity-70">•</span>
                <span>{p.figures.length} figures</span>
              </div>
              {p.description ? <div className="mt-1 text-xs text-studio-subtle">{p.description}</div> : null}
              {p.examples?.length ? (
                <div className="mt-2.5 flex gap-2" aria-label="Example previews">
                  {p.examples.slice(0, 3).map((ex) => (
                    <img
                      key={`${ex.figureId}/${ex.variantId}`}
                      className="h-12 w-[72px] rounded-control border border-studio-border bg-studio-panel object-cover"
                      src={ex.src}
                      alt={ex.caption ?? `${ex.figureId}/${ex.variantId}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </CardLink>
        ))}
        {!projects && !error ? <div className="p-4 text-sm text-studio-subtle">Loading…</div> : null}
      </div>
    </div>
  );
}
