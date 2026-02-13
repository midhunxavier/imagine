import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ProjectDefinition } from '../../core/manifest';
import { resolveSize } from '../../framework/sizing';
import { Card, CardLink, Skeleton } from '../components/ui';
import { loadProject } from '../projectLoader';

type SortBy = 'name' | 'variants';
type ViewMode = 'grid' | 'list';

function FigureCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-card border border-studio-border bg-white p-3">
      <Skeleton width="100%" height={120} />
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={12} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-studio-panel p-4 text-2xl">🎨</div>
      <div className="text-lg font-extrabold text-studio-text">No figures yet</div>
      <div className="mt-2 max-w-sm text-sm text-studio-subtle">
        Add figure components to your project to see them here.
      </div>
    </div>
  );
}

export function ProjectHome() {
  const params = useParams();
  const projectId = params.projectId ?? '';
  const [project, setProject] = useState<ProjectDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    if (!projectId) return;
    setProject(null);
    setError(null);
    loadProject(projectId).then(setProject, (err) => setError(String(err?.message ?? err)));
  }, [projectId]);

  const examples = project?.examples ?? [];

  const figures = useMemo(() => project?.figures ?? [], [project]);

  const filteredAndSortedFigures = useMemo(() => {
    let result = [...figures];

    // Filter
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      result = result.filter(
        (f) => f.id.toLowerCase().includes(q) || f.title.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'variants') {
        return b.variants.length - a.variants.length;
      }
      return 0;
    });

    return result;
  }, [figures, filterQuery, sortBy]);

  const totalVariants = figures.reduce((sum, f) => sum + f.variants.length, 0);

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
        <div className="animate-pulse border-b border-studio-border bg-white px-6 py-5">
          <Skeleton width={200} height={24} />
          <Skeleton width={300} height={16} className="mt-2" />
        </div>
        <div className="columns-1 gap-4 p-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="mb-4 break-inside-avoid">
              <FigureCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-w-0 flex-col">
      {/* Header */}
      <div className="border-b border-studio-border bg-white px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-extrabold">{project.title}</div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-studio-subtle">
              <span className="font-mono">{project.id}</span>
              {project.description ? <span>• {project.description}</span> : null}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-studio-subtle">
            <span>🖼️</span>
            {figures.length} figure{figures.length === 1 ? '' : 's'}
          </span>
          <span className="flex items-center gap-1.5 text-studio-subtle">
            <span>🔀</span>
            {totalVariants} variant{totalVariants === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Gallery Section */}
      {examples.length ? (
        <div className="border-b border-studio-border bg-gray-50/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-extrabold text-gray-700">Featured Examples</div>
            <div className="text-xs text-studio-subtle">{examples.length} example{examples.length === 1 ? '' : 's'}</div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {examples.map((ex) => (
              <CardLink
                key={`${ex.figureId}/${ex.variantId}`}
                padding="none"
                hover
                className="group overflow-hidden"
                to={`/project/${encodeURIComponent(project.id)}/figure/${encodeURIComponent(ex.figureId)}/${encodeURIComponent(
                  ex.variantId
                )}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-studio-panel">
                  <img
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={ex.src}
                    alt={ex.caption ?? `${ex.figureId}/${ex.variantId}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="text-sm font-bold">{ex.caption ?? `${ex.figureId}/${ex.variantId}`}</div>
                  </div>
                </div>
              </CardLink>
            ))}
          </div>
        </div>
      ) : null}

      {/* Figures Section */}
      <div className="flex flex-1 flex-col p-6">
        {/* Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-extrabold text-gray-700">
            Figures
            <span className="ml-2 text-xs font-normal text-studio-subtle">
              {filteredAndSortedFigures.length} of {figures.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter figures..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="h-8 w-40 rounded-control border border-studio-border bg-white px-3 text-sm placeholder:text-studio-subtle/60 focus:border-studio-blue focus:outline-none focus:ring-2 focus:ring-studio-blue/20 sm:w-56"
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-studio-subtle hover:text-studio-text"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-8 rounded-control border border-studio-border bg-white px-2 text-sm focus:border-studio-blue focus:outline-none focus:ring-2 focus:ring-studio-blue/20"
            >
              <option value="name">Sort by Name</option>
              <option value="variants">Sort by Variants</option>
            </select>

            {/* View Mode */}
            <div className="flex rounded-control border border-studio-border bg-white p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded px-2 py-1 text-sm transition-colors ${
                  viewMode === 'grid' ? 'bg-studio-panel font-medium' : 'hover:bg-studio-panel/50'
                }`}
                title="Grid view"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded px-2 py-1 text-sm transition-colors ${
                  viewMode === 'list' ? 'bg-studio-panel font-medium' : 'hover:bg-studio-panel/50'
                }`}
                title="List view"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Figures Grid/Masonry */}
        {filteredAndSortedFigures.length === 0 ? (
          figures.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-2xl">🔍</div>
              <div className="mt-2 text-sm text-studio-subtle">No figures match your filter</div>
              <button
                onClick={() => setFilterQuery('')}
                className="mt-2 text-sm font-medium text-studio-blue hover:underline"
              >
                Clear filter
              </button>
            </div>
          )
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4'
                : 'flex flex-col gap-3'
            }
          >
            {filteredAndSortedFigures.map((f) => {
              const r = resolveSize(f.size);
              const mmText = r.mm && r.dpi ? ` (${r.mm.width}×${r.mm.height} mm @ ${r.dpi}dpi)` : '';

              if (viewMode === 'list') {
                return (
                  <CardLink
                    key={f.id}
                    to={`/project/${encodeURIComponent(project.id)}/figure/${encodeURIComponent(f.id)}`}
                    hover
                    className="group flex items-center gap-4 p-3"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-studio-panel text-lg">
                      🎨
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-extrabold">{f.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-studio-subtle">
                        <span className="font-mono">{f.id}</span>
                        <span>•</span>
                        <span>
                          {r.width}×{r.height} px{mmText}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-xs text-studio-subtle">
                      {f.variants.length} variant{f.variants.length === 1 ? '' : 's'}
                    </div>
                  </CardLink>
                );
              }

              // Grid/Masonry view
              return (
                <CardLink
                  key={f.id}
                  to={`/project/${encodeURIComponent(project.id)}/figure/${encodeURIComponent(f.id)}`}
                  hover
                  className="group break-inside-avoid"
                >
                  {/* Preview placeholder - sized by aspect ratio */}
                  <div
                    className="relative overflow-hidden rounded-t-card bg-studio-panel"
                    style={{
                      aspectRatio: `${r.width} / ${r.height}`,
                      maxHeight: '200px'
                    }}
                  >
                    <div className="flex h-full w-full items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110">
                      🎨
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </div>

                  <div className="p-3">
                    <div className="font-extrabold">{f.title}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-studio-subtle">
                      <span className="font-mono">{f.id}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-studio-panel px-2 py-0.5 text-studio-subtle">
                        {r.width}×{r.height} px
                      </span>
                      {mmText ? (
                        <span className="rounded-full bg-studio-panel px-2 py-0.5 text-studio-subtle">
                          {r.mm?.width}×{r.mm?.height} mm
                        </span>
                      ) : null}
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700">
                        {f.variants.length} variant{f.variants.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </CardLink>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
