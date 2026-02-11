import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import type { ProjectDefinition } from '../core/manifest';
import { Button, Input } from './components/ui';
import { loadAllProjects } from './projectLoader';
import { ProjectsHome } from './routes/ProjectsHome';
import { ProjectHome } from './routes/ProjectHome';
import { FigureView } from './routes/FigureView';

function useActiveProjectId(): string | null {
  const match = useMatch('/project/:projectId/*');
  return match?.params.projectId ?? null;
}

function useActiveFigureId(): string | null {
  const match = useMatch('/project/:projectId/figure/:figureId/*');
  return match?.params.figureId ?? null;
}

export function StudioApp() {
  const navigate = useNavigate();
  const activeId = useActiveFigureId();
  const activeProjectId = useActiveProjectId();
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<ProjectDefinition[] | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const navItemBase =
    'block rounded-control border border-transparent px-2.5 py-2.5 no-underline hover:bg-studio-panel transition-colors duration-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio-blue/30';

  useEffect(() => {
    loadAllProjects().then(setProjects, (err) => setProjectsError(String(err?.message ?? err)));
  }, []);

  const activeProject = useMemo(() => {
    if (!projects || !activeProjectId) return null;
    return projects.find((p) => p.id === activeProjectId) ?? null;
  }, [projects, activeProjectId]);

  const filteredFigures = useMemo(() => {
    if (!activeProject) return [];
    const q = query.trim().toLowerCase();
    if (!q) return activeProject.figures;
    return activeProject.figures.filter((f) => f.id.toLowerCase().includes(q) || f.title.toLowerCase().includes(q));
  }, [activeProject, query]);

  return (
    <div className="flex h-dvh overflow-hidden bg-studio-bg font-sans text-studio-text antialiased">
      <aside className="flex w-[300px] shrink-0 flex-col border-r border-studio-border bg-white">
        <div className="border-b border-studio-border px-3.5 py-3">
          <div className="flex items-center justify-between gap-2.5">
            <div className="font-extrabold tracking-tight">Imagine Studio</div>
            <Button size="sm" onClick={() => navigate('/')}>
              Home
            </Button>
          </div>
        </div>

        <div className="border-b border-gray-100 px-2.5 py-3">
          <div className="px-1.5 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Projects</div>
          <nav className="p-1.5" aria-label="Projects">
            {projects?.map((p) => {
              const active = activeProjectId === p.id;
              return (
                <Link
                  key={p.id}
                  className={`${navItemBase} ${active ? 'bg-cyan-50 border-cyan-200' : ''}`}
                  to={`/project/${encodeURIComponent(p.id)}`}
                >
                  <div className="font-extrabold">{p.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-studio-subtle">
                    <span className="font-mono">{p.id}</span>
                    <span className="opacity-70">•</span>
                    <span>{p.figures.length} figure{p.figures.length === 1 ? '' : 's'}</span>
                  </div>
                </Link>
              );
            })}
            {projectsError ? <div className="px-2.5 py-2 text-xs font-medium text-studio-red">{projectsError}</div> : null}
            {!projects && !projectsError ? <div className="px-2.5 py-2 text-xs text-studio-subtle">Loading…</div> : null}
          </nav>
        </div>

        {activeProject ? (
          <div className="flex flex-1 flex-col px-2.5 py-3">
            <div className="px-1.5 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Figures</div>
            <Input
              uiSize="md"
              placeholder={`Search in ${activeProject.title}…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <nav className="flex-1 overflow-auto p-1.5" aria-label="Figures">
              {filteredFigures.map((f) => {
                const active = activeId === f.id;
                return (
                  <Link
                    key={f.id}
                    className={`${navItemBase} ${active ? 'bg-indigo-50 border-indigo-200' : ''}`}
                    to={`/project/${encodeURIComponent(activeProject.id)}/figure/${encodeURIComponent(f.id)}`}
                  >
                    <div className="font-bold">{f.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-studio-subtle">
                      <span className="font-mono">{f.id}</span>
                      <span className="opacity-70">•</span>
                      <span>
                        {f.variants.length} variant{f.variants.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </aside>

      <main className="flex flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<ProjectsHome />} />
          <Route path="/project/:projectId" element={<ProjectHome />} />
          <Route path="/project/:projectId/figure/:figureId/:variantId?" element={<FigureView />} />
          <Route
            path="*"
            element={
              <div className="m-10 rounded-card border border-studio-border bg-white p-6">
                <div className="mb-1.5 font-extrabold">Not found</div>
                <div className="text-sm text-studio-subtle">
                  Go back to{' '}
                  <Link className="font-medium text-studio-blue underline underline-offset-4 hover:opacity-90" to="/">
                    home
                  </Link>
                  .
                </div>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
