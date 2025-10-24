import React, { useState } from 'react';
import axios from '../../utils/axios';

const RevertOrderModal = ({ order, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Calcular información importante
  const totalItemsReceived = order.items?.reduce((sum, item) => sum + (item.cantidadRecibida || 0), 0) || 0;
  const totalUnitsToRevert = totalItemsReceived;
  const productsAffected = order.items?.filter(item => (item.cantidadRecibida || 0) > 0).length || 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reason.trim().length < 10) {
      alert('Por favor ingresa un motivo detallado (mínimo 10 caracteres)');
      return;
    }

    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`/purchase/orders/${order.id}/revert`, {
        reason: reason.trim()
      });

      if (response.data.error === false) {
        const { summary } = response.data.data;
        
        alert(
          `✅ ORDEN REVERTIDA EXITOSAMENTE\n\n` +
          `Orden: ${order.orderNumber}\n` +
          `Unidades revertidas: ${summary.totalUnitsReverted}\n` +
          `Productos afectados: ${summary.productsAffected}\n` +
          `Gastos eliminados: ${summary.expensesDeleted}\n\n` +
          `El inventario ha sido ajustado correctamente.`
        );
        onSuccess();
      } else {
        alert(`Error: ${response.data.message || 'No se pudo revertir la orden'}`);
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error('Error al revertir orden:', error);
      
      const errorMessage = error.response?.data?.message || error.message;
      const errorDetails = error.response?.data?.details;
      
      let alertMessage = `❌ ERROR AL REVERTIR ORDEN\n\n${errorMessage}`;
      
      if (errorDetails) {
        alertMessage += `\n\n⚠️ Detalles:\n`;
        if (errorDetails.productName) {
          alertMessage += `Producto: ${errorDetails.productName}\n`;
          alertMessage += `Stock actual: ${errorDetails.currentStock}\n`;
          alertMessage += `Cantidad a revertir: ${errorDetails.quantityToRevert}\n`;
          alertMessage += `Stock resultante: ${errorDetails.resultingStock}\n`;
        }
        if (errorDetails.hint) {
          alertMessage += `\n💡 Sugerencia: ${errorDetails.hint}`;
        }
      }
      
      alert(alertMessage);
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <span>🔄</span>
              <span>Revertir Orden de Compra</span>
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          {!showConfirmation ? (
            <>
              {/* Advertencia principal */}
              <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-red-600 text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h3 className="text-red-800 font-semibold mb-2">
                      ADVERTENCIA: Acción Crítica
                    </h3>
                    <p className="text-red-700 text-sm mb-2">
                      Esta acción revertirá completamente la recepción de mercancía de esta orden. 
                      Se realizarán los siguientes cambios:
                    </p>
                    <ul className="text-red-700 text-sm space-y-1 ml-4">
                      <li>• Se reducirá el stock de todos los productos recibidos</li>
                      <li>• Se eliminarán los gastos automáticos asociados</li>
                      <li>• La orden volverá a estado "Pendiente"</li>
                      <li>• Se registrarán movimientos de stock de reversión</li>
                    </ul>
                    <p className="text-red-700 text-sm mt-2 font-medium">
                      ⚠️ Esta acción NO se puede deshacer automáticamente
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de la orden */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Información de la Orden</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Número de Orden:</p>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Proveedor:</p>
                    <p className="font-medium text-gray-900">{order.proveedor?.nombre || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total de la Orden:</p>
                    <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estado Actual:</p>
                    <p className="font-medium text-green-700">✅ {order.status}</p>
                  </div>
                </div>
              </div>

              {/* Items a revertir */}
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-900 mb-3">Items que se Revertirán</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {order.items?.filter(item => (item.cantidadRecibida || 0) > 0).map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-yellow-200">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">SKU: {item.productSku || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-600 font-semibold">
                            - {item.cantidadRecibida} unidades
                          </p>
                          <p className="text-xs text-gray-500">
                            de {item.cantidad} ordenadas
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Resumen */}
                <div className="mt-4 pt-4 border-t border-yellow-300">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-yellow-800">Productos Afectados:</p>
                      <p className="font-bold text-yellow-900">{productsAffected}</p>
                    </div>
                    <div>
                      <p className="text-yellow-800">Unidades a Revertir:</p>
                      <p className="font-bold text-yellow-900">{totalUnitsToRevert}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de motivo */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de la Reversión *
                    <span className="text-red-600 ml-1">(Requerido - Mínimo 10 caracteres)</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Explica detalladamente por qué necesitas revertir esta orden (ej: Error en cantidades recibidas, productos defectuosos, devolución al proveedor, etc.)"
                    required
                    minLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Caracteres: {reason.length}/10 mínimo
                  </p>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || reason.trim().length < 10}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Continuar</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Pantalla de confirmación final */}
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-red-600 text-3xl">🚨</span>
                  <div className="flex-1">
                    <h3 className="text-red-900 font-bold text-lg mb-3">
                      CONFIRMACIÓN FINAL
                    </h3>
                    <p className="text-red-800 mb-4">
                      Estás a punto de revertir la orden <strong>{order.orderNumber}</strong>.
                    </p>
                    
                    <div className="bg-white rounded p-4 mb-4">
                      <p className="font-semibold text-gray-900 mb-2">Se ejecutarán las siguientes acciones:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">❌</span>
                          <span>Se reducirá el stock de <strong>{productsAffected} producto(s)</strong> en un total de <strong>{totalUnitsToRevert} unidades</strong></span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">💰</span>
                          <span>Se eliminarán los gastos automáticos asociados a esta orden</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">📝</span>
                          <span>Se crearán <strong>{productsAffected} movimientos de stock</strong> de tipo "salida" para documentar la reversión</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600">🔄</span>
                          <span>La orden volverá a estado <strong>"Pendiente"</strong></span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-400 rounded p-3 mb-4">
                      <p className="text-yellow-900 text-sm">
                        <strong>Motivo registrado:</strong> "{reason}"
                      </p>
                    </div>

                    <p className="text-red-900 font-bold text-center text-lg">
                      ⚠️ ¿Estás completamente seguro? ⚠️
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    No, Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Revirtiendo...</span>
                      </>
                    ) : (
                      <>
                        <span>✅</span>
                        <span>Sí, Revertir Orden</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevertOrderModal;
