import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getOrders, updateOrderStatus, cancelOrder, getOrderById } from '../../Redux/Actions/salesActions';
import { getPaymentStatus, updateOrderPaymentStatus } from '../../Redux/Actions/wompiActions';
import OrderDetailModal from './OrderDetailModal';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    orderType: '',
    paymentStatus: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    totalOrders: 0,
    totalPages: 0,
    currentPage: 1
  });

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('📋 [OrderManagement] Cargando órdenes con filtros:', filters);

      const response = await dispatch(getOrders(filters));
      if (response.error === false) {
        console.log('✅ [OrderManagement] Órdenes cargadas:', response.data.orders.length);
        setOrders(response.data.orders);
        setPagination({
          totalOrders: response.data.totalOrders,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage
        });
      }
    } catch (error) {
      console.error('❌ [OrderManagement] Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN PARA VALIDAR IDs DE WOMPI
  const isValidWompiId = (id) => {
    if (!id) return false;
    // Los IDs de Wompi suelen tener formato: números-números-números
    // Los UUIDs tienen formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const wompiPattern = /^\d+-\d+-\d+$/;
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return wompiPattern.test(id) && !uuidPattern.test(id);
  };

  // ✅ FUNCIÓN PARA CONSULTAR ESTADO INDIVIDUAL DE WOMPI
  const checkRealPaymentStatus = async (order) => {
    console.log('🔍 [DEBUG] Consultando estado de pago para orden:', order.orderNumber);

    const wompiPayment = order.payments?.find(p => p.method === 'wompi');

    if (!wompiPayment) {
      alert('❌ Esta orden no tiene un pago de Wompi');
      return;
    }

    console.log('✅ [DEBUG] Pago de Wompi encontrado:', wompiPayment);

    // Buscar el VERDADERO transaction ID de Wompi
    const possibleTransactionIds = [
      wompiPayment.paymentDetails?.transactionId,
      wompiPayment.paymentDetails?.wompiTransactionId,
      wompiPayment.paymentDetails?.wompiData?.transactionId,
      wompiPayment.paymentDetails?.reference,
      wompiPayment.paymentDetails?.wompiReference,
      wompiPayment.transactionId
    ].filter(Boolean);

    console.log('🔍 [DEBUG] IDs encontrados:', possibleTransactionIds);

    // Filtrar solo IDs válidos de Wompi
    const validWompiIds = possibleTransactionIds.filter(isValidWompiId);
    const wompiTransactionId = validWompiIds[0];

    console.log('✅ [DEBUG] IDs válidos de Wompi:', validWompiIds);

    if (!wompiTransactionId) {
      const detailsText = `🔍 ANÁLISIS DE TRANSACTION ID:

📋 Orden: ${order.orderNumber}
💰 Monto: $${new Intl.NumberFormat('es-CO').format(wompiPayment.amount)}
📊 Estado en BD: ${wompiPayment.status}

🔍 IDs encontrados:
${possibleTransactionIds.map((id, index) => `${index + 1}. ${id} ${isValidWompiId(id) ? '✅ VÁLIDO' : '❌ INVÁLIDO (UUID interno)'}`).join('\n')}

❌ No se encontró un Transaction ID válido de Wompi.
Esta orden podría ser de antes de que la integración funcionara correctamente.`;

      alert(detailsText);
      return;
    }

    try {
      setPaymentStatusLoading(prev => ({ ...prev, [order.id]: true }));

      console.log('🔍 [OrderManagement] Consultando TransactionId:', wompiTransactionId);

      const paymentStatusResponse = await dispatch(getPaymentStatus(wompiTransactionId));

      console.log('✅ [OrderManagement] Estado obtenido:', paymentStatusResponse);

      // Actualizar estado local
      setOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === order.id
            ? {
              ...o,
              realPaymentStatus: paymentStatusResponse.data,
              lastPaymentCheck: new Date().toISOString()
            }
            : o
        )
      );

      // Comparar estados y montos
      const statusMatch = wompiPayment.status === paymentStatusResponse.data.status;
      const amountMatch = parseFloat(wompiPayment.amount) === (paymentStatusResponse.data.amount_in_cents / 100);

      const resultText = `📊 CONSULTA DE PAGO WOMPI EXITOSA:
    
🏷️ Orden: ${order.orderNumber}
🆔 Transaction ID: ${wompiTransactionId}

💰 MONTOS:
   Base de Datos: $${new Intl.NumberFormat('es-CO').format(wompiPayment.amount)}
   Wompi Real: $${new Intl.NumberFormat('es-CO').format(paymentStatusResponse.data.amount_in_cents / 100)}
   ${amountMatch ? '✅ COINCIDEN' : '⚠️ DIFERENTES'}

📊 ESTADOS:
   Base de Datos: ${wompiPayment.status}
   Wompi Real: ${paymentStatusResponse.data.status}
   ${statusMatch ? '✅ COINCIDEN' : '⚠️ DIFERENTES'}

🕒 Consultado: ${new Date().toLocaleString()}

${statusMatch && amountMatch ? '🎉 Todo está en orden!' : '⚠️ Revisa las diferencias encontradas'}`;

      alert(resultText);

    } catch (error) {
      console.error('❌ [OrderManagement] Error consultando pago:', error);
      alert(`❌ Error al consultar el pago: 

🆔 Transaction ID: ${wompiTransactionId}
📋 Orden: ${order.orderNumber}
❌ Error: ${error.response?.data?.message || error.message}

${error.response?.status === 404 ? '💡 Sugerencia: El Transaction ID podría no existir en Wompi (orden antigua).' : ''}`);
    } finally {
      setPaymentStatusLoading(prev => ({ ...prev, [order.id]: false }));
    }
  };

  // ✅ FUNCIÓN PARA VERIFICAR TODOS LOS PAGOS DE WOMPI
  const checkAllWompiPayments = async () => {
    console.log('🔍 [DEBUG] Iniciando verificación masiva de pagos Wompi');

    const wompiOrders = orders.filter(order => {
      return order.payments?.some(p => p.method === 'wompi');
    });

    console.log('✅ [DEBUG] Órdenes con Wompi encontradas:', wompiOrders.length);

    if (wompiOrders.length === 0) {
      alert('ℹ️ No hay órdenes con pagos de Wompi para verificar en esta página.');
      return;
    }

    const confirmResult = confirm(`🔍 VERIFICACIÓN MASIVA DE PAGOS WOMPI

Se encontraron ${wompiOrders.length} órdenes con pagos de Wompi.

⚠️ Esta operación puede tomar tiempo si hay muchas órdenes.

¿Deseas continuar con la verificación?`);

    if (!confirmResult) return;

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const order of wompiOrders) {
      try {
        const wompiPayment = order.payments.find(p => p.method === 'wompi');

        // Buscar y validar Transaction ID
        const possibleTransactionIds = [
          wompiPayment.paymentDetails?.transactionId,
          wompiPayment.paymentDetails?.wompiTransactionId,
          wompiPayment.paymentDetails?.wompiData?.transactionId,
          wompiPayment.paymentDetails?.reference,
          wompiPayment.transactionId
        ].filter(Boolean);

        const validWompiIds = possibleTransactionIds.filter(isValidWompiId);
        const wompiTransactionId = validWompiIds[0];

        if (!wompiTransactionId) {
          console.log(`❌ Orden ${order.orderNumber} sin Transaction ID válido`);
          results.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            statusInDB: wompiPayment.status,
            statusInWompi: 'SIN_ID_VÁLIDO',
            error: 'Orden antigua sin ID de Wompi válido',
            statusMatch: '❓'
          });
          errorCount++;
          continue;
        }

        console.log(`🔍 Consultando orden ${order.orderNumber} - ID: ${wompiTransactionId}`);

        const paymentStatusResponse = await dispatch(getPaymentStatus(wompiTransactionId));

        const statusMatch = wompiPayment.status === paymentStatusResponse.data.status;
        const amountMatch = parseFloat(wompiPayment.amount) === (paymentStatusResponse.data.amount_in_cents / 100);

        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          statusInDB: wompiPayment.status,
          statusInWompi: paymentStatusResponse.data.status,
          amount: paymentStatusResponse.data.amount_in_cents / 100,
          transactionId: wompiTransactionId,
          statusMatch: statusMatch && amountMatch ? '✅' : '⚠️'
        });

        // Actualizar estado local
        setOrders(prevOrders =>
          prevOrders.map(o =>
            o.id === order.id
              ? {
                ...o,
                realPaymentStatus: paymentStatusResponse.data,
                lastPaymentCheck: new Date().toISOString()
              }
              : o
          )
        );

        successCount++;

        // Pausa entre consultas para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 800));

      } catch (error) {
        console.error(`❌ Error consultando orden ${order.orderNumber}:`, error);
        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          statusInDB: 'ERROR',
          statusInWompi: 'ERROR',
          error: error.response?.data?.message || error.message,
          statusMatch: '❌'
        });
        errorCount++;
      }
    }

    // Mostrar resumen completo
    console.log('📊 Resumen completo de verificación:', results);

    const summary = results.map(r =>
      `${r.statusMatch} ${r.orderNumber}: BD=${r.statusInDB} | Wompi=${r.statusInWompi}${r.error ? ` (${r.error})` : ''}`
    ).join('\n');

    const summaryText = `🔍 VERIFICACIÓN MASIVA COMPLETADA:

📊 RESUMEN:
✅ Exitosas: ${successCount}
❌ Con errores: ${errorCount}
📋 Total procesadas: ${results.length}

📋 DETALLES:
${summary}

LEYENDA:
✅ = Todo coincide perfectamente
⚠️ = Hay diferencias entre BD y Wompi  
❌ = Error en la consulta
❓ = Sin ID válido (orden antigua)

🕒 Verificación completada: ${new Date().toLocaleString()}`;

    alert(summaryText);
  };

  // ✅ FUNCIÓN PARA DEBUG (OPCIONAL)
  const debugOrderStructure = () => {
    console.log('🔍 [DEBUG COMPLETO] Analizando estructura de todas las órdenes:');

    orders.forEach((order, index) => {
      const wompiPayment = order.payments?.find(p => p.method === 'wompi');

      console.log(`\n📋 === ORDEN ${index + 1} (${order.orderNumber}) ===`);
      console.log('💳 Tiene pago Wompi:', !!wompiPayment);

      if (wompiPayment) {
        console.log('💰 Monto:', wompiPayment.amount);
        console.log('📊 Estado:', wompiPayment.status);
        console.log('🔗 PaymentDetails:', wompiPayment.paymentDetails);

        const possibleIds = [
          wompiPayment.paymentDetails?.transactionId,
          wompiPayment.paymentDetails?.reference,
          wompiPayment.transactionId
        ].filter(Boolean);

        console.log('🆔 IDs encontrados:', possibleIds);
        console.log('✅ IDs válidos:', possibleIds.filter(isValidWompiId));
      }
    });

    alert('🐛 Análisis completado. Revisa la consola para ver todos los detalles.');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await dispatch(updateOrderStatus(orderId, { status: newStatus }));
      if (response.error === false) {
        loadOrders();
        alert('✅ Estado de orden actualizado exitosamente');
      }
    } catch (error) {
      alert('❌ Error al actualizar estado: ' + error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt('Razón de cancelación:');
    if (!reason) return;

    try {
      const response = await dispatch(cancelOrder(orderId, reason));
      if (response.error === false) {
        loadOrders();
        alert('✅ Orden cancelada exitosamente');
      }
    } catch (error) {
      alert('❌ Error al cancelar orden: ' + error.message);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      const response = await dispatch(getOrderById(order.id));
      if (response.error === false) {
        setSelectedOrder(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      alert('❌ Error al obtener detalles: ' + error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const hasFacturableItems = (order) => {
    return order.items?.some(item => item.product?.isFacturable) || false;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      'confirmed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmada' },
      'processing': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Procesando' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completada' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
      'refunded': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Reembolsada' }
    };

    const config = statusConfig[status] || statusConfig['pending'];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // ✅ FUNCIÓN PARA MOSTRAR ESTADOS DE PAGO MEJORADOS
  const getPaymentStatusBadge = (order) => {
    const wompiPayment = order.payments?.find(p => p.method === 'wompi');
    const { realPaymentStatus } = order;

    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      'partial': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Parcial' },
      'paid': { bg: 'bg-green-100', text: 'text-green-800', label: 'Pagado' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completado' },
      'failed': { bg: 'bg-red-100', text: 'text-red-800', label: 'Fallido' },
      // Estados de Wompi
      'APPROVED': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Aprobado' },
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pendiente' },
      'DECLINED': { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Rechazado' },
      'VOIDED': { bg: 'bg-gray-100', text: 'text-gray-800', label: '🚫 Anulado' }
    };

    if (!wompiPayment) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Sin pago registrado
        </span>
      );
    }

    const config = statusConfig[wompiPayment.status] || statusConfig['pending'];

    return (
      <div className="space-y-1">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {config.label}
        </span>

        {/* Estado real de Wompi si existe */}
        {realPaymentStatus && (
          <div className="text-xs text-gray-600">
            <span className="text-gray-500">Wompi:</span>
            <span className={`ml-1 px-1 py-0.5 rounded text-xs ${statusConfig[realPaymentStatus.status]?.bg || 'bg-gray-100'} ${statusConfig[realPaymentStatus.status]?.text || 'text-gray-800'}`}>
              {realPaymentStatus.status}
            </span>
            {wompiPayment.status !== realPaymentStatus.status && (
              <span className="ml-1 text-orange-600">⚠️</span>
            )}
          </div>
        )}

        {/* Timestamp de última consulta */}
        {order.lastPaymentCheck && (
          <div className="text-xs text-gray-400">
            Última consulta: {new Date(order.lastPaymentCheck).toLocaleTimeString()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header con botones mejorados */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Gestión de Órdenes</h1>

            <div className="flex space-x-2">
              <button
                onClick={loadOrders}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
                title="Recargar órdenes"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Cargando...</span>
                  </div>
                ) : (
                  <>🔄 Refrescar</>
                )}
              </button>

              <button
                onClick={checkAllWompiPayments}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                title="Verificar todos los pagos de Wompi"
              >
                🔍 Verificar Pagos Wompi
              </button>

              <button
                onClick={debugOrderStructure}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200"
                title="Debug estructura de datos"
              >
                🐛 Debug
              </button>
            </div>
          </div>

          {/* Filtros existentes */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="processing">Procesando</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={filters.orderType}
                  onChange={(e) => handleFilterChange('orderType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Todos</option>
                  <option value="local">Local</option>
                  <option value="online">Online</option>
                  <option value="distributor">Distribuidor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pago</label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="partial">Parcial</option>
                  <option value="completed">Completado</option>
                  <option value="failed">Fallido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    page: 1,
                    limit: 20,
                    status: '',
                    orderType: '',
                    paymentStatus: '',
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

          {/* Tabla mejorada */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="text-gray-500">Cargando órdenes...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <p className="text-gray-500 text-lg">No se encontraron órdenes</p>
                  <p className="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
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
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pago
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
                            {/* Indicador de pago Wompi */}
                            {order.payments?.some(p => p.method === 'wompi') && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                WOMPI
                              </span>
                            )}
                            {hasFacturableItems(order) && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                📄 FACTURABLE
                              </span>
                            )}
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
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(order.total)}
                        </div>
                        {order.discount > 0 && (
                          <div className="text-sm text-green-600">
                            Desc: -{formatPrice(order.discount)}
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
                          {/* Ver detalles */}
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                            title="Ver detalles"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Consultar estado de Wompi */}
                          {order.payments?.some(p => p.method === 'wompi') && (
                            <button
                              onClick={() => checkRealPaymentStatus(order)}
                              disabled={paymentStatusLoading[order.id]}
                              className="text-green-600 hover:text-green-900 disabled:text-gray-400 transition duration-150"
                              title="Consultar estado real en Wompi"
                            >
                              {paymentStatusLoading[order.id] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <span className="text-lg">🔍</span>
                              )}
                            </button>
                          )}

                          {/* Confirmar orden */}
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900 transition duration-150"
                              title="Confirmar orden"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}

                          {/* Cancelar orden */}
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-red-600 hover:text-red-900 transition duration-150"
                              title="Cancelar orden"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
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
          onStatusUpdate={handleStatusUpdate}
          onCancel={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default OrderManagement;