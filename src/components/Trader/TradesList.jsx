// Ubicación: src/components/Trader/TradesList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const TradesList = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrades = async (active = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = active === null ? '/trade/list' : `/trade/list?active=${active}`;
      const response = await api.get(url);
      setTrades(response.data.trades);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades(); // Cargar todas las negociaciones
  }, []);

  return (
    <div>
      <h3>Listado de Negociaciones</h3>
      {loading && <p>Cargando negociaciones...</p>}
      {error && <p>Error: {error}</p>}
      {trades.map(trade => (
        <div key={trade.id}>
          <p>
            <strong>{trade.symbol}</strong> | {trade.active ? 'Activo' : 'Cerrado'} | 
            Precio compra: {trade.buy_price} | Precio actual: {trade.current_price} | 
            Inicial: {trade.initial_amount} | Resultado: {trade.resulting_amount} | Gain/Loss: {trade.gain_loss}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TradesList;
