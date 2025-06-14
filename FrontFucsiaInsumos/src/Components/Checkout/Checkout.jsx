import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../Redux/Actions/salesActions';
import { clearCart } from '../../Redux/Reducer/cartReducer';
import WompiWidget from '../../components/Checkout/WompiWidget';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, subtotal } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    paymentMethod: 'efectivo',
    notes: '',
    pickupInfo: {
      customerName: '',
      phone: '',
      pickupDate: '',
      notes: ''
    }
  });
  const [showWompiWidget, setShowWompiWidget] = useState(false);
  const [wompiReference, setWompiReference] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }

    if (items.length === 0) {
      navigate('/catalogo');
      return;
    }
  }, [isAuthenticated, items.length, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const generateWompiReference = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `FUCSIA-${user.n_document}-${timestamp}-${randomNum}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('pickup.')) {
      const field = name.split('.')[1];
      setOrderData(prev => ({
        ...prev,
        pickupInfo: {
          ...prev.pickupInfo,
          [field]: value
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setOrderData(prev => ({
      ...prev,
      paymentMethod: method
    }));

    // Si selecciona Wompi, generar referencia y mostrar widget
    if (method === 'wompi') {
      const reference = generateWompiReference();
      setWompiReference(reference);
      setShowWompiWidget(true);
    } else {
      setShowWompiWidget(false);
    }
  };

  const handleWompiSuccess = (transaction) => {
    console.log('Wompi payment successful:', transaction);
    
    // Actualizar los datos de la orden con la información del pago
    setOrderData(prev => ({
      ...prev,
      paymentDetails: {
        gateway: 'wompi',
        transactionId: transaction.id,
        reference: transaction.reference,
        status: transaction.status,
        amount: transaction.amount_in_cents,
        timestamp: new Date().toISOString()
      }
    }));

    // Proceder a crear la orden
    handleSubmitWithPayment();
  };

  const handleWompiError = (error) => {
    console.error('Wompi payment error:', error);
    setShowWompiWidget(false);
    // El toast ya se encarga del mensaje de error
  };

  const handleSubmitWithPayment = async () => {
    setLoading(true);

    try {
      const orderPayload = {
        userId: user.n_document,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        orderType: 'online',
        paymentMethod: orderData.paymentMethod,
        paymentDetails: orderData.paymentDetails || {
          method: orderData.paymentMethod,
          timestamp: new Date().toISOString()
        },
        notes: orderData.notes,
        pickupInfo: orderData.pickupInfo
      };

      const response = await dispatch(createOrder(orderPayload));
      
      if (response.error === false) {
        dispatch(clearCart());
        navigate(`/order-confirmation/${response.data.id}`, {
          state: { order: response.data }
        });
      }
    } catch (error) {
      console.error('Error al crear orden:', error);
      alert('Error al procesar la orden: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si es pago con Wompi y no tenemos transacción, mostrar widget
    if (orderData.paymentMethod === 'wompi' && !orderData.paymentDetails?.transactionId) {
      setShowWompiWidget(true);
      return;
    }

    // Para otros métodos de pago, proceder directamente
    handleSubmitWithPayment();
  };

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">Finalizar Compra</h1>
            <p className="text-blue-200">Revisa tu pedido y completa la información</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información del pedido */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Información de Retiro</h2>
                
                {/* Información del cliente */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Datos del Cliente</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Nombre:</strong> {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Documento:</strong> {user.n_document}
                  </p>
                  {user.role === 'Distributor' && user.distributor && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Cliente Distribuidor - Precios especiales aplicados
                      </p>
                      <div className="text-xs text-green-700 mt-1">
                        <p>Mínimo de compra: {formatPrice(user.distributor.minimumPurchase)}</p>
                        <p>Total actual: {formatPrice(total)}</p>
                        {total < user.distributor.minimumPurchase && (
                          <p className="text-red-600 font-medium">
                            ⚠️ Faltan {formatPrice(user.distributor.minimumPurchase - total)} para el mínimo
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Información de retiro */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">📍 Punto de Retiro</h3>
                  <div className="text-sm text-blue-800">
                    <p><strong>Dirección:</strong> Calle 123 #45-67, Centro</p>
                    <p><strong>Ciudad:</strong> Bogotá, Colombia</p>
                    <p><strong>Horarios:</strong> Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    <p><strong>Sábados:</strong> 8:00 AM - 2:00 PM</p>
                    <p><strong>Teléfono:</strong> +57 (1) 234-5678</p>
                  </div>
                </div>

                {/* Datos de contacto para retiro */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de quien retira *
                    </label>
                    <input
                      type="text"
                      name="pickup.customerName"
                      value={orderData.pickupInfo.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`${user.first_name} ${user.last_name}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono de contacto *
                    </label>
                    <input
                      type="tel"
                      name="pickup.phone"
                      value={orderData.pickupInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Número de teléfono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha preferida de retiro
                    </label>
                    <input
                      type="date"
                      name="pickup.pickupDate"
                      value={orderData.pickupInfo.pickupDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas adicionales
                    </label>
                    <textarea
                      name="pickup.notes"
                      value={orderData.pickupInfo.notes}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Instrucciones especiales para el retiro..."
                    />
                  </div>
                </div>

                {/* Método de pago */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Método de Pago</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="efectivo"
                        checked={orderData.paymentMethod === 'efectivo'}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="text-lg mr-2">💵</span>
                        <div>
                          <div className="font-medium">Efectivo</div>
                          <div className="text-sm text-gray-500">Pago al retirar en local</div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="tarjeta"
                        checked={orderData.paymentMethod === 'tarjeta'}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="text-lg mr-2">💳</span>
                        <div>
                          <div className="font-medium">Tarjeta</div>
                          <div className="text-sm text-gray-500">Débito o crédito en local</div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="wompi"
                        checked={orderData.paymentMethod === 'wompi'}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🌐</span>
                        <div>
                          <div className="font-medium">Pago Online (Wompi)</div>
                          <div className="text-sm text-gray-500">PSE, Tarjetas, Nequi</div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transferencia"
                        checked={orderData.paymentMethod === 'transferencia'}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🏦</span>
                        <div>
                          <div className="font-medium">Transferencia</div>
                          <div className="text-sm text-gray-500">Pago anticipado por transferencia</div>
                        </div>
                      </div>
                    </label>

                    {user.role === 'Distributor' && (
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credito"
                          checked={orderData.paymentMethod === 'credito'}
                          onChange={(e) => handlePaymentMethodChange(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <span className="text-lg mr-2">📄</span>
                          <div>
                            <div className="font-medium">Crédito</div>
                            <div className="text-sm text-gray-500">Pago a 30 días</div>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Widget de Wompi */}
                {showWompiWidget && (
                  <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-3">Completar Pago Online</h4>
                    <WompiWidget
                      orderId={null}
                      reference={wompiReference}
                      amount={Math.round(total * 100)}
                      currency="COP"
                      customerEmail={user.email}
                      customerName={`${user.first_name} ${user.last_name}`}
                      customerDocument={user.n_document}
                      customerPhone={user.phone || orderData.pickupInfo.phone}
                      onSuccess={handleWompiSuccess}
                      onError={handleWompiError}
                      onClose={() => setShowWompiWidget(false)}
                    />
                  </div>
                )}

                {/* Notas adicionales */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas del pedido
                  </label>
                  <textarea
                    name="notes"
                    value={orderData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Comentarios adicionales sobre tu pedido..."
                  />
                </div>
              </div>

              {/* Resumen del pedido */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.price)} × {item.quantity}
                            </p>
                            {item.isPromotion && (
                              <span className="text-xs bg-red-100 text-red-800 px-1 rounded">OFERTA</span>
                            )}
                            {item.isDistributorPrice && (
                              <span className="text-xs bg-green-100 text-green-800 px-1 rounded">DISTRIBUIDOR</span>
                            )}
                            {item.priceReverted && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">PRECIO NORMAL</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(item.total)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Retiro en local:</span>
                      <span>Gratis</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                      <span>Total a pagar:</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Botón de confirmación */}
                <button
                  type="submit"
                  disabled={loading || (user?.role === 'Distributor' && user.distributor && total < user.distributor.minimumPurchase)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : orderData.paymentMethod === 'wompi' ? (
                    'Pagar Online'
                  ) : user?.role === 'Distributor' && user.distributor && total < user.distributor.minimumPurchase ? (
                    `Mínimo requerido: ${formatPrice(user.distributor.minimumPurchase)}`
                  ) : (
                    `Confirmar Pedido - ${formatPrice(total)}`
                  )}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/catalogo')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    ← Volver al catálogo
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

