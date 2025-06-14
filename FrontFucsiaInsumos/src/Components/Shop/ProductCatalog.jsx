import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../../Redux/Actions/categoryActions';
import { getProducts } from '../../Redux/Actions/productActions';
import { toggleCart } from '../../Redux/Reducer/cartReducer';
import CategorySelector from './CategorySelector';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';

const ProductCatalog = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { categories } = useSelector(state => state.categories);
  const { products, loading } = useSelector(state => state.products);
  const { items: cartItems } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name' // name, price-asc, price-desc, newest
  });

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getProducts());
  }, [dispatch]);

  // Efecto para manejar parámetros de URL
  useEffect(() => {
    const categoriaId = searchParams.get('categoria');
    const subcategoriaId = searchParams.get('subcategoria');
    
    if (categories && categories.length > 0) {
      if (subcategoriaId) {
        const subcategoria = categories.find(cat => cat.id === subcategoriaId);
        if (subcategoria) {
          const categoria = categories.find(cat => cat.id === subcategoria.parentId);
          setSelectedCategory(categoria);
          setSelectedSubcategory(subcategoria);
        }
      } else if (categoriaId) {
        const categoria = categories.find(cat => cat.id === categoriaId);
        if (categoria) {
          setSelectedCategory(categoria);
          setSelectedSubcategory(null);
        }
      }
    }
  }, [searchParams, categories]);

  // Filtrar productos según categoría/subcategoría seleccionada y filtros
  useEffect(() => {
    let filtered = [...(products || [])]; // Crear una copia del array

    // Filtrar por categoría/subcategoría
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.categoryId === selectedSubcategory.id);
    } else if (selectedCategory) {
      // Si no hay subcategoría seleccionada, mostrar productos de la categoría principal
      const categoryIds = [selectedCategory.id];
      if (selectedCategory.subcategories) {
        categoryIds.push(...selectedCategory.subcategories.map(sub => sub.id));
      }
      filtered = filtered.filter(product => categoryIds.includes(product.categoryId));
    }

    // Aplicar filtros adicionales
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        Object.values(product.specificAttributes || {}).some(value => 
          value.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    // Filtrar por precio según el rol del usuario
    const getEffectivePrice = (product) => {
      if (product.isPromotion && product.promotionPrice) {
        return product.promotionPrice;
      }
      if (isAuthenticated && user?.role === 'Distributor' && product.distributorPrice) {
        return product.distributorPrice;
      }
      return product.price;
    };

    if (filters.minPrice) {
      filtered = filtered.filter(product => {
        const effectivePrice = getEffectivePrice(product);
        return effectivePrice >= parseFloat(filters.minPrice);
      });
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => {
        const effectivePrice = getEffectivePrice(product);
        return effectivePrice <= parseFloat(filters.maxPrice);
      });
    }

    // Aplicar ordenamiento - ahora filtered es una copia mutable
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return getEffectivePrice(a) - getEffectivePrice(b);
        case 'price-desc':
          return getEffectivePrice(b) - getEffectivePrice(a);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedSubcategory, filters, isAuthenticated, user]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const clearSelection = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleCartToggle = () => {
    dispatch(toggleCart());
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Catálogo de Productos</h1>
            <p className="text-gray-600">
              Encuentra los mejores productos para tus necesidades
              {isAuthenticated && user?.role === 'Distributor' && (
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  Precios especiales para distribuidores
                </span>
              )}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              📍 Retiro gratuito en nuestro local - No realizamos envíos
            </p>
          </div>

          {/* Botón del carrito */}
          <button
            onClick={handleCartToggle}
            className="relative bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition duration-200 shadow-lg transform hover:scale-105"
            title="Abrir carrito"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            </svg>
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                {getCartItemCount()}
              </span>
            )}
          </button>
        </div>

        {/* Breadcrumb */}
        {(selectedCategory || selectedSubcategory) && (
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <button 
                  onClick={clearSelection}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Todos los productos
                </button>
              </li>
              {selectedCategory && (
                <>
                  <li className="text-gray-500">/</li>
                  <li>
                    <button 
                      onClick={() => setSelectedSubcategory(null)}
                      className={`${selectedSubcategory ? 'text-blue-600 hover:text-blue-800' : 'text-gray-800 font-medium'}`}
                    >
                      {selectedCategory.name}
                    </button>
                  </li>
                </>
              )}
              {selectedSubcategory && (
                <>
                  <li className="text-gray-500">/</li>
                  <li className="text-gray-800 font-medium">{selectedSubcategory.name}</li>
                </>
              )}
            </ol>
          </nav>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                onCategorySelect={handleCategorySelect}
                onSubcategorySelect={handleSubcategorySelect}
              />
              
              <div className="mt-6 pt-6 border-t">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  productCount={filteredProducts.length}
                />
              </div>

              {/* Información del usuario logueado */}
              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2">Mi Cuenta</h4>
                  <div className="text-sm">
                    <p className="text-gray-600">
                      Conectado como: <span className="font-medium text-gray-900">{user.first_name} {user.last_name}</span>
                    </p>
                    <p className="text-gray-600">
                      Rol: <span className={`font-medium ${
                        user.role === 'Distributor' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {user.role === 'Distributor' ? 'Distribuidor' : 'Cliente'}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Cargando productos...</span>
              </div>
            ) : (
              <ProductGrid 
                products={filteredProducts}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
