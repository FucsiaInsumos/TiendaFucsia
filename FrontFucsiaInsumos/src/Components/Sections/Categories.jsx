import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { getCategories } from '../../Redux/Actions/categoryActions';

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useSelector(state => state.categories);
  
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const handleCategoryClick = (category) => {
    // Navegar al catálogo con la categoría seleccionada
    navigate(`/catalogo?categoria=${category.id}`);
    setIsOpen(false);
  };

  const handleSubcategoryClick = (subcategory) => {
    // Navegar al catálogo con la subcategoría seleccionada
    navigate(`/catalogo?subcategoria=${subcategory.id}`);
    setIsOpen(false);
  };

  // Filtrar solo categorías principales (sin parentId)
  const mainCategories = categories?.filter(category => !category.parentId) || [];

  return (
    <div className="relative">
      {/* Botón para abrir el menú de categorías */}
      <button 
        className="flex items-center text-xl font-bold text-principal hover:text-principalHover cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="mr-2" /> Categorías
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-white shadow-lg border rounded-md p-4 z-50">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-principal"></div>
              <span className="ml-2 text-sm text-gray-600">Cargando...</span>
            </div>
          ) : mainCategories.length > 0 ? (
            mainCategories.map((category) => (
              <div key={category.id}>
                {/* Botón de categoría */}
                <button 
                  className="text-principalHover font-bold uppercase mb-2 flex justify-between items-center w-full p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => {
                    if (category.subcategories && category.subcategories.length > 0) {
                      toggleCategory(category.id);
                    } else {
                      handleCategoryClick(category);
                    }
                  }}
                >
                  {category.name}
                  {category.subcategories && category.subcategories.length > 0 ? (
                    openCategory === category.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                  ) : null}
                </button>

                {/* Subcategorías */}
                {openCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                  <ul className="pl-4 border-l border-gray-300">
                    {category.subcategories.map((subcategory) => (
                      <li 
                        key={subcategory.id} 
                        className="text-gray-700 hover:text-principalHover cursor-pointer p-2 text-sm"
                        onClick={() => handleSubcategoryClick(subcategory)}
                      >
                        {subcategory.name}
                        {subcategory.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {subcategory.description}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">No hay categorías disponibles</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
