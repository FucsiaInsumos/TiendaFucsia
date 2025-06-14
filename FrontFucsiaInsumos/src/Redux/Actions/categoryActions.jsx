import api from '../../utils/axios';
import {
  getCategoriesRequest,
  getCategoriesSuccess,
  getCategoriesFailure,
  getCategoryByIdRequest,
  getCategoryByIdSuccess,
  getCategoryByIdFailure,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure
} from '../Reducer/categoryReducer';

// Get all categories
export const getCategories = () => async (dispatch) => {
  try {
    dispatch(getCategoriesRequest());
    const response = await api.get('/category');
    dispatch(getCategoriesSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener categorías';
    dispatch(getCategoriesFailure(errorMessage));
    throw error;
  }
};

// Get category by ID
export const getCategoryById = (id) => async (dispatch) => {
  try {
    dispatch(getCategoryByIdRequest());
    const response = await api.get(`/category/${id}`);
    dispatch(getCategoryByIdSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener categoría';
    dispatch(getCategoryByIdFailure(errorMessage));
    throw error;
  }
};

// Create category
export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch(createCategoryRequest());
    const response = await api.post('/category', categoryData);
    dispatch(createCategorySuccess(response.data));
    return response.data;
  } catch (error) {
    console.error('Error completo:', error.response || error);
    const errorMessage = error.response?.data?.message || 'Error al crear categoría';
    dispatch(createCategoryFailure(errorMessage));
    throw error;
  }
};

// Update category
export const updateCategory = (id, categoryData) => async (dispatch) => {
  try {
    dispatch(updateCategoryRequest());
    const response = await api.put(`/category/${id}`, categoryData);
    dispatch(updateCategorySuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar categoría';
    dispatch(updateCategoryFailure(errorMessage));
    throw error;
  }
};

// Delete category
export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch(deleteCategoryRequest());
    await api.delete(`/category/${id}`);
    dispatch(deleteCategorySuccess(id));
    
    // Recargar la lista completa después de eliminar para asegurar sincronización
    dispatch(getCategories());
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al eliminar categoría';
    dispatch(deleteCategoryFailure(errorMessage));
    throw error;
  }
};
