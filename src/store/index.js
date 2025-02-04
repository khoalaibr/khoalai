// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import traderReducer from './traderSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    trader: traderReducer,
  },
});

export default store;
