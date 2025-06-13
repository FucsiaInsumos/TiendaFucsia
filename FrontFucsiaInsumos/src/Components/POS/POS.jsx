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
    total: 0
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
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price
      }]);
    }
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
    if (cart.length === 0) return;

    try {
      const calculationData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        userType: selectedCustomer?.role === 'Distributor' ? 'distributors' : 'customers',
        userId: selectedCustomer?.n_document || null
      };

      const response = await dispatch(calculateProductPrices(calculationData));
      
      if (response.error === false) {
        const { summary } = response.data;
        setOrderTotal({
          subtotal: summary.subtotal,
          discount: summary.totalDiscount,
          total: summary.total
        });

        // Actualizar precios en el carrito
        setCart(prevCart => 
          prevCart.map(cartItem => {
            const calculatedItem = response.data.items.find(
              item => item.productId === cartItem.productId
            );
            if (calculatedItem) {
              return {
                ...cartItem,
                unitPrice: calculatedItem.basePrice,
                appliedDiscount: calculatedItem.itemDiscount,
                subtotal: calculatedItem.finalPrice
              };
            }
            return cartItem;
          })
        );
      }
    } catch (error) {
      console.error('Error calculating totals:', error);
      // Fallback: calcular totales simples
      const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
      setOrderTotal({ subtotal, discount: 0, total: subtotal });
    }
  };

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
                  Procesar Venta
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
        />
      )}
    </div>
  );
};

export default POS;
