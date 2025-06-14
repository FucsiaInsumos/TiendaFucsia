import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Calendar, Eye, X } from 'lucide-react';
import { getMyOrders, getOrderById } from '../../Redux/Actions/salesActions';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    orderType: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    totalOrders: 0,
    totalPages: 0,
    currentPage: 1
  });

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getMyOrders(filters));
      if (!response.error) {
        setOrders(response.data.orders);
        setPagination({
          totalOrders: response.data.totalOrders,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage
        });
      }
    } catch (error) {
      console.error('Error al obtener mis órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [filters]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return texts[status] || status;
  };

  const openOrderDetail = async (order) => {
    try {
      const response = await dispatch(getOrderById(order.id));
      if (!response.error) {
        setSelectedOrder(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error al obtener detalles:', error);
    }
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando mis órdenes...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Órdenes</h1>
        <p className="text-gray-600">
          Historial de todas tus compras y pedidos
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Orden
            </label>
            <select
              value={filters.orderType}
              onChange={(e) => setFilters(prev => ({ ...prev, orderType: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="online">En línea</option>
              <option value="local">En tienda</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end justify-end">
            <button
              onClick={() => setFilters({ status: '', orderType: '', page: 1, limit: 10 })}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes órdenes aún
            </h3>
            <p className="text-gray-500">
              Cuando realices tu primera compra, aparecerá aquí
            </p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Orden #{order.orderNumber}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <div className="text-lg font-bold text-gray-800 mt-1">
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Tipo:</span>
                  <div className="font-medium">
                    {order.orderType === 'online' ? 'En línea' : 'En tienda'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Estado de pago:</span>
                  <div className="font-medium">
                    {order.paymentStatus === 'completed' ? 'Pagado' : 
                     order.paymentStatus === 'pending' ? 'Pendiente' : 'No pagado'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Productos:</span>
                  <div className="font-medium">
                    {order.items?.length || 0} artículo{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {order.items?.slice(0, 2).map(item => item.product?.name).join(', ')}
                  {order.items?.length > 2 && ` y ${order.items.length - 2} más...`}
                </div>
                <button
                  onClick={() => openOrderDetail(order)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye size={16} className="mr-2" />
                  Ver detalles
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setFilters(prev => ({ ...prev, page }))}
                className={`px-3 py-2 rounded ${
                  page === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Detalles de Orden #{selectedOrder.orderNumber}</h2>
              <button
                onClick={closeOrderDetail}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Información de la Orden</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Fecha:</span> {formatDate(selectedOrder.createdAt)}</div>
                    <div><span className="text-gray-500">Estado:</span> {getStatusText(selectedOrder.status)}</div>
                    <div><span className="text-gray-500">Tipo:</span> {selectedOrder.orderType === 'online' ? 'En línea' : 'En tienda'}</div>
                    <div><span className="text-gray-500">Pago:</span> {selectedOrder.paymentStatus === 'completed' ? 'Pagado' : 'Pendiente'}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Resumen de Costos</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento:</span>
                        <span>-{formatPrice(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Productos</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <img
                          src={item.product?.image_url?.[0] || '/placeholder-image.png'}
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <div className="font-medium">{item.product?.name}</div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.unitPrice)} x {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-semibold">
                        {formatPrice(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Notas</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
