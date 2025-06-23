import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // ✅ AGREGAR IMPORT

const ProductSearch = ({ products, onAddToCart, selectedCustomer }) => {
  // ✅ OBTENER USUARIO ACTUAL
  const { user } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      ).slice(0, 10); // Limitar a 10 resultados
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleProductSelect = (product) => {
    if (product.stock > 0) {
      console.log('ProductSearch: Seleccionando producto:', product.name, 'ID:', product.id);
      onAddToCart(product);
      setSearchTerm('');
      setFilteredProducts([]);
    } else {
      alert('Producto sin stock disponible');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const getEffectivePrice = (product) => {
    let bestPrice = product.price;
    let priceInfo = { isDistributorPrice: false, isPromotion: false };
    
    // Evaluar promoción primero
    if (product.isPromotion && product.promotionPrice && product.promotionPrice < bestPrice) {
      bestPrice = product.promotionPrice;
      priceInfo.isPromotion = true;
    }
    
    // Si hay cliente distribuidor, evaluar precio de distribuidor
    if (selectedCustomer?.role === 'Distributor' && selectedCustomer.distributor && product.distributorPrice) {
      if (product.distributorPrice < bestPrice) {
        bestPrice = product.distributorPrice;
        priceInfo = { isDistributorPrice: true, isPromotion: false };
      }
    }
    
    return {
      price: bestPrice,
      ...priceInfo,
      originalPrice: product.price
    };
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Producto
          {selectedCustomer && (
            <span className="ml-2 text-xs text-blue-600">
              (Cliente: {selectedCustomer.first_name} {selectedCustomer.last_name}
              {selectedCustomer.role === 'Distributor' ? ' - Distribuidor' : ''})
            </span>
          )}
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, SKU o etiqueta..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          autoComplete="off"
        />
      </div>

      {/* Resultados de búsqueda */}
      {filteredProducts.length > 0 && (
        <div className="absolute z-[90] w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {filteredProducts.map(product => {
            const effectivePrice = getEffectivePrice(product);
            
            return (
              <div
                key={product.id} // ✅ USAR product.id EN LUGAR DE ÍNDICE
                onClick={() => handleProductSelect(product)}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                      {/* ✅ SOLO MOSTRAR BADGES DE STOCK AL OWNER, ADMIN Y CASHIER */}
                      {(user?.role === 'Owner' || user?.role === 'Admin' || user?.role === 'Cashier') && (
                        <>
                          {product.stock <= product.minStock && product.stock > 0 && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Stock bajo
                            </span>
                          )}
                          {product.stock === 0 && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Sin stock
                            </span>
                          )}
                        </>
                      )}
                      {effectivePrice.isPromotion && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          PROMOCIÓN
                        </span>
                      )}
                      {effectivePrice.isDistributorPrice && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          PRECIO DISTRIBUIDOR
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 flex items-center space-x-4 flex-wrap">
                      <span className="text-lg font-bold text-indigo-600">
                        {formatPrice(effectivePrice.price)}
                      </span>
                      {(effectivePrice.isPromotion || effectivePrice.isDistributorPrice) && 
                       effectivePrice.originalPrice > effectivePrice.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(effectivePrice.originalPrice)}
                        </span>
                      )}
                      {/* ✅ SOLO MOSTRAR STOCK AL OWNER, ADMIN Y CASHIER */}
                      {(user?.role === 'Owner' || user?.role === 'Admin' || user?.role === 'Cashier') && (
                        <span className="text-sm text-gray-600">
                          Stock: {product.stock}
                        </span>
                      )}
                    </div>

                    {/* Mostrar información adicional de precios */}
                    {selectedCustomer?.role === 'Distributor' && product.distributorPrice && (
                      <div className="mt-1 text-sm">
                        {effectivePrice.isDistributorPrice ? (
                          <span className="text-green-600">✓ Precio distribuidor aplicado</span>
                        ) : (
                          <span className="text-gray-500">
                            Precio distribuidor: {formatPrice(product.distributorPrice)}
                            {product.distributorPrice >= effectivePrice.price && (
                              <span className="text-xs text-gray-400 ml-1">(promoción mejor)</span>
                            )}
                          </span>
                        )}
                      </div>
                    )}

                    {product.tags && product.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <span key={`tag-${product.id}-${index}`} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {product.image_url && product.image_url.length > 0 && (
                    <img
                      src={product.image_url[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg ml-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {searchTerm.trim() !== '' && filteredProducts.length === 0 && (
        <div className="absolute z-[90] w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
          No se encontraron productos que coincidan con "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
