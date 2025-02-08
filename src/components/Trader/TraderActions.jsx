// Ubicación: src/components/Trader/TraderActions.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConsolidatedActions } from '../../store/traderSlice';
import { CSVLink } from 'react-csv';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import api from '../../services/api';

import './TraderActions.css'; // Importa los estilos

const TraderActions = () => {
  const dispatch = useDispatch();
  const { consolidated, flattenedData, loading, error } = useSelector(state => state.trader);

  // Estado para resultados de negociaciones cerradas
  const [closedStats, setClosedStats] = useState(null);

  // Encabezados para exportar CSV
  const csvHeaders = [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Strategy', key: 'strategy' },
    { label: 'Action', key: 'action' },
    { label: 'Current Price', key: 'current_price' },
  ];

  // Botón para consolidar acciones
  const handleConsolidateActions = () => {
    dispatch(fetchConsolidatedActions());
  };

  // Botón para obtener resultados de negociaciones cerradas
  const handleGetClosedResults = async () => {
    try {
      const resp = await api.get('/trade/closed-results');
      setClosedStats(resp.data);
    } catch (err) {
      console.error('Error obteniendo resultados cerrados:', err.response?.data || err.message);
    }
  };

  // Procesamiento para apertura/actualización/cierre de negociaciones
  const processTrades = async (consolidatedData) => {
    try {
      // Obtener negociaciones activas
      const response = await api.get('/trade/list?active=true');
      const activeTrades = response.data.trades;
      const activeTradeMap = {};
      activeTrades.forEach(trade => {
        activeTradeMap[trade.symbol] = trade;
      });

      // Recorrer cada símbolo consolidado
      for (const symbol in consolidatedData) {
        const { actions, current_price } = consolidatedData[symbol];
        const buyCount = Object.values(actions).filter(a => a === 'Buy').length;
        const sellCount = Object.values(actions).filter(a => a === 'Sell').length;
        const diff = buyCount - sellCount;
        const activeTrade = activeTradeMap[symbol];

        // Condición para abrir/mantener negociación
        if (diff >= 3) {
          if (activeTrade) {
            // Actualizar solo si cambia el current_price
            if (parseFloat(activeTrade.current_price) !== parseFloat(current_price)) {
              try {
                await api.put('/trade/update', {
                  id: activeTrade.id,
                  current_price,
                  active: true
                });
                console.log(`Negociación actualizada para ${symbol}`);
              } catch (error) {
                console.error(`Error actualizando negociación para ${symbol}:`, error.response?.data || error.message);
              }
            }
          } else {
            // Crear nueva negociación
            try {
              await api.post('/trade/open', {
                symbol,
                buy_price: current_price,
                initial_amount: 1000
              });
              console.log(`Negociación abierta para ${symbol}`);
            } catch (error) {
              console.error(`Error abriendo negociación para ${symbol}:`, error.response?.data || error.message);
            }
          }
        } else {
          // Cerrar negociación si diff < 3 y está activa
          if (activeTrade) {
            try {
              await api.put('/trade/update', {
                id: activeTrade.id,
                current_price,
                active: false
              });
              console.log(`Negociación cerrada para ${symbol}`);
            } catch (error) {
              console.error(`Error cerrando negociación para ${symbol}:`, error.response?.data || error.message);
            }
          }
        }
      }
      // Si quieres refrescar el listado de cerradas luego de procesar, puedes llamar handleGetClosedResults aquí:
      // handleGetClosedResults();
    } catch (error) {
      console.error("Error obteniendo negociaciones activas:", error.response?.data || error.message);
    }
  };

  // Dispara el procesamiento automáticamente cuando se consolida la información
  useEffect(() => {
    if (!loading && Object.keys(consolidated).length > 0) {
      processTrades(consolidated);
    }
  }, [loading, consolidated]);

  return (
    <div>
      {/* Botones */}
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

      {/* Mostrar resumen de negociaciones cerradas */}
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

      {/* Botones de exportación (solo si hay data) */}
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
