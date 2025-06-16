import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getStockMovements, createStockMovement, getLowStockProducts } from '../../Redux/Actions/salesActions';
import { getProducts } from '../../Redux/Actions/productActions';

const StockManagement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('movements');
  const [movements, setMovements] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddMovement, setShowAddMovement] = useState(false);
  const [newMovement, setNewMovement] = useState({
    productId: '',
    quantity: '',
    type: 'entrada',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'movements') {
        const response = await dispatch(getStockMovements());
        if (response.error === false) {
          setMovements(response.data.movements);
        }
      } else if (activeTab === 'alerts') {
        const response = await dispatch(getLowStockProducts());
        if (response.error === false) {
          setLowStockProducts(response.data.products);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await dispatch(getProducts());
      if (response.error === false) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleAddMovement = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(createStockMovement(newMovement));
      if (response.error === false) {
        setShowAddMovement(false);
        setNewMovement({
          productId: '',
          quantity: '',
          type: 'entrada',
          reason: '',
          notes: ''
        });
        loadData();
        alert('Movimiento de stock creado exitosamente');
      }
    } catch (error) {
      alert('Error al crear movimiento: ' + error.message);
    }
  };

  const getMovementTypeIcon = (type) => {
    const icons = {
      'entrada': '⬆️',
      'salida': '⬇️',
      'ajuste': '⚖️',
      'transferencia': '🔄'
    };
    return icons[type] || '📦';
  };

  const getMovementTypeBadge = (type) => {
    const config = {
      'entrada': { bg: 'bg-green-100', text: 'text-green-800' },
      'salida': { bg: 'bg-red-100', text: 'text-red-800' },
      'ajuste': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'transferencia': { bg: 'bg-purple-100', text: 'text-purple-800' }
    };

    const typeConfig = config[type] || config['entrada'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.bg} ${typeConfig.text}`}>
        {getMovementTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Gestión de Stock</h1>
              {activeTab === 'movements' && (
                <button
                  onClick={() => {
                    setShowAddMovement(true);
                    loadProducts();
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  + Nuevo Movimiento
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('movements')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'movements'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Movimientos de Stock
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'alerts'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Alertas de Stock Bajo
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'movements' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Stock Anterior
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Stock Actual
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Razón
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Usuario
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Fecha
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {movements.map((movement) => (
                          <tr key={movement.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {movement.product?.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  SKU: {movement.product?.sku}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getMovementTypeBadge(movement.type)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium ${
                                movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {movement.previousStock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {movement.currentStock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {movement.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {movement.user?.first_name} {movement.user?.last_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(movement.createdAt).toLocaleDateString('es-CO')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'alerts' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-red-800">
                              {product.name}
                            </h3>
                            <p className="text-sm text-red-600">
                              SKU: {product.sku}
                            </p>
                            <div className="mt-2 flex items-center space-x-4">
                              <span className="text-sm text-red-700">
                                Stock actual: <strong>{product.stock}</strong>
                              </span>
                              <span className="text-sm text-red-700">
                                Mínimo: <strong>{product.minStock}</strong>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {product.stock === 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Sin Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Stock Bajo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {lowStockProducts.length === 0 && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>¡Excelente! No hay productos con stock bajo</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Movement Modal */}
      {showAddMovement && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddMovement(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddMovement}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Nuevo Movimiento de Stock
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Producto
                      </label>
                      <select
                        value={newMovement.productId}
                        onChange={(e) => setNewMovement(prev => ({...prev, productId: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Seleccionar producto</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} (SKU: {product.sku}) - Stock: {product.stock}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Movimiento
                      </label>
                      <select
                        value={newMovement.type}
                        onChange={(e) => setNewMovement(prev => ({...prev, type: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="entrada">Entrada</option>
                        <option value="salida">Salida</option>
                        <option value="ajuste">Ajuste</option>
                        <option value="transferencia">Transferencia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        value={newMovement.quantity}
                        onChange={(e) => setNewMovement(prev => ({...prev, quantity: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Razón
                      </label>
                      <input
                        type="text"
                        value={newMovement.reason}
                        onChange={(e) => setNewMovement(prev => ({...prev, reason: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Razón del movimiento"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas (opcional)
                      </label>
                      <textarea
                        value={newMovement.notes}
                        onChange={(e) => setNewMovement(prev => ({...prev, notes: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="Notas adicionales"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Crear Movimiento
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMovement(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default StockManagement;
