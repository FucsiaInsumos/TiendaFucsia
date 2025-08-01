import api from '../../utils/axios';

// =============================================================================
// EXPENSE ACTIONS
// =============================================================================

// Crear gasto
export const createExpense = (expenseData) => async (dispatch) => {
  try {
    const response = await api.post('/expenses', expenseData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear gasto';
    console.error('Create expense error:', errorMessage);
    throw error;
  }
};

// Obtener gastos con filtros
export const getExpenses = (params = {}) => async (dispatch) => {
  try {
    const response = await api.get('/expenses', { params });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener gastos';
    console.error('Get expenses error:', errorMessage);
    throw error;
  }
};

// Obtener gasto por ID
export const getExpenseById = (id) => async (dispatch) => {
  try {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener gasto';
    console.error('Get expense error:', errorMessage);
    throw error;
  }
};

// Actualizar gasto
export const updateExpense = (id, expenseData) => async (dispatch) => {
  try {
    const response = await api.put(`/expenses/${id}`, expenseData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar gasto';
    console.error('Update expense error:', errorMessage);
    throw error;
  }
};

// Aprobar gasto
export const approveExpense = (id) => async (dispatch) => {
  try {
    const response = await api.patch(`/expenses/${id}/approve`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al aprobar gasto';
    console.error('Approve expense error:', errorMessage);
    throw error;
  }
};

// Eliminar gasto
export const deleteExpense = (id) => async (dispatch) => {
  try {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al eliminar gasto';
    console.error('Delete expense error:', errorMessage);
    throw error;
  }
};

// Obtener estadísticas de gastos
export const getExpenseStats = (period = 'month') => async (dispatch) => {
  try {
    const response = await api.get('/expenses/stats', { 
      params: { period } 
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener estadísticas';
    console.error('Get expense stats error:', errorMessage);
    throw error;
  }
};
