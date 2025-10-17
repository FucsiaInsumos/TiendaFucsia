import React, { useState } from 'react';
import axios from '../../utils/axios';

const PaymentModal = ({ order, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'efectivo',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    if (parseFloat(formData.amount) > order.total) {
      if (!window.confirm(`El monto (${formatPrice(formData.amount)}) es mayor al total de la orden (${formatPrice(order.total)}). ¿Continuar?`)) {
        return;
      }
    }

    try {
      setLoading(true);

      const response = await axios.post(`/purchase/orders/${order.id}/payment`, formData);

      if (response.data.error === false) {
        const { data } = response.data;
        let successMessage = `Pago registrado exitosamente\n\n`;
        successMessage += `💰 Monto: ${formatPrice(data.paymentAmount)}\n`;
        successMessage += `💳 Método: ${data.paymentMethod}\n`;
        successMessage += `📊 Total pagado: ${formatPrice(data.totalPaid)} / ${formatPrice(data.orderTotal)}\n`;
        successMessage += `📋 Estado de pago: ${data.paymentStatus === 'pagada' ? 'COMPLETAMENTE PAGADA' : 
                                              data.paymentStatus === 'parcial' ? 'PARCIALMENTE PAGADA' : 'PENDIENTE'}\n`;
        
        if (data.remainingAmount > 0) {
          successMessage += `⏳ Restante: ${formatPrice(data.remainingAmount)}\n`;
        }
        
        if (data.paymentStatus === 'pagada' && order.status === 'completada') {
          successMessage += `\n✅ Se creó el gasto automático en expenses`;
        }
        
        alert(successMessage);
        onSuccess();
      } else {
        alert(response.data.message || 'Error al registrar pago');
      }
    } catch (error) {
      console.error('Error al registrar pago:', error);
      alert('Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      {/* 📱 MODAL RESPONSIVE: Mobile-first, adapta a tablet y desktop */}
      <div className="bg-white rounded-lg w-full max-w-md max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              💳 Registrar Pago
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl sm:text-xl leading-none p-1"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>

          {/* Información de la orden - Tarjeta responsive */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border border-purple-100">
            <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base flex items-center">
              📋 Información de la Orden
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center">
                <span className="font-medium text-gray-700 mr-2">Orden:</span> 
                <span className="font-mono bg-white px-2 py-1 rounded text-purple-700">
                  {order.orderNumber}
                </span>
              </div>
              <div className="flex flex-wrap items-center">
                <span className="font-medium text-gray-700 mr-2">Proveedor:</span> 
                <span className="text-gray-900">{order.proveedor?.nombre || 'N/A'}</span>
              </div>
              <div className="flex flex-wrap items-center">
                <span className="font-medium text-gray-700 mr-2">Total:</span> 
                <span className="font-bold text-green-700 text-base sm:text-lg">
                  {formatPrice(order.total)}
                </span>
              </div>
              <div className="flex flex-wrap items-center">
                <span className="font-medium text-gray-700 mr-2">Estado:</span> 
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'parcial' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'completada' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Formulario responsive */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Monto del Pago */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                💰 Monto del Pago *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                />
              </div>
              <div className="mt-1 text-xs text-gray-500 flex items-center">
                <span className="mr-1">💵</span>
                Total de la orden: <span className="font-semibold ml-1">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Método de Pago */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                💳 Método de Pago *
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base appearance-none bg-white cursor-pointer"
              >
                <option value="efectivo">💵 Efectivo</option>
                <option value="transferencia">🏦 Transferencia Bancaria</option>
                <option value="cheque">📝 Cheque</option>
                <option value="tarjeta_credito">💳 Tarjeta de Crédito</option>
                <option value="tarjeta_debito">💳 Tarjeta de Débito</option>
                <option value="pse">🔐 PSE</option>
                <option value="credito">📋 Nota de Crédito</option>
                <option value="otro">➕ Otro</option>
              </select>
            </div>

            {/* Fecha del Pago */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                📅 Fecha del Pago *
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleInputChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            {/* Referencia */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                🔢 Referencia/Número de Transacción
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                placeholder="Ej: 123456789, Cheque #001"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
              <p className="mt-1 text-xs text-gray-500">
                Opcional: Número de transferencia, cheque, etc.
              </p>
            </div>

            {/* Notas Adicionales */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                📝 Notas Adicionales
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Observaciones sobre el pago..."
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base resize-none"
              />
            </div>

            {/* Botones - Responsive: Stack en móvil, inline en desktop */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm sm:text-base transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </>
                ) : (
                  <>
                    💸 Registrar Pago
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
