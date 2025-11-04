import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './src/util/redux/store.ts';
import ImpactReportPage from './src/ImpactReportPage.tsx';
import LoginPage from './src/pages/LoginPage.tsx';
import AdminDashboardPage from './src/pages/AdminDashboardPage.tsx';
import ImpactReportCustomizationPage from './src/pages/ImpactReportCustomizationPage.tsx';
import ProtectedRoute from './src/components/ProtectedRoute.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/album-upload"
            element={
              <ProtectedRoute>
                <ImpactReportCustomizationPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<ImpactReportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);

