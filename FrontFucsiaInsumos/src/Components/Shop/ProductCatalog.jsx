import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../../Redux/Actions/categoryActions';
import { getProducts } from '../../Redux/Actions/productActions';
import CategorySelector from './CategorySelector';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';

const ProductCatalog = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { categories } = useSelector(state => state.categories);
  const { products, loading } = useSelector(state => state.products);
  
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

    if (filters.minPrice) {
      filtered = filtered.filter(product => {
        const price = product.isPromotion && product.promotionPrice 
          ? product.promotionPrice 
          : product.price;
        return price >= parseFloat(filters.minPrice);
      });
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => {
        const price = product.isPromotion && product.promotionPrice 
          ? product.promotionPrice 
          : product.price;
        return price <= parseFloat(filters.maxPrice);
      });
    }

    // Aplicar ordenamiento - ahora filtered es una copia mutable
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          const priceA = a.isPromotion && a.promotionPrice ? a.promotionPrice : a.price;
          const priceB = b.isPromotion && b.promotionPrice ? b.promotionPrice : b.price;
          return priceA - priceB;
        case 'price-desc':
          const priceA2 = a.isPromotion && a.promotionPrice ? a.promotionPrice : a.price;
          const priceB2 = b.isPromotion && b.promotionPrice ? b.promotionPrice : b.price;
          return priceB2 - priceA2;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedSubcategory, filters]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Catálogo de Productos</h1>
          <p className="text-gray-600">Encuentra los mejores productos para tus necesidades</p>
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
