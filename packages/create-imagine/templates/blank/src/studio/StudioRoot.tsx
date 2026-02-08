import { HashRouter, Route, Routes } from 'react-router-dom';
import { RenderView } from './routes/RenderView';
import { StudioApp } from './StudioApp';

export function StudioRoot() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/render/:projectId/:figureId/:variantId?" element={<RenderView />} />
        <Route path="/*" element={<StudioApp />} />
      </Routes>
    </HashRouter>
  );
}
