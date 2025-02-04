// src/App.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout/MainLayout';
import LoginPage from './pages/Login/LoginPage';

function App() {
  const isLoggedIn = useSelector((state) => state.ui.isLoggedIn);

  return (
    <BrowserRouter>
      {isLoggedIn ? <MainLayout /> : <LoginPage />}
    </BrowserRouter>
  );
}

export default App;

