import api from '../../utils/axios';
import {
  getDistributorsRequest,
  getDistributorsSuccess,
  getDistributorsFailure,
  createDistributorRequest,
  createDistributorSuccess,
  createDistributorFailure,
  updateDistributorRequest,
  updateDistributorSuccess,
  updateDistributorFailure,
} from '../Reducer/distributorReducer';

// Get all distributors
export const getDistributors = () => async (dispatch) => {
  try {
    dispatch(getDistributorsRequest());
    const response = await api.get('/distributor');
    dispatch(getDistributorsSuccess(response.data.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener distribuidores';
    dispatch(getDistributorsFailure(errorMessage));
    throw error;
  }
};

// Get distributor by user ID
export const getDistributorByUserId = (userId) => async (dispatch) => {
  try {
    const response = await api.get(`/distributor/user/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener distribuidor';
    throw error;
  }
};

// Create distributor
export const createDistributor = (distributorData) => async (dispatch) => {
  try {
    dispatch(createDistributorRequest());
    const response = await api.post('/distributor', distributorData);
    dispatch(createDistributorSuccess(response.data.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear distribuidor';
    dispatch(createDistributorFailure(errorMessage));
    throw error;
  }
};

// Update distributor
export const updateDistributor = (id, distributorData) => async (dispatch) => {
  try {
    dispatch(updateDistributorRequest());
    const response = await api.put(`/distributor/${id}`, distributorData);
    dispatch(updateDistributorSuccess(response.data.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar distribuidor';
    dispatch(updateDistributorFailure(errorMessage));
    throw error;
  }
};
