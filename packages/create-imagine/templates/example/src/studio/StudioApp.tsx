import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import type { ProjectDefinition } from '../core/manifest';
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
    <div className="studio">
      <aside className="sidebar">
        <div className="sidebarHeader">
          <div className="sidebarTitleRow">
            <div className="sidebarTitle">Imagine Studio</div>
            <button className="btn btnSmall" onClick={() => navigate('/')}>
              Home
            </button>
          </div>
        </div>

        <div className="sidebarSection">
          <div className="sidebarSectionTitle">Projects</div>
          <nav className="projectList" aria-label="Projects">
            {projects?.map((p) => {
              const active = activeProjectId === p.id;
              return (
                <Link key={p.id} className={`projectItem ${active ? 'active' : ''}`} to={`/project/${encodeURIComponent(p.id)}`}>
                  <div className="projectItemTitle">{p.title}</div>
                  <div className="projectItemMeta">
                    <span className="mono">{p.id}</span>
                    <span className="dot">•</span>
                    <span>{p.figures.length} figure{p.figures.length === 1 ? '' : 's'}</span>
                  </div>
                </Link>
              );
            })}
            {projectsError ? <div className="sidebarError">{projectsError}</div> : null}
            {!projects && !projectsError ? <div className="sidebarHint">Loading…</div> : null}
          </nav>
        </div>

        {activeProject ? (
          <div className="sidebarSection">
            <div className="sidebarSectionTitle">Figures</div>
            <input
              className="search"
              placeholder={`Search in ${activeProject.title}…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <nav className="figureList" aria-label="Figures">
              {filteredFigures.map((f) => {
                const active = activeId === f.id;
                return (
                  <Link
                    key={f.id}
                    className={`figureItem ${active ? 'active' : ''}`}
                    to={`/project/${encodeURIComponent(activeProject.id)}/figure/${encodeURIComponent(f.id)}`}
                  >
                    <div className="figureItemTitle">{f.title}</div>
                    <div className="figureItemMeta">
                      <span className="mono">{f.id}</span>
                      <span className="dot">•</span>
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

      <main className="main">
        <Routes>
          <Route path="/" element={<ProjectsHome />} />
          <Route path="/project/:projectId" element={<ProjectHome />} />
          <Route path="/project/:projectId/figure/:figureId/:variantId?" element={<FigureView />} />
          <Route
            path="*"
            element={
              <div className="empty">
                <div className="emptyTitle">Not found</div>
                <div className="emptyBody">
                  Go back to <Link to="/">home</Link>.
                </div>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
