// Ubicación: src/components/Trader/TraderActions.jsx
import React from 'react';
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

  const handleConsolidateActions = () => {
    dispatch(fetchConsolidatedActions());
  };
  // Función para procesar negociaciones (abrir y actualizar)
  const handleProcessTrades = async () => {
    await processTrades(consolidated);
    // Opcional: podrías refrescar la lista de negociaciones o mostrar un mensaje de éxito
  };

  // Función de procesamiento (se puede extraer a utils si se reutiliza)
  const processTrades = async (consolidatedData) => {
    // Abrir negociaciones para símbolos que cumplan la condición
    for (const symbol of Object.keys(consolidatedData)) {
      const actions = Object.values(consolidatedData[symbol]);
      const buyCount = actions.filter(action => action === 'Buy').length;
      const sellCount = actions.filter(action => action === 'Sell').length;

      if (buyCount >= 3 && sellCount === 0) {
        try {
          const payload = {
            symbol,
            buy_price: 100,       // Ejemplo: define el precio (ajústalo según tus datos)
            initial_amount: 1000  // Monto inicial fijo
          };
          await api.post('/trade/open', payload);
          console.log(`Negociación abierta para ${symbol}`);
        } catch (error) {
          console.error(`Error abriendo negociación para ${symbol}:`, error.response?.data || error.message);
        }
      }
    }

    // Verificar negociaciones activas para cerrar las que ya no cumplen
    try {
      const response = await api.get('/trade/list?active=true');
      const activeTrades = response.data.trades;

      for (const trade of activeTrades) {
        const actions = consolidatedData[trade.symbol] ? Object.values(consolidatedData[trade.symbol]) : [];
        const buyCount = actions.filter(action => action === 'Buy').length;

        if (buyCount < 3) {
          try {
            const payload = {
              id: trade.id,
              current_price: trade.buy_price, // O bien, un precio calculado actual
              active: false
            };
            await api.put('/trade/update', payload);
            console.log(`Negociación cerrada para ${trade.symbol}`);
          } catch (error) {
            console.error(`Error actualizando negociación para ${trade.symbol}:`, error.response?.data || error.message);
          }
        }
      }
    } catch (error) {
      console.error("Error obteniendo negociaciones activas:", error.response?.data || error.message);
    }
  };

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

      {/* Botón para procesar negociaciones */}
      {Object.keys(consolidated).length > 0 && !loading && (
        <button
          className="btn btn-warning mb-3"
          onClick={handleProcessTrades}
        >
          Procesar Negociaciones
        </button>
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
            const stratObj = consolidated[sym].actions;
            return (
              <div key={idx} className="mb-3">
                <h5>{sym} (Precio actual: {consolidated[sym].current_price})</h5>
                <ul>
                  {Object.keys(stratObj).map((st) => (
                    <li key={st}>{st}: {stratObj[st]}</li>
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
