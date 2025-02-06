// Ubicación: src/components/Trader/TraderActions.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConsolidatedActions } from '../../store/traderSlice';
import { CSVLink } from 'react-csv';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import api from '../../services/api';

const TraderActions = () => {
  const dispatch = useDispatch();
  const { consolidated, flattenedData, loading, error } = useSelector(state => state.trader);

  const csvHeaders = [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Strategy', key: 'strategy' },
    { label: 'Action', key: 'action' },
    { label: 'Current Price', key: 'current_price' },
  ];

  // Función para disparar la consolidación manualmente
  const handleConsolidateActions = () => {
    dispatch(fetchConsolidatedActions());
  };

  // Función de procesamiento para apertura/actualización/cierre de negociaciones
  const processTrades = async (consolidatedData) => {
    try {
      // Obtener el listado actual de negociaciones activas
      const response = await api.get('/trade/list?active=true');
      const activeTrades = response.data.trades;
      // Mapear por símbolo para un acceso rápido
      const activeTradeMap = {};
      activeTrades.forEach(trade => {
        activeTradeMap[trade.symbol] = trade;
      });

      // Recorrer cada símbolo consolidado
      for (const symbol in consolidatedData) {
        const { actions, current_price } = consolidatedData[symbol];
        const buyCount = Object.values(actions).filter(action => action === 'Buy').length;
        const sellCount = Object.values(actions).filter(action => action === 'Sell').length;
        const diff = buyCount - sellCount;
        const activeTrade = activeTradeMap[symbol];

        if (diff >= 3) {
          if (activeTrade) {
            // Existe negociación activa; si el precio ha cambiado, actualizar current_price
            if (parseFloat(activeTrade.current_price) !== parseFloat(current_price)) {
              try {
                const payload = {
                  id: activeTrade.id,
                  current_price,  // se envía el valor actualizado
                  active: true    // se mantiene activa
                };
                await api.put('/trade/update', payload);
                console.log(`Negociación actualizada para ${symbol}`);
              } catch (error) {
                console.error(`Error actualizando negociación para ${symbol}:`, error.response?.data || error.message);
              }
            }
            // Si no ha cambiado el precio, no se hace nada.
          } else {
            // No existe negociación activa: crear una nueva negociación
            try {
              const payload = {
                symbol,
                buy_price: current_price,  // se usa el precio real obtenido
                initial_amount: 1000       // o el monto que se decida usar
              };
              await api.post('/trade/open', payload);
              console.log(`Negociación abierta para ${symbol}`);
            } catch (error) {
              console.error(`Error abriendo negociación para ${symbol}:`, error.response?.data || error.message);
            }
          }
        } else {
          // diff < 3: Si existe negociación activa, se cierra (active=false) y se actualiza el precio
          if (activeTrade) {
            try {
              const payload = {
                id: activeTrade.id,
                current_price,  // actualizar con el precio actual obtenido
                active: false
              };
              await api.put('/trade/update', payload);
              console.log(`Negociación cerrada para ${symbol}`);
            } catch (error) {
              console.error(`Error cerrando negociación para ${symbol}:`, error.response?.data || error.message);
            }
          }
        }
      }
      // (Opcional) Aquí podrías refrescar el listado de negociaciones en el estado o notificar al usuario.
    } catch (error) {
      console.error("Error obteniendo negociaciones activas:", error.response?.data || error.message);
    }
  };

  // useEffect para disparar el procesamiento automáticamente cuando se consolida la información
  useEffect(() => {
    if (!loading && Object.keys(consolidated).length > 0) {
      processTrades(consolidated);
    }
    // Asegúrate de que este efecto no se dispare en bucle infinito (podrías agregar una bandera para evitar reprocesos innecesarios).
  }, [loading, consolidated]);

  return (
    <div>
      <h2>Acciones Consolidadas entre Estrategias</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={handleConsolidateActions}
        disabled={loading}
      >
        {loading ? 'Procesando...' : 'Consolidar Acciones (Buy/Sell)'}
      </button>

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
          <button onClick={() => exportToExcel(flattenedData, 'consolidated_actions')} className="btn btn-success">
            Excel
          </button>
          <button onClick={() => exportToPDF(flattenedData, 'consolidated_actions')} className="btn btn-danger">
            PDF
          </button>
        </div>
      )}

      {Object.keys(consolidated).length > 0 && !loading && (
        <div>
          {Object.keys(consolidated).sort().map((sym, idx) => {
            const { actions, current_price } = consolidated[sym];
            return (
              <div key={idx} className="mb-3">
                <h5>{sym} (Precio actual: {current_price})</h5>
                <ul>
                  {Object.keys(actions).map((st) => (
                    <li key={st}>{st}: {actions[st]}</li>
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
