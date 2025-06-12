import React, { useState } from 'react';
import api from '../../utils/axios';

const AdminUserForm = ({ onSuccess, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    n_document: initialData?.n_document || '',
    wdoctype: initialData?.wdoctype || 'CC',
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    password: '',
    phone: initialData?.phone || '',
    city: initialData?.city || '',
    role: initialData?.role || 'Customer',
    wlegalorganizationtype: initialData?.wlegalorganizationtype || 'person',
    scostumername: initialData?.scostumername || '',
    stributaryidentificationkey: initialData?.stributaryidentificationkey || 'O-1',
    sfiscalresponsibilities: initialData?.sfiscalresponsibilities || 'R-99-PN',
    sfiscalregime: initialData?.sfiscalregime || '48',
    isActive: initialData?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const documentTypes = [
    { value: 'RC', label: 'Registro Civil' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'TE', label: 'Tarjeta de Extranjería' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PAS', label: 'Pasaporte' }
  ];

  const roles = [
    { value: 'Customer', label: 'Cliente' },
    { value: 'Distributor', label: 'Distribuidor' },
    { value: 'Cashier', label: 'Cajero' },
    { value: 'Owner', label: 'Propietario' }
  ];

  const fiscalResponsibilities = [
    { value: 'O-13', label: 'O-13 - Gran Contribuyente' },
    { value: 'O-15', label: 'O-15 - Autorretenedor' },
    { value: 'O-23', label: 'O-23 - Agente de Retención IVA' },
    { value: 'O-47', label: 'O-47 - Régimen Simple' },
    { value: 'R-99-PN', label: 'R-99-PN - No Aplica' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = initialData ? `/users/${initialData.n_document}` : '/auth/register';
      const method = initialData ? 'put' : 'post';
      
      const submitData = { ...formData };
      if (initialData && !submitData.password) {
        delete submitData.password; // No enviar password vacío en actualizaciones
      }

      const response = await api[method](endpoint, submitData);
      
      if (response.data.error === false) {
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium mb-4">Información Personal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
              <select
                name="wdoctype"
                value={formData.wdoctype}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Documento</label>
              <input
                type="text"
                name="n_document"
                value={formData.n_document}
                onChange={handleChange}
                required
                disabled={initialData} // No permitir cambiar el documento en ediciones
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellidos</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium mb-4">Información de Contacto</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {initialData ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!initialData}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium mb-4">Configuración del Sistema</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Organización</label>
              <select
                name="wlegalorganizationtype"
                value={formData.wlegalorganizationtype}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="person">Persona Natural</option>
                <option value="company">Empresa</option>
              </select>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Usuario Activo
            </label>
          </div>
        </div>

        {/* Información Fiscal */}
        <div>
          <h3 className="text-lg font-medium mb-4">Información Fiscal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Responsabilidades Fiscales</label>
              <select
                name="sfiscalresponsibilities"
                value={formData.sfiscalresponsibilities}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {fiscalResponsibilities.map(resp => (
                  <option key={resp.value} value={resp.value}>{resp.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Régimen Fiscal</label>
              <select
                name="sfiscalregime"
                value={formData.sfiscalregime}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="48">Régimen Ordinario</option>
                <option value="49">Régimen Simple</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Nombre Comercial (Opcional)</label>
            <input
              type="text"
              name="scostumername"
              value={formData.scostumername}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (initialData ? 'Actualizar' : 'Crear Usuario')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserForm;
