import axios from 'axios';
import { store } from '../Redux/Store/Store';
import { logout } from '../Redux/Reducer/authReducer';

// Crear instancia de axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/', // ✅ Usar variable de entorno
  timeout: 30000, // ✅ Aumentado a 30 segundos para operaciones complejas (recepciones, creación de expenses, etc.)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: verificar header
      console.log('Authorization header being sent:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si recibimos un 401, hacer logout automático
      store.dispatch(logout());
      
      // Mostrar mensaje al usuario (opcional)
      console.warn('Sesión expirada. Redirigiendo al login...');
      
      // Redireccionar al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;