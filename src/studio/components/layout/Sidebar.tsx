import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { FigureManifestItem, ProjectDefinition } from '../../../core/manifest';
import { useSidebarFocus } from '../../hooks/useSidebarFocus';
import { Button, Input, cn } from '../ui';

function initials(label: string): string {
  const words = label
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

type SidebarProps = {
  projects: ProjectDefinition[] | null;
  projectsError: string | null;
  activeProjectId: string | null;
  activeFigureId: string | null;
  activeProject: ProjectDefinition | null;
  filteredFigures: FigureManifestItem[];
  query: string;
  onQueryChange: (value: string) => void;
  miniMode: boolean;
  onMiniModeChange: (miniMode: boolean) => void;
  onHome: () => void;
};

export function Sidebar({
  projects,
  projectsError,
  activeProjectId,
  activeFigureId,
  activeProject,
  filteredFigures,
  query,
  onQueryChange,
  miniMode,
  onMiniModeChange,
  onHome
}: SidebarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { registerFocusSearch } = useSidebarFocus();

  useEffect(() => {
    registerFocusSearch(() => {
      if (!miniMode && searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select();
      }
    });
  }, [registerFocusSearch, miniMode]);

  const navItemBase =
    'block rounded-control border border-transparent px-2.5 py-2.5 no-underline hover:bg-studio-panel transition-colors duration-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio-blue/30';

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-studio-border bg-white transition-[width] duration-150 ease-out dark:bg-gray-900 dark:border-gray-700',
        miniMode ? 'w-[60px]' : 'w-[300px]'
      )}
    >
      <div className="border-b border-studio-border px-2.5 py-3">
        <div className={cn('flex items-center gap-2', miniMode ? 'justify-center' : 'justify-between')}>
          {!miniMode ? <div className="font-extrabold tracking-tight">Imagine Studio</div> : null}
          <div className="flex items-center gap-1.5">
            {!miniMode ? (
              <Button size="sm" onClick={onHome}>
                Home
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMiniModeChange(!miniMode)}
              aria-label={miniMode ? 'Expand sidebar' : 'Collapse sidebar'}
              title={miniMode ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {miniMode ? '»' : '«'}
            </Button>
          </div>
        </div>
      </div>

      <div className={cn('border-b border-gray-100', miniMode ? 'px-1.5 py-2' : 'px-2.5 py-3')}>
        {!miniMode ? <div className="px-1.5 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Projects</div> : null}
        <nav className={cn(miniMode ? 'space-y-1' : 'p-1.5')} aria-label="Projects">
          {projects?.map((project) => {
            const active = activeProjectId === project.id;
            if (miniMode) {
              return (
                <Link
                  key={project.id}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-control border text-xs font-bold no-underline',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio-blue/30',
                    active
                      ? 'border-cyan-200 bg-cyan-50 text-cyan-700'
                      : 'border-transparent text-studio-subtle hover:bg-studio-panel hover:text-studio-text'
                  )}
                  title={project.title}
                  to={`/project/${encodeURIComponent(project.id)}`}
                >
                  {initials(project.title)}
                </Link>
              );
            }
            return (
              <Link
                key={project.id}
                className={`${navItemBase} ${active ? 'bg-cyan-50 border-cyan-200' : ''}`}
                to={`/project/${encodeURIComponent(project.id)}`}
              >
                <div className="font-extrabold">{project.title}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-studio-subtle">
                  <span className="font-mono">{project.id}</span>
                  <span className="opacity-70">•</span>
                  <span>{project.figures.length} figure{project.figures.length === 1 ? '' : 's'}</span>
                </div>
              </Link>
            );
          })}
          {projectsError ? <div className="px-2.5 py-2 text-xs font-medium text-studio-red">{projectsError}</div> : null}
          {!projects && !projectsError ? <div className="px-2.5 py-2 text-xs text-studio-subtle">Loading…</div> : null}
        </nav>
      </div>

      {activeProject ? (
        <div className={cn('flex flex-1 flex-col', miniMode ? 'px-1.5 py-2' : 'px-2.5 py-3')}>
          {!miniMode ? <div className="px-1.5 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Figures</div> : null}
          {!miniMode ? (
            <Input ref={searchInputRef} uiSize="md" placeholder={`Search in ${activeProject.title}…`} value={query} onChange={(event) => onQueryChange(event.target.value)} />
          ) : null}
          <nav className={cn('flex-1 overflow-auto', miniMode ? 'mt-1 space-y-1' : 'p-1.5')} aria-label="Figures">
            {filteredFigures.map((figure) => {
              const active = activeFigureId === figure.id;
              if (miniMode) {
                return (
                  <Link
                    key={figure.id}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-control border text-xs font-bold no-underline',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio-blue/30',
                      active
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                        : 'border-transparent text-studio-subtle hover:bg-studio-panel hover:text-studio-text'
                    )}
                    title={figure.title}
                    to={`/project/${encodeURIComponent(activeProject.id)}/figure/${encodeURIComponent(figure.id)}`}
                  >
                    {initials(figure.title)}
                  </Link>
                );
              }
              return (
                <Link
                  key={figure.id}
                  className={`${navItemBase} ${active ? 'bg-indigo-50 border-indigo-200' : ''}`}
                  to={`/project/${encodeURIComponent(activeProject.id)}/figure/${encodeURIComponent(figure.id)}`}
                >
                  <div className="font-bold">{figure.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-studio-subtle">
                    <span className="font-mono">{figure.id}</span>
                    <span className="opacity-70">•</span>
                    <span>
                      {figure.variants.length} variant{figure.variants.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}

      {!miniMode ? (
        <div className="border-t border-studio-border px-3 py-2.5 text-[11px] text-studio-subtle">
          <div className="font-semibold uppercase tracking-wider text-gray-500">Keyboard Hints</div>
          <div className="mt-1">
            <div>Ctrl/Cmd+K: Search • Ctrl/Cmd+S: Save</div>
            <div>Ctrl/Cmd+Z: Undo • Ctrl/Cmd+Shift+Z: Redo</div>
            <div>Ctrl/Cmd+0: Fit • +/-: Zoom • Esc: Exit Edit</div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
