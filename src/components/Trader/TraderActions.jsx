// Ubicación: src/components/Trader/TraderActions.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConsolidatedActions } from '../../store/traderSlice';
import { CSVLink } from 'react-csv';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import api from '../../services/api';
import './TraderActions.css';

const TraderActions = () => {
  const dispatch = useDispatch();
  const { consolidated, flattenedData, loading, error } = useSelector(state => state.trader);

  // Estado para resultados de negociaciones cerradas
  const [closedStats, setClosedStats] = useState(null);

  const csvHeaders = [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Strategy', key: 'strategy' },
    { label: 'Action', key: 'action' },
    { label: 'Current Price', key: 'current_price' },
  ];

  const handleConsolidateActions = () => {
    dispatch(fetchConsolidatedActions());
  };

  const handleGetClosedResults = async () => {
    try {
      const resp = await api.get('/trade/closed-results');
      setClosedStats(resp.data);
    } catch (err) {
      console.error('Error obteniendo resultados cerrados:', err.response?.data || err.message);
    }
  };

  // PROCESAMIENTO DE NEGOCIACIONES
  const processTrades = async (consolidatedData) => {
    try {
      const response = await api.get('/trade/list?active=true');
      const activeTrades = response.data.trades;

      // Mapeamos por símbolo para acceder rápidamente
      const activeTradeMap = {};
      activeTrades.forEach(trade => {
        activeTradeMap[trade.symbol] = trade;
      });

      // Recorremos cada símbolo consolidado
      for (const symbol in consolidatedData) {
        const { actions, current_price } = consolidatedData[symbol];
        const buyCount = Object.values(actions).filter(a => a === 'Buy').length;
        const sellCount = Object.values(actions).filter(a => a === 'Sell').length;
        const diff = buyCount - sellCount;

        const activeTrade = activeTradeMap[symbol];

        // Si diff >= 3 => Abrir o actualizar (mantener activa)
        if (diff >= 3) {
          if (activeTrade) {
            // Actualizar solo si cambia el precio
            if (parseFloat(activeTrade.current_price) !== parseFloat(current_price)) {
              await api.put('/trade/update', {
                id: activeTrade.id,
                current_price,
                active: true
              });
              console.log(`Negociación actualizada para ${symbol}`);
            }
          } else {
            // Crear nueva negociación
            await api.post('/trade/open', {
              symbol,
              buy_price: current_price,
              initial_amount: 1000
            });
            console.log(`Negociación abierta para ${symbol}`);
          }
        } else {
          // diff < 3 => Si hay negociación activa, cerrarla solo si hay ganancia (gain_loss >= 0)
          if (activeTrade) {
            // Verificar la ganancia actual
            const gainLoss = parseFloat(activeTrade.gain_loss); // puede ser 0
            if (gainLoss >= 0) {
              await api.put('/trade/update', {
                id: activeTrade.id,
                current_price,
                active: false
              });
              console.log(`Negociación cerrada con ganancia para ${symbol}`);
            } else {
              console.log(`Negociación de ${symbol} se mantiene abierta (pérdida actual)`);
            }
          }
        }
      }

      // Al terminar el proceso, lanzamos un evento para que TradesList se refresque de inmediato
      window.dispatchEvent(new Event('TRADES_UPDATED'));

    } catch (error) {
      console.error("Error procesando negociaciones:", error.response?.data || error.message);
    }
  };

  // Dispara el procesamiento cuando finaliza la consolidación
  useEffect(() => {
    if (!loading && Object.keys(consolidated).length > 0) {
      processTrades(consolidated);
    }
  }, [loading, consolidated]);

  return (
    <div>
      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={handleConsolidateActions}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Consolidar Acciones (Buy/Sell)'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleGetClosedResults}
          disabled={loading}
        >
          Ver Negociaciones Cerradas
        </button>
      </div>

      {/* Card con resultados de negociaciones cerradas */}
      {closedStats && (
        <div className="closed-results-card">
          {closedStats.total_negociaciones === 0 ? (
            <p>{closedStats.message}</p>
          ) : (
            <>
              <div className="closed-results-header">Resumen de Negociaciones Cerradas</div>
              <div className="closed-results-stats">
                <p><strong>Negociaciones cerradas:</strong> {closedStats.total_negociaciones}</p>
                <p><strong>Ganancia/Pérdida total:</strong> {closedStats.ganancia_total.toFixed(2)}</p>
                <p><strong>Ganancia/Pérdida media:</strong> {closedStats.ganancia_media.toFixed(2)}</p>
                <p><strong>Porcentaje total:</strong> {closedStats.porcentaje_total.toFixed(2)}%</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {flattenedData.length > 0 && !loading && (
        <div className="mb-3 d-flex gap-2">
          <CSVLink
            headers={csvHeaders}
            data={flattenedData}
            filename={`consolidated_actions_${new Date().toISOString()}.csv`}
            className="btn btn-secondary"
          >
            CSV
          </CSVLink>
          <button 
            onClick={() => exportToExcel(flattenedData, 'consolidated_actions')} 
            className="btn btn-success"
          >
            Excel
          </button>
          <button 
            onClick={() => exportToPDF(flattenedData, 'consolidated_actions')} 
            className="btn btn-danger"
          >
            PDF
          </button>
        </div>
      )}

      {/* Listado de consolidaciones */}
      {Object.keys(consolidated).length > 0 && !loading && (
        <div className="consolidated-container">
          {Object.keys(consolidated).sort().map((sym, idx) => {
            const { actions, current_price } = consolidated[sym];
            return (
              <div key={idx} className="consolidated-card">
                <div className="consolidated-header">
                  {sym} (Precio actual: {current_price})
                </div>
                <ul className="consolidated-list">
                  {Object.keys(actions).map((st) => (
                    <li key={st} className="consolidated-item">
                      <span>{st}:</span>
                      <span
                        className={`consolidated-action ${actions[st] === 'Buy' ? 'buy' : 'sell'}`}
                      >
                        {actions[st]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TraderActions;
