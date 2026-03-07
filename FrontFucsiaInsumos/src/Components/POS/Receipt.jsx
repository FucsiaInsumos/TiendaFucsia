import React from 'react';
import logo from '../../../public/logo.jpg';

const Receipt = ({ order, onPrint, onDownload }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getPaymentMethodInfo = (method) => {
    const methods = {
      'efectivo': { icon: '💵', label: 'Efectivo' },
      'tarjeta': { icon: '💳', label: 'Tarjeta' },
      'nequi': { icon: '📱', label: 'Nequi' },
      'bancolombia': { icon: '🏦', label: 'Bancolombia' },
      'daviplata': { icon: '📱', label: 'Daviplata' },
      'credito': { icon: '📄', label: 'Crédito' },
      'wompi': { icon: '🌐', label: 'Wompi' }
    };
    return methods[method] || { icon: '💰', label: method };
  };

  return (
    <div className="bg-white" id="receipt">
      {/* Contenedor principal optimizado para impresión térmica */}
      <div className="receipt-content max-w-sm mx-auto p-4 font-mono text-sm">
        
        {/* Header con logo y título */}
        <div className="text-center mb-4 border-b-2 border-dashed border-gray-400 pb-4">
          <div className="mb-3">
            <img 
              src={logo} 
              alt="Tienda Fucsia Logo" 
              className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-gray-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-lg font-bold uppercase tracking-wide">FUCSIA INSUMOS</h1>
          <p className="text-xs text-gray-600 mt-1">GABRIEL ROLDÁN LEÓN</p>
          <p className="text-xs text-gray-500 mt-1">NIT:122647296-4</p>
          <p className="text-xs text-gray-500 mt-1">NO responsable de IVA</p>
          <div className="mt-2">
            <p className="text-xs font-semibold">RECIBO DE VENTA</p>
            <p className="text-xs font-mono">No. {order.orderNumber}</p>
          </div>
        </div>

        {/* Información de la venta */}
        <div className="mb-4 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="font-semibold">Fecha:</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Tipo:</span>
            <span>
              {order.orderType === 'local' ? '🏪 Local' :
               order.orderType === 'online' ? '🌐 Online' : 
               '📦 Distribuidor'}
            </span>
          </div>
          {order.cashier && (
            <div className="flex justify-between">
              <span className="font-semibold">Cajero:</span>
              <span>{order.cashier.first_name}</span>
            </div>
          )}
        </div>

        {/* Información del cliente */}
        <div className="mb-4 text-xs border-b border-dashed border-gray-300 pb-3">
          <p className="font-semibold mb-1">CLIENTE:</p>
          {order.customer?.first_name === 'Cliente' && order.customer?.last_name === 'Local' ? (
            <p className="text-gray-600">Cliente Local (Sin registro)</p>
          ) : (
            <div className="space-y-1">
              <p className="font-medium">{order.customer?.first_name} {order.customer?.last_name}</p>
              <p className="text-gray-600">CC: {order.customer?.n_document}</p>
              {order.customer?.role === 'Distributor' && (
                <p className="text-blue-600 font-semibold">⭐ DISTRIBUIDOR</p>
              )}
            </div>
          )}
        </div>

        {/* Lista de productos */}
        <div className="mb-4">
          <p className="font-semibold text-xs mb-3 text-center border-b border-gray-300 pb-1">
            PRODUCTOS
          </p>
          
          {/* Header de la tabla */}
          <div className="text-xs border-b border-gray-300 pb-1 mb-2">
            <div className="grid grid-cols-12 gap-1 font-semibold">
              <div className="col-span-6">ITEM</div>
              <div className="col-span-2 text-center">CANT</div>
              <div className="col-span-2 text-right">PRECIO</div>
              <div className="col-span-2 text-right">TOTAL</div>
            </div>
          </div>

          {/* Items */}
          {order.items?.map((item, index) => (
            <div key={index} className="text-xs mb-2">
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-6">
                  <p className="font-medium leading-tight">{item.product?.name}</p>
                  {item.product?.sku && (
                    <p className="text-gray-500 text-xs">SKU: {item.product.sku}</p>
                  )}
                </div>
                <div className="col-span-2 text-center">
                  {item.quantity}
                </div>
                <div className="col-span-2 text-right">
                  {formatPrice(item.unitPrice)}
                </div>
                <div className="col-span-2 text-right font-medium">
                  {formatPrice(item.subtotal)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="border-t-2 border-dashed border-gray-400 pt-3 mb-4">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono">{formatPrice(order.subtotal)}</span>
            </div>
            
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuentos:</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            )}
            
            <div className="border-t border-gray-300 pt-1 mt-2">
              <div className="flex justify-between text-base font-bold">
                <span>TOTAL:</span>
                <span className="font-mono">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="mb-4 border-b border-dashed border-gray-300 pb-3">
          <p className="font-semibold text-xs mb-2 text-center">FORMA DE PAGO</p>
          
          {order.payments?.length > 1 ? (
            // Pago combinado
            <div className="space-y-1">
              <p className="text-xs text-center text-blue-600 font-semibold mb-2">
                🔄 PAGO COMBINADO
              </p>
              {order.payments.map((payment, index) => {
                const methodInfo = getPaymentMethodInfo(payment.method);
                return (
                  <div key={index} className="flex justify-between text-xs">
                    <span>{methodInfo.icon} {methodInfo.label}</span>
                    <span className="font-mono">{formatPrice(payment.amount)}</span>
                  </div>
                );
              })}
              <div className="border-t border-gray-300 pt-1 mt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Total Pagado:</span>
                  <span className="font-mono">
                    {formatPrice(order.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0))}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Pago único
            order.payments?.map((payment, index) => {
              const methodInfo = getPaymentMethodInfo(payment.method);
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{methodInfo.icon} {methodInfo.label}</span>
                    <span className="font-mono">{formatPrice(payment.amount)}</span>
                  </div>
                  
                  {/* Detalles específicos del método */}
                  {payment.method === 'efectivo' && payment.paymentDetails?.amountReceived && (
                    <div className="text-xs text-gray-600 mt-1 space-y-1">
                      <div className="flex justify-between">
                        <span>Recibido:</span>
                        <span>{formatPrice(payment.paymentDetails.amountReceived)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cambio:</span>
                        <span>{formatPrice(Math.max(0, payment.paymentDetails.amountReceived - payment.amount))}</span>
                      </div>
                    </div>
                  )}
                  
                  {payment.method === 'tarjeta' && payment.paymentDetails?.authNumber && (
                    <div className="text-xs text-gray-600 mt-1">
                      <p>Auth: {payment.paymentDetails.authNumber}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Ahorros si existen */}
        {order.discount > 0 && (
          <div className="mb-4 text-center bg-green-50 border border-green-200 rounded p-2">
            <p className="text-xs font-semibold text-green-700">
              🎉 ¡AHORRO TOTAL!
            </p>
            <p className="text-sm font-bold text-green-600">
              {formatPrice(order.discount)}
            </p>
          </div>
        )}

        {/* Notas adicionales */}
        {order.notes && (
          <div className="mb-4 text-xs text-gray-600">
            <p className="font-semibold mb-1">NOTAS:</p>
            <p className="whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t-2 border-dashed border-gray-400 pt-3">
          <p className="font-semibold mb-2">¡GRACIAS POR SU COMPRA!</p>
          <p className="mb-1">AL COMPRAR Y/O RECIBIR SU MERCANCIA ACEPTA LA POLITICAS DE GARANTIA</p>
          <p className="mb-1">Politicas de cambio de acuerdo a la ley 1480 de 2011</p>
          <p className="mb-2">Para cambios, garantia o devoluciones presentar este recibo</p>
          
          <div className="mt-3 space-y-1">
            <p>📱 WhatsApp: +57 311 4928756</p>
            <p>📧 ventas@fucsiainsumos.com</p>
            <p>🌐 www.fucsiainsumos.com</p>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-300">
            <p className="text-xs">
              Generado: {new Date().toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        {/* Botones de acción (no se imprimen) */}
        <div className="flex space-x-2 mt-6 no-print">
          <button
            onClick={onPrint}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm font-semibold"
          >
            🖨️ Imprimir
          </button>
          <button
            onClick={onDownload}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 text-sm font-semibold"
          >
            📄 Descargar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
