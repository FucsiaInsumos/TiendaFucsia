import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getOrdersRequiringBilling, markOrderAsBilled } from '../../Redux/Actions/salesActions';

import OrderDetailModal from './OrderDetailModal';


const BillingOrdersManagement = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    totalOrders: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [billingStats, setBillingStats] = useState({});

  useEffect(() => {
    loadBillingOrders();
  }, [filters]);

  const loadBillingOrders = async () => {
    try {
      setLoading(true);
      console.log('📋 [BillingOrders] Cargando órdenes que requieren facturación:', filters);
      
      const response = await dispatch(getOrdersRequiringBilling(filters));
      if (response.error === false) {
        console.log('✅ [BillingOrders] Órdenes cargadas:', response.data.orders.length);
        setOrders(response.data.orders);
        setPagination({
          totalOrders: response.data.totalOrders,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage
        });
        setBillingStats(response.data.billingStats || {});
      }
    } catch (error) {
      console.error('❌ [BillingOrders] Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleMarkAsBilled = async (orderId) => {
    const billingDetails = {
      billingDate: new Date().toISOString(),
      billingNote: prompt('Nota de facturación (opcional):') || '',
      billedBy: 'current-user' // Puedes obtener del estado de usuario
    };

    try {
      await dispatch(markOrderAsBilled(orderId, billingDetails));
      alert('✅ Orden marcada como facturada exitosamente');
      loadBillingOrders(); // Recargar lista
    } catch (error) {
      alert('❌ Error al marcar como facturada: ' + error.message);
    }
  };

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

  // ✅ NUEVA FUNCIÓN PARA MOSTRAR ESTADO DE PAGO GENERAL
  const getPaymentStatusBadge = (order) => {
    // Verificar si tiene pagos
    if (!order.payments || order.payments.length === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Sin pago registrado
        </span>
      );
    }

    // Usar el paymentStatus de la orden directamente
    const paymentStatus = order.paymentStatus || 'pending';
    
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pendiente' },
      'partial': { bg: 'bg-orange-100', text: 'text-orange-800', label: '📊 Parcial' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Completado' },
      'failed': { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Fallido' }
    };

    const config = statusConfig[paymentStatus] || statusConfig['pending'];

    // Mostrar información de métodos de pago
    const paymentMethods = order.payments.map(p => p.method).join(', ');
    const totalPaid = order.payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    return (
      <div className="space-y-1">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {config.label}
        </span>
        
        {/* Información adicional */}
        <div className="text-xs text-gray-600">
          <div>Métodos: {paymentMethods}</div>
          {paymentStatus === 'partial' && (
            <div>Pagado: {formatPrice(totalPaid)}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">📄 Órdenes para Facturación</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona las órdenes que contienen productos codificados
              </p>
            </div>
            
            <button
              onClick={loadBillingOrders}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
            >
              {loading ? '🔄 Cargando...' : '🔄 Refrescar'}
            </button>
          </div>

          {/* Stats */}
          {billingStats.totalOrdersRequiringBilling > 0 && (
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
                    📋
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Órdenes pendientes</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {billingStats.totalOrdersRequiringBilling}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
                    💰
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monto total codificable</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(billingStats.totalBillableAmount || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="completed">Completada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    page: 1,
                    limit: 20,
                    status: '',
                    startDate: '',
                    endDate: ''
                  })}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500">Cargando órdenes facturables...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-gray-500 text-lg">¡No hay órdenes pendientes de facturación!</p>
                  <p className="text-gray-400">Todas las órdenes con productos codificados han sido procesadas</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items Codificable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Codificable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.orderType === 'local' && '🏪 Local'}
                            {order.orderType === 'online' && '🌐 Online'}
                            {order.orderType === 'distributor' && '📦 Distribuidor'}
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              📄 CODIFICADO
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer?.first_name} {order.customer?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer?.n_document}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {order.billingInfo?.billableItemsCount || 0} productos
                          </div>
                          {order.billingInfo?.nonBillableItemsCount > 0 && (
                            <div className="text-xs text-gray-500">
                              (+{order.billingInfo.nonBillableItemsCount} no codificado)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(order.billingInfo?.billableTotal || 0)}
                        </div>
                        {order.billingInfo?.billableTotal !== parseFloat(order.total) && (
                          <div className="text-xs text-gray-500">
                            Total orden: {formatPrice(order.total)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(order)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-blue-600 hover:text-blue-900 transition duration-150"
                            title="Ver detalles"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleMarkAsBilled(order.id)}
                            className="text-green-600 hover:text-green-900 transition duration-150"
                            title="Marcar como facturada"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.currentPage - 1) * filters.limit) + 1} a {Math.min(pagination.currentPage * filters.limit, pagination.totalOrders)} de {pagination.totalOrders} órdenes
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-200"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-200"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default BillingOrdersManagement;

//cambio