import { Link } from 'react-router-dom';
import { figures } from '../../figures/manifest';
import { resolveSize } from '../../framework/sizing';

export function StudioHome() {
  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Figures</div>
          <div className="pageSubtitle">Edit React/TS files and see live updates. Export via `npm run render`.</div>
        </div>
      </div>

      <div className="cardGrid">
        {figures.map((f) => {
          const r = resolveSize(f.size);
          const mmText = r.mm && r.dpi ? ` (${r.mm.width}×${r.mm.height} mm @ ${r.dpi}dpi)` : '';
          return (
            <Link key={f.id} to={`/figure/${encodeURIComponent(f.id)}`} className="card">
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
  );
}

