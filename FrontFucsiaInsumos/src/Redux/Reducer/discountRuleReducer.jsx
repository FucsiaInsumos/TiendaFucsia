import { createSlice } from '@reduxjs/toolkit';

const discountRuleSlice = createSlice({
  name: 'discountRules',
  initialState: {
    discountRules: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Get discount rules
    getDiscountRulesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDiscountRulesSuccess: (state, action) => {
      state.loading = false;
      state.discountRules = action.payload;
      state.error = null;
    },
    getDiscountRulesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create discount rule
    createDiscountRuleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createDiscountRuleSuccess: (state, action) => {
      state.loading = false;
      state.discountRules.push(action.payload);
      state.error = null;
    },
    createDiscountRuleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update discount rule
    updateDiscountRuleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDiscountRuleSuccess: (state, action) => {
      state.loading = false;
      const index = state.discountRules.findIndex(rule => rule.id === action.payload.id);
      if (index !== -1) {
        state.discountRules[index] = action.payload;
      }
      state.error = null;
    },
    updateDiscountRuleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete discount rule
    deleteDiscountRuleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteDiscountRuleSuccess: (state, action) => {
      state.loading = false;
      state.discountRules = state.discountRules.filter(rule => rule.id !== action.payload);
      state.error = null;
    },
    deleteDiscountRuleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear errors
    clearDiscountRuleError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearDiscountRuleError,
} = discountRuleSlice.actions;

export default discountRuleSlice.reducer;
