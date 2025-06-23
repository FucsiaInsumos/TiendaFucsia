import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Proveedores
  proveedores: [],
  currentProveedor: null,
  
  // Órdenes de compra
  purchaseOrders: [],
  currentPurchaseOrder: null,
  
  // Estado de carga
  loading: false,
  error: null,
  
  // Estadísticas
  totalProveedores: 0,
  totalPurchaseOrders: 0,
  
  // Filtros
  filters: {
    status: '',
    proveedorId: '',
    startDate: '',
    endDate: ''
  }
};

const purchaseSlice = createSlice({
  name: 'purchase',
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
    // PROVEEDORES
    // =============================================================================
    setProveedores: (state, action) => {
      state.proveedores = action.payload;
      state.totalProveedores = action.payload.length;
      state.loading = false;
      state.error = null;
    },
    
    addProveedor: (state, action) => {
      state.proveedores.push(action.payload);
      state.totalProveedores += 1;
    },
    
    updateProveedor: (state, action) => {
      const index = state.proveedores.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.proveedores[index] = action.payload;
      }
      if (state.currentProveedor?.id === action.payload.id) {
        state.currentProveedor = action.payload;
      }
    },
    
    setCurrentProveedor: (state, action) => {
      state.currentProveedor = action.payload;
    },
    
    clearCurrentProveedor: (state) => {
      state.currentProveedor = null;
    },

    // =============================================================================
    // PURCHASE ORDERS
    // =============================================================================
    setPurchaseOrders: (state, action) => {
      state.purchaseOrders = action.payload;
      state.totalPurchaseOrders = action.payload.length;
      state.loading = false;
      state.error = null;
    },
    
    addPurchaseOrder: (state, action) => {
      state.purchaseOrders.unshift(action.payload); // Agregar al inicio
      state.totalPurchaseOrders += 1;
    },
    
    updatePurchaseOrder: (state, action) => {
      const index = state.purchaseOrders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.purchaseOrders[index] = action.payload;
      }
      if (state.currentPurchaseOrder?.id === action.payload.id) {
        state.currentPurchaseOrder = action.payload;
      }
    },
    
    setCurrentPurchaseOrder: (state, action) => {
      state.currentPurchaseOrder = action.payload;
    },
    
    clearCurrentPurchaseOrder: (state) => {
      state.currentPurchaseOrder = null;
    },

    // =============================================================================
    // FILTERS
    // =============================================================================
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const {
  setLoading,
  setError,
  clearError,
  setProveedores,
  addProveedor,
  updateProveedor,
  setCurrentProveedor,
  clearCurrentProveedor,
  setPurchaseOrders,
  addPurchaseOrder,
  updatePurchaseOrder,
  setCurrentPurchaseOrder,
  clearCurrentPurchaseOrder,
  setFilters,
  clearFilters
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
