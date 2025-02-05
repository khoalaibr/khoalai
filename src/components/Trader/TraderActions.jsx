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

  // Lanza la consolidación al presionar el botón
  const handleConsolidateActions = () => {
    dispatch(fetchConsolidatedActions());
  };

  // Función de procesamiento para abrir/actualizar negociaciones
  const processTrades = async (consolidatedData) => {
    // Procesar apertura de negociaciones
    for (const symbol of Object.keys(consolidatedData)) {
      const { actions, current_price } = consolidatedData[symbol];
      const actionValues = Object.values(actions);
      const buyCount = actionValues.filter(action => action === 'Buy').length;
      const sellCount = actionValues.filter(action => action === 'Sell').length;

      // Si no se tiene un precio válido, se omite
      if (current_price == null) continue;

      if (buyCount >= 3 && sellCount === 0) {
        try {
          // Se usa el valor real current_price
          const payload = {
            symbol,
            buy_price: current_price,
            initial_amount: 1000  // o el monto que decidas usar
          };
          await api.post('/trade/open', payload);
          console.log(`Negociación abierta para ${symbol}`);
        } catch (error) {
          console.error(`Error abriendo negociación para ${symbol}:`, error.response?.data || error.message);
        }
      }
    }

    // Procesar actualización de negociaciones activas
    try {
      const response = await api.get('/trade/list?active=true');
      const activeTrades = response.data.trades;

      for (const trade of activeTrades) {
        let buyCount = 0;
        let newPrice = trade.current_price;
        if (consolidatedData[trade.symbol]) {
          const { actions, current_price } = consolidatedData[trade.symbol];
          buyCount = Object.values(actions).filter(action => action === 'Buy').length;
          newPrice = current_price; // actualizar con el valor obtenido
        } else {
          // Si no hay información consolidada, se entiende que no hay suficientes buys
          buyCount = 0;
        }
        if (buyCount < 3) {
          try {
            // Solo actualizamos si se tiene un precio válido
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
    } catch (error) {
      console.error("Error obteniendo negociaciones activas:", error.response?.data || error.message);
    }
  };

  // useEffect para disparar el procesamiento automáticamente cuando se consolidan las acciones
  useEffect(() => {
    if (!loading && Object.keys(consolidated).length > 0) {
      processTrades(consolidated);
    }
    // Nota: Asegúrate de que este efecto no se dispare de forma infinita.
    // Puedes agregar lógica para no volver a procesar si ya se hizo en el último ciclo.
  }, [loading, consolidated]);

  return (
    <div>
      <h2>Acciones Consolidadas entre Estrategias</h2>
      <p>
        Se consultan las estrategias: [breakout_range, fibonacci_rsi, macd_crossover, rsi_v2, volume_breakout] en <code>/backtestAll/&lt;strategy&gt;</code>,
        filtrando solo Buy/Sell y unificando los resultados.
      </p>

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
