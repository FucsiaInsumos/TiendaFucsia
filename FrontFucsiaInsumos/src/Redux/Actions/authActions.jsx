import api from '../../utils/axios';
import { loginRequest, loginSuccess, loginFailure, logout } from '../Reducer/authReducer';

// Rename loginUser to login to match the import
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const response = await api.post('/auth/login', credentials); // MANTENER /auth/login
    const { data } = response;
    console.log('Login response data:', data);
    
    // Extraer token y user de la estructura anidada
    const token = data.data.token;
    const user = data.data.user;
    
    // Crear el payload con la estructura que espera el reducer
    const payload = {
      token: token,
      data: {
        user: user
      }
    };
    
    dispatch(loginSuccess(payload));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // Guardar user también
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error en el login';
    console.error('Login error:', errorMessage);
    dispatch(loginFailure(errorMessage));
    throw error;
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    // Opcional: Llamar al backend para registrar el logout
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        // Si falla la llamada al backend, continuar con el logout local
        console.warn('Error al notificar logout al servidor:', error);
      }
    }
    
    // Dispatch del logout
    dispatch(logout());
    
    // Redireccionar a la página principal (opcional)
    window.location.href = '/';
    
  } catch (error) {
    console.error('Error en logout:', error);
    // Aunque haya error, hacer logout local
    dispatch(logout());
  }
};

// Export the actions
export { loginRequest, loginSuccess, loginFailure, logout };