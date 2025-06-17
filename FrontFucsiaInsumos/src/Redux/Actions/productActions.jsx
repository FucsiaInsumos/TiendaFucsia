import api from '../../utils/axios';
import {
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure,
  getProductByIdRequest,
  getProductByIdSuccess,
  getProductByIdFailure,
  createProductRequest,
  createProductSuccess,
  createProductFailure,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailure
} from '../Reducer/productReducer';

// Get all products
export const getProducts = () => async (dispatch) => {
  try {
    dispatch(getProductsRequest());
    const response = await api.get('/product');
    dispatch(getProductsSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener productos';
    dispatch(getProductsFailure(errorMessage));
    throw error;
  }
};

// Get product by ID
export const getProductById = (id) => async (dispatch) => {
  try {
    dispatch(getProductByIdRequest());
    const response = await api.get(`/product/${id}`);
    dispatch(getProductByIdSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener producto';
    dispatch(getProductByIdFailure(errorMessage));
    throw error;
  }
};

// Create product
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch(createProductRequest());
    const response = await api.post('/product', productData);
    dispatch(createProductSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear producto';
    dispatch(createProductFailure(errorMessage));
    throw error;
  }
};

// Create product with files (FormData)
export const createProductWithFiles = (formData) => async (dispatch) => {
  try {
    dispatch(createProductRequest());
    const response = await api.post('/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch(createProductSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al crear producto';
    dispatch(createProductFailure(errorMessage));
    throw error;
  }
};

// Update product
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());
    const response = await api.put(`/product/${id}`, productData);
    dispatch(updateProductSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar producto';
    dispatch(updateProductFailure(errorMessage));
    throw error;
  }
};

// Update product with files
export const updateProductWithFiles = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());
    const response = await api.put(`/product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch(updateProductSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar producto';
    dispatch(updateProductFailure(errorMessage));
    throw error;
  }
};

// Delete product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());
    await api.delete(`/product/${id}`);
    dispatch(deleteProductSuccess(id));
    
    // Recargar la lista completa después de eliminar para asegurar sincronización
    dispatch(getProducts());
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al eliminar producto';
    dispatch(deleteProductFailure(errorMessage));
    throw error;
  }
};

// Filter products
export const filterProducts = (filters) => async (dispatch) => {
  try {
    dispatch(getProductsRequest());
    const queryParams = new URLSearchParams();
    
    if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.name) queryParams.append('name', filters.name);
     if (filters.isFacturable !== undefined && filters.isFacturable !== '') { // ✅ NUEVO FILTRO
      queryParams.append('isFacturable', filters.isFacturable);
    }

    const response = await api.get(`/product?${queryParams.toString()}`);
    dispatch(getProductsSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al filtrar productos';
    dispatch(getProductsFailure(errorMessage));
    throw error;
  }
};

export const getFacturableProducts = () => async (dispatch) => {
  try {
    dispatch(getProductsRequest());
    const response = await api.get('/product/facturable');
    dispatch(getProductsSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al obtener productos facturables';
    dispatch(getProductsFailure(errorMessage));
    throw error;
  }
};
