import api from '../../utils/axios';

// Obtener token de aceptación
export const getAcceptanceToken = () => async (dispatch) => {
  try {
    const response = await api.get('/wompi/acceptance-token');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener token de aceptación';
    console.error('Get acceptance token error:', errorMessage);
    throw error;
  }
};

// Crear transacción de pago
export const createPaymentTransaction = (transactionData) => async (dispatch) => {
  try {
    const response = await api.post('/wompi/create-transaction', transactionData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear transacción';
    console.error('Create transaction error:', errorMessage);
    throw error;
  }
};

// Verificar estado de transacción
export const checkTransactionStatus = (transactionId) => async (dispatch) => {
  try {
    const response = await api.get(`/wompi/transaction/${transactionId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al verificar transacción';
    console.error('Check transaction error:', errorMessage);
    throw error;
  }
};
