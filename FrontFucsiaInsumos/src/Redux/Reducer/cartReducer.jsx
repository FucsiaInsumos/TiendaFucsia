import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  subtotal: 0,
  discount: 0,
  isOpen: false,
  distributorPricesApplied: false,
  distributorMinimumRequired: 0,
  isDistributorMinimumMet: true,
  tempSubtotalDistributorPotential: 0, // Nuevo: Para mostrar el total que sería con precios de distribuidor
};

// --- Helper Functions ---
/**
 * Calcula el precio efectivo de un ítem y los flags correspondientes.
 * Esta función NO considera el mínimo de compra del distribuidor globalmente,
 * solo el precio potencial si todas las condiciones (excepto el mínimo total) se cumplen.
 */
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

/**
 * Recalcula todo el estado del carrito basado en los ítems y el usuario.
 * Esta es la función principal para mantener la consistencia.
 */
const calculateCartState = (currentItems, user) => {
  const newCartState = {
    items: [],
    subtotal: 0,
    total: 0,
    distributorPricesApplied: false,
    distributorMinimumRequired: 0,
    isDistributorMinimumMet: true,
    tempSubtotalDistributorPotential: 0, // Inicializar
  };

  if (!currentItems || currentItems.length === 0) {
    return newCartState;
  }

  let tempSubtotalForDistributorCheck = 0;
  const processedItemsPass1 = currentItems.map(item => {
    const details = getItemPriceDetails(item, user); // 'item' aquí es el producto del carrito
    let priceForDistributorCheck = details.basePrice;

    if (details.potentialDistributorPrice !== null && details.potentialDistributorPrice < priceForDistributorCheck) {
      priceForDistributorCheck = details.potentialDistributorPrice;
    }
    tempSubtotalForDistributorCheck += item.quantity * priceForDistributorCheck;
    
    return {
      ...item, // Mantiene id, name, sku, image, quantity, stock, originalPrice, etc.
      _priceDetails: details, // Guardar detalles intermedios
    };
  });

  // Guardar el subtotal potencial para mostrar en UI
  newCartState.tempSubtotalDistributorPotential = tempSubtotalForDistributorCheck;

  if (user?.role === 'Distributor' && user?.distributor) {
    newCartState.distributorMinimumRequired = parseFloat(user.distributor.minimumPurchase) || 0;
    if (newCartState.distributorMinimumRequired > 0 && tempSubtotalForDistributorCheck < newCartState.distributorMinimumRequired) {
      newCartState.isDistributorMinimumMet = false;
    } else {
      newCartState.isDistributorMinimumMet = true; // Mínimo cumplido o no aplica
      newCartState.distributorPricesApplied = true; // Los precios de distribuidor pueden aplicarse
    }
  } else {
    newCartState.isDistributorMinimumMet = true; // No es distribuidor, o no tiene mínimo
  }

  // Segunda pasada: aplicar precios finales
  newCartState.items = processedItemsPass1.map(item => {
    let finalPrice = item._priceDetails.basePrice;
    let itemIsDistributorPrice = false;
    let itemIsPromotion = item._priceDetails.isPromotionApplied;
    let itemPriceReverted = false;

    if (newCartState.distributorPricesApplied && item._priceDetails.potentialDistributorPrice !== null) {
      if (item._priceDetails.potentialDistributorPrice < finalPrice) {
        finalPrice = item._priceDetails.potentialDistributorPrice;
        itemIsDistributorPrice = true;
        itemIsPromotion = false; // Precio de distribuidor anula promo si es mejor
      }
    } else if (user?.role === 'Distributor' && !newCartState.isDistributorMinimumMet && item._priceDetails.potentialDistributorPrice !== null) {
      // Mínimo no cumplido, y este item PODRÍA haber tenido precio de distribuidor
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

  newCartState.total = newCartState.subtotal - (initialState.discount); // Aplicar descuento global si existe

  // Limpiar _priceDetails de los items finales
  newCartState.items.forEach(item => delete item._priceDetails);
  
  return newCartState;
};


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, user } = action.payload; // Esperar 'user' completo
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          // Guardar todos los datos relevantes del producto, incluyendo precios originales
          ...product, 
          originalPrice: product.price, // Asegurar que el precio original se guarda
          price: product.price, // Precio inicial antes de cálculos
          quantity: quantity,
          image: product.image_url?.[0] || product.image || null, // Manejar ambas estructuras de imagen
        });
      }
      
      const newState = calculateCartState(state.items, user);
      Object.assign(state, newState); // Actualizar el estado del carrito
      state.isOpen = true;
    },
    
    removeFromCart: (state, action) => {
      const { productId, user } = action.payload; // Esperar 'user'
      state.items = state.items.filter(item => item.id !== productId);
      
      const newState = calculateCartState(state.items, user);
      Object.assign(state, newState);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity, user } = action.payload; // Esperar 'user'
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      
      const newState = calculateCartState(state.items, user);
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
  clearDistributorWarning,
  toggleCart,
  setCartOpen
} = cartSlice.actions;

export default cartSlice.reducer;
