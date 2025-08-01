import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Lista de gastos
  expenses: [],
  currentExpense: null,
  
  // Estado de carga
  loading: false,
  error: null,
  
  // Estadísticas
  stats: {
    totalExpenses: 0,
    expensesByCategory: [],
    expensesByPaymentMethod: [],
    expensesByStatus: [],
    upcomingDueExpenses: []
  },
  
  // Paginación
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 20
  },
  
  // Filtros
  filters: {
    categoryType: '',
    status: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    search: '',
    sortBy: 'expenseDate',
    sortOrder: 'DESC'
  },
  
  // Resumen
  summary: {
    totalAmount: 0,
    expensesByCategory: []
  }
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // =============================================================================
    // LOADING STATES
    // =============================================================================
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },

    // =============================================================================
    // EXPENSES CRUD
    // =============================================================================
    setExpenses: (state, action) => {
      state.expenses = action.payload.expenses || [];
      state.pagination = action.payload.pagination || state.pagination;
      state.summary = action.payload.summary || state.summary;
      state.loading = false;
      state.error = null;
    },
    
    addExpense: (state, action) => {
      state.expenses.unshift(action.payload); // Agregar al inicio
      state.summary.totalAmount += parseFloat(action.payload.amount || 0);
    },
    
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        // Ajustar total si cambió el monto
        const oldAmount = parseFloat(state.expenses[index].amount || 0);
        const newAmount = parseFloat(action.payload.amount || 0);
        state.summary.totalAmount += (newAmount - oldAmount);
        
        state.expenses[index] = action.payload;
      }
      if (state.currentExpense?.id === action.payload.id) {
        state.currentExpense = action.payload;
      }
    },
    
    removeExpense: (state, action) => {
      const expenseToRemove = state.expenses.find(e => e.id === action.payload);
      if (expenseToRemove) {
        state.summary.totalAmount -= parseFloat(expenseToRemove.amount || 0);
      }
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
      if (state.currentExpense?.id === action.payload) {
        state.currentExpense = null;
      }
    },
    
    setCurrentExpense: (state, action) => {
      state.currentExpense = action.payload;
    },
    
    clearCurrentExpense: (state) => {
      state.currentExpense = null;
    },

    // =============================================================================
    // STATISTICS
    // =============================================================================
    setExpenseStats: (state, action) => {
      state.stats = action.payload;
    },

    // =============================================================================
    // FILTERS & PAGINATION
    // =============================================================================
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // =============================================================================
    // BULK OPERATIONS
    // =============================================================================
    approveMultipleExpenses: (state, action) => {
      const { expenseIds, approvedBy } = action.payload;
      state.expenses.forEach(expense => {
        if (expenseIds.includes(expense.id)) {
          expense.status = 'pagado';
          expense.approvedBy = approvedBy;
          expense.approvedAt = new Date().toISOString();
        }
      });
    },

    // =============================================================================
    // UI HELPERS
    // =============================================================================
    updateExpenseStatus: (state, action) => {
      const { id, status, approvedBy, approvedAt } = action.payload;
      const expense = state.expenses.find(e => e.id === id);
      if (expense) {
        expense.status = status;
        if (approvedBy) expense.approvedBy = approvedBy;
        if (approvedAt) expense.approvedAt = approvedAt;
      }
      if (state.currentExpense?.id === id) {
        state.currentExpense.status = status;
        if (approvedBy) state.currentExpense.approvedBy = approvedBy;
        if (approvedAt) state.currentExpense.approvedAt = approvedAt;
      }
    }
  }
});

export const {
  setLoading,
  setError,
  clearError,
  setExpenses,
  addExpense,
  updateExpense,
  removeExpense,
  setCurrentExpense,
  clearCurrentExpense,
  setExpenseStats,
  setFilters,
  clearFilters,
  setPagination,
  approveMultipleExpenses,
  updateExpenseStatus
} = expenseSlice.actions;

export default expenseSlice.reducer;
