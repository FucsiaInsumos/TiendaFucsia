import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { receivePurchaseOrder } from '../../Redux/Actions/purchaseActions';

const ReceiveMerchandiseModal = ({ order, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [receivedItems, setReceivedItems] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (order && order.items) {
      // ✅ VALIDACIÓN INICIAL - NO PERMITIR RECEPCIONES EN ÓRDENES COMPLETADAS
      if (order.status === 'completada') {
        alert('Esta orden ya está completamente recibida. No se pueden hacer más recepciones.');
        onClose && onClose();
        return;
      }

      if (order.status === 'cancelada') {
        alert('No se puede recibir mercancía de una orden cancelada.');
        onClose && onClose();
        return;
      }

      // Inicializar con las cantidades pendientes por recibir
      const initialItems = order.items.map(item => {
        const cantidadPendiente = item.cantidad - (item.cantidadRecibida || 0);
        
        // ✅ VALIDACIÓN: Si no hay cantidad pendiente, no mostrar el item
        if (cantidadPendiente <= 0) {
          return null;
        }
        
        return {
          itemId: item.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          cantidadOrdenada: item.cantidad,
          cantidadRecibidaAnterior: item.cantidadRecibida || 0,
          cantidadRecibir: cantidadPendiente, // Por defecto, recibir todo lo pendiente
          cantidadPendiente: cantidadPendiente,
          precioUnitario: item.precioUnitario,
          // ✅ CAMPOS PARA ACTUALIZACIÓN DE PRECIOS
          precioCompraActual: item.product?.purchasePrice || item.precioUnitario,
          precioVentaActual: item.product?.price || item.precioVentaSugerido,
          precioDistribuidorActual: item.product?.distributorPrice || item.precioDistribuidorSugerido,
          // Nuevos precios (editables)
          nuevoPrecioCompra: item.precioUnitario,
          nuevoPrecioVenta: item.precioVentaSugerido || 0,
          nuevoPrecioDistribuidor: item.precioDistribuidorSugerido || 0,
          actualizarPrecios: false, // Flag para decidir si actualizar precios
          isNewProduct: item.isNewProduct || false
        };
      }).filter(Boolean); // ✅ FILTRAR ITEMS NULOS

      // ✅ VERIFICAR SI HAY ITEMS PENDIENTES
      if (initialItems.length === 0) {
        alert('No hay items pendientes por recibir en esta orden.');
        onClose && onClose();
        return;
      }

      setReceivedItems(initialItems);
    }
  }, [order, onClose]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...receivedItems];
    updatedItems[index][field] = value;

    // Si cambia la cantidad a recibir, validar que no exceda la pendiente
    if (field === 'cantidadRecibir') {
      const maxCantidad = updatedItems[index].cantidadPendiente;
      if (value > maxCantidad) {
        updatedItems[index][field] = maxCantidad;
      } else if (value < 0) {
        updatedItems[index][field] = 0;
      }
    }

    setReceivedItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que se esté recibiendo al menos un item
    const itemsToReceive = receivedItems.filter(item => item.cantidadRecibir > 0);
    if (itemsToReceive.length === 0) {
      alert('Debe especificar al menos una cantidad a recibir');
      return;
    }

    try {
      setLoading(true);

      // ✅ CORREGIR ESTRUCTURA DE DATOS PARA EL BACKEND
      const receiveData = {
        receivedItems: itemsToReceive.map(item => ({
          itemId: item.itemId,
          cantidadRecibida: item.cantidadRecibir,
          // ✅ INCLUIR INFORMACIÓN DE ACTUALIZACIÓN DE PRECIOS
          updatePrices: item.actualizarPrecios,
          newPrices: item.actualizarPrecios ? {
            purchasePrice: parseFloat(item.nuevoPrecioCompra),
            price: parseFloat(item.nuevoPrecioVenta),
            distributorPrice: parseFloat(item.nuevoPrecioDistribuidor) || null
          } : null
        })),
        notes: notes.trim()
      };

      console.log('📦 Datos de recepción a enviar:', receiveData);
      console.log('📦 Items a recibir:', receiveData.receivedItems);

      // ✅ USAR LA ACCIÓN CORRECTA CON LOS DATOS ESTRUCTURADOS
      const response = await dispatch(receivePurchaseOrder(order.id, receiveData.receivedItems));
      
      if (response.error === false) {
        alert(`Mercancía recibida exitosamente. Stock y precios actualizados.\n\nResumen:\n- Productos actualizados: ${response.data?.updatedProducts || 0}\n- Productos creados: ${response.data?.createdProducts || 0}\n- Movimientos de stock: ${response.data?.stockMovements || 0}\n- Estado de la orden: ${response.data?.newStatus || 'actualizado'}`);
        onSuccess && onSuccess();
      } else {
        alert('Error al recibir mercancía: ' + (response.message || 'Error desconocido'));
      }

    } catch (error) {
      console.error('Error al recibir mercancía:', error);
      alert('Error al recibir mercancía: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price || 0);
  };

  const getTotalValue = () => {
    return receivedItems.reduce((sum, item) => {
      return sum + (item.cantidadRecibir * item.nuevoPrecioCompra);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  📦 Recibir Mercancía - Orden {order.orderNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  Registra la mercancía recibida y actualiza stock y precios automáticamente
                </p>
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Proveedor:</strong> {order.proveedor?.nombre} | 
                    <strong> Total orden:</strong> {formatPrice(order.total)} | 
                    <strong> Estado:</strong> {order.status}
                  </p>
                </div>
                
                {/* ✅ MOSTRAR PROGRESO DE RECEPCIÓN */}
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">📊 Progreso de Recepción</h4>
                  <div className="space-y-1">
                    {order.items.map(item => {
                      const recibida = item.cantidadRecibida || 0;
                      const total = item.cantidad;
                      const porcentaje = (recibida / total) * 100;
                      
                      return (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{item.productName}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${porcentaje === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                              {recibida}/{total}
                            </span>
                            <div className="w-20 h-2 bg-gray-200 rounded">
                              <div 
                                className={`h-full rounded transition-all duration-300 ${
                                  porcentaje === 100 ? 'bg-green-500' : 'bg-orange-400'
                                }`}
                                style={{ width: `${porcentaje}%` }}
                              />
                            </div>
                            <span className="text-gray-500">{porcentaje.toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ✅ TABLA DE ITEMS MEJORADA */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Items de la Orden
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Producto
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Cantidades
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Cantidad a Recibir
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Precios Actuales
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Nuevos Precios
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actualizar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {receivedItems.map((item, index) => (
                        <tr key={item.itemId} className="hover:bg-gray-50">
                          {/* Información del Producto */}
                          <td className="px-3 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.productName}
                              </div>
                              <div className="text-sm text-gray-500">
                                SKU: {item.productSku}
                              </div>
                              {item.isNewProduct && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Producto Nuevo
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Cantidades */}
                          <td className="px-3 py-4">
                            <div className="text-xs space-y-1">
                              <div>Ordenada: <span className="font-medium">{item.cantidadOrdenada}</span></div>
                              <div>Recibida: <span className="font-medium">{item.cantidadRecibidaAnterior}</span></div>
                              <div className="text-orange-600">
                                Pendiente: <span className="font-medium">{item.cantidadPendiente}</span>
                              </div>
                            </div>
                          </td>

                          {/* Cantidad a Recibir */}
                          <td className="px-3 py-4">
                            <input
                              type="number"
                              min="0"
                              max={item.cantidadPendiente}
                              value={item.cantidadRecibir}
                              onChange={(e) => handleItemChange(index, 'cantidadRecibir', parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </td>

                          {/* Precios Actuales */}
                          <td className="px-3 py-4">
                            <div className="text-xs space-y-1">
                              <div>Compra: <span className="font-medium">{formatPrice(item.precioCompraActual)}</span></div>
                              <div>Venta: <span className="font-medium">{formatPrice(item.precioVentaActual)}</span></div>
                              {item.precioDistribuidorActual > 0 && (
                                <div>Dist.: <span className="font-medium">{formatPrice(item.precioDistribuidorActual)}</span></div>
                              )}
                            </div>
                          </td>

                          {/* Nuevos Precios */}
                          <td className="px-3 py-4">
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs text-gray-500">Compra:</label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.nuevoPrecioCompra}
                                  onChange={(e) => handleItemChange(index, 'nuevoPrecioCompra', parseFloat(e.target.value) || 0)}
                                  disabled={!item.actualizarPrecios}
                                  className="w-24 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Venta:</label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.nuevoPrecioVenta}
                                  onChange={(e) => handleItemChange(index, 'nuevoPrecioVenta', parseFloat(e.target.value) || 0)}
                                  disabled={!item.actualizarPrecios}
                                  className="w-24 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Distribuidor:</label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.nuevoPrecioDistribuidor}
                                  onChange={(e) => handleItemChange(index, 'nuevoPrecioDistribuidor', parseFloat(e.target.value) || 0)}
                                  disabled={!item.actualizarPrecios}
                                  className="w-24 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                />
                              </div>
                            </div>
                          </td>

                          {/* Checkbox para Actualizar */}
                          <td className="px-3 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={item.actualizarPrecios}
                              onChange={(e) => handleItemChange(index, 'actualizarPrecios', e.target.checked)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              {item.actualizarPrecios ? '✅ Sí' : '❌ No'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ✅ RESUMEN Y NOTAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Resumen de Recepción */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3">Resumen de Recepción</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items a recibir:</span>
                      <span className="font-medium">
                        {receivedItems.filter(item => item.cantidadRecibir > 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cantidad total:</span>
                      <span className="font-medium">
                        {receivedItems.reduce((sum, item) => sum + item.cantidadRecibir, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor total:</span>
                      <span className="font-medium text-indigo-600">
                        {formatPrice(getTotalValue())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precios a actualizar:</span>
                      <span className="font-medium">
                        {receivedItems.filter(item => item.actualizarPrecios).length} productos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas de Recepción
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Observaciones sobre la mercancía recibida, estado, diferencias, etc..."
                  />
                </div>
              </div>

              {/* ✅ ALERTAS Y ADVERTENCIAS */}
              <div className="mb-6 space-y-3">
                {receivedItems.some(item => item.actualizarPrecios) && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          ⚠️ Se actualizarán precios de productos
                        </h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Los precios marcados se actualizarán en el sistema. Esta acción afectará futuras ventas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {receivedItems.some(item => item.isNewProduct) && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          ✅ Productos nuevos serán creados
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          Los productos marcados como nuevos se crearán automáticamente en el inventario.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              {/* ✅ INFORMACIÓN ADICIONAL */}
              <div className="text-xs text-gray-500 mb-3">
                💡 <strong>Nota:</strong> Al recibir mercancía se actualizará automáticamente el stock, 
                se crearán movimientos de inventario y, si la orden se completa y está pagada, 
                se generará un gasto automático en el módulo de expenses.
              </div>
              
              <div className="sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={loading || receivedItems.filter(item => item.cantidadRecibir > 0).length === 0}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Recibiendo...
                    </div>
                  ) : (
                    '📦 Recibir Mercancía y Actualizar Stock'
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceiveMerchandiseModal;
