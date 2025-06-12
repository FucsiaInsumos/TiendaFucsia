import React, { useState, useEffect } from 'react';

const DiscountRuleForm = ({ rule, products, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    discountType: 'percentage',
    discountValue: '',
    conditionType: 'quantity',
    minQuantity: '',
    minAmount: '',
    maxQuantity: '',
    maxAmount: '',
    applicableFor: 'all',
    productId: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    priority: '0',
    isActive: true,
    ...rule
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (rule) {
      setFormData({
        ...formData,
        ...rule,
        startDate: rule.startDate ? new Date(rule.startDate).toISOString().split('T')[0] : '',
        endDate: rule.endDate ? new Date(rule.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [rule]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'El valor del descuento debe ser mayor a 0';
    }
    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'El porcentaje no puede ser mayor a 100';
    }

    // Validar condiciones según el tipo
    if (formData.conditionType === 'quantity' || formData.conditionType === 'both') {
      if (!formData.minQuantity || formData.minQuantity <= 0) {
        newErrors.minQuantity = 'La cantidad mínima debe ser mayor a 0';
      }
    }
    if (formData.conditionType === 'amount' || formData.conditionType === 'both') {
      if (!formData.minAmount || formData.minAmount <= 0) {
        newErrors.minAmount = 'El monto mínimo debe ser mayor a 0';
      }
    }

    // Validar fechas
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minQuantity: formData.minQuantity ? parseInt(formData.minQuantity) : null,
        minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
        maxQuantity: formData.maxQuantity ? parseInt(formData.maxQuantity) : null,
        maxAmount: formData.maxAmount ? parseFloat(formData.maxAmount) : null,
        priority: parseInt(formData.priority),
        productId: formData.productId || null,
        categoryId: formData.categoryId || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la regla *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Descuento por volumen"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Tipo de descuento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de descuento *
          </label>
          <select
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="percentage">Porcentaje (%)</option>
            <option value="fixed_amount">Monto fijo ($)</option>
          </select>
        </div>

        {/* Valor del descuento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor del descuento *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.discountValue ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={formData.discountType === 'percentage' ? '10' : '1000'}
          />
          {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>}
        </div>

        {/* Tipo de condición */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aplicar descuento por *
          </label>
          <select
            value={formData.conditionType}
            onChange={(e) => setFormData({ ...formData, conditionType: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="quantity">Cantidad</option>
            <option value="amount">Monto</option>
            <option value="both">Cantidad y Monto</option>
          </select>
        </div>

        {/* Aplicable para */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aplicable para *
          </label>
          <select
            value={formData.applicableFor}
            onChange={(e) => setFormData({ ...formData, applicableFor: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los usuarios</option>
            <option value="customers">Solo clientes</option>
            <option value="distributors">Solo distribuidores</option>
          </select>
        </div>

        {/* Condiciones de cantidad */}
        {(formData.conditionType === 'quantity' || formData.conditionType === 'both') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad mínima *
              </label>
              <input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.minQuantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="5"
              />
              {errors.minQuantity && <p className="text-red-500 text-sm mt-1">{errors.minQuantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad máxima (opcional)
              </label>
              <input
                type="number"
                value={formData.maxQuantity}
                onChange={(e) => setFormData({ ...formData, maxQuantity: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
          </>
        )}

        {/* Condiciones de monto */}
        {(formData.conditionType === 'amount' || formData.conditionType === 'both') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto mínimo *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.minAmount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="50000"
              />
              {errors.minAmount && <p className="text-red-500 text-sm mt-1">{errors.minAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto máximo (opcional)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.maxAmount}
                onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500000"
              />
            </div>
          </>
        )}

        {/* Producto específico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Producto específico (opcional)
          </label>
          <select
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value, categoryId: '' })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los productos</option>
            {products?.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.sku}
              </option>
            ))}
          </select>
        </div>

        {/* Categoría específica */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría específica (opcional)
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, productId: '' })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={formData.productId}
          >
            <option value="">Todas las categorías</option>
            {categories?.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fechas de vigencia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de inicio (opcional)
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de fin (opcional)
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.endDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <input
            type="number"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          <p className="text-sm text-gray-500 mt-1">
            Mayor número = mayor prioridad
          </p>
        </div>

        {/* Estado activo */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Regla activa
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          {rule ? 'Actualizar' : 'Crear'} Regla
        </button>
      </div>
    </form>
  );
};

export default DiscountRuleForm;
