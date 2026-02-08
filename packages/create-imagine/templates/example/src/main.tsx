import React from 'react';
import ReactDOM from 'react-dom/client';
import { StudioRoot } from './studio/StudioRoot';
import './studio/studio.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StudioRoot />
  </React.StrictMode>
);

