import api from '../../utils/axios';

// =============================================================================
// PROVEEDOR ACTIONS
// =============================================================================

// Crear proveedor
export const createProveedor = (proveedorData) => async (dispatch) => {
  try {
    const response = await api.post('/purchase/proveedores', proveedorData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear proveedor';
    console.error('Create proveedor error:', errorMessage);
    throw error;
  }
};

// Obtener proveedores
export const getProveedores = (params = {}) => async (dispatch) => {
  try {
    const response = await api.get('/purchase/proveedores', { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener proveedores';
    console.error('Get proveedores error:', errorMessage);
    throw error;
  }
};

// Obtener proveedor por ID
export const getProveedorById = (id) => async (dispatch) => {
  try {
    const response = await api.get(`/purchase/proveedores/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener proveedor';
    console.error('Get proveedor error:', errorMessage);
    throw error;
  }
};

// Actualizar proveedor
export const updateProveedor = (id, proveedorData) => async (dispatch) => {
  try {
    const response = await api.put(`/purchase/proveedores/${id}`, proveedorData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar proveedor';
    console.error('Update proveedor error:', errorMessage);
    throw error;
  }
};

// Eliminar proveedor
export const deleteProveedor = (id) => async (dispatch) => {
  try {
    const response = await api.delete(`/purchase/proveedores/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al eliminar proveedor';
    console.error('Delete proveedor error:', errorMessage);
    throw error;
  }
};

// =============================================================================
// PURCHASE ORDER ACTIONS
// =============================================================================

// Crear orden de compra
export const createPurchaseOrder = (orderData) => async (dispatch) => {
  try {
    // Si hay archivo de comprobante, usar FormData
    if (orderData.comprobante) {
      const formData = new FormData();
      
      // Agregar todos los campos excepto el archivo
      Object.keys(orderData).forEach(key => {
        if (key !== 'comprobante') {
          if (key === 'items') {
            formData.append(key, JSON.stringify(orderData[key]));
          } else {
            formData.append(key, orderData[key]);
          }
        }
      });
      
      // Agregar archivo
      formData.append('comprobante', orderData.comprobante);
      
      const response = await api.post('/purchase/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } else {
      const response = await api.post('/purchase/orders', orderData);
      return response.data;
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear orden de compra';
    console.error('Create purchase order error:', errorMessage);
    throw error;
  }
};

// Obtener órdenes de compra
export const getPurchaseOrders = (params = {}) => async (dispatch) => {
  try {
    const response = await api.get('/purchase/orders', { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener órdenes de compra';
    console.error('Get purchase orders error:', errorMessage);
    throw error;
  }
};

// ✅ CORREGIR LA ACCIÓN DE RECEPCIÓN DE MERCANCÍA
export const receivePurchaseOrder = (orderId, receivedItems) => async (dispatch) => {
  try {
    console.log('🔄 [Action] Enviando datos de recepción:', { orderId, receivedItems });
    
    const response = await api.post(`/purchase/orders/${orderId}/receive`, { 
      receivedItems,
      notes: '' // Agregar campo de notas si es necesario
    });
    
    console.log('✅ [Action] Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al recibir mercancía';
    console.error('❌ [Action] Error al recibir mercancía:', errorMessage);
    console.error('❌ [Action] Error completo:', error.response?.data);
    throw error;
  }
};

// =============================================================================
// TESTING ACTION
// =============================================================================

// Probar conexión con el backend
export const testPurchaseConnection = () => async (dispatch) => {
  try {
    const response = await api.get('/purchase/test');
    console.log('✅ Purchase API Test:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error en conexión con API de compras';
    console.error('❌ Purchase API Test Error:', errorMessage);
    throw error;
  }
};
