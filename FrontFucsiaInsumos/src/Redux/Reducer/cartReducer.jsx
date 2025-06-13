import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  subtotal: 0,
  discount: 0,
  isOpen: false,
  distributorMinimumNotMet: false,
  distributorMinimumRequired: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, userRole, distributorInfo } = action.payload;
      console.log('Cart addToCart received:', { product: product.name, userRole, distributorInfo });
      
      const existingItem = state.items.find(item => item.id === product.id);
      
      // Determinar el precio correcto
      let price = product.price;
      let isDistributorPrice = false;
      
      // Primero verificar promoción
      if (product.isPromotion && product.promotionPrice) {
        price = product.promotionPrice;
        console.log('Using promotion price:', price);
      } 
      // Luego verificar precio de distribuidor
      else if (userRole === 'Distributor' && product.distributorPrice && distributorInfo) {
        price = product.distributorPrice;
        isDistributorPrice = true;
        console.log('Using distributor price:', price, 'vs regular:', product.price);
      }
      
      if (existingItem) {
        existingItem.price = price;
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * existingItem.price;
        existingItem.isDistributorPrice = isDistributorPrice;
        existingItem.distributorInfo = distributorInfo;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: price,
          originalPrice: product.price,
          distributorPrice: product.distributorPrice,
          image: product.image_url?.[0] || null,
          quantity: quantity,
          total: price * quantity,
          stock: product.stock,
          isPromotion: product.isPromotion,
          isDistributorPrice: isDistributorPrice,
          userRole: userRole,
          distributorInfo: distributorInfo
        });
      }
      
      cartSlice.caseReducers.calculateTotals(state);
      cartSlice.caseReducers.validateDistributorMinimum(state);
      state.isOpen = true;
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      cartSlice.caseReducers.calculateTotals(state);
      cartSlice.caseReducers.validateDistributorMinimum(state);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== productId);
        } else {
          item.quantity = quantity;
          item.total = item.price * quantity;
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state);
      cartSlice.caseReducers.validateDistributorMinimum(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.distributorMinimumNotMet = false;
      state.distributorMinimumRequired = null;
    },
    
    calculateTotals: (state) => {
      state.subtotal = state.items.reduce((sum, item) => sum + item.total, 0);
      state.discount = 0;
      state.total = state.subtotal - state.discount;
    },

    validateDistributorMinimum: (state) => {
      console.log('Validating distributor minimum...');
      
      // Buscar items de distribuidor
      const distributorItems = state.items.filter(item => 
        item.userRole === 'Distributor' && item.isDistributorPrice
      );
      
      console.log('Distributor items found:', distributorItems.length);
      
      if (distributorItems.length > 0) {
        const distributorInfo = distributorItems[0]?.distributorInfo;
        console.log('Distributor info:', distributorInfo);
        
        if (distributorInfo && distributorInfo.minimumPurchase > 0) {
          const distributorTotal = distributorItems.reduce((sum, item) => sum + item.total, 0);
          console.log('Distributor total:', distributorTotal, 'vs minimum:', distributorInfo.minimumPurchase);
          
          if (distributorTotal < distributorInfo.minimumPurchase) {
            console.log('Minimum not met, reverting prices...');
            
            // Revertir a precios normales
            state.items = state.items.map(item => {
              if (item.isDistributorPrice) {
                // Calcular precio normal (promoción o precio regular)
                const normalPrice = item.isPromotion && item.originalPrice ? 
                  Math.min(item.originalPrice, item.promotionPrice || item.originalPrice) : 
                  item.originalPrice;
                
                return {
                  ...item,
                  price: normalPrice,
                  total: item.quantity * normalPrice,
                  isDistributorPrice: false,
                  priceReverted: true
                };
              }
              return item;
            });
            
            state.distributorMinimumNotMet = true;
            state.distributorMinimumRequired = distributorInfo.minimumPurchase;
            
            // Recalcular totales después de revertir precios
            cartSlice.caseReducers.calculateTotals(state);
          } else {
            console.log('Minimum met, keeping distributor prices');
            state.distributorMinimumNotMet = false;
            state.distributorMinimumRequired = null;
            
            // Asegurar que los items mantengan el precio de distribuidor
            state.items = state.items.map(item => ({
              ...item,
              priceReverted: false
            }));
          }
        }
      } else {
        state.distributorMinimumNotMet = false;
        state.distributorMinimumRequired = null;
      }
    },

    clearDistributorWarning: (state) => {
      state.distributorMinimumNotMet = false;
      state.distributorMinimumRequired = null;
      state.items = state.items.map(item => ({
        ...item,
        priceReverted: false
      }));
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    setCartOpen: (state, action) => {
      state.isOpen = action.payload;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  calculateTotals,
  validateDistributorMinimum,
  clearDistributorWarning,
  toggleCart,
  setCartOpen
} = cartSlice.actions;

export default cartSlice.reducer;
