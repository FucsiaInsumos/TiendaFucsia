import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  subtotal: 0,
  discount: 0,
  appliedDiscounts: [],
  isOpen: false,
  distributorPricesApplied: false,
  distributorMinimumRequired: 0,
  isDistributorMinimumMet: true,
  tempSubtotalDistributorPotential: 0, // Nuevo: Para mostrar el total que sería con precios de distribuidor
};

// Función para aplicar reglas de descuento
const applyDiscountRules = (items, user, discountRules) => {
  if (!discountRules || discountRules.length === 0) return { totalDiscount: 0, appliedDiscounts: [] };

  const userType = user?.role === 'Distributor' ? 'distributors' : 'customers';
  const now = new Date();
  
  // Filtrar reglas aplicables
  const applicableRules = discountRules.filter(rule => {
    // Verificar si está activa
    if (!rule.isActive) return false;
    
    // Verificar si aplica para el tipo de usuario
    if (rule.applicableFor !== 'all' && rule.applicableFor !== userType) return false;
    
    // Verificar fechas de vigencia
    if (rule.startDate && new Date(rule.startDate) > now) return false;
    if (rule.endDate && new Date(rule.endDate) < now) return false;
    
    return true;
  });

  // Ordenar por prioridad (mayor prioridad primero)
  applicableRules.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  let totalDiscount = 0;
  const appliedDiscounts = [];

  // Calcular subtotal y cantidad total
  const cartSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Aplicar reglas de descuento
  for (const rule of applicableRules) {
    let ruleApplies = false;
    let discountAmount = 0;

    // Verificar condiciones de la regla
    switch (rule.conditionType) {
      case 'quantity':
        ruleApplies = totalQuantity >= (rule.minQuantity || 0) && 
                     (!rule.maxQuantity || totalQuantity <= rule.maxQuantity);
        break;
      case 'amount':
        ruleApplies = cartSubtotal >= (parseFloat(rule.minAmount) || 0) && 
                     (!rule.maxAmount || cartSubtotal <= parseFloat(rule.maxAmount));
        break;
      case 'both':
        ruleApplies = totalQuantity >= (rule.minQuantity || 0) && 
                     cartSubtotal >= (parseFloat(rule.minAmount) || 0) &&
                     (!rule.maxQuantity || totalQuantity <= rule.maxQuantity) &&
                     (!rule.maxAmount || cartSubtotal <= parseFloat(rule.maxAmount));
        break;
    }

    if (ruleApplies) {
      // Calcular descuento
      if (rule.discountType === 'percentage') {
        discountAmount = cartSubtotal * (parseFloat(rule.discountValue) / 100);
      } else if (rule.discountType === 'fixed_amount') {
        discountAmount = Math.min(parseFloat(rule.discountValue), cartSubtotal);
      }

      if (discountAmount > 0) {
        totalDiscount += discountAmount;
        appliedDiscounts.push({
          id: rule.id,
          name: rule.name,
          type: rule.discountType,
          value: rule.discountValue,
          amount: discountAmount
        });
        
        // Si queremos aplicar solo el primer descuento que aplique, podemos hacer break aquí
        // break;
      }
    }
  }

  return { totalDiscount, appliedDiscounts };
};


const getItemPriceDetails = (product, user) => {
  let price = product.originalPrice || product.price; // Precio base (normal)
  let isPromotionApplied = false;
  let potentialDistributorPrice = null;

  // 1. Precio de promoción tiene prioridad sobre el normal
  if (product.isPromotion && product.promotionPrice && product.promotionPrice < price) {
    price = product.promotionPrice;
    isPromotionApplied = true;
  }

  // 2. Determinar el precio potencial de distribuidor
  if (user?.role === 'Distributor' && user?.distributor && product.distributorPrice) {
    potentialDistributorPrice = product.distributorPrice;
  }

  return {
    basePrice: price, // Precio después de promoción (si aplica), antes de considerar distribuidor
    isPromotionApplied,
    potentialDistributorPrice,
  };
};


// Función principal para calcular el estado del carrito
const calculateCartState = (currentItems, user, discountRules = []) => {
  const newCartState = {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    appliedDiscounts: [],
    distributorPricesApplied: false,
    distributorMinimumRequired: 0,
    isDistributorMinimumMet: true,
    tempSubtotalDistributorPotential: 0,
  };

  if (!currentItems || currentItems.length === 0) {
    return newCartState;
  }

   let tempSubtotalForDistributorCheck = 0;
  const processedItemsPass1 = currentItems.map(item => {
    const details = getItemPriceDetails(item, user);
    let priceForDistributorCheck = details.basePrice;

    if (details.potentialDistributorPrice !== null && details.potentialDistributorPrice < priceForDistributorCheck) {
      priceForDistributorCheck = details.potentialDistributorPrice;
    }
    tempSubtotalForDistributorCheck += item.quantity * priceForDistributorCheck;
    
    return {
      ...item,
      _priceDetails: details,
    };
  });

  newCartState.tempSubtotalDistributorPotential = tempSubtotalForDistributorCheck;

  if (user?.role === 'Distributor' && user?.distributor) {
    newCartState.distributorMinimumRequired = parseFloat(user.distributor.minimumPurchase) || 0;
    if (newCartState.distributorMinimumRequired > 0 && tempSubtotalForDistributorCheck < newCartState.distributorMinimumRequired) {
      newCartState.isDistributorMinimumMet = false;
    } else {
      newCartState.isDistributorMinimumMet = true;
      newCartState.distributorPricesApplied = true;
    }
  } else {
    newCartState.isDistributorMinimumMet = true;
  }
// Segunda pasada: aplicar precios finales
  newCartState.items = processedItemsPass1.map(item => {
    let finalPrice = item._priceDetails.basePrice;
    let itemIsDistributorPrice = false;
    let itemIsPromotion = item._priceDetails.isPromotionApplied;
    let itemPriceReverted = false; // Definir la variable aquí

    if (newCartState.distributorPricesApplied && item._priceDetails.potentialDistributorPrice !== null) {
      if (item._priceDetails.potentialDistributorPrice < finalPrice) {
        finalPrice = item._priceDetails.potentialDistributorPrice;
        itemIsDistributorPrice = true;
        itemIsPromotion = false;
      }
    } else if (user?.role === 'Distributor' && item._priceDetails.potentialDistributorPrice !== null && item._priceDetails.potentialDistributorPrice < finalPrice) {
      // El precio de distribuidor sería mejor pero no se aplicó por no cumplir mínimo
      itemPriceReverted = true;
    }

    const itemTotal = item.quantity * finalPrice;
    newCartState.subtotal += itemTotal;

    return {
      ...item,
      price: finalPrice, // Precio efectivo final
      total: itemTotal,
      isPromotion: itemIsPromotion,
      isDistributorPrice: itemIsDistributorPrice,
      priceReverted: itemPriceReverted, // Flag si el precio de distribuidor no se aplicó por mínimo
      // Eliminar _priceDetails si no se necesita fuera de esta función
    };
  });

 // Aplicar reglas de descuento
  const discountResult = applyDiscountRules(newCartState.items, user, discountRules);
  newCartState.discount = discountResult.totalDiscount;
  newCartState.appliedDiscounts = discountResult.appliedDiscounts;
  newCartState.total = newCartState.subtotal - newCartState.discount;

  // Limpiar _priceDetails de los items finales
  newCartState.items.forEach(item => delete item._priceDetails);
  
  return newCartState;
};


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, user } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          ...product, 
          originalPrice: product.price,
          price: product.price,
          quantity: quantity,
          image: product.image_url?.[0] || product.image || null,
        });
      }
      
      const newState = calculateCartState(state.items, user);
      Object.assign(state, newState);
      state.isOpen = true;
    },

    applyDiscounts: (state, action) => {
      const { user, discountRules } = action.payload;
      const newState = calculateCartState(state.items, user, discountRules);
      Object.assign(state, newState);
    },

    recalculateCartOnUserChange: (state, action) => {
      const { user, discountRules } = action.payload;
      const newState = calculateCartState(state.items, user, discountRules);
      Object.assign(state, newState);
    },
    
    removeFromCart: (state, action) => {
      const { productId, user, discountRules } = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      const newState = calculateCartState(state.items, user, discountRules);
      Object.assign(state, newState);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity, user, discountRules } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      
      const newState = calculateCartState(state.items, user, discountRules);
      Object.assign(state, newState);
    },
    
    clearCart: (state) => {
      // Resetear a un estado limpio, considerando la estructura de initialState
      Object.assign(state, initialState, { items: [], isOpen: state.isOpen }); 
    },

    // Esta acción es crucial si el usuario se loguea/desloguea mientras hay items en el carrito
    recalculateCartOnUserChange: (state, action) => {
      const user = action.payload; // El nuevo objeto user (o null)
      const newState = calculateCartState(state.items, user);
      Object.assign(state, newState);
    },
    
    // No necesitamos validateDistributorMinimum ni calculateTotals como reducers separados
    // si calculateCartState lo maneja todo.

    clearDistributorWarning: (state) => {
      // Esta acción podría ser para que el usuario descarte una advertencia visual,
      // pero la lógica de precios se basa en isDistributorMinimumMet.
      // Si solo es visual, no necesita cambiar el estado de precios.
      // Si se quiere forzar la reevaluación, se podría llamar a recalculate con el user actual.
      // Por ahora, la dejamos simple, asumiendo que es solo para UI.
      // state.distributorWarningDismissed = true; // Ejemplo de flag visual
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
  recalculateCartOnUserChange, // Exportar la nueva acción
  applyDiscounts,
  clearDistributorWarning,
  toggleCart,
  setCartOpen
} = cartSlice.actions;

export default cartSlice.reducer;
