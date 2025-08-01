import React, { useState } from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';

const ExpenseFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    { value: 'servicios', label: 'Servicios' },
    { value: 'empleados', label: 'Empleados' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'oficina', label: 'Oficina' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'otros', label: 'Otros' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' }
  ];

  const paymentMethodOptions = [
    { value: '', label: 'Todos los métodos' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'credito', label: 'Crédito' }
  ];

  const handleInputChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const quickDateFilters = [
    {
      label: 'Hoy',
      onClick: () => {
        const today = new Date().toISOString().split('T')[0];
        handleInputChange('startDate', today);
        handleInputChange('endDate', today);
      }
    },
    {
      label: 'Esta semana',
      onClick: () => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        handleInputChange('startDate', startOfWeek.toISOString().split('T')[0]);
        handleInputChange('endDate', endOfWeek.toISOString().split('T')[0]);
      }
    },
    {
      label: 'Este mes',
      onClick: () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        handleInputChange('startDate', startOfMonth.toISOString().split('T')[0]);
        handleInputChange('endDate', endOfMonth.toISOString().split('T')[0]);
      }
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros de Búsqueda
        </h3>
        <button
          onClick={handleClear}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Búsqueda por texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Descripción, proveedor..."
              value={localFilters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={localFilters.categoryType || ''}
            onChange={(e) => handleInputChange('categoryType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={localFilters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Método de pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Método de Pago
          </label>
          <select
            value={localFilters.paymentMethod || ''}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {paymentMethodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros de fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha desde
          </label>
          <input
            type="date"
            value={localFilters.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha hasta
          </label>
          <input
            type="date"
            value={localFilters.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto mínimo
          </label>
          <input
            type="number"
            placeholder="0"
            value={localFilters.minAmount || ''}
            onChange={(e) => handleInputChange('minAmount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto máximo
          </label>
          <input
            type="number"
            placeholder="999999999"
            value={localFilters.maxAmount || ''}
            onChange={(e) => handleInputChange('maxAmount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filtros rápidos de fecha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtros rápidos
        </label>
        <div className="flex flex-wrap gap-2">
          {quickDateFilters.map((filter, index) => (
            <button
              key={index}
              onClick={filter.onClick}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
