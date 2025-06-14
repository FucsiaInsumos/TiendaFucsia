import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllUsers } from '../../Redux/Actions/authActions';

const CustomerSelector = ({ selectedCustomer, onCustomerSelect }) => {
  const dispatch = useDispatch();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers([]);
    } else {
      const filtered = customers.filter(customer =>
        customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.n_document?.includes(searchTerm)
      ).slice(0, 10);
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getAllUsers({ limit: 1000 }));
      if (response.error === false) {
        setCustomers(response.data.users || []);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    onCustomerSelect(customer);
    setSearchTerm(`${customer.first_name} ${customer.last_name} - ${customer.n_document}`);
    setShowDropdown(false);
    setFilteredCustomers([]);
  };

  const clearSelection = () => {
    onCustomerSelect(null);
    setSearchTerm('');
    setShowDropdown(false);
    setFilteredCustomers([]);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'Customer': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Cliente' },
      'Distributor': { bg: 'bg-green-100', text: 'text-green-800', label: 'Distribuidor' },
      'Cashier': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Cajero' },
      'Owner': { bg: 'bg-red-100', text: 'text-red-800', label: 'Propietario' }
    };

    const config = roleConfig[role] || roleConfig['Customer'];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cliente <span className="text-red-500">*</span>
      </label>
      
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Buscar cliente por nombre, email o documento..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoComplete="off"
          />

          {selectedCustomer && (
            <button
              onClick={clearSelection}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={loadCustomers}
          disabled={loading}
          className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          title="Recargar clientes"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Información del cliente seleccionado */}
      {selectedCustomer && (
        <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-indigo-900">
                {selectedCustomer.first_name} {selectedCustomer.last_name}
              </h4>
              <p className="text-sm text-indigo-700">{selectedCustomer.email}</p>
              <p className="text-sm text-indigo-600">Doc: {selectedCustomer.n_document}</p>
            </div>
            <div className="text-right">
              {getRoleBadge(selectedCustomer.role)}
              {selectedCustomer.role === 'Distributor' && selectedCustomer.distributor && (
                <div className="mt-1 text-xs text-green-600">
                  Descuento: {selectedCustomer.distributor.discountPercentage}%
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dropdown de resultados */}
      {showDropdown && filteredCustomers.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {filteredCustomers.map(customer => (
            <div
              key={customer.n_document}
              onClick={() => handleCustomerSelect(customer)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {customer.first_name} {customer.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                  <p className="text-xs text-gray-500">Doc: {customer.n_document}</p>
                </div>
                <div className="text-right">
                  {getRoleBadge(customer.role)}
                  {customer.role === 'Distributor' && customer.distributor && (
                    <div className="mt-1 text-xs text-green-600">
                      {customer.distributor.discountPercentage}% desc.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {showDropdown && searchTerm.trim() !== '' && filteredCustomers.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No se encontraron clientes que coincidan con "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default CustomerSelector;
