import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ImpactReportPage from './src/ImpactReportPage.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ImpactReportPage />
    </BrowserRouter>
  </React.StrictMode>,
);

