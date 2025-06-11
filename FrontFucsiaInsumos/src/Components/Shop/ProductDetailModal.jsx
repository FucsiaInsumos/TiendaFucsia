import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Heart, Share2 } from 'lucide-react';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
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
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(product.promotionPrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    OFERTA
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
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Descripción</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Atributos específicos */}
            {product.specificAttributes && Object.keys(product.specificAttributes).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Especificaciones</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.specificAttributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stock y cantidad */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800">Disponibilidad:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `En stock (${product.stock})` : 'Agotado'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-800">Cantidad:</span>
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-3">
              <button
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  product.stock === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <ShoppingCart size={20} className="mr-2" />
                {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart size={20} />
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
