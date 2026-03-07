import axios from 'axios';
import { store } from '../Redux/Store/Store';
import { logout } from '../Redux/Reducer/authReducer';

// Obtener la URL del backend desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'https://tiendafucsia.up.railway.app/';

// Debug: Mostrar URL en consola
console.log('🔧 API URL configurada:', API_URL);
console.log('🔧 Variables de entorno:', import.meta.env);

// Crear instancia de axios con la URL base
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
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
    }
    // Debug: verificar request completo
    console.log('🔹 Request:', {
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url,
      method: config.method,
      headers: config.headers
    });
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