import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductSearch from './ProductSearch';
import CartItems from './CartItems';
import PaymentModal from './PaymentModal';
import CustomerSelector from './CustomerSelector';
import { createOrder, calculateProductPrices } from '../../Redux/Actions/salesActions';
import { getProducts } from '../../Redux/Actions/productActions';

const POS = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderTotal, setOrderTotal] = useState({
    subtotal: 0,
    discount: 0,
    total: 0,
    distributorMinimumMet: false,
    distributorMinimumRequired: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      calculateTotals();
    } else {
      setOrderTotal({ subtotal: 0, discount: 0, total: 0 });
    }
  }, [cart, selectedCustomer]);

  const loadProducts = async () => {
    try {
      const response = await dispatch(getProducts());
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    // Calcular precio efectivo basado en el cliente seleccionado
    const effectivePrice = calculateEffectivePrice(product, selectedCustomer);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.unitPrice // Usar el precio ya establecido del item
            }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: effectivePrice.price,
        subtotal: effectivePrice.price,
        isDistributorPrice: effectivePrice.isDistributorPrice || false,
        isPromotion: effectivePrice.isPromotion || false,
        originalPrice: product.price,
        priceReverted: false
      }]);
    }
  };

  const calculateEffectivePrice = (product, customer) => {
    let bestPrice = product.price;
    let priceType = { isDistributorPrice: false, isPromotion: false };
    
    // Primero evaluar promoción
    if (product.isPromotion && product.promotionPrice && product.promotionPrice < bestPrice) {
      bestPrice = product.promotionPrice;
      priceType.isPromotion = true;
    }
    
    // Si hay cliente distribuidor, evaluar precio de distribuidor
    if (customer?.role === 'Distributor' && customer.distributor && product.distributorPrice) {
      // Si el precio de distribuidor es mejor que el mejor precio actual, usarlo
      if (product.distributorPrice < bestPrice) {
        bestPrice = product.distributorPrice;
        priceType = { isDistributorPrice: true, isPromotion: false };
      }
    }
    
    return {
      price: bestPrice,
      ...priceType,
      originalPrice: product.price
    };
  };

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { 
              ...item, 
              quantity, 
              subtotal: quantity * item.unitPrice 
            }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  const calculateTotals = async () => {
    if (cart.length === 0) {
      setOrderTotal({ subtotal: 0, discount: 0, total: 0, distributorMinimumMet: true, distributorMinimumRequired: 0 });
      return;
    }

    // Si tenemos cliente distribuidor, necesitamos verificar el mínimo
    if (selectedCustomer?.role === 'Distributor' && selectedCustomer.distributor) {
      const minimumRequired = parseFloat(selectedCustomer.distributor.minimumPurchase) || 0;
      
      console.log('Cliente distribuidor detectado:', selectedCustomer.first_name, selectedCustomer.last_name);
      console.log('Mínimo requerido:', minimumRequired);
      
      // Calcular el subtotal que tendríamos con precios de distribuidor aplicados
      let subtotalWithDistributorPrices = 0;
      const potentialCartWithDistributor = cart.map(item => {
        const distributorPrice = calculateEffectivePrice(item.product, selectedCustomer);
        subtotalWithDistributorPrices += item.quantity * distributorPrice.price;
        return {
          ...item,
          potentialUnitPrice: distributorPrice.price,
          potentialIsDistributorPrice: distributorPrice.isDistributorPrice,
          potentialIsPromotion: distributorPrice.isPromotion
        };
      });

      console.log('Subtotal con precios de distribuidor:', subtotalWithDistributorPrices);
      console.log('¿Cumple mínimo?', subtotalWithDistributorPrices >= minimumRequired);

      // Si cumple el mínimo, aplicar precios de distribuidor
      if (minimumRequired === 0 || subtotalWithDistributorPrices >= minimumRequired) {
        const updatedCart = cart.map(item => {
          const newPrice = calculateEffectivePrice(item.product, selectedCustomer);
          return {
            ...item,
            unitPrice: newPrice.price,
            subtotal: item.quantity * newPrice.price,
            isDistributorPrice: newPrice.isDistributorPrice,
            isPromotion: newPrice.isPromotion,
            priceReverted: false
          };
        });
        
        setCart(updatedCart);
        const newSubtotal = updatedCart.reduce((sum, item) => sum + item.subtotal, 0);
        
        setOrderTotal({
          subtotal: newSubtotal,
          discount: 0,
          total: newSubtotal,
          distributorMinimumMet: true,
          distributorMinimumRequired: minimumRequired
        });
        
        console.log('Precios de distribuidor aplicados. Nuevo total:', newSubtotal);
        return;
      } else {
        // No cumple el mínimo, usar precios normales/promoción pero marcar como revertido
        const updatedCart = cart.map(item => {
          const normalPrice = calculateEffectivePriceWithoutDistributor(item.product);
          return {
            ...item,
            unitPrice: normalPrice.price,
            subtotal: item.quantity * normalPrice.price,
            isDistributorPrice: false,
            isPromotion: normalPrice.isPromotion,
            priceReverted: true
          };
        });
        
        setCart(updatedCart);
        const newSubtotal = updatedCart.reduce((sum, item) => sum + item.subtotal, 0);
        
        setOrderTotal({
          subtotal: newSubtotal,
          discount: 0,
          total: newSubtotal,
          distributorMinimumMet: false,
          distributorMinimumRequired: minimumRequired,
          tempSubtotalDistributorPotential: subtotalWithDistributorPrices
        });
        
        console.log('Mínimo no cumplido. Aplicando precios normales. Total:', newSubtotal);
        return;
      }
    }

    // Cálculo normal para clientes regulares
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    setOrderTotal({
      subtotal,
      discount: 0,
      total: subtotal,
      distributorMinimumMet: true,
      distributorMinimumRequired: 0
    });
  };

  const calculateEffectivePriceWithoutDistributor = (product) => {
    // Solo evaluar precio normal vs promoción (sin distribuidor)
    if (product.isPromotion && product.promotionPrice && product.promotionPrice < product.price) {
      return {
        price: product.promotionPrice,
        isPromotion: true,
        originalPrice: product.price
      };
    }
    
    return {
      price: product.price,
      isPromotion: false,
      originalPrice: product.price
    };
  };

  // Recalcular cuando cambie el cliente seleccionado
  useEffect(() => {
    if (cart.length > 0) {
      console.log('Cliente cambió o carrito se actualizó, recalculando...');
      calculateTotals();
    }
  }, [selectedCustomer]); // Solo cuando cambie el cliente

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    if (!selectedCustomer) {
      alert('Selecciona un cliente');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentData) => {
    setLoading(true);
    try {
      const orderData = {
        userId: selectedCustomer.n_document,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        orderType: 'local',
        paymentMethod: paymentData.method,
        paymentDetails: paymentData.details,
        cashierId: user.n_document,
        notes: paymentData.notes
      };

      const response = await dispatch(createOrder(orderData));
      
      if (response.error === false) {
        alert('Venta completada exitosamente');
        clearCart();
        setShowPaymentModal(false);
        
        // Aquí podrías abrir un modal para imprimir ticket
        console.log('Orden creada:', response.data);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar la venta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-6">
            <h1 className="text-2xl font-bold">Punto de Venta</h1>
            <p className="text-indigo-200">Cajero: {user.first_name} {user.last_name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Panel izquierdo - Búsqueda y productos */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selector de cliente */}
              <CustomerSelector
                selectedCustomer={selectedCustomer}
                onCustomerSelect={setSelectedCustomer}
              />

              {/* Búsqueda de productos */}
              <ProductSearch
                products={products}
                onAddToCart={addToCart}
                selectedCustomer={selectedCustomer}
              />
            </div>

            {/* Panel derecho - Carrito y totales */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Carrito de Compras</h2>
              
              <CartItems
                cart={cart}
                onUpdateQuantity={updateCartItem}
                onRemoveItem={removeFromCart}
              />

              {/* Totales */}
              <div className="border-t pt-4 mt-4">
                {selectedCustomer?.role === 'Distributor' && selectedCustomer.distributor && (
                  <div className={`mb-3 p-3 border rounded ${
                    orderTotal.distributorMinimumMet 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <p className={`text-sm font-medium ${
                      orderTotal.distributorMinimumMet ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      🏢 Cliente Distribuidor: {selectedCustomer.first_name} {selectedCustomer.last_name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Mínimo requerido: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(orderTotal.distributorMinimumRequired)}
                    </p>
                    {!orderTotal.distributorMinimumMet && orderTotal.tempSubtotalDistributorPotential && (
                      <>
                        <p className="text-xs text-yellow-700 mt-1">
                          ⚠️ Mínimo no alcanzado - Aplicando precios regulares/promoción
                        </p>
                        <p className="text-xs text-gray-600">
                          Con precios de distribuidor sumaría: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(orderTotal.tempSubtotalDistributorPotential)}
                        </p>
                      </>
                    )}
                    {orderTotal.distributorMinimumMet && (
                      <p className="text-xs text-green-700 mt-1">
                        ✅ Precios de distribuidor aplicados
                      </p>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${orderTotal.subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  {orderTotal.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-${orderTotal.discount.toLocaleString('es-CO')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${orderTotal.total.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || !selectedCustomer}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                >
                  {cart.length === 0 ? 'Carrito Vacío' : 
                   !selectedCustomer ? 'Selecciona Cliente' : 
                   'Procesar Venta'}
                </button>
                
                <button
                  onClick={clearCart}
                  disabled={cart.length === 0}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                >
                  Limpiar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de pago */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderTotal={orderTotal}
          onPaymentComplete={handlePaymentComplete}
          loading={loading}
          selectedCustomer={selectedCustomer}
        />
      )}
    </div>
  );
};

export default POS;
