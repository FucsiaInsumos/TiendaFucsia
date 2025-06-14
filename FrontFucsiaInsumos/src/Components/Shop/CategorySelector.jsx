import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Package } from 'lucide-react';

const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  selectedSubcategory, 
  onCategorySelect, 
  onSubcategorySelect 
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const mainCategories = categories?.filter(cat => !cat.parentId) || [];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Categorías</h3>
      
      <div className="space-y-2">
        {mainCategories.map(category => {
          const isExpanded = expandedCategories[category.id];
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;
          const isSelected = selectedCategory?.id === category.id;

          return (
            <div key={category.id}>
              {/* Categoría principal */}
              <div className="flex items-center">
                <button
                  onClick={() => {
                    onCategorySelect(category);
                    if (hasSubcategories) {
                      toggleCategory(category.id);
                    }
                  }}
                  className={`flex-1 flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    isSelected && !selectedSubcategory
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="flex items-center">
                    <Package size={16} className="mr-2" />
                    {category.name}
                  </span>
                  {hasSubcategories && (
                    <span className="ml-2">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  )}
                </button>
              </div>

              {/* Subcategorías */}
              {hasSubcategories && isExpanded && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.subcategories.map(subcategory => {
                    const isSubSelected = selectedSubcategory?.id === subcategory.id;
                    
                    return (
                      <button
                        key={subcategory.id}
                        onClick={() => {
                          if (!isSelected) {
                            onCategorySelect(category);
                          }
                          onSubcategorySelect(subcategory);
                        }}
                        className={`w-full text-left p-2 pl-6 rounded transition-colors text-sm ${
                          isSubSelected
                            ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-400'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        {subcategory.name}
                        {subcategory.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {subcategory.description}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
