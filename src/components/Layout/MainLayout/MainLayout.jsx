// src/components/Layout/MainLayout.jsx
import React from 'react';
import './MainLayout.css';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import AppRoutes from '../../../routes/AppRoutes';

function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__content">
        <Header />
        <main className="layout__main">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
