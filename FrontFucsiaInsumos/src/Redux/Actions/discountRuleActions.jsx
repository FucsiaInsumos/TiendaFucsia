import api from '../../utils/axios';
import {
  getDiscountRulesRequest,
  getDiscountRulesSuccess,
  getDiscountRulesFailure,
  createDiscountRuleRequest,
  createDiscountRuleSuccess,
  createDiscountRuleFailure,
  updateDiscountRuleRequest,
  updateDiscountRuleSuccess,
  updateDiscountRuleFailure,
  deleteDiscountRuleRequest,
  deleteDiscountRuleSuccess,
  deleteDiscountRuleFailure,
} from '../Reducer/discountRuleReducer';

// Get all discount rules
export const getDiscountRules = () => async (dispatch) => {
  try {
    dispatch(getDiscountRulesRequest());
    const response = await api.get('/discount-rules');
    dispatch(getDiscountRulesSuccess(response.data.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener reglas de descuento';
    dispatch(getDiscountRulesFailure(errorMessage));
    throw error;
  }
};

// Create discount rule
export const createDiscountRule = (discountRuleData) => async (dispatch) => {
  try {
    dispatch(createDiscountRuleRequest());
    const response = await api.post('/discount-rules', discountRuleData);
    dispatch(createDiscountRuleSuccess(response.data.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear regla de descuento';
    dispatch(createDiscountRuleFailure(errorMessage));
    throw error;
  }
};

// Update discount rule
export const updateDiscountRule = (id, discountRuleData) => async (dispatch) => {
  try {
    dispatch(updateDiscountRuleRequest());
    const response = await api.put(`/discount-rules/${id}`, discountRuleData);
    dispatch(updateDiscountRuleSuccess(response.data.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar regla de descuento';
    dispatch(updateDiscountRuleFailure(errorMessage));
    throw error;
  }
};

// Delete discount rule
export const deleteDiscountRule = (id) => async (dispatch) => {
  try {
    dispatch(deleteDiscountRuleRequest());
    await api.delete(`/discount-rules/${id}`);
    dispatch(deleteDiscountRuleSuccess(id));
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al eliminar regla de descuento';
    dispatch(deleteDiscountRuleFailure(errorMessage));
    throw error;
  }
};

// Calculate product price
export const calculateProductPrice = (items, userType = 'customers', userId = null) => async (dispatch) => {
  try {
    const response = await api.post('/product/calculate-price', {
      items,
      userType,
      userId
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al calcular precios';
    throw error;
  }
};
