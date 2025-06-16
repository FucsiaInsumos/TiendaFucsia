import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, orderTotal, onPaymentComplete, loading, selectedCustomer }) => {
  const [selectedMethod, setSelectedMethod] = useState('efectivo');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [notes, setNotes] = useState('');
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('percentage'); 


  const paymentMethods = [
    { value: 'efectivo', label: 'Efectivo', icon: '💵' },
    { value: 'tarjeta', label: 'Tarjeta', icon: '💳' },
    { value: 'nequi', label: 'Nequi', icon: '📱' },
    { value: 'bancolombia', label: 'Bancolombia', icon: '🏦' },
    { value: 'daviplata', label: 'Daviplata', icon: '📱' },
    { value: 'wompi', label: 'Wompi (Online)', icon: '🌐' },
    { value: 'credito', label: 'Crédito', icon: '📄' },
    { value: 'combinado', label: 'Pago Combinado', icon: '🔄' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };



  const handlePaymentDetailsChange = (key, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateDiscountAmount = () => {
    if (extraDiscount <= 0) return 0;
    
    if (discountType === 'percentage') {
      return (orderTotal.total * extraDiscount) / 100;
    } else {
      // Monto fijo - no puede ser mayor al total
      return Math.min(extraDiscount, orderTotal.total);
    }
  };

  const calculateFinalTotal = () => {
    const discountAmount = calculateDiscountAmount();
    return Math.max(0, orderTotal.total - discountAmount);
  };

 const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalTotal = calculateFinalTotal();
    const discountAmount = calculateDiscountAmount();
    
    const paymentData = {
      method: selectedMethod,
      details: {
        ...paymentDetails,
        originalTotal: orderTotal.total,
        extraDiscountAmount: discountAmount,
        extraDiscountType: discountType, // NUEVO: tipo de descuento
        finalTotal: finalTotal
      },
      notes: notes.trim(),
      extraDiscountPercentage: discountType === 'percentage' ? extraDiscount : 0,
      extraDiscountAmount: discountType === 'fixed' ? discountAmount : 0 // NUEVO
    };

    console.log('Datos de pago enviados:', paymentData);
    onPaymentComplete(paymentData);
  };

  const renderPaymentFields = () => {
    switch (selectedMethod) {
      case 'efectivo':
        const finalTotal = calculateFinalTotal(); // Obtener el total final con descuento
        
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto recibido
              </label>
              <input
                type="number"
                step="0.01"
                min={finalTotal} // Usar el total final con descuento
                value={paymentDetails.amountReceived || ''}
                onChange={(e) => handlePaymentDetailsChange('amountReceived', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={formatPrice(finalTotal)} // Mostrar el total final como placeholder
              />
            </div>
            {paymentDetails.amountReceived && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800">
                  <p className="font-medium">Detalle del pago:</p>
                  <p>Total a pagar: {formatPrice(finalTotal)}</p>
                  <p>Monto recibido: {formatPrice(parseFloat(paymentDetails.amountReceived))}</p>
                  <p className="font-bold border-t pt-1 mt-1">
                    Cambio: {formatPrice(Math.max(0, parseFloat(paymentDetails.amountReceived || 0) - finalTotal))}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'tarjeta':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de tarjeta
              </label>
              <select
                value={paymentDetails.cardType || 'credito'}
                onChange={(e) => handlePaymentDetailsChange('cardType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="credito">Crédito</option>
                <option value="debito">Débito</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de autorización
              </label>
              <input
                type="text"
                value={paymentDetails.authNumber || ''}
                onChange={(e) => handlePaymentDetailsChange('authNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Número de autorización"
              />
            </div>
          </div>
        );

      case 'nequi':
      case 'bancolombia':
      case 'daviplata':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de referencia
              </label>
              <input
                type="text"
                value={paymentDetails.reference || ''}
                onChange={(e) => handlePaymentDetailsChange('reference', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Número de referencia de la transacción"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono del pagador
              </label>
              <input
                type="tel"
                value={paymentDetails.phoneNumber || ''}
                onChange={(e) => handlePaymentDetailsChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Número de teléfono"
              />
            </div>
          </div>
        );

      case 'credito':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Pago a crédito - Se generará una cuenta por cobrar
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de crédito
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={paymentDetails.creditDays || 30}
                onChange={(e) => handlePaymentDetailsChange('creditDays', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        );

      case 'combinado':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Pago combinado - Especifica los métodos y montos en las notas
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Procesar Pago
                  </h3>

                  {/* Resumen del total */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatPrice(orderTotal.subtotal)}</span>
                      </div>
                      
                     {/* Mostrar descuentos aplicados previamente */}
                      {orderTotal.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Descuentos automáticos:</span>
                          <span>-{formatPrice(orderTotal.discount)}</span>
                        </div>
                      )}
                      
                      {/* Mostrar subtotal después de descuentos previos */}
                      <div className="flex justify-between">
                        <span>Subtotal con descuentos:</span>
                        <span>{formatPrice(orderTotal.total)}</span>
                      </div>
                      
                      {/* NUEVA SECCIÓN - Descuento extra flexible */}
                      <div className="border-t pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descuento adicional en caja
                        </label>
                        
                        {/* Selector de tipo de descuento */}
                        <div className="flex space-x-2 mb-2">
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType('percentage');
                              setExtraDiscount(0);
                            }}
                            className={`px-3 py-1 text-sm rounded ${
                              discountType === 'percentage'
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                          >
                            % Porcentaje
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDiscountType('fixed');
                              setExtraDiscount(0);
                            }}
                            className={`px-3 py-1 text-sm rounded ${
                              discountType === 'fixed'
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                          >
                            $ Monto fijo
                          </button>
                        </div>

                        {/* Input de descuento */}
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={discountType === 'percentage' ? "50" : orderTotal.total}
                            step={discountType === 'percentage' ? "0.1" : "100"}
                            value={extraDiscount}
                            onChange={(e) => setExtraDiscount(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={discountType === 'percentage' ? "0.0" : "0"}
                          />
                          <span className="absolute right-3 top-2 text-gray-500 text-sm">
                            {discountType === 'percentage' ? '%' : '$'}
                          </span>
                        </div>

                        {/* Mostrar el descuento calculado */}
                        {extraDiscount > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-green-600">
                              Descuento aplicado: -{formatPrice(calculateDiscountAmount())}
                              {discountType === 'percentage' && ` (${extraDiscount}%)`}
                            </p>
                            {discountType === 'fixed' && extraDiscount > orderTotal.total && (
                              <p className="text-xs text-red-600">
                                ⚠️ El descuento no puede ser mayor al total
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                        <span>Total final a pagar:</span>
                        <span className="text-indigo-600">{formatPrice(calculateFinalTotal())}</span>
                      </div>
                    </div>
                    
                    {/* Información del cliente distribuidor */}
                    {selectedCustomer?.role === 'Distributor' && !selectedCustomer?.isGeneric && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xs text-blue-800 font-medium">
                          Cliente Distribuidor: {selectedCustomer.first_name} {selectedCustomer.last_name}
                        </p>
                        {selectedCustomer.distributor && (
                          <p className="text-xs text-blue-600">
                            Descuento base: {selectedCustomer.distributor.discountPercentage}%
                          </p>
                        )}
                      </div>
                    )}

                    {/* Mostrar si es cliente genérico */}
                    {selectedCustomer?.isGeneric && (
                      <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-xs text-orange-800 font-medium">
                          👤 Cliente Local - Venta sin registro
                        </p>
                      </div>
                    )}
                  </div>


                  {/* Selección de método de pago */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Método de pago
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map(method => (
                        <label
                          key={method.value}
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                            selectedMethod === method.value
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={selectedMethod === method.value}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-lg mr-2">{method.icon}</span>
                          <span className="text-sm font-medium">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Campos específicos del método de pago */}
                  {renderPaymentFields()}

                  {/* Notas adicionales */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas adicionales
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Observaciones sobre el pago..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </div>
                ) : (
                  'Confirmar Pago'
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
