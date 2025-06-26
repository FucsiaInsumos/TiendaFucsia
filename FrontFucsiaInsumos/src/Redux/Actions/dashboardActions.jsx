
import api from '../../utils/axios';

// Action Types
export const DASHBOARD_LOADING = 'DASHBOARD_LOADING';
export const DASHBOARD_ERROR = 'DASHBOARD_ERROR';

// Stats Actions
export const GET_DASHBOARD_STATS_SUCCESS = 'GET_DASHBOARD_STATS_SUCCESS';
export const GET_SALES_CHART_SUCCESS = 'GET_SALES_CHART_SUCCESS';
export const GET_WEEKLY_SALES_SUCCESS = 'GET_WEEKLY_SALES_SUCCESS';
export const GET_MONTHLY_SALES_SUCCESS = 'GET_MONTHLY_SALES_SUCCESS';
export const GET_REVENUE_STATS_SUCCESS = 'GET_REVENUE_STATS_SUCCESS';
export const GET_PRODUCT_STATS_SUCCESS = 'GET_PRODUCT_STATS_SUCCESS';
export const GET_TOP_CUSTOMERS_SUCCESS = 'GET_TOP_CUSTOMERS_SUCCESS';

// Loading action
const setLoading = (isLoading) => ({
  type: DASHBOARD_LOADING,
  payload: isLoading
});

// Error action
const setError = (error) => ({
  type: DASHBOARD_ERROR,
  payload: error
});

// Obtener estadísticas generales del dashboard
export const getDashboardStats = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get('/dashboard/stats');
    
    if (!response.data.error) {
      dispatch({
        type: GET_DASHBOARD_STATS_SUCCESS,
        payload: response.data.data
      });
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener estadísticas del dashboard';
    dispatch(setError(errorMessage));
    console.error('Error en getDashboardStats:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Obtener gráfico de ventas
export const getSalesChart = (period = 'month', year, month) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const params = new URLSearchParams({ period });
    if (year) params.append('year', year);
    if (month !== undefined) params.append('month', month);
    
    const response = await api.get(`/dashboard/sales-chart?${params}`);
    
    if (!response.data.error) {
      dispatch({
        type: GET_SALES_CHART_SUCCESS,
        payload: response.data.data
      });
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener gráfico de ventas';
    dispatch(setError(errorMessage));
    console.error('Error en getSalesChart:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Obtener ventas semanales
export const getWeeklySales = (year, week) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (week) params.append('week', week);
    
    const response = await api.get(`/dashboard/weekly-sales?${params}`);
    
    if (!response.data.error) {
      dispatch({
        type: GET_WEEKLY_SALES_SUCCESS,
        payload: response.data.data
      });
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener ventas semanales';
    dispatch(setError(errorMessage));
    console.error('Error en getWeeklySales:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Obtener ventas mensuales
export const getMonthlySales = (year, months) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (months) params.append('months', months);
    
    const response = await api.get(`/dashboard/monthly-sales?${params}`);
    
    if (!response.data.error) {
      dispatch({
        type: GET_MONTHLY_SALES_SUCCESS,
        payload: response.data.data
      });
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener ventas mensuales';
    dispatch(setError(errorMessage));
    console.error('Error en getMonthlySales:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Obtener estadísticas de ingresos
export const getRevenueStats = (period = 'month', year) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const params = new URLSearchParams({ period });
    if (year) params.append('year', year);
    
    const response = await api.get(`/dashboard/revenue-stats?${params}`);
    
    if (!response.data.error) {
      dispatch({
        type: GET_REVENUE_STATS_SUCCESS,
        payload: response.data.data
      });
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener estadísticas de ingresos';
    dispatch(setError(errorMessage));
    console.error('Error en getRevenueStats:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Obtener estadísticas de productos
export const getProductStats = (period = 'month', limit = 10) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const params = new URLSearchParams({ period, limit });
    
    const response = await api.get(`/dashboard/product-stats?${params}`);
    
    if (!response.data.error) {
      dispatch({
        type: GET_PRODUCT_STATS_SUCCESS,
        payload: response.data.data
      });
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener estadísticas de productos';
    dispatch(setError(errorMessage));
    console.error('Error en getProductStats:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Obtener top clientes
export const getTopCustomers = (period = 'month', limit = 10) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const params = new URLSearchParams({ period, limit });
    
    const response = await api.get(`/dashboard/top-customers?${params}`);
    
    if (!response.data.error) {
      dispatch({
        type: GET_TOP_CUSTOMERS_SUCCESS,
        payload: response.data.data
      });
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener top clientes';
    dispatch(setError(errorMessage));
    console.error('Error en getTopCustomers:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Limpiar errores
export const clearDashboardError = () => ({
  type: DASHBOARD_ERROR,
  payload: null
});
