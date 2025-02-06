// Ubicación: src/components/Trader/TradesList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './TradesList.css'; // Importa el CSS de estilos para las cards

const TradesList = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/trade/list');
      let tradesData = response.data.trades;
      // Ordenar: primero activos (ascendente por símbolo), luego inactivos (ascendente)
      tradesData.sort((a, b) => {
        if (a.active === b.active) {
          return a.symbol.localeCompare(b.symbol);
        } else {
          return a.active ? -1 : 1;
        }
      });
      setTrades(tradesData);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Al montar el componente se carga el listado y se establece un refresco cada 30 segundos
  useEffect(() => {
    fetchTrades();
    const interval = setInterval(() => {
      fetchTrades();
    }, 30000); // cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="trades-list-container">
      <h3 className="heading-secondary">Listado de Negociaciones</h3>
      {loading && <p>Cargando negociaciones...</p>}
      {error && <p>Error: {error}</p>}
      <div className="trades-cards">
        {trades.map(trade => (
          <div key={trade.id} className="trade-card">
            <div className="trade-card-header">
              <h4>{trade.symbol}</h4>
              <span className={`trade-status ${trade.active ? 'active' : 'inactive'}`}>
                {trade.active ? 'Activo' : 'Cerrado'}
              </span>
            </div>
            <div className="trade-card-body">
              <p><strong>Precio compra:</strong> {trade.buy_price}</p>
              <p><strong>Precio actual:</strong> {trade.current_price}</p>
              <p><strong>Inicial:</strong> {trade.initial_amount}</p>
              <p><strong>Resultado:</strong> {trade.resulting_amount}</p>
              <p>
                <strong>Gain/Loss:</strong>{' '}
                <span className={`gain-loss ${trade.gain_loss >= 0 ? 'positive' : 'negative'}`}>
                  {Number(trade.gain_loss).toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradesList;
