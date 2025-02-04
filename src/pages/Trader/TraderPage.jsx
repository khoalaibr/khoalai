// Ubicación: src/pages/Ejemplo/EjemploPage.jsx
import React from 'react';
import './../Page.css';
import TraderActions from '../../components/Trader/TraderActions';
import TradesList from '../../components/Trader/TradesList';

export const TraderPage = () => {
  return (
    <main className="main-container">
      <section className="left-column">
        <h1 className="heading-primary">Negociaciones</h1>
        <TradesList />
      </section>
      <section className="right-column">
        <TraderActions />
      </section>
    </main>
  );
};

export default TraderPage;
