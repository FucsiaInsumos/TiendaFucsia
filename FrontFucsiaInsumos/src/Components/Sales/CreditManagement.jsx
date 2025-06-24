import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCreditPayments, recordCreditPayment } from '../../Redux/Actions/salesActions';

const CreditManagement = () => {
  const dispatch = useDispatch();
  const [creditPayments, setCreditPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: 'pending',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    totalPayments: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [showAbonModal, setShowAbonModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [abonAmount, setAbonAmount] = useState('');
  const [abonNotes, setAbonNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo'); // ✅ NUEVO ESTADO

  useEffect(() => {
    loadCreditPayments();
  }, [filters]);

  const loadCreditPayments = async () => {
    try {
      setLoading(true);
      console.log('📋 [CreditManagement] Cargando pagos a crédito:', filters);

      const response = await dispatch(getCreditPayments(filters));
      if (response.error === false) {
        console.log('✅ [CreditManagement] Pagos a crédito cargados:', response.data.payments.length);
        setCreditPayments(response.data.payments);
        setPagination({
          totalPayments: response.data.totalPayments,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage
        });
      }
    } catch (error) {
      console.error('❌ [CreditManagement] Error loading credit payments:', error);
      alert('Error al cargar pagos a crédito: ' + error.message);
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

  const handleAbonClick = (payment) => {
    setSelectedPayment(payment);
    setAbonAmount('');
    setAbonNotes('');
    setPaymentMethod('efectivo'); // ✅ RESETEAR MÉTODO DE PAGO
    setShowAbonModal(true);
  };

  const handleAbonSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPayment || !abonAmount || parseFloat(abonAmount) <= 0) {
      alert('Por favor ingrese un monto válido para el abono');
      return;
    }

    const abonAmountNum = parseFloat(abonAmount);
    const remainingAmount = parseFloat(selectedPayment.amount) - parseFloat(selectedPayment.paidAmount || 0);

    if (abonAmountNum > remainingAmount) {
      alert(`El abono no puede ser mayor al saldo pendiente: ${formatPrice(remainingAmount)}`);
      return;
    }

    try {
      const abonData = {
        amount: abonAmountNum,
        notes: abonNotes || 'Abono registrado',
        paymentMethod: paymentMethod // ✅ INCLUIR MÉTODO DE PAGO
      };

      console.log('💰 [CreditManagement] Registrando abono:', abonData);

      const response = await dispatch(recordCreditPayment(selectedPayment.id, abonData));
      
      if (response.error === false) {
        const recordedByInfo = response.data.recordedBy;
        let successMessage = '✅ Abono registrado exitosamente';
        
        if (recordedByInfo?.document) {
          successMessage += `\nRegistrado por: ${recordedByInfo.document}`;
        }
        
        alert(successMessage);
        setShowAbonModal(false);
        setSelectedPayment(null);
        loadCreditPayments(); // Recargar lista
      }
    } catch (error) {
      console.error('❌ [CreditManagement] Error recording payment:', error);
      alert('Error al registrar abono: ' + error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const getStatusBadge = (payment) => {
    const totalPaid = parseFloat(payment.paidAmount || 0);
    const totalAmount = parseFloat(payment.amount);
    const remaining = totalAmount - totalPaid;

    if (remaining <= 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ Pagado
        </span>
      );
    } else if (totalPaid > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          ⏳ Abonado
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ❌ Pendiente
        </span>
      );
    }
  };

  const getDaysOverdue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  // Calcular totales
  const totalPending = creditPayments.reduce((sum, payment) => {
    const remaining = parseFloat(payment.amount) - parseFloat(payment.paidAmount || 0);
    return sum + Math.max(0, remaining);
  }, 0);

  const totalOverdue = creditPayments.reduce((sum, payment) => {
    const daysOverdue = getDaysOverdue(payment.dueDate);
    if (daysOverdue && daysOverdue > 0) {
      const remaining = parseFloat(payment.amount) - parseFloat(payment.paidAmount || 0);
      return sum + Math.max(0, remaining);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">💳 Gestión de Créditos</h1>
              <p className="text-sm text-gray-600 mt-1">
                Administra los pagos a crédito y registra abonos
              </p>
            </div>
            
            <button
              onClick={loadCreditPayments}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
            >
              {loading ? '🔄 Cargando...' : '🔄 Refrescar'}
            </button>
          </div>

          {/* Stats */}
          <div className="px-6 py-4 bg-red-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="bg-red-500 text-white p-2 rounded-lg mr-3">
                  💰
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pendiente</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatPrice(totalPending)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-orange-500 text-white p-2 rounded-lg mr-3">
                  ⏰
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vencido</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {formatPrice(totalOverdue)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
                  📋
                </div>
                <div>
                  <p className="text-sm text-gray-600">Créditos Activos</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {creditPayments.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                  <option value="pending">Pendientes</option>
                  <option value="partial">Con Abonos</option>
                  <option value="completed">Pagados</option>
                  <option value="overdue">Vencidos</option>
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
                    status: 'pending',
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
                  <p className="text-gray-500">Cargando créditos...</p>
                </div>
              </div>
            ) : creditPayments.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-gray-500 text-lg">¡No hay créditos pendientes!</p>
                  <p className="text-gray-400">Todos los pagos están al día</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden / Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto Original
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Abonado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo Pendiente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {creditPayments.map((payment) => {
                    const totalPaid = parseFloat(payment.paidAmount || 0);
                    const totalAmount = parseFloat(payment.amount);
                    const remaining = totalAmount - totalPaid;
                    const daysOverdue = getDaysOverdue(payment.dueDate);

                    return (
                      <tr key={payment.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{payment.order?.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.order?.customer?.first_name} {payment.order?.customer?.last_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {payment.order?.customer?.n_document}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(payment.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            {formatPrice(totalPaid)}
                          </div>
                          {payment.abonos && payment.abonos.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {payment.abonos.length} abono{payment.abonos.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatPrice(remaining)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('es-CO') : 'Sin fecha'}
                          </div>
                          {daysOverdue && daysOverdue > 0 && (
                            <div className="text-xs text-red-600 font-medium">
                              Vencido {daysOverdue} día{daysOverdue !== 1 ? 's' : ''}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {remaining > 0 && (
                            <button
                              onClick={() => handleAbonClick(payment)}
                              className="text-green-600 hover:text-green-900 transition duration-150"
                              title="Registrar abono"
                            >
                              <span className="text-lg">💰</span> Abonar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.currentPage - 1) * filters.limit) + 1} a {Math.min(pagination.currentPage * filters.limit, pagination.totalPayments)} de {pagination.totalPayments} créditos
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

      {/* Modal de Abono */}
      {showAbonModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  💰 Registrar Abono
                </h3>
                <button
                  onClick={() => setShowAbonModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Orden: <span className="font-medium">#{selectedPayment.order?.orderNumber}</span></p>
                <p className="text-sm text-gray-600">Cliente: <span className="font-medium">{selectedPayment.order?.customer?.first_name} {selectedPayment.order?.customer?.last_name}</span></p>
                <p className="text-sm text-gray-600">Monto total: <span className="font-medium">{formatPrice(selectedPayment.amount)}</span></p>
                <p className="text-sm text-gray-600">Ya abonado: <span className="font-medium text-green-600">{formatPrice(selectedPayment.paidAmount || 0)}</span></p>
                <p className="text-sm text-gray-600">Saldo pendiente: <span className="font-medium text-red-600">{formatPrice(parseFloat(selectedPayment.amount) - parseFloat(selectedPayment.paidAmount || 0))}</span></p>
              </div>

              <form onSubmit={handleAbonSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto del Abono *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={parseFloat(selectedPayment.amount) - parseFloat(selectedPayment.paidAmount || 0)}
                    value={abonAmount}
                    onChange={(e) => setAbonAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago del Abono
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="transferencia">🏦 Transferencia</option>
                    <option value="tarjeta">💳 Tarjeta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={abonNotes}
                    onChange={(e) => setAbonNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="3"
                    placeholder="Observaciones del abono..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    💰 Registrar Abono
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAbonModal(false)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditManagement;