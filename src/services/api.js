// Ubicación: src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_SERVICE,
});

// Ejemplo de interceptor (opcional, para tokens/roles)
api.interceptors.request.use(
  (config) => {
    // Si necesitas agregar tokens o headers adicionales, hazlo aquí
    // Ejemplo:
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
