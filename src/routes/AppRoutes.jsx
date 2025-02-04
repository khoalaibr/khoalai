// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EjemploPage } from '../pages/Ejemplo/EjemploPage';
import { TraderPage } from '../pages/Trader/TraderPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas de Atención */}
      <Route path="/atencion/trader" element={<TraderPage title="Trader" />} />
      <Route path="/atencion/dos" element={<TraderPage title="Opcion 2" />} />

      {/* Rutas de Informes */}
      <Route path="/informes/reporte1" element={<EjemploPage title="Reporte 1" />} />
      <Route path="/informes/reporte2" element={<EjemploPage title="Reporte 2" />} />

      {/* Rutas de Oficios */}
      <Route path="/oficios/judiciales" element={<EjemploPage title="Judiciales" />} />
      <Route path="/oficios/administrativos" element={<EjemploPage title="Administrativos" />} />
    </Routes>
  );
}

export default AppRoutes;
