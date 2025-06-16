import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  totalCategories: 0
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Get Categories
    getCategoriesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload.data;
      state.totalCategories = action.payload.data.length;
      state.error = null;
    },
    getCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get Category by ID
    getCategoryByIdRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCategoryByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentCategory = action.payload.data;
      state.error = null;
    },
    getCategoryByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create Category
    createCategoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories.push(action.payload.data);
      state.totalCategories += 1;
      state.error = null;
    },
    createCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update Category
    updateCategoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCategorySuccess: (state, action) => {
      state.loading = false;
      const index = state.categories.findIndex(c => c.id === action.payload.data.id);
      if (index !== -1) {
        state.categories[index] = action.payload.data;
      }
      state.currentCategory = action.payload.data;
      state.error = null;
    },
    updateCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete Category
    deleteCategoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter(c => c.id !== action.payload);
      state.totalCategories -= 1;
      state.error = null;
    },
    deleteCategoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear Current Category
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },

    // Clear Error
    clearCategoryError: (state) => {
      state.error = null;
    }
  }
});

export const {
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
  deleteCategoryFailure,
  clearCurrentCategory,
  clearCategoryError
} = categorySlice.actions;

export default categorySlice.reducer;
