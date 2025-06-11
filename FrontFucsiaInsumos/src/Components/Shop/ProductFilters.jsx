import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const ProductFilters = ({ filters, onFiltersChange, productCount }) => {
  const handleFilterChange = (field, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      name: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Filter size={18} className="mr-2" />
          Filtros
        </h3>
        {(filters.name || filters.minPrice || filters.maxPrice || filters.sortBy !== 'name') && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Buscador */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar productos
        </label>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            placeholder="Buscar por nombre, descripción, tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rango de precios */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rango de precios
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="Precio mín"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="Precio máx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Ordenar por */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <SlidersHorizontal size={16} className="mr-1" />
          Ordenar por
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">Nombre A-Z</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="newest">Más Recientes</option>
        </select>
      </div>

      {/* Contador de productos */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {productCount === 0 ? 'No se encontraron productos' : 
           productCount === 1 ? '1 producto encontrado' : 
           `${productCount} productos encontrados`}
        </p>
      </div>
    </div>
  );
};

export default ProductFilters;
