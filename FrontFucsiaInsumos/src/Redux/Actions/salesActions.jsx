import api from '../../utils/axios';

// =============================================================================
// ORDER ACTIONS
// =============================================================================

// Crear orden
export const createOrder = (orderData) => async (dispatch) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear orden';
    console.error('Create order error:', errorMessage);
    throw error;
  }
};

// Obtener órdenes
export const getOrders = (params = {}) => async (dispatch) => {
  try {
    const response = await api.get('/orders', { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener órdenes';
    console.error('Get orders error:', errorMessage);
    throw error;
  }
};

// Obtener orden por ID
export const getOrderById = (orderId) => async (dispatch) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener orden';
    console.error('Get order error:', errorMessage);
    throw error;
  }
};

// Actualizar estado de orden
export const updateOrderStatus = (orderId, statusData) => async (dispatch) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar orden';
    console.error('Update order error:', errorMessage);
    throw error;
  }
};

// Cancelar orden
export const cancelOrder = (orderId, reason) => async (dispatch) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al cancelar orden';
    console.error('Cancel order error:', errorMessage);
    throw error;
  }
};

// Obtener órdenes del usuario actual (para clientes)
export const getMyOrders = (params = {}) => async (dispatch) => {
  try {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener mis órdenes';
    console.error('Get my orders error:', errorMessage);
    throw error;
  }
};

export const markOrderAsBilled = (orderId, billingDetails) => async (dispatch) => {
  try {
    const response = await api.patch(`/orders/${orderId}/mark-billed`, { billingDetails });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al marcar orden como facturada';
    console.error('Mark order as billed error:', errorMessage);
    throw error;
  }
};

export const getOrdersRequiringBilling = (params = {}) => async (dispatch) => {
  try {
    const response = await api.get('/orders/requiring-billing', { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener órdenes que requieren facturación';
    console.error('Get orders requiring billing error:', errorMessage);
    throw error;
  }
};

// =============================================================================
// PAYMENT ACTIONS
// =============================================================================

// Procesar pago
export const processPayment = (paymentData) => async (dispatch) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al procesar pago';
    console.error('Process payment error:', errorMessage);
    throw error;
  }
};

// Obtener pagos
export const getPayments = (params = {}) => async (dispatch) => {
  try {
    const response = await api.get('/payments', { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener pagos';
    console.error('Get payments error:', errorMessage);
    throw error;
  }
};

// Obtener pagos de una orden
export const getPaymentsByOrder = (orderId) => async (dispatch) => {
  try {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener pagos de la orden';
    console.error('Get order payments error:', errorMessage);
    throw error;
  }
};

// Reembolsar pago
export const refundPayment = (paymentId, refundData) => async (dispatch) => {
  try {
    const response = await api.post(`/payments/${paymentId}/refund`, refundData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al procesar reembolso';
    console.error('Refund payment error:', errorMessage);
    throw error;
  }
};

// =============================================================================
// STOCK ACTIONS
// =============================================================================

// Obtener movimientos de stock
export const getStockMovements = (params = {}) => async (dispatch) => {
  try {
    const response = await api.get('/stock/movements', { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener movimientos de stock';
    console.error('Get stock movements error:', errorMessage);
    throw error;
  }
};

// Crear movimiento de stock
export const createStockMovement = (movementData) => async (dispatch) => {
  try {
    const response = await api.post('/stock/movements', movementData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear movimiento de stock';
    console.error('Create stock movement error:', errorMessage);
    throw error;
  }
};

// Obtener productos con stock bajo
export const getLowStockProducts = () => async (dispatch) => {
  try {
    const response = await api.get('/stock/low-stock');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener productos con stock bajo';
    console.error('Get low stock products error:', errorMessage);
    throw error;
  }
};

// Obtener historial de stock de un producto
export const getProductStockHistory = (productId, params = {}) => async (dispatch) => {
  try {
    const response = await api.get(`/stock/product/${productId}/history`, { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener historial de stock';
    console.error('Get product stock history error:', errorMessage);
    throw error;
  }
};

// =============================================================================
// PRODUCT ACTIONS (para POS)
// =============================================================================

// Calcular precios con descuentos
export const calculateProductPrices = (calculationData) => async (dispatch) => {
  try {
    const response = await api.post('/product/calculate-price', calculationData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al calcular precios';
    console.error('Calculate prices error:', errorMessage);
    throw error;
  }
};

// Nueva acción para calcular precios para el POS o carrito
export const calculatePricesForCartAPI = (items, userId) => async (dispatch) => {
  try {
    // La ruta es /product/calculate-price porque en routes/index.js tienes router.use("/product", productRoutes)
    // y en productRoutes.js tienes router.post("/calculate-price", calculatePriceController)
    const response = await api.post('/orders/calculate-price', { items, userId });
    
    if (response.data && response.data.error === false) {
      return response.data.data; // Devuelve la parte 'data' de la respuesta exitosa
    } else {
      // Si la API devuelve un error controlado (error: true)
      const errorMessage = response.data?.message || 'Error al calcular precios desde la API.';
      console.error('API Error en calculatePricesForCartAPI:', errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Error de red o servidor al calcular precios.';
    console.error('Catch Error en calculatePricesForCartAPI:', errorMessage, error.response?.data);
    // Aquí podrías despachar una acción de error si es necesario para tu UI
    // dispatch({ type: 'CALCULATE_PRICE_FAILURE', payload: errorMessage });
    throw error; // Relanzar para que el componente que llama pueda manejarlo
  }
};

// =============================================================================
// CREDIT MANAGEMENT ACTIONS
// =============================================================================

// Obtener pagos a crédito
export const getCreditPayments = (params = {}) => async (dispatch) => {
  try {
    const response = await api.get('/payments/credits', { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener pagos a crédito';
    console.error('Get credit payments error:', errorMessage);
    throw error;
  }
};

// Registrar abono a un pago a crédito
export const recordCreditPayment = (paymentId, abonData) => async (dispatch) => {
  try {
    const response = await api.post(`/payments/${paymentId}/record-payment`, abonData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al registrar abono';
    console.error('Record credit payment error:', errorMessage);
    throw error;
  }
};

// Obtener historial de abonos de un pago
export const getCreditPaymentHistory = (paymentId) => async (dispatch) => {
  try {
    const response = await api.get(`/payments/${paymentId}/payment-history`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener historial de abonos';
    console.error('Get credit payment history error:', errorMessage);
    throw error;
  }
};
