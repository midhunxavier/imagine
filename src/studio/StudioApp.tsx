import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import type { ProjectDefinition } from '../core/manifest';
import { Sidebar, readSidebarMini, writeSidebarMini } from './components/layout';
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
  const [miniMode, setMiniMode] = useState(() => readSidebarMini(false));
  const [projects, setProjects] = useState<ProjectDefinition[] | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    loadAllProjects().then(setProjects, (err) => setProjectsError(String(err?.message ?? err)));
  }, []);

  useEffect(() => {
    writeSidebarMini(miniMode);
  }, [miniMode]);

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
      <Sidebar
        projects={projects}
        projectsError={projectsError}
        activeProjectId={activeProjectId}
        activeFigureId={activeId}
        activeProject={activeProject}
        filteredFigures={filteredFigures}
        query={query}
        onQueryChange={setQuery}
        miniMode={miniMode}
        onMiniModeChange={setMiniMode}
        onHome={() => navigate('/')}
      />

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
