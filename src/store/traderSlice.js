// Ubicación: src/store/traderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const strategies = [
  "breakout_range", 
  "fibonacci_rsi", 
  "macd_crossover", 
  "rsi_v2", 
  "volume_breakout"
];

export const fetchConsolidatedActions = createAsyncThunk(
  'trader/fetchConsolidatedActions',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Llamadas en paralelo para cada estrategia
      const promises = strategies.map(async (strat) => {
        const resp = await api.get(`/backtestAll/${strat}`);
        let dataArr = Object.values(resp.data);
        dataArr = dataArr.filter(item => item.action === 'Buy' || item.action === 'Sell');
        return { strategy: strat, data: dataArr };
      });
      const allResults = await Promise.all(promises);

      // 2. Construir el diccionario consolidado:
      //    { symbol: { actions: { strategy: action, ... }, current_price: <valor> } }
      const dictionary = {};
      allResults.forEach((res) => {
        const strat = res.strategy;
        res.data.forEach((item) => {
          const sym = item.symbol;
          if (!dictionary[sym]) {
            dictionary[sym] = { actions: {}, current_price: item.current_price };
          }
          // Actualizamos current_price (asumimos que cada respuesta trae el precio actual correcto)
          dictionary[sym].current_price = item.current_price;
          dictionary[sym].actions[strat] = item.action;
        });
      });

      // 3. Convertir el diccionario a un arreglo plano para exportar
      const flattenedData = [];
      Object.keys(dictionary).forEach((sym) => {
        const stratObj = dictionary[sym].actions;
        Object.keys(stratObj).forEach((s) => {
          flattenedData.push({
            symbol: sym,
            strategy: s,
            action: stratObj[s],
            current_price: dictionary[sym].current_price
          });
        });
      });

      // Ordenar alfabéticamente (opcional)
      flattenedData.sort((a, b) =>
        a.symbol.localeCompare(b.symbol) || a.strategy.localeCompare(b.strategy)
      );

      return { consolidated: dictionary, flattenedData };
    } catch (err) {
      return rejectWithValue(err.message || 'Error al consolidar acciones');
    }
  }
);

const traderSlice = createSlice({
  name: 'trader',
  initialState: {
    consolidated: {},
    flattenedData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsolidatedActions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.consolidated = {};
        state.flattenedData = [];
      })
      .addCase(fetchConsolidatedActions.fulfilled, (state, action) => {
        state.loading = false;
        state.consolidated = action.payload.consolidated;
        state.flattenedData = action.payload.flattenedData;
      })
      .addCase(fetchConsolidatedActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default traderSlice.reducer;
