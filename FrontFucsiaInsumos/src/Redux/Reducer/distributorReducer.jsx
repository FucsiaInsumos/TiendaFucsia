import { createSlice } from '@reduxjs/toolkit';

const distributorSlice = createSlice({
  name: 'distributors',
  initialState: {
    distributors: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Get distributors
    getDistributorsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDistributorsSuccess: (state, action) => {
      state.loading = false;
      state.distributors = action.payload;
      state.error = null;
    },
    getDistributorsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create distributor
    createDistributorRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createDistributorSuccess: (state, action) => {
      state.loading = false;
      state.distributors.push(action.payload);
      state.error = null;
    },
    createDistributorFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update distributor
    updateDistributorRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDistributorSuccess: (state, action) => {
      state.loading = false;
      const index = state.distributors.findIndex(dist => dist.id === action.payload.id);
      if (index !== -1) {
        state.distributors[index] = action.payload;
      }
      state.error = null;
    },
    updateDistributorFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear errors
    clearDistributorError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getDistributorsRequest,
  getDistributorsSuccess,
  getDistributorsFailure,
  createDistributorRequest,
  createDistributorSuccess,
  createDistributorFailure,
  updateDistributorRequest,
  updateDistributorSuccess,
  updateDistributorFailure,
  clearDistributorError,
} = distributorSlice.actions;

export default distributorSlice.reducer;
