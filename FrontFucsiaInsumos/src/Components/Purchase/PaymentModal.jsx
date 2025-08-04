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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Registrar Pago
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Información de la orden */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Información de la Orden</h3>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Orden:</span> {order.orderNumber}</div>
              <div><span className="font-medium">Proveedor:</span> {order.proveedor?.nombre || 'N/A'}</div>
              <div><span className="font-medium">Total:</span> {formatPrice(order.total)}</div>
              <div><span className="font-medium">Estado:</span> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto del Pago *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="mt-1 text-xs text-gray-500">
                Total de la orden: {formatPrice(order.total)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago *
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="cheque">Cheque</option>
                <option value="tarjeta_credito">Tarjeta de Crédito</option>
                <option value="tarjeta_debito">Tarjeta de Débito</option>
                <option value="pse">PSE</option>
                <option value="credito">Nota de Crédito</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Pago *
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencia/Número de Transacción
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                placeholder="Ej: 123456789, Cheque #001, etc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Observaciones sobre el pago..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
              >
                {loading ? 'Registrando...' : 'Registrar Pago'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
