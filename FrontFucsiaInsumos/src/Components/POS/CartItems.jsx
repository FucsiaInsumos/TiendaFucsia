import React from 'react';
import { useSelector } from 'react-redux'; // ✅ AGREGAR IMPORT

const CartItems = ({ cart, onUpdateQuantity, onRemoveItem }) => {
  // ✅ OBTENER USUARIO ACTUAL
  const { user } = useSelector(state => state.auth);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H17M13 13v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
        </svg>
        <p>Carrito vacío</p>
        <p className="text-sm">Busca productos para agregar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {cart.map((item, index) => (
        <div key={`cart-item-${item.productId}-${index}`} className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">{item.product?.name || 'Producto'}</h4>
              <p className="text-xs text-gray-500">SKU: {item.product?.sku || 'Sin SKU'}</p>
            </div>
            <button
              onClick={() => onRemoveItem(item.productId)}
              className="text-red-500 hover:text-red-700 p-1"
              title="Eliminar producto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                disabled={item.quantity <= 1}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              
              <span className="w-12 text-center font-semibold">{item.quantity}</span>
              
              <button
                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                disabled={item.quantity >= (item.product?.stock || 0)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {formatPrice(parseFloat(item.subtotal) || (parseFloat(item.unitPrice) * parseInt(item.quantity)))}
              </div>
              <div className="text-xs text-gray-500">
                {formatPrice(parseFloat(item.unitPrice) || 0)} c/u
              </div>
              
              {/* Mostrar información de descuentos aplicados */}
              <div className="text-xs mt-1">
                {item.isDistributorPrice && (
                  <span className="bg-green-100 text-green-800 px-1 rounded font-medium text-[10px]">
                    PRECIO DISTRIBUIDOR
                  </span>
                )}
                {item.isPromotion && !item.isDistributorPrice && (
                  <span className="bg-red-100 text-red-800 px-1 rounded font-medium text-[10px]">
                    PROMOCIÓN
                  </span>
                )}
                {item.priceReverted && (
                  <span className="bg-yellow-100 text-yellow-800 px-1 rounded font-medium text-[10px]">
                    MÍNIMO NO CUMPLIDO
                  </span>
                )}
              </div>
              
              {/* Mostrar precio original si hay descuento */}
              {(item.isDistributorPrice || item.isPromotion) && item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.unitPrice) && (
                <div className="text-xs text-gray-400 line-through">
                  {formatPrice(parseFloat(item.originalPrice))} c/u
                </div>
              )}
              
              {item.appliedDiscount > 0 && (
                <div className="text-xs text-green-600">
                  Desc: -{formatPrice(parseFloat(item.appliedDiscount))}
                </div>
              )}
            </div>
          </div>

          {/* ✅ SOLO MOSTRAR STOCK AL OWNER, ADMIN Y CASHIER */}
          {(user?.role === 'Owner' || user?.role === 'Admin' || user?.role === 'Cashier') && (
            <div className="mt-2 text-xs text-gray-500 text-right">
              Stock disponible: {item.product?.stock || 0}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CartItems;



