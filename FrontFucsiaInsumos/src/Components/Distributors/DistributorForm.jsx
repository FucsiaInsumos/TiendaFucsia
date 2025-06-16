import React, { useState, useEffect } from 'react';

const DistributorForm = ({ distributor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    userId: '',
    discountPercentage: '0',
    creditLimit: '0',
    paymentTerm: '30',
    minimumPurchase: '0',
    ...distributor
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (distributor) {
      setFormData({
        ...formData,
        ...distributor,
      });
    }
  }, [distributor]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) newErrors.userId = 'El ID del usuario es requerido';
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = 'El porcentaje debe estar entre 0 y 100';
    }
    if (formData.creditLimit < 0) {
      newErrors.creditLimit = 'El límite de crédito no puede ser negativo';
    }
    if (formData.paymentTerm <= 0) {
      newErrors.paymentTerm = 'El plazo de pago debe ser mayor a 0';
    }
    if (formData.minimumPurchase < 0) {
      newErrors.minimumPurchase = 'El mínimo de compra no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        discountPercentage: parseFloat(formData.discountPercentage),
        creditLimit: parseFloat(formData.creditLimit),
        paymentTerm: parseInt(formData.paymentTerm),
        minimumPurchase: parseFloat(formData.minimumPurchase),
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ID del Usuario */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Documento (ID Usuario) *
          </label>
          <input
            type="text"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.userId ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Número de documento del usuario"
            disabled={distributor} // No permitir cambiar en edición
          />
          {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
          <p className="text-sm text-gray-500 mt-1">
            Debe corresponder al número de documento de un usuario con rol "Distributor"
          </p>
        </div>

        {/* Porcentaje de Descuento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Porcentaje de Descuento (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.discountPercentage}
            onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.discountPercentage ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.discountPercentage && <p className="text-red-500 text-sm mt-1">{errors.discountPercentage}</p>}
        </div>

        {/* Límite de Crédito */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Límite de Crédito (COP)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.creditLimit ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.creditLimit && <p className="text-red-500 text-sm mt-1">{errors.creditLimit}</p>}
        </div>

        {/* Plazo de Pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plazo de Pago (días)
          </label>
          <input
            type="number"
            min="1"
            value={formData.paymentTerm}
            onChange={(e) => setFormData({ ...formData, paymentTerm: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.paymentTerm ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="30"
          />
          {errors.paymentTerm && <p className="text-red-500 text-sm mt-1">{errors.paymentTerm}</p>}
        </div>

        {/* Mínimo de Compra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mínimo de Compra (COP)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.minimumPurchase}
            onChange={(e) => setFormData({ ...formData, minimumPurchase: e.target.value })}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.minimumPurchase ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.minimumPurchase && <p className="text-red-500 text-sm mt-1">{errors.minimumPurchase}</p>}
          <p className="text-sm text-gray-500 mt-1">
            Monto mínimo requerido para acceder a precios de distribuidor
          </p>
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
          {distributor ? 'Actualizar' : 'Crear'} Distribuidor
        </button>
      </div>
    </form>
  );
};

export default DistributorForm;
