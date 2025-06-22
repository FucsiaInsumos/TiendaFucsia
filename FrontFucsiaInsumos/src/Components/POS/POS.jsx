import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductSearch from './ProductSearch';
import CartItems from './CartItems';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal'; // ✅ NUEVO IMPORT
import CustomerSelector from './CustomerSelector';
import { createOrder, calculateProductPrices } from '../../Redux/Actions/salesActions';
import { getProducts } from '../../Redux/Actions/productActions';
import { getDiscountRules } from '../../Redux/Actions/discountRuleActions';

const POS = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false); // ✅ NUEVO ESTADO
  const [completedOrder, setCompletedOrder] = useState(null); // ✅ NUEVO ESTADO
  const [orderTotal, setOrderTotal] = useState({
    subtotal: 0,
    discount: 0,
    total: 0,
    distributorMinimumMet: false,
    distributorMinimumRequired: 0
  });
  const [loading, setLoading] = useState(false);
  const isCalculatingRef = useRef(false);

   // NUEVO ESTADO para reglas de descuento
  const [discountRules, setDiscountRules] = useState([]);

  useEffect(() => {
    loadProducts();
    loadDiscountRules(); // NUEVA FUNCIÓN
  }, []);

  // NUEVA FUNCIÓN - Cargar reglas de descuento
  const loadDiscountRules = async () => {
    try {
      const response = await dispatch(getDiscountRules());
      setDiscountRules(response.data || []);
      console.log('Reglas de descuento cargadas:', response.data?.length || 0);
    } catch (error) {
      console.error('Error loading discount rules:', error);
      setDiscountRules([]);
    }
  };

  // NUEVA FUNCIÓN - Aplicar reglas de descuento (similar al backend)
  const applyDiscountRules = (cartItems, customer) => {
    if (!discountRules || discountRules.length === 0) {
      return { totalDiscount: 0, appliedDiscounts: [] };
    }

     const userType = customer?.role === 'Distributor' ? 'distributors' : 'customers';
    const now = new Date();
    
    // Filtrar reglas aplicables
    const applicableRules = discountRules.filter(rule => {
      // Verificar si está activa
      if (!rule.isActive) return false;
      
      // Verificar fechas
      if (rule.startDate && new Date(rule.startDate) > now) return false;
      if (rule.endDate && new Date(rule.endDate) < now) return false;
      
      // Verificar tipo de usuario
      return rule.applicableFor === 'all' || rule.applicableFor === userType;
    });

    console.log(`Reglas aplicables para ${customer?.role || 'sin cliente'}:`, applicableRules.map(r => r.name));

    // Calcular totales del carrito
    const cartSubtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

    let totalDiscount = 0;
    const appliedDiscounts = [];

    // Aplicar cada regla aplicable
    for (const rule of applicableRules) {
      let ruleApplies = false;

      // Verificar condiciones
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
          const quantityOk = totalQuantity >= (rule.minQuantity || 0) && 
                           (!rule.maxQuantity || totalQuantity <= rule.maxQuantity);
          const amountOk = cartSubtotal >= (parseFloat(rule.minAmount) || 0) && 
                          (!rule.maxAmount || cartSubtotal <= parseFloat(rule.maxAmount));
          ruleApplies = quantityOk && amountOk;
          break;
      }

      // Si aplica la regla, calcular descuento
      if (ruleApplies) {
        let discountAmount = 0;
        
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

          console.log(`✅ Descuento aplicado: ${rule.name} - ${discountAmount}`);
        }
      }
    }

    return { totalDiscount, appliedDiscounts };
  };


  const loadProducts = async () => {
    try {
      const response = await dispatch(getProducts());
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const addToCart = (product) => {
    console.log('=== AGREGANDO PRODUCTO ===');
    console.log('Producto:', product.name, 'ID:', product.id);
    
    setCart(prevCart => {
      console.log('Carrito actual antes de agregar:', prevCart.map(item => ({ id: item.productId, name: item.product?.name })));
      
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        console.log('Producto YA EXISTE, incrementando cantidad');
        return prevCart.map(item => 
          item.productId === product.id 
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.unitPrice
              }
            : item
        );
      } else {
        console.log('NUEVO PRODUCTO, agregando al carrito');
        // Calcular precio efectivo basado en el cliente seleccionado
        const effectivePrice = calculateEffectivePrice(product, selectedCustomer);
        
        const newItem = {
          productId: product.id,
          product: product,
          quantity: 1,
          unitPrice: effectivePrice.price,
          subtotal: effectivePrice.price,
          isDistributorPrice: effectivePrice.isDistributorPrice || false,
          isPromotion: effectivePrice.isPromotion || false,
          originalPrice: product.price,
          priceReverted: false
        };
        
        const newCart = [...prevCart, newItem];
        console.log('Nuevo carrito creado:', newCart.map(item => ({ id: item.productId, name: item.product?.name })));
        return newCart;
      }
    });
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
    console.log(`Actualizando item ${productId} a cantidad ${quantity}`);
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.productId === productId) {
          const newSubtotal = parseInt(quantity) * parseFloat(item.unitPrice);
          console.log(`Item ${productId}: nueva cantidad ${quantity}, precio unitario ${item.unitPrice}, nuevo subtotal ${newSubtotal}`);
          
          return {
            ...item, 
            quantity: parseInt(quantity),
            subtotal: newSubtotal
          };
        }
        return item;
      });
      
      console.log('Carrito después de actualizar cantidad:', updatedCart.map(item => ({ 
        id: item.productId, 
        name: item.product?.name, 
        qty: item.quantity, 
        subtotal: item.subtotal 
      })));
      
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    console.log('Limpiando carrito');
    setCart([]);
    setSelectedCustomer(null);
    setOrderTotal({
      subtotal: 0,
      discount: 0,
      total: 0,
      distributorMinimumMet: true,
      distributorMinimumRequired: 0
    });
  };

  // Efecto para calcular totales cuando cambie el carrito o cliente - SIMPLIFICADO
  useEffect(() => {
    // Solo ejecutar si no estamos ya calculando
    if (isCalculatingRef.current) {
      return;
    }

    if (cart.length === 0) {
      setOrderTotal({
        subtotal: 0,
        discount: 0,
        total: 0,
        distributorMinimumMet: true,
        distributorMinimumRequired: 0
      });
      return;
    }

    const timeoutId = setTimeout(() => {
      calculateTotals();
    }, 200); // Timeout más corto

    return () => clearTimeout(timeoutId);
  }, [
    cart.length, 
    selectedCustomer?.n_document,
    // Agregar dependencia de las cantidades y subtotales para que recalcule cuando cambien
    cart.map(item => `${item.productId}:${item.quantity}:${item.subtotal}`).join('|')
  ]);

  // ACTUALIZAR la función calculateTotals existente
const calculateTotals = () => {
  if (isCalculatingRef.current) {
    console.log('Ya se está calculando, saltando...');
    return;
  }

  isCalculatingRef.current = true;

  if (cart.length === 0) {
    setOrderTotal({ 
      subtotal: 0, 
      discount: 0, 
      total: 0, 
      distributorMinimumMet: true, 
      distributorMinimumRequired: 0,
      appliedDiscounts: []
    });
    isCalculatingRef.current = false;
    return;
  }

  console.log('=== CALCULANDO TOTALES CON DESCUENTOS ===');
  console.log('Cliente seleccionado:', selectedCustomer?.role);

  try {
    // Calcular subtotal base
    let currentSubtotal = 0;
    cart.forEach(item => {
      const itemSubtotal = parseFloat(item.subtotal) || (parseFloat(item.unitPrice) * parseInt(item.quantity));
      currentSubtotal += itemSubtotal;
    });

    console.log('Subtotal base calculado:', currentSubtotal);

    // Si es distribuidor, aplicar lógica especial
    if (selectedCustomer?.role === 'Distributor' && selectedCustomer.distributor) {
      console.log('Procesando como distribuidor...');
      
      const minimumRequired = parseFloat(selectedCustomer.distributor.minimumPurchase) || 0;
      
      // Calcular qué sería el subtotal con precios de distribuidor
      let subtotalWithDistributorPrices = 0;
      cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          let bestPrice = parseFloat(product.price);
          
          // Comparar con precio de promoción
          if (product.isPromotion && product.promotionPrice) {
            const promoPrice = parseFloat(product.promotionPrice);
            if (promoPrice < bestPrice) {
              bestPrice = promoPrice;
            }
          }
          
          // Comparar con precio de distribuidor
          if (product.distributorPrice) {
            const distPrice = parseFloat(product.distributorPrice);
            if (distPrice < bestPrice) {
              bestPrice = distPrice;
            }
          }
          
          subtotalWithDistributorPrices += bestPrice * parseInt(item.quantity);
        }
      });

      console.log('Subtotal con precios distribuidor:', subtotalWithDistributorPrices);
      console.log('Mínimo requerido:', minimumRequired);

      // Determinar si aplicar precios de distribuidor
      const shouldApplyDistributorPrices = minimumRequired <= 0 || subtotalWithDistributorPrices >= minimumRequired;
      
      if (shouldApplyDistributorPrices) {
        console.log('✅ Aplicando precios de distribuidor');
        
        // Recalcular carrito con precios de distribuidor
        const updatedCart = cart.map(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            let bestPrice = parseFloat(product.price);
            let appliedPriceType = 'normal';
            
            // Comparar con precio de promoción
            if (product.isPromotion && product.promotionPrice) {
              const promoPrice = parseFloat(product.promotionPrice);
              if (promoPrice < bestPrice) {
                bestPrice = promoPrice;
                appliedPriceType = 'promocion';
              }
            }
            
            // Comparar con precio de distribuidor
            if (product.distributorPrice) {
              const distPrice = parseFloat(product.distributorPrice);
              if (distPrice < bestPrice) {
                bestPrice = distPrice;
                appliedPriceType = 'distribuidor';
              }
            }
            
            return {
              ...item,
              unitPrice: bestPrice.toFixed(2),
              subtotal: (bestPrice * parseInt(item.quantity)).toFixed(2),
              appliedPriceType
            };
          }
          return item;
        });

        // Actualizar el carrito con los nuevos precios
        setCart(updatedCart);
        
        // Recalcular subtotal con precios actualizados
        currentSubtotal = updatedCart.reduce((sum, item) => {
          return sum + parseFloat(item.subtotal);
        }, 0);
        
        console.log('Subtotal con precios distribuidor aplicados:', currentSubtotal);
      } else {
        console.log('❌ No aplicando precios de distribuidor - Mínimo no cumplido');
      }

      // Aplicar reglas de descuento
      const discountResult = applyDiscountRules(cart, selectedCustomer);
      const finalTotal = currentSubtotal - discountResult.totalDiscount;

      console.log('Descuentos aplicados:', discountResult.totalDiscount);
      console.log('Total final:', finalTotal);

      setOrderTotal({
        subtotal: currentSubtotal,
        discount: discountResult.totalDiscount,
        total: finalTotal,
        distributorMinimumMet: shouldApplyDistributorPrices,
        distributorMinimumRequired: minimumRequired,
        tempSubtotalDistributorPotential: shouldApplyDistributorPrices ? undefined : subtotalWithDistributorPrices,
        appliedDiscounts: discountResult.appliedDiscounts
      });

    } else {
      // Cliente regular o sin cliente
      console.log('Procesando como cliente regular...');
      
      // Aplicar reglas de descuento
      const discountResult = applyDiscountRules(cart, selectedCustomer);
      const finalTotal = currentSubtotal - discountResult.totalDiscount;

      console.log('Subtotal cliente regular:', currentSubtotal);
      console.log('Descuentos aplicados:', discountResult.totalDiscount);
      console.log('Total final:', finalTotal);

      setOrderTotal({
        subtotal: currentSubtotal,
        discount: discountResult.totalDiscount,
        total: finalTotal,
        distributorMinimumMet: true,
        distributorMinimumRequired: 0,
        appliedDiscounts: discountResult.appliedDiscounts
      });
    }

  } catch (error) {
    console.error('Error en calculateTotals:', error);
    setOrderTotal({
      subtotal: currentSubtotal || 0,
      discount: 0,
      total: currentSubtotal || 0,
      distributorMinimumMet: true,
      distributorMinimumRequired: 0,
      appliedDiscounts: []
    });
  } finally {
    isCalculatingRef.current = false;
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
      console.log('Datos de pago recibidos:', paymentData);

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
        notes: paymentData.notes,
        extraDiscountPercentage: paymentData.extraDiscountPercentage || 0
      };

      console.log('Datos de orden enviados al backend:', orderData);

      const response = await dispatch(createOrder(orderData));
      
      if (response.error === false) {
        // ✅ MOSTRAR EL RECIBO EN LUGAR DEL ALERT
        setCompletedOrder(response.data);
        setShowReceiptModal(true);
        
        clearCart();
        setShowPaymentModal(false);
        
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
                      Mínimo requerido: {new Intl.NumberFormat('es-CO', { 
                        style: 'currency', 
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(orderTotal.distributorMinimumRequired || 0)}
                    </p>
                    {!orderTotal.distributorMinimumMet && orderTotal.tempSubtotalDistributorPotential && (
                      <>
                        <p className="text-xs text-yellow-700 mt-1">
                          ⚠️ Mínimo no alcanzado - Aplicando precios regulares/promoción
                        </p>
                        <p className="text-xs text-gray-600">
                          Con precios de distribuidor sumaría: {new Intl.NumberFormat('es-CO', { 
                            style: 'currency', 
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(orderTotal.tempSubtotalDistributorPotential)}
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
    <span>{new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(orderTotal.subtotal)}</span>
  </div>
                 {orderTotal.discount > 0 && (
    <>
      {orderTotal.appliedDiscounts && orderTotal.appliedDiscounts.length > 0 ? (
        // Mostrar descuentos detallados
        <>
          <div className="text-sm font-medium text-gray-700 border-t pt-2">Descuentos aplicados:</div>
          {orderTotal.appliedDiscounts.map((discount, index) => (
            <div key={index} className="flex justify-between text-sm text-green-600 pl-4">
              <span>• {discount.name}:</span>
              <span>-{new Intl.NumberFormat('es-CO', { 
                style: 'currency', 
                currency: 'COP',
                minimumFractionDigits: 0
              }).format(discount.amount)}</span>
            </div>
          ))}
        </>
      ): (
        // Solo mostrar total de descuentos
        <div className="flex justify-between text-green-600">
          <span>Descuentos:</span>
          <span>-{new Intl.NumberFormat('es-CO', { 
            style: 'currency', 
            currency: 'COP',
            minimumFractionDigits: 0
          }).format(orderTotal.discount)}</span>
        </div>
      )}
    </>
  )}
                  <div className="flex justify-between text-xl font-bold text-indigo-600 border-t pt-2">
    <span>Total:</span>
    <span>{new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(orderTotal.total)}</span>
  </div>
   {orderTotal.discount > 0 && (
    <div className="text-sm text-green-600 text-center font-medium">
      💰 ¡Ahorro total: {new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(orderTotal.discount)}!
    </div>
  )}
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

      {/* ✅ NUEVO: Modal de recibo */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        order={completedOrder}
      />
    </div>
  );
};

export default POS;

