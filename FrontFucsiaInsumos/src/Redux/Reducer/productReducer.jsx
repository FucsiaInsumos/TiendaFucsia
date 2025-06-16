import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  totalProducts: 0,
  filters: {
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    name: ''
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Get Products
    getProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.data;
      state.totalProducts = action.payload.data.length;
      state.error = null;
    },
    getProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get Product by ID
    getProductByIdRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProductByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload.data;
      state.error = null;
    },
    getProductByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create Product
    createProductRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createProductSuccess: (state, action) => {
      state.loading = false;
      state.products.push(action.payload.data);
      state.totalProducts += 1;
      state.error = null;
    },
    createProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update Product
    updateProductRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProductSuccess: (state, action) => {
      state.loading = false;
      const index = state.products.findIndex(p => p.id === action.payload.data.id);
      if (index !== -1) {
        state.products[index] = action.payload.data;
      }
      state.currentProduct = action.payload.data;
      state.error = null;
    },
    updateProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete Product
    deleteProductRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess: (state, action) => {
      state.loading = false;
      state.products = state.products.filter(p => p.id !== action.payload);
      state.totalProducts -= 1;
      state.error = null;
    },
    deleteProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set Filters
    setProductFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear Filters
    clearProductFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear Current Product
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },

    // Clear Error
    clearProductError: (state) => {
      state.error = null;
    }
  }
});

export const {
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
  deleteProductFailure,
  setProductFilters,
  clearProductFilters,
  clearCurrentProduct,
  clearProductError
} = productSlice.actions;

export default productSlice.reducer;
