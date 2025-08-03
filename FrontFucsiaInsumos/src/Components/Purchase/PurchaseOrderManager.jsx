import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  getPurchaseOrders,
  getProveedores 
} from '../../Redux/Actions/purchaseActions';
import PurchaseOrderForm from './PurchaseOrderForm';
import ReceiveMerchandiseModal from './ReceiveMerchandiseModal';
import EditPurchaseOrderModal from './EditPurchaseOrderModal';
import PaymentModal from './PaymentModal';
import axios from '../../utils/axios';

const PurchaseOrderManager = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForReceiving, setSelectedOrderForReceiving] = useState(null);
  const [selectedOrderForEditing, setSelectedOrderForEditing] = useState(null);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    proveedorId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadOrders();
    loadProveedores();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getPurchaseOrders(filters));
      if (response.error === false) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      alert('Error al cargar órdenes de compra');
    } finally {
      setLoading(false);
    }
  };

  const loadProveedores = async () => {
    try {
      const response = await dispatch(getProveedores());
      if (response.error === false) {
        setProveedores(response.data.proveedores || []);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
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
      'pendiente': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      'parcial': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Parcial' },
      'completada': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completada' },
      'cancelada': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' }
    };

    const config = statusConfig[status] || statusConfig['pendiente'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // ✅ NUEVA FUNCIÓN: Badge para estado de pago
  const getPaymentStatusBadge = (paymentStatus, totalPaid, total) => {
    const statusConfig = {
      'pendiente': { bg: 'bg-gray-100', text: 'text-gray-800', label: '💳 Pendiente', icon: '⏳' },
      'parcial': { bg: 'bg-orange-100', text: 'text-orange-800', label: '💳 Parcial', icon: '🔄' },
      'pagada': { bg: 'bg-green-100', text: 'text-green-800', label: '💳 Pagada', icon: '✅' }
    };

    const config = statusConfig[paymentStatus] || statusConfig['pendiente'];
    const percentage = total > 0 ? (totalPaid / total * 100).toFixed(0) : 0;
    
    return (
      <div className="flex flex-col items-start">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {config.icon} {config.label}
        </span>
        {paymentStatus === 'parcial' && (
          <span className="text-xs text-gray-500 mt-1">
            {percentage}% pagado
          </span>
        )}
      </div>
    );
  };

  const handleCreateOrder = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadOrders(); // Recargar órdenes
  };

  // ✅ NUEVA FUNCIÓN: Abrir modal para recibir mercancía
  const handleReceiveMerchandise = (order) => {
    setSelectedOrderForReceiving(order);
    setShowReceiveModal(true);
  };

  // ✅ NUEVA FUNCIÓN: Cerrar modal de recepción
  const handleCloseReceiveModal = () => {
    setShowReceiveModal(false);
    setSelectedOrderForReceiving(null);
  };

  // ✅ NUEVA FUNCIÓN: Éxito en recepción
  const handleReceiveSuccess = () => {
    setShowReceiveModal(false);
    setSelectedOrderForReceiving(null);
    loadOrders(); // Recargar órdenes para ver cambios de estado
  };

  // ✅ FUNCIONES PARA EDICIÓN
  const handleEditOrder = (order) => {
    setSelectedOrderForEditing(order);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedOrderForEditing(null);
    setShowEditModal(false);
  };

  const handleEditSuccess = () => {
    handleCloseEditModal();
    loadOrders(); // Recargar órdenes después del éxito
  };

  // ✅ FUNCIONES PARA PAGOS
  const handleRegisterPayment = (order) => {
    setSelectedOrderForPayment(order);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setSelectedOrderForPayment(null);
    setShowPaymentModal(false);
  };

  const handlePaymentSuccess = () => {
    handleClosePaymentModal();
    loadOrders(); // Recargar órdenes después del éxito
  };

  // ✅ FUNCIÓN PARA CANCELAR ORDEN CON CONFIRMACIÓN INTELIGENTE
  const handleCancelOrder = async (order) => {
    // Determinar si la orden tiene mercancía recibida
    const hasReceivedItems = order.status === 'recibida' || order.status === 'parcial' || order.status === 'completada';
    
    let confirmMessage = `¿Estás seguro de cancelar la orden ${order.orderNumber}?`;
    if (hasReceivedItems) {
      confirmMessage += '\n\n⚠️ ADVERTENCIA: Esta orden ya recibió mercancía.\nAl cancelarla se REVERTIRÁ el stock y se ELIMINARÁN los gastos automáticos.\n\n¿Continuar con la cancelación?';
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await axios.patch(`/purchase/orders/${order.id}/status`, {
        status: 'cancelada',
        reason: 'Cancelada por usuario'
      });

      if (response.data.error === false) {
        let successMessage = 'Orden cancelada exitosamente';
        if (response.data.data?.stockReverted) {
          successMessage += '\n\n✅ Stock revertido correctamente\n✅ Gastos automáticos eliminados';
        }
        alert(successMessage);
        loadOrders();
      } else {
        alert(response.data.message || 'Error al cancelar orden');
      }
    } catch (error) {
      console.error('Error al cancelar orden:', error);
      alert('Error al cancelar la orden');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Órdenes de Compra
          </h2>
          <p className="text-gray-600">
            Gestiona órdenes de compra y recepción de mercancía
          </p>
        </div>
        <button
          onClick={handleCreateOrder} // ✅ AGREGAR FUNCIONALIDAD
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center space-x-2"
        >
          <span>📦</span>
          <span>Nueva Orden</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="parcial">Parcial</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor
            </label>
            <select
              value={filters.proveedorId}
              onChange={(e) => setFilters(prev => ({ ...prev, proveedorId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los proveedores</option>
              {proveedores.map(proveedor => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha desde
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha hasta
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={loadOrders}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay órdenes de compra
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza creando tu primera orden de compra
            </p>
            <button 
              onClick={handleCreateOrder}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Nueva Orden
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pago
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        {order.numeroFactura && (
                          <div className="text-sm text-gray-500">
                            Fact: {order.numeroFactura}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.proveedor?.nombre || 'N/A'}
                      </div>
                      {order.proveedor?.nit && (
                        <div className="text-sm text-gray-500">
                          {order.proveedor.nit}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.fechaCompra).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div>
                          {getStatusBadge(order.status)}
                        </div>
                        {/* ✅ MOSTRAR PROGRESO DE RECEPCIÓN */}
                        {(order.status === 'parcial' || order.status === 'completada') && order.items && (
                          <div className="text-xs text-gray-500">
                            {order.items.reduce((received, item) => received + (item.cantidadRecibida || 0), 0)} / {order.items.reduce((total, item) => total + item.cantidad, 0)} recibidos
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(
                        order.paymentStatus || 'pendiente', 
                        order.totalPaid || 0, 
                        order.total
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        
                        {/* ✅ BOTÓN DE EDICIÓN - Solo para órdenes no completadas */}
                        {order.status !== 'completada' && order.status !== 'cancelada' && (
                          <button 
                            onClick={() => handleEditOrder(order)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                            title="Editar orden"
                          >
                            ✏️ Editar
                          </button>
                        )}
                        
                        {/* ✅ BOTÓN DE RECEPCIÓN */}
                        {(order.status === 'pendiente' || order.status === 'parcial') && (
                          <button 
                            onClick={() => handleReceiveMerchandise(order)}
                            className="text-green-600 hover:text-green-900 font-medium"
                            title="Recibir mercancía pendiente"
                          >
                            📦 Recibir
                          </button>
                        )}
                        
                        {/* ✅ BOTÓN DE PAGO */}
                        {order.status !== 'cancelada' && (
                          <button 
                            onClick={() => handleRegisterPayment(order)}
                            className="text-purple-600 hover:text-purple-900 font-medium"
                            title="Registrar pago"
                          >
                            💳 Pago
                          </button>
                        )}
                        
                        {/* ✅ BOTÓN DE CANCELAR - Solo para órdenes pendientes/parciales */}
                        {(order.status === 'pendiente' || order.status === 'parcial') && (
                          <button 
                            onClick={() => handleCancelOrder(order)}
                            className="text-red-600 hover:text-red-900 font-medium"
                            title="Cancelar orden"
                          >
                            ❌ Cancelar
                          </button>
                        )}
                        
                        {/* ✅ ESTADOS VISUALES */}
                        {order.status === 'completada' && (
                          <span className="text-green-600 text-sm font-medium" title="Orden completamente recibida">
                            ✅ Completada
                          </span>
                        )}
                        
                        {order.status === 'cancelada' && (
                          <span className="text-red-500 text-sm">
                            ❌ Cancelada
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ MODAL DE FORMULARIO */}
      {showForm && (
        <PurchaseOrderForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* ✅ MODAL DE RECEPCIÓN DE MERCANCÍA */}
      {showReceiveModal && selectedOrderForReceiving && (
        <ReceiveMerchandiseModal
          order={selectedOrderForReceiving}
          onClose={handleCloseReceiveModal}
          onSuccess={handleReceiveSuccess}
        />
      )}

      {/* ✅ MODAL DE EDICIÓN DE ORDEN */}
      {showEditModal && selectedOrderForEditing && (
        <EditPurchaseOrderModal
          order={selectedOrderForEditing}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* ✅ MODAL DE REGISTRO DE PAGO */}
      {showPaymentModal && selectedOrderForPayment && (
        <PaymentModal
          order={selectedOrderForPayment}
          onClose={handleClosePaymentModal}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PurchaseOrderManager;
