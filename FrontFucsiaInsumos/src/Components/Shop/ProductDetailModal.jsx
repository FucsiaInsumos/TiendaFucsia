import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { X, ChevronLeft, ChevronRight, ShoppingCart} from 'lucide-react';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const getDisplayPrice = () => {
    if (product.isPromotion && product.promotionPrice) {
      return product.promotionPrice;
    }
    
    if (isAuthenticated && user?.role === 'Distributor' && product.distributorPrice) {
      return product.distributorPrice;
    }
    
    return product.price;
  };

  const nextImage = () => {
    if (product.image_url && product.image_url.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.image_url.length);
    }
  };

  const prevImage = () => {
    if (product.image_url && product.image_url.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.image_url.length) % product.image_url.length);
    }
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      alert('No hay suficiente stock disponible');
      return;
    }
    onAddToCart(product, quantity);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Detalles del Producto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Galería de imágenes */}
          <div>
            <div className="relative mb-4">
              {product.image_url && product.image_url.length > 0 ? (
                <>
                  <img
                    src={product.image_url[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  
                  {product.image_url.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2"
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {currentImageIndex + 1} / {product.image_url.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {product.image_url && product.image_url.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.image_url.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>

            {/* Precio */}
            <div className="mb-6">
              {product.isPromotion && product.promotionPrice ? (
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(product.promotionPrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                    PROMOCIÓN
                  </span>
                </div>
              ) : isAuthenticated && user?.role === 'Distributor' && product.distributorPrice ? (
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(product.distributorPrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    PRECIO DISTRIBUIDOR
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-800">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            {/* Stock */}
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `Disponible` : 'Agotado'}
              </span>
            </div>

            {/* Atributos específicos */}
            {product.specificAttributes && Object.keys(product.specificAttributes).length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Especificaciones</h4>
                <div className="space-y-1">
                  {Object.entries(product.specificAttributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Etiquetas</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de cantidad y botón agregar */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Agregar al carrito ({formatPrice(getDisplayPrice() * quantity)})</span>
                </button>
              </div>
            )}

            {product.stock === 0 && (
              <div className="text-center py-4">
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Producto Agotado</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
