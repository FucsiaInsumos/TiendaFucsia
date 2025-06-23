import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import { addToCart, toggleCart } from '../../Redux/Reducer/cartReducer';
import ProductDetailModal from './ProductDetailModal';

const ProductGrid = ({ products, selectedCategory, selectedSubcategory }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
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

  const handleAddToCart = (product, quantity = 1) => {
    // ✅ VALIDACIÓN DE STOCK - SOLO ALERTAR SI ES OWNER O SI EL STOCK ES REALMENTE 0
    if (product.stock < quantity) {
      if (user?.role === 'Owner') {
        alert(`No hay suficiente stock disponible. Stock actual: ${product.stock}`);
      } else {
        alert('Producto no disponible en este momento');
      }
      return;
    }

    // Obtener información completa del distribuidor
    let distributorInfo = null;
    if (user?.role === 'Distributor' && user?.distributor) {
      distributorInfo = {
        discountPercentage: user.distributor.discountPercentage || 0,
        minimumPurchase: user.distributor.minimumPurchase || 0,
        creditLimit: user.distributor.creditLimit || 0,
        paymentTerm: user.distributor.paymentTerm || 30
      };
      console.log('Distributor info being sent to cart:', distributorInfo);
    }

    console.log('Adding to cart:', {
      product: product.name,
      userRole: user?.role,
      distributorPrice: product.distributorPrice,
      regularPrice: product.price,
      distributorInfo
    });

    dispatch(addToCart({ 
      product, 
      quantity, 
      userRole: user?.role,
      distributorInfo: distributorInfo
    }));
    dispatch(toggleCart()); // Mostrar el carrito después de agregar
  };

  const getDisplayPrice = (product) => {
    if (product.isPromotion && product.promotionPrice) {
      return product.promotionPrice;
    }
    
    // Si es distribuidor autenticado y tiene precio especial
    if (isAuthenticated && user?.role === 'Distributor' && product.distributorPrice) {
      return product.distributorPrice;
    }
    
    return product.price;
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
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
          {selectedSubcategory && ` en "${selectedSubcategory.name}"`}
          {selectedCategory && !selectedSubcategory && ` en "${selectedCategory.name}"`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Imagen del producto - Ahora clickeable */}
            <div 
              className="relative h-48 bg-gray-200 overflow-hidden cursor-pointer"
              onClick={() => openProductDetail(product)}
            >
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
                {/* ✅ SOLO MOSTRAR BADGES DE STOCK AL OWNER */}
                {user?.role === 'Owner' && (
                  <>
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
                  </>
                )}
                {isAuthenticated && user?.role === 'Distributor' && product.distributorPrice && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    PRECIO ESPECIAL
                  </span>
                )}
              </div>

              {/* Indicador de múltiples imágenes */}
              {product.image_url && product.image_url.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                  +{product.image_url.length - 1}
                </div>
              )}

              {/* Overlay para indicar que es clickeable */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </div>
              </div>
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
                ) : isAuthenticated && user?.role === 'Distributor' && product.distributorPrice ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(product.distributorPrice)}
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

              {/* ✅ SECCIÓN DE BOTÓN - SIN INFORMACIÓN DE STOCK PARA NO-OWNERS */}
              <div className="w-full">
                {/* ✅ SOLO MOSTRAR STOCK AL OWNER */}
                {user?.role === 'Owner' && (
                  <div className="text-sm text-gray-600 mb-2">
                    {product.stock > 0 ? (
                      <span className="text-green-600">Stock: {product.stock}</span>
                    ) : (
                      <span className="text-red-600">Sin stock</span>
                    )}
                  </div>
                )}
                
                {/* ✅ BOTÓN DE AGREGAR AL CARRITO - MENSAJE APROPIADO SEGÚN ROL */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 flex items-center justify-center space-x-2 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 shadow-md hover:shadow-lg'
                  }`}
                >
                  {product.stock === 0 ? (
                    user?.role === 'Owner' ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                        </svg>
                        <span>Agotado</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 515.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                        </svg>
                        <span>No disponible</span>
                      </>
                    )
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                      </svg>
                      <span>Agregar</span>
                    </>
                  )}
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
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default ProductGrid;



