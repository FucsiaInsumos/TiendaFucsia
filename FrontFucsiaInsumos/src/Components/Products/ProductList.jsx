import React, { useState } from 'react';
import ImageGallery from './ImageGallery';

const ProductList = ({ products, categories, onEdit, onDelete }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState({});
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryProductName, setGalleryProductName] = useState('');

  const openGallery = (images, productName) => {
    setGalleryImages(images);
    setGalleryProductName(productName);
    setGalleryOpen(true);
  };

  const handleImageCycle = (productId, totalImages) => {
    const currentIndex = selectedImageIndex[productId] || 0;
    const nextIndex = (currentIndex + 1) % totalImages;
    setSelectedImageIndex(prev => ({
      ...prev,
      [productId]: nextIndex
    }));
  };

  const getCategoryName = (categoryId) => {
    for (let category of categories) {
      if (category.id === categoryId) return category.name;
      if (category.subcategories) {
        for (let sub of category.subcategories) {
          if (sub.id === categoryId) return `${category.name} > ${sub.name}`;
        }
      }
    }
    return 'Sin categoría';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <p>No hay productos disponibles</p>
        <p className="text-sm">Crea tu primer producto para comenzar</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Imagen del producto */}
            <div className="h-48 bg-gray-200 relative">
              {product.image_url && product.image_url.length > 0 ? (
                <>
                  <img
                    src={product.image_url[selectedImageIndex[product.id] || 0]}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      if (product.image_url.length > 1) {
                        openGallery(product.image_url, product.name);
                      } else {
                        handleImageCycle(product.id, product.image_url.length);
                      }
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  
                  {/* Indicador de múltiples imágenes */}
                  {product.image_url.length > 1 && (
                    <>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                        {(selectedImageIndex[product.id] || 0) + 1} / {product.image_url.length}
                      </div>
                      
                      {/* Puntos indicadores */}
                      <div className="absolute bottom-2 left-2 flex space-x-1">
                        {product.image_url.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageIndex(prev => ({
                                ...prev,
                                [product.id]: index
                              }));
                            }}
                            className={`w-2 h-2 rounded-full ${
                              (selectedImageIndex[product.id] || 0) === index 
                                ? 'bg-white' 
                                : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Texto indicativo */}
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {product.image_url.length} fotos
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {product.isPromotion && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    PROMOCIÓN
                  </span>
                )}
                {product.stock <= product.minStock && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    STOCK BAJO
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    SIN STOCK
                  </span>
                )}
              </div>
            </div>

            {/* Información del producto */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.sku}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{getCategoryName(product.categoryId)}</p>

              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              )}

              {/* Precios */}
              <div className="mb-3">
                {product.isPromotion && product.promotionPrice ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(product.promotionPrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gray-800">
                    {formatPrice(product.price)}
                  </span>
                )}
                <div className="text-xs text-gray-500">
                  Costo: {formatPrice(product.purchasePrice)}
                </div>
              </div>

              {/* Stock */}
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-gray-600">Stock: {product.stock}</span>
                <span className="text-gray-600">Min: {product.minStock}</span>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                  {product.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.tags.length - 3} más</span>
                  )}
                </div>
              )}

              {/* Atributos específicos - TODOS LOS ATRIBUTOS */}
              {product.specificAttributes && Object.keys(product.specificAttributes).length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Atributos:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(product.specificAttributes).map(([key, value]) => (
                      <span key={key} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        <span className="capitalize font-medium">{key}:</span> {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex justify-between items-center">
                <div className={`px-2 py-1 rounded-full text-xs ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Activo' : 'Inactivo'}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal de galería de imágenes */}
      <ImageGallery
        images={galleryImages}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        productName={galleryProductName}
      />
    </>
  );
};

export default ProductList;
