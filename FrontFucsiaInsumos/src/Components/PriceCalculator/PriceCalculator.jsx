import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../../Redux/Actions/productActions';
import { calculateProductPrice } from '../../Redux/Actions/discountRuleActions';

const PriceCalculator = () => {
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products);
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [userType, setUserType] = useState('customers');
  const [userId, setUserId] = useState('');
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      const validItems = items.filter(item => item.productId && item.quantity > 0);
      
      if (validItems.length === 0) {
        alert('Agregue al menos un producto válido');
        return;
      }

      const result = await dispatch(calculateProductPrice(validItems, userType, userId || null));
      setCalculation(result.data);
    } catch (error) {
      console.error('Error calculating prices:', error);
      alert('Error al calcular precios');
    } finally {
      setLoading(false);
    }
  };

  const getProductInfo = (productId) => {
    return products?.find(p => p.id === productId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver al Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Calculadora de Precios</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Configuración</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de usuario
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="customers">Cliente</option>
              <option value="distributors">Distribuidor</option>
            </select>
          </div>

          {userType === 'distributors' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Usuario (opcional)
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ID del distribuidor"
              />
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">Productos</h3>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar producto</option>
                  {products?.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.sku} (${product.price})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cant."
                />
              </div>
              
              <button
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-800 p-2"
                disabled={items.length === 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={addItem}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Agregar producto
          </button>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Calculando...' : 'Calcular Precios'}
          </button>
        </div>
      </div>

      {calculation && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resultados</h2>
          
          <div className="space-y-4">
            {calculation.items.map((item, index) => {
              const product = getProductInfo(item.productId);
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.productName}</h3>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity} | Precio base: ${item.basePrice} ({item.priceType})
                      </p>
                      {item.appliedRule && (
                        <p className="text-sm text-green-600">
                          Descuento aplicado: {item.appliedRule.name} ({item.appliedRule.value}{item.appliedRule.type === 'percentage' ? '%' : ' COP'})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${item.finalPrice}</p>
                      {item.itemDiscount > 0 && (
                        <p className="text-sm text-green-600">Ahorro: ${item.itemDiscount}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>${calculation.summary.subtotal}</span>
            </div>
            {calculation.summary.totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento total:</span>
                <span>-${calculation.summary.totalDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>${calculation.summary.total}</span>
            </div>

            {!calculation.summary.minimumPurchaseValidation.valid && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                <p>{calculation.summary.minimumPurchaseValidation.message}</p>
                <p className="text-sm mt-1">
                  Falta: ${calculation.summary.minimumPurchaseValidation.missing}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;
