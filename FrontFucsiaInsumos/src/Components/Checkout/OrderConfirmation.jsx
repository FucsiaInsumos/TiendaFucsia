import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getOrderById } from '../../Redux/Actions/salesActions';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getOrderById(orderId));
      if (response.error === false) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      'efectivo': 'Efectivo',
      'tarjeta': 'Tarjeta',
      'wompi': 'Pago Online (Wompi)',
      'transferencia': 'Transferencia',
      'credito': 'Crédito'
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Orden no encontrada</h1>
          <Link to="/catalogo" className="text-blue-600 hover:text-blue-800">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header de confirmación */}
          <div className="bg-green-600 text-white p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">¡Pedido Confirmado!</h1>
            <p className="text-green-200">Tu orden ha sido procesada exitosamente</p>
          </div>

          <div className="p-6">
            {/* Información de la orden */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Detalles de la Orden</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Número de Orden:</span>
                  <span className="font-semibold ml-2">{order.orderNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-semibold ml-2">
                    {new Date(order.createdAt).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-semibold ml-2 text-green-600">{order.status}</span>
                </div>
                <div>
                  <span className="text-gray-600">Método de Pago:</span>
                  <span className="font-semibold ml-2">
                    {getPaymentMethodLabel(order.payments?.[0]?.method || 'N/A')}
                  </span>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Productos</h3>
              <div className="space-y-3">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold">
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Información de retiro */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📍 Información de Retiro</h4>
              <div className="text-sm text-blue-800">
                <p><strong>Dirección:</strong> Calle 123 #45-67, Centro</p>
                <p><strong>Ciudad:</strong> Bogotá, Colombia</p>
                <p><strong>Horarios:</strong> Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                <p><strong>Sábados:</strong> 8:00 AM - 2:00 PM</p>
                <p><strong>Teléfono:</strong> +57 (1) 234-5678</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalogo"
                className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Seguir Comprando
              </Link>
              <Link
                to="/ordenes"
                className="flex-1 bg-gray-600 text-white text-center py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Ver Mis Órdenes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
