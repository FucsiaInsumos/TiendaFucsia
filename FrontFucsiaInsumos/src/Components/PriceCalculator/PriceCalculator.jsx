import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../Redux/Actions/productActions';
import { getAllUsers } from '../../Redux/Actions/authActions';
import { calculatePricesForCartAPI } from '../../Redux/Actions/salesActions';

const PriceCalculator = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(state => state.auth);
  const { products: reduxProducts, loading: productsLoading } = useSelector(state => state.products);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [calculationResult, setCalculationResult] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar productos usando la acción Redux
      await dispatch(getProducts());

      // Cargar usuarios usando getAllUsers
      try {
        const usersResponse = await dispatch(getAllUsers());
        if (!usersResponse.error && usersResponse.data?.users) {
          // Filtrar solo distribuidores y clientes para el cálculo
          const filteredUsers = usersResponse.data.users.filter(
            user => user.role === 'Distributor' || user.role === 'Customer'
          );
          setUsers(filteredUsers);
          console.log('Usuarios cargados:', filteredUsers);
        }
      } catch (userError) {
        console.error('Error cargando usuarios:', userError);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProductToCalculation = () => {
    setSelectedItems([...selectedItems, {
      id: Date.now(),
      productId: '',
      quantity: 1
    }]);
  };

  const updateSelectedItem = (itemId, field, value) => {
    setSelectedItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const removeSelectedItem = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculatePrices = async () => {
    if (!selectedUser || selectedItems.length === 0) {
      alert('Por favor selecciona un usuario y al menos un producto');
      return;
    }

    // Validar que todos los items tengan producto y cantidad válida
    const invalidItems = selectedItems.filter(
      item => !item.productId || !item.quantity || item.quantity <= 0
    );

    if (invalidItems.length > 0) {
      alert('Por favor completa todos los productos y cantidades válidas');
      return;
    }

    try {
      setLoading(true);
      
      // Preparar los items para la API
      const itemsForCalculation = selectedItems.map(item => ({
        productId: item.productId,
        quantity: parseInt(item.quantity)
      }));

      console.log('=== PRICE CALCULATOR DEBUG ===');
      console.log('Usuario seleccionado ID:', selectedUser);
      console.log('Usuario seleccionado data:', getSelectedUserData());
      console.log('Items para calcular:', itemsForCalculation);

      const result = await dispatch(calculatePricesForCartAPI(itemsForCalculation, selectedUser));
      
      console.log('=== RESULTADO DEL CÁLCULO ===');
      console.log(result);
      setCalculationResult(result);

    } catch (error) {
      console.error('Error calculating prices:', error);
      alert('Error al calcular precios: ' + (error.message || 'Error desconocido'));
      setCalculationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const getSelectedProduct = (productId) => {
    return reduxProducts.find(p => p.id === productId);
  };

  const getSelectedUserData = () => {
    return users.find(u => u.id === selectedUser);
  };

  // Usar products del Redux store
  const products = reduxProducts || [];

  if ((loading || productsLoading) && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Calculadora de Precios</h1>
        <p className="text-gray-600">
          Simula precios para diferentes tipos de usuarios y productos
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Productos: {products.length} | Usuarios: {users.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de configuración */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Configuración</h2>

          {/* Selector de usuario */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Usuario ({users.length} disponibles)
            </label>
            <select
              value={selectedUser}
              onChange={(e) => {
                console.log('Usuario seleccionado:', e.target.value);
                setSelectedUser(e.target.value);
                setCalculationResult(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un usuario...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} - {user.role}
                  {user.role === 'Distributor' && user.distributor && (
                    ` (${user.distributor.discountPercentage || 0}% desc, Min: ${formatPrice(user.distributor.minimumPurchase || 0)})`
                  )}
                </option>
              ))}
            </select>
            
            {selectedUser && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <strong>ID Usuario:</strong> {selectedUser}
                  <br />
                  <strong>Nombre:</strong> {getSelectedUserData()?.first_name} {getSelectedUserData()?.last_name}
                  <br />
                  <strong>Rol:</strong> {getSelectedUserData()?.role}
                  {getSelectedUserData()?.role === 'Distributor' && getSelectedUserData()?.distributor && (
                    <>
                      <br />
                      <strong>Descuento:</strong> {getSelectedUserData().distributor.discountPercentage || 0}%
                      <br />
                      <strong>Compra mínima:</strong> {formatPrice(getSelectedUserData().distributor.minimumPurchase || 0)}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Lista de productos */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Productos a calcular ({products.length} disponibles)
              </label>
              <button
                onClick={addProductToCalculation}
                disabled={products.length === 0}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                + Agregar producto
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-6 text-red-500 bg-red-50 rounded-lg">
                No hay productos disponibles. Verifica la conexión con el servidor.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <select
                      value={item.productId}
                      onChange={(e) => updateSelectedItem(item.id, 'productId', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar producto...</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - Normal: {formatPrice(product.price)}
                          {product.distributorPrice && ` | Dist: ${formatPrice(product.distributorPrice)}`}
                          {product.isPromotion && product.promotionPrice && ` | Promo: ${formatPrice(product.promotionPrice)}`}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateSelectedItem(item.id, 'quantity', e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Cant."
                    />

                    <button
                      onClick={() => removeSelectedItem(item.id)}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {selectedItems.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No hay productos agregados. Haz clic en "Agregar producto" para comenzar.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botón calcular */}
          <button
            onClick={calculatePrices}
            disabled={loading || !selectedUser || selectedItems.length === 0 || products.length === 0}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {loading ? 'Calculando...' : `Calcular Precios para ${getSelectedUserData()?.role || 'Usuario'}`}
          </button>
        </div>

        {/* Panel de resultados */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resultados</h2>

          {calculationResult ? (
            <div className="space-y-4">
              {/* Información del usuario calculado */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Usuario Calculado</h3>
                <div className="text-sm text-blue-700">
                  <div><strong>Nombre:</strong> {getSelectedUserData()?.first_name} {getSelectedUserData()?.last_name}</div>
                  <div><strong>Rol:</strong> {getSelectedUserData()?.role}</div>
                  <div><strong>Es Distribuidor:</strong> {calculationResult.isDistributor ? 'Sí' : 'No'}</div>
                  {calculationResult.isDistributor && calculationResult.distributorInfo && (
                    <>
                      <div><strong>Descuento configurado:</strong> {calculationResult.distributorInfo.discountPercentage || 0}%</div>
                      <div><strong>Compra mínima:</strong> {formatPrice(calculationResult.distributorInfo.minimumPurchase || 0)}</div>
                      <div><strong>Valor del pedido:</strong> {formatPrice(calculationResult.orderValueForDistributorCheck || 0)}</div>
                      <div className={`font-semibold ${calculationResult.appliedDistributorPrices ? 'text-green-600' : 'text-orange-600'}`}>
                        {calculationResult.appliedDistributorPrices ? 
                          '✅ Precios de distribuidor aplicados' : 
                          '⚠️ No cumple mínimo para descuento de distribuidor'
                        }
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Detalles por producto */}
              <div>
                <h3 className="font-semibold mb-2">Detalles por producto</h3>
                <div className="space-y-2">
                  {calculationResult.items?.map((item, index) => {
                    const product = getSelectedProduct(item.productId);
                    return (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium">{product?.name || item.name}</div>
                            <div className="text-sm text-gray-600">
                              <strong>Cantidad:</strong> {item.quantity}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Precio original:</strong> {formatPrice(item.originalPrice || product?.price)}
                            </div>
                            <div className="text-sm">
                              <strong>Precio aplicado: {formatPrice(item.unitPrice)}</strong>
                              {item.isPromotion && (
                                <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">PROMOCIÓN</span>
                              )}
                              {item.isDistributorPrice && (
                                <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">DISTRIBUIDOR</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{formatPrice(item.itemTotal)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Totales */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatPrice(calculationResult.subtotal)}</span>
                  </div>
                  {calculationResult.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento total:</span>
                      <span className="font-semibold">-{formatPrice(calculationResult.totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatPrice(calculationResult.total)}</span>
                  </div>
                </div>

                {calculationResult.savings > 0 && (
                  <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-sm text-center">
                    💰 <strong>Ahorro total: {formatPrice(calculationResult.savings)}</strong>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🧮</div>
              <div className="text-lg mb-2">Configura los productos y usuario</div>
              <div className="text-sm">para ver los resultados del cálculo</div>
              {products.length === 0 && (
                <div className="text-red-500 mt-4 font-semibold">
                  ⚠️ No hay productos cargados
                </div>
              )}
              {users.length === 0 && (
                <div className="text-red-500 mt-2 font-semibold">
                  ⚠️ No hay usuarios cargados
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
