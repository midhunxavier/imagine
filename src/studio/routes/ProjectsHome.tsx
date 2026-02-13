import { useEffect, useState } from 'react';
import type { ProjectDefinition } from '../../core/manifest';
import { CardLink, Skeleton } from '../components/ui';
import { loadAllProjects } from '../projectLoader';

function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-studio-border bg-white p-4">
      <Skeleton width="70%" height={20} />
      <Skeleton width="40%" height={14} />
      <div className="mt-2 flex gap-2">
        <Skeleton width={72} height={48} />
        <Skeleton width={72} height={48} />
        <Skeleton width={72} height={48} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-studio-panel p-4 text-2xl">
        📁
      </div>
      <div className="text-lg font-extrabold text-studio-text">No projects yet</div>
      <div className="mt-2 max-w-sm text-sm text-studio-subtle">
        Create a folder in <span className="font-mono">projects/&lt;id&gt;</span> to add a new project.
        Restart the dev server to load it.
      </div>
    </div>
  );
}

export function ProjectsHome() {
  const [projects, setProjects] = useState<ProjectDefinition[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllProjects().then(setProjects, (err) => setError(String(err?.message ?? err)));
  }, []);

  const totalFigures = projects?.reduce((sum, p) => sum + p.figures.length, 0) ?? 0;

  return (
    <div className="flex flex-1 min-w-0 flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-studio-border bg-white px-6 py-5">
        <div>
          <div className="text-xl font-extrabold">Projects</div>
          <div className="mt-1.5 flex items-center gap-4 text-sm text-studio-subtle">
            {projects ? (
              <>
                <span className="flex items-center gap-1.5">
                  <span>📁</span>
                  {projects.length} project{projects.length === 1 ? '' : 's'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span>🖼️</span>
                  {totalFigures} figure{totalFigures === 1 ? '' : 's'}
                </span>
              </>
            ) : (
              <span>Loading projects…</span>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="m-10 rounded-card border border-studio-border bg-white p-6">
          <div className="mb-1.5 font-extrabold">Failed to load projects</div>
          <div className="font-mono text-xs text-studio-subtle">{error}</div>
        </div>
      ) : null}

      {!projects && !error ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {projects && projects.length === 0 && !error ? (
        <EmptyState />
      ) : null}

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 p-6">
          {projects.map((p) => (
            <CardLink
              key={p.id}
              to={`/project/${encodeURIComponent(p.id)}`}
              hover
              className="group flex flex-col overflow-hidden"
            >
              {/* Preview Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-studio-panel">
                {p.examples && p.examples.length > 0 ? (
                  <>
                    <img
                      src={p.examples[0].src}
                      alt={p.examples[0].caption ?? `${p.examples[0].figureId}/${p.examples[0].variantId}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">
                    🖼️
                  </div>
                )}

                {/* Figure Count Badge */}
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-studio-text shadow-sm backdrop-blur-sm">
                  <span>📊</span>
                  {p.figures.length}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1 p-4">
                <div className="font-extrabold text-studio-text">{p.title}</div>
                <div className="flex items-center gap-2 text-xs text-studio-subtle">
                  <span className="font-mono">{p.id}</span>
                </div>
                {p.description ? (
                  <div className="mt-1 line-clamp-2 text-xs text-studio-subtle">{p.description}</div>
                ) : null}
                
                {/* Additional Previews */}
                {p.examples && p.examples.length > 1 ? (
                  <div className="mt-3 flex gap-1.5">
                    {p.examples.slice(1, 4).map((ex) => (
                      <img
                        key={`${ex.figureId}/${ex.variantId}`}
                        className="h-10 w-14 rounded-sm border border-studio-border/50 bg-studio-panel object-cover"
                        src={ex.src}
                        alt={ex.caption ?? `${ex.figureId}/${ex.variantId}`}
                        loading="lazy"
                      />
                    ))}
                    {p.examples.length > 4 ? (
                      <div className="flex h-10 w-14 items-center justify-center rounded-sm border border-studio-border/50 bg-studio-panel text-xs text-studio-subtle">
                        +{p.examples.length - 4}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </CardLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}
