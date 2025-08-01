import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, FileText, TrendingDown, Calendar, Filter, Download } from 'lucide-react';
import { 
  getExpenses, 
  getExpenseStats,
  deleteExpense,
  approveExpense 
} from '../../Redux/Actions/expenseActions';
import { 
  setExpenses, 
  setExpenseStats,
  setFilters, 
  clearFilters,
  setLoading,
  setError 
} from '../../Redux/Reducer/expenseReducer';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseFilters from './ExpenseFilters';
import ExpenseStats from './ExpenseStats';
import ConfirmModal from '../Common/ConfirmModal';

const ExpenseManager = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { 
    expenses, 
    loading, 
    error, 
    filters, 
    pagination, 
    summary, 
    stats 
  } = useSelector(state => state.expenses);

  // Estados locales
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    loadExpenses();
    loadStats();
  }, [filters]);

  const loadExpenses = async () => {
    try {
      dispatch(setLoading(true));
      const response = await dispatch(getExpenses(filters));
      
      if (response.error === false) {
        dispatch(setExpenses(response.data));
      } else {
        dispatch(setError(response.message || 'Error al cargar gastos'));
      }
    } catch (error) {
      dispatch(setError('Error al cargar gastos'));
      console.error('Error loading expenses:', error);
    }
  };

  const loadStats = async () => {
    try {
      const period = getStatsPeriod();
      const response = await dispatch(getExpenseStats(period));
      
      if (response.error === false) {
        dispatch(setExpenseStats(response.data));
      }
    } catch (error) {
      console.error('Error loading expense stats:', error);
    }
  };

  const getStatsPeriod = () => {
    const { startDate, endDate } = filters;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) return 'week';
      if (diffDays <= 31) return 'month';
      return 'year';
    }
    return 'month';
  };

  // Handlers
  const handleCreateExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExpense(null);
    loadExpenses();
    loadStats();
  };

  const handleDeleteExpense = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      dispatch(setLoading(true));
      const response = await dispatch(deleteExpense(expenseToDelete.id));
      
      if (response.error === false) {
        setShowDeleteModal(false);
        setExpenseToDelete(null);
        loadExpenses();
        loadStats();
      } else {
        dispatch(setError(response.message || 'Error al eliminar gasto'));
      }
    } catch (error) {
      dispatch(setError('Error al eliminar gasto'));
      console.error('Error deleting expense:', error);
    }
  };

  const handleApproveExpense = async (expense) => {
    try {
      dispatch(setLoading(true));
      const response = await dispatch(approveExpense(expense.id));
      
      if (response.error === false) {
        loadExpenses();
        loadStats();
      } else {
        dispatch(setError(response.message || 'Error al aprobar gasto'));
      }
    } catch (error) {
      dispatch(setError('Error al aprobar gasto'));
      console.error('Error approving expense:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const exportExpenses = () => {
    // Implementar exportación a Excel/PDF
    console.log('Exportar gastos...');
  };

  const canCreateExpense = user?.role;
  const canApprove = user?.role === 'Owner' || user?.role === 'Cashier';
  const canDelete = user?.role === 'Owner';

  if (loading && expenses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Gastos</h1>
            <p className="text-gray-600 mt-1">
              Administra todos los gastos y controla el presupuesto de la empresa
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
            <button
              onClick={exportExpenses}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            {canCreateExpense && (
              <button
                onClick={handleCreateExpense}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Gasto
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {showStats && (
        <ExpenseStats 
          stats={stats}
          summary={summary}
          loading={loading}
        />
      )}

      {/* Filtros */}
      {showFilters && (
        <ExpenseFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Lista de Gastos */}
      <ExpenseList
        expenses={expenses}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        onApprove={handleApproveExpense}
        onFilterChange={handleFilterChange}
        canApprove={canApprove}
        canDelete={canDelete}
        filters={filters}
      />

      {/* Modal de Formulario */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Eliminar Gasto"
          message={`¿Estás seguro de que deseas eliminar el gasto "${expenseToDelete?.description}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          confirmColor="red"
        />
      )}
    </div>
  );
};

export default ExpenseManager;
