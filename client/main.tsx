import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ImpactReportPage from './src/ImpactReportPage.tsx';
import AdminUploadPage from './src/AdminUploadPage.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ImpactReportPage />} />
        <Route path="/admin" element={<AdminUploadPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

