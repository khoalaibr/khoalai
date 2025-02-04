// src/store/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: true,
  //department: null,
  sidebarCollapsed: false,

  sidebarSelected: 'Atencion', // Categoría seleccionada por defecto
  headerOptions: ['trader', 'Opcion 2'], // Opciones para la categoría seleccionada
  activePage: '/atencion/trader', // Página activa por defecto

};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarSelected(state, action) {
      state.sidebarSelected = action.payload;

      // Cambiar las opciones del Header según la categoría seleccionada
      switch (action.payload) {
        case 'Atencion':
          state.headerOptions = ['trader', 'Opcion 2'];
          state.activePage = '/atencion/trader'; // Ruta inicial de la categoría
          break;
        case 'Informes':
          state.headerOptions = ['Reporte1', 'Reporte2'];
          state.activePage = '/informes/reporte1';
          break;
        case 'Oficios':
          state.headerOptions = ['Judiciales', 'Administrativos'];
          state.activePage = '/oficios/judiciales';
          break;
        default:
          state.headerOptions = [];
          state.activePage = '/';
      }
    },
    setActivePage(state, action) {
      state.activePage = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    login(state, action) {
      state.isLoggedIn = true;
      state.department = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.department = null;
    },
  },
});

export const {
  toggleSidebar,
  login,
  logout,
  setSidebarSelected, 
  setActivePage
} = uiSlice.actions;

export default uiSlice.reducer;
