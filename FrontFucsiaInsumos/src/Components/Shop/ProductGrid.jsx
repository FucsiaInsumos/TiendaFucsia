import React, { useState } from 'react';
import { Eye, ShoppingCart, Heart, Star } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';

const ProductGrid = ({ products, selectedCategory, selectedSubcategory }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {selectedCategory || selectedSubcategory 
            ? 'No hay productos en esta categoría' 
            : 'Selecciona una categoría'}
        </h3>
        <p className="text-gray-500">
          {selectedCategory || selectedSubcategory 
            ? 'Prueba con otra categoría o ajusta los filtros' 
            : 'Explora nuestro catálogo seleccionando una categoría del menú lateral'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Imagen del producto */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              {product.image_url && product.image_url.length > 0 ? (
                <img
                  src={product.image_url[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {product.isPromotion && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    OFERTA
                  </span>
                )}
                {product.stock <= product.minStock && product.stock > 0 && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    ÚLTIMAS UNIDADES
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    AGOTADO
                  </span>
                )}
              </div>

              {/* Botones de acción */}
              <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openProductDetail(product)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  title="Ver detalles"
                >
                  <Eye size={16} className="text-gray-600" />
                </button>
                <button
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  title="Agregar a favoritos"
                >
                  <Heart size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Indicador de múltiples imágenes */}
              {product.image_url && product.image_url.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                  +{product.image_url.length - 1}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Tags importantes */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                  {product.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{product.tags.length - 2}</span>
                  )}
                </div>
              )}

              {/* Atributos destacados */}
              {product.specificAttributes && Object.keys(product.specificAttributes).length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(product.specificAttributes).slice(0, 2).map(([key, value]) => (
                      <span key={key} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Precio */}
              <div className="mb-4">
                {product.isPromotion && product.promotionPrice ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-red-600">
                      {formatPrice(product.promotionPrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-gray-800">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Stock y botón de compra */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {product.stock > 0 ? (
                    <span className="text-green-600">En stock ({product.stock})</span>
                  ) : (
                    <span className="text-red-600">Agotado</span>
                  )}
                </div>
                
                <button
                  disabled={product.stock === 0}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    product.stock === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <ShoppingCart size={16} className="mr-1" />
                  {product.stock === 0 ? 'Agotado' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles del producto */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductDetail}
      />
    </>
  );
};

export default ProductGrid;
