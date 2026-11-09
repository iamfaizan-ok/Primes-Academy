import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { adminRouteElements } from './routes/AdminRoutes';
import { studentRouteElements } from './routes/StudentRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route opens Student Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Student Routes */}
        {studentRouteElements}

        {/* Admin Routes */}
        {adminRouteElements}

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
