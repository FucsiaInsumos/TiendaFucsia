import React from 'react';

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      'confirmed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmada' },
      'processing': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Procesando' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completada' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // ✅ SEPARAR PRODUCTOS FACTURABLES Y NO FACTURABLES
  const facturabeItems = order.items?.filter(item => item.product?.isFacturable) || [];
  const nonFacturableItems = order.items?.filter(item => !item.product?.isFacturable) || [];
  
  // ✅ CALCULAR TOTALES DE FACTURACIÓN
  const billableSubtotal = facturabeItems.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
  const nonBillableSubtotal = nonFacturableItems.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Detalles de la Orden #{order.orderNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-150"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-6">
          {/* Información de la orden */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Información de la Orden</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span>{getStatusBadge(order.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">
                    {order.orderType === 'local' && '🏪 Local'}
                    {order.orderType === 'online' && '🌐 Online'}
                    {order.orderType === 'distributor' && '📦 Distribuidor'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {order.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notas:</span>
                    <span className="font-medium">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Información del Cliente</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">
                    {order.customer?.first_name} {order.customer?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documento:</span>
                  <span className="font-medium">{order.customer?.n_document}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{order.customer?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teléfono:</span>
                  <span className="font-medium">{order.customer?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ RESUMEN DE FACTURACIÓN */}
          {(facturabeItems.length > 0 || nonFacturableItems.length > 0) && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-blue-900 mb-3 flex items-center">
                📄 Resumen de Facturación
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {facturabeItems.length}
                  </div>
                  <div className="text-sm text-blue-700">Productos Facturables</div>
                  <div className="text-lg font-semibold text-blue-800">
                    {formatPrice(billableSubtotal)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {nonFacturableItems.length}
                  </div>
                  <div className="text-sm text-gray-700">Productos No Facturables</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {formatPrice(nonBillableSubtotal)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {order.items?.length || 0}
                  </div>
                  <div className="text-sm text-green-700">Total Productos</div>
                  <div className="text-lg font-semibold text-green-800">
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ PRODUCTOS FACTURABLES */}
          {facturabeItems.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                📄 Productos Facturables ({facturabeItems.length})
              </h4>
              <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-green-200">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                          Precio Unit.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-green-200">
                      {facturabeItems.map((item) => (
                        <tr key={item.id} className="hover:bg-green-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.product?.image_url?.[0] && (
                                <img
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                  src={item.product.image_url[0]}
                                  alt={item.product.name}
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.product?.name}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    📄 FACTURABLE
                                  </span>
                                  {item.product?.category?.name && (
                                    <span className="text-xs text-gray-500">
                                      {item.product.category.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.product?.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(item.unitPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatPrice(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ✅ PRODUCTOS NO FACTURABLES */}
          {nonFacturableItems.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                🚫 Productos No Facturables ({nonFacturableItems.length})
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio Unit.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {nonFacturableItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.product?.image_url?.[0] && (
                                <img
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                  src={item.product.image_url[0]}
                                  alt={item.product.name}
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.product?.name}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    🚫 NO FACTURABLE
                                  </span>
                                  {item.product?.category?.name && (
                                    <span className="text-xs text-gray-500">
                                      {item.product.category.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.product?.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(item.unitPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatPrice(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Información de pagos */}
          {order.payments && order.payments.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Información de Pagos</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.method === 'wompi' && '💳 Wompi'}
                          {payment.method === 'cash' && '💵 Efectivo'}
                          {payment.method === 'transfer' && '🏦 Transferencia'}
                          {payment.method === 'credit' && '💳 Crédito'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status === 'completed' && '✅ Completado'}
                            {payment.status === 'pending' && '⏳ Pendiente'}
                            {payment.status === 'failed' && '❌ Fallido'}
                            {payment.status === 'refunded' && '↩️ Reembolsado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resumen financiero */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Resumen Financiero</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Descuento:</span>
                  <span className="font-medium text-red-600">-{formatPrice(order.discount)}</span>
                </div>
              )}
              {parseFloat(order.tax) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos:</span>
                  <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              
              {/* ✅ DESGLOSE DE FACTURACIÓN */}
              {facturabeItems.length > 0 && (
                <>
                  <hr className="my-2" />
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between text-green-600">
                      <span>• Monto facturable:</span>
                      <span className="font-medium">{formatPrice(billableSubtotal)}</span>
                    </div>
                    {nonFacturableItems.length > 0 && (
                      <div className="flex justify-between text-gray-500">
                        <span>• Monto no facturable:</span>
                        <span className="font-medium">{formatPrice(nonBillableSubtotal)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;