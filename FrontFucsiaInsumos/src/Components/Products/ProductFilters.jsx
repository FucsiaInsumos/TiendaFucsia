import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { filterProducts, getProducts } from '../../Redux/Actions/productActions';

const ProductFilters = ({ categories }) => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    name: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].trim() !== '') {
        activeFilters[key] = filters[key];
      }
    });

    if (Object.keys(activeFilters).length > 0) {
      dispatch(filterProducts(activeFilters));
    } else {
      dispatch(getProducts());
    }
  };

  const clearFilters = () => {
    setFilters({
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      name: ''
    });
    dispatch(getProducts());
  };

  const flattenCategories = (categories) => {
    let flattened = [];
    categories.forEach(category => {
      flattened.push({ id: category.id, name: category.name, level: 0 });
      if (category.subcategories) {
        category.subcategories.forEach(sub => {
          flattened.push({ id: sub.id, name: sub.name, level: 1, parent: category.name });
        });
      }
    });
    return flattened;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar por nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre del producto"
          />
        </div>

        {/* Filtro por categoría */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {flattenCategories(categories).map(category => (
              <option key={category.id} value={category.id}>
                {category.level > 0 ? '└─ ' : ''}{category.name}
                {category.parent ? ` (${category.parent})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por precio mínimo */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Precio mínimo
          </label>
          <input
            type="number"
            step="0.01"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        {/* Filtro por precio máximo */}
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Precio máximo
          </label>
          <input
            type="number"
            step="0.01"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Limpiar
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
