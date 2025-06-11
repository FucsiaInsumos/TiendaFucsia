import React from 'react';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  const renderCategory = (category, level = 0) => {
    return (
      <div key={category.id}>
        <div 
          className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-2 ${
            level > 0 ? 'ml-8 bg-gray-50' : 'bg-white'
          }`}
        >
          <div className="flex-1">
            <div className="flex items-center">
              {level > 0 && (
                <span className="text-gray-400 mr-2">└─</span>
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                {category.name}
              </h3>
              {category.parentId && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Subcategoría
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-gray-600 mt-1">{category.description}</p>
            )}
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
              <span>ID: {category.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                category.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {category.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(category)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
              title="Editar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button
              onClick={() => onDelete(category)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
              title="Eliminar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Render subcategories */}
        {category.subcategories && category.subcategories.map(subcat => 
          renderCategory(subcat, level + 1)
        )}
      </div>
    );
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <p>No hay categorías disponibles</p>
        <p className="text-sm">Crea tu primera categoría para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map(category => renderCategory(category))}
    </div>
  );
};

export default CategoryList;
