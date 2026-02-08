import { useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { figures } from '../figures/manifest';
import { StudioHome } from './routes/StudioHome';
import { FigureView } from './routes/FigureView';

function useActiveFigureId(): string | null {
  const location = useLocation();
  const match = location.pathname.match(/^\/figure\/([^/]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function StudioApp() {
  const navigate = useNavigate();
  const activeId = useActiveFigureId();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return figures;
    return figures.filter((f) => f.id.toLowerCase().includes(q) || f.title.toLowerCase().includes(q));
  }, [query]);

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
          <input
            className="search"
            placeholder="Search figures…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <nav className="figureList" aria-label="Figures">
          {filtered.map((f) => {
            const active = activeId === f.id;
            return (
              <Link key={f.id} className={`figureItem ${active ? 'active' : ''}`} to={`/figure/${encodeURIComponent(f.id)}`}>
                <div className="figureItemTitle">{f.title}</div>
                <div className="figureItemMeta">
                  <span className="mono">{f.id}</span>
                  <span className="dot">•</span>
                  <span>{f.variants.length} variant{f.variants.length === 1 ? '' : 's'}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="main">
        <Routes>
          <Route path="/" element={<StudioHome />} />
          <Route path="/figure/:figureId/:variantId?" element={<FigureView />} />
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

