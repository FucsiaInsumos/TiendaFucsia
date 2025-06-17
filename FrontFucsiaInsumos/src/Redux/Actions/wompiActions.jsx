import api from '../../utils/axios';

export const getAcceptanceToken = () => async (dispatch) => {
  try {
    console.log('🔑 [Action] Obteniendo token de aceptación...');
    const response = await api.get('/wompi/acceptance-token');
    console.log('✅ [Action] Token obtenido:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener token de aceptación';
    console.error('❌ [Action] Get acceptance token error:', errorMessage);
    throw error;
  }
};

// ✅ NUEVA FUNCIÓN - Generar signature
export const generateWompiSignature = (reference, amountInCents, currency = 'COP') => async (dispatch) => {
  try {
    console.log('🔐 [Action] Generando signature...', { reference, amountInCents, currency });
    
    const response = await api.post('/wompi/generate-signature', {
      reference,
      amount_in_cents: amountInCents,
      currency
    });
    
    console.log('✅ [Action] Signature generada:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al generar signature';
    console.error('❌ [Action] Generate signature error:', errorMessage);
    throw error;
  }
};

// Crear transacción de pago (mantener para compatibilidad)
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

// ✅ NUEVA FUNCIÓN - Obtener estado real del pago desde Wompi
export const getPaymentStatus = (transactionId) => async (dispatch) => {
  try {
    console.log('🔍 [Action] Consultando estado real del pago...', transactionId);
    
    const response = await api.get(`/wompi/transaction/${transactionId}`);
    
    console.log('✅ [Action] Estado del pago obtenido:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al consultar estado del pago';
    console.error('❌ [Action] Get payment status error:', errorMessage);
    throw error;
  }
};

// ✅ NUEVA FUNCIÓN - Actualizar estado del pago en orden
export const updateOrderPaymentStatus = (orderId) => async (dispatch) => {
  try {
    console.log('🔄 [Action] Actualizando estado de pago de la orden...', orderId);
    
    const response = await api.patch(`/orders/${orderId}/payment-status`);
    
    console.log('✅ [Action] Estado de orden actualizado:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar estado de la orden';
    console.error('❌ [Action] Update order payment status error:', errorMessage);
    throw error;
  }
};