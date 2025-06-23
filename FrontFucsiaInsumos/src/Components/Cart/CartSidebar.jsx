import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {getDiscountRules} from '../../Redux/Actions/discountRuleActions';
import { removeFromCart, updateQuantity, setCartOpen, clearCart, clearDistributorWarning, applyDiscounts } from '../../Redux/Reducer/cartReducer';

const CartSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    items, 
    total, 
    subtotal,
    discount,
    appliedDiscounts,
    isOpen, 
    isDistributorMinimumMet, 
    distributorMinimumRequired,
    distributorPricesApplied,
    tempSubtotalDistributorPotential
  } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { discountRules } = useSelector(state => state.discountRules);

  // Cargar reglas de descuento al montar el componente
  useEffect(() => {
    dispatch(getDiscountRules());
  }, [dispatch]);

  // Aplicar descuentos cuando cambien los items del carrito, usuario o reglas
  useEffect(() => {
    if (items.length > 0 && discountRules.length > 0) {
      dispatch(applyDiscounts({ user, discountRules }));
    }
  }, [items.length, user?.n_document, discountRules.length, dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

   const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart({ productId, user, discountRules }));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity, user, discountRules }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId, user, discountRules }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirigir al login con redirect al checkout
      navigate('/login?redirect=checkout');
    } else {
      // Ir al checkout
      navigate('/checkout');
    }
    dispatch(setCartOpen(false));
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      dispatch(clearCart());
    }
  };

  const handleContinueShopping = () => {
    dispatch(setCartOpen(false));
    navigate('/catalogo');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => dispatch(setCartOpen(false))}
      ></div>
      
      {/* Sidebar - Ajustar para que se vea completo */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform flex flex-col">
        {/* Header - Fijo */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
          <h2 className="text-lg font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            </svg>
            Carrito ({items.length})
          </h2>
          <button
            onClick={() => dispatch(setCartOpen(false))}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items - Scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {/* Advertencia de monto mínimo para distribuidores */}
          {user?.role === 'Distributor' && !isDistributorMinimumMet && distributorMinimumRequired > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Mínimo de compra no alcanzado</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Para acceder a precios de distribuidor, tu pedido (con dichos precios) debe sumar al menos {formatPrice(distributorMinimumRequired)}.
                  </p>
                  <p className="text-sm text-yellow-600 font-medium">
                    Actualmente, tu pedido con precios de distribuidor sumaría: {formatPrice(tempSubtotalDistributorPotential)}.
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Por ello, se aplican precios normales o de promoción.
                  </p>
                </div>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
              </div>
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <button
                onClick={handleContinueShopping}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-3 bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm font-semibold ${
                        item.isDistributorPrice ? 'text-green-600' :
                        item.isPromotion ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {formatPrice(item.price)}
                      </span>
                      
                      {(item.isPromotion || item.isDistributorPrice) && item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-1">
                      {item.isDistributorPrice && (
                        <span className="bg-green-100 text-green-800 px-1 rounded font-medium">PRECIO DISTRIBUIDOR</span>
                      )}
                      {item.isPromotion && !item.isDistributorPrice && (
                        <span className="bg-red-100 text-red-800 px-1 rounded font-medium">OFERTA</span>
                      )}
                      {item.priceReverted && (
                         <span className="bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded font-medium text-[10px]">Mínimo no cumplido</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                        </svg>
                      </button>
                      <span className="px-3 py-1 text-sm font-medium bg-gray-50 min-w-[3rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.total)}
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center space-x-1 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      <span>Eliminar</span>
                    </button>
                    
                    {/* ✅ SOLO MOSTRAR STOCK A OWNER, ADMIN Y CASHIER */}
                    {(user?.role === 'Owner' || user?.role === 'Admin' || user?.role === 'Cashier') && (
                      <div className="text-xs text-gray-500">
                        Stock: {item.stock}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-gray-50 space-y-4 flex-shrink-0">
            {/* Información adicional para distribuidores */}
            {user?.role === 'Distributor' && user?.distributor && (
              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded mb-2">
                <p className="font-medium text-blue-800">💼 Estatus Distribuidor:</p>
                <p>Mínimo requerido: <span className="font-medium">{formatPrice(user.distributor.minimumPurchase)}</span></p>
                
                {distributorPricesApplied && isDistributorMinimumMet && (
                  <>
                    <p>Total actual (con precios de distribuidor): <span className="font-medium">{formatPrice(total)}</span></p>
                    <p className="text-green-600 font-medium mt-1">
                      ✅ Mínimo alcanzado - Precios de distribuidor aplicados.
                    </p>
                  </>
                )}
                {!isDistributorMinimumMet && distributorMinimumRequired > 0 && (
                  <>
                    <p>Total con precios de distribuidor sería: <span className="font-medium">{formatPrice(tempSubtotalDistributorPotential)}</span></p>
                    <p className="text-red-600 font-medium mt-1">
                      ⚠️ Mínimo no alcanzado. Se aplican precios normales/promo.
                    </p>
                     <p>Total actual (con precios normales/promo): <span className="font-medium">{formatPrice(total)}</span></p>
                  </>
                )}
              </div>
            )}

            {/* Resumen de precios */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              {/* Mostrar descuentos aplicados */}
              {appliedDiscounts && appliedDiscounts.length > 0 && (
                <div className="space-y-1">
                  {appliedDiscounts.map((discountItem, index) => (
                    <div key={index} className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        {discountItem.name}:
                      </span>
                      <span>-{formatPrice(discountItem.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-medium text-green-600 pt-1 border-t border-green-200">
                    <span>Total descuentos:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
              <span>Total:</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
            
            {/* Botones de acción */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                <span>{isAuthenticated ? 'Finalizar Compra' : 'Iniciar Sesión'}</span>
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
                >
                  Seguir comprando
                </button>
                
                <button
                  onClick={handleClearCart}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200 text-sm"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default CartSidebar;
