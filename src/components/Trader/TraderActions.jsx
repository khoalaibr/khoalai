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

  // Disparar consolidación de acciones
  const handleConsolidateActions = () => {
    dispatch(fetchConsolidatedActions());
  };

  // Función de procesamiento para aperturar/actualizar negociaciones
  const processTrades = async (consolidatedData) => {
    // Procesar apertura: se verifica que la diferencia (BUY - SELL) sea >= 3
    for (const symbol of Object.keys(consolidatedData)) {
      const { actions, current_price } = consolidatedData[symbol];
      const actionValues = Object.values(actions);
      const buyCount = actionValues.filter(action => action === 'Buy').length;
      const sellCount = actionValues.filter(action => action === 'Sell').length;
      // Condición: la diferencia entre buys y sells debe ser al menos 3 y se debe tener un precio válido
      if (current_price == null) continue;
      if ((buyCount - sellCount) >= 3) {
        try {
          // Antes de crear, se debería verificar que no exista ya una negociación activa.
          // Aquí se asume que el endpoint /trade/open ya lo verifica.
          const payload = {
            symbol,
            buy_price: current_price,
            initial_amount: 1000  // O el monto que decidas usar
          };
          await api.post('/trade/open', payload);
          console.log(`Negociación abierta para ${symbol}`);
        } catch (error) {
          console.error(`Error abriendo negociación para ${symbol}:`, error.response?.data || error.message);
        }
      }
    }

    // Procesar actualización de negociaciones activas:
    try {
      const response = await api.get('/trade/list?active=true');
      const activeTrades = response.data.trades;
      for (const trade of activeTrades) {
        let buyCount = 0;
        let newPrice = trade.current_price;
        if (consolidatedData[trade.symbol]) {
          const { actions, current_price } = consolidatedData[trade.symbol];
          buyCount = Object.values(actions).filter(action => action === 'Buy').length;
          sellCount = Object.values(actions).filter(action => action === 'Sell').length;
          newPrice = current_price;
        } else {
          // Si no hay información consolidada para ese símbolo, se considera que no cumple la condición.
          buyCount = 0;
        }
        if ((buyCount - sellCount) < 3) {
          try {
            if (newPrice == null) continue;
            const payload = {
              id: trade.id,
              current_price: newPrice,
              active: false
            };
            await api.put('/trade/update', payload);
            console.log(`Negociación cerrada para ${trade.symbol}`);
          } catch (error) {
            console.error(`Error actualizando negociación para ${trade.symbol}:`, error.response?.data || error.message);
          }
        }
      }
      // (Opcional) Después de procesar, refrescar el listado
      // await dispatch(fetchTrades());
    } catch (error) {
      console.error("Error obteniendo negociaciones activas:", error.response?.data || error.message);
    }
  };

  // useEffect para disparar el procesamiento cuando se consolidan las acciones
  useEffect(() => {
    if (!loading && Object.keys(consolidated).length > 0) {
      processTrades(consolidated);
    }
    // Evita bucles infinitos
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
