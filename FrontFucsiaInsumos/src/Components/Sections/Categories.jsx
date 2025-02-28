import React, { useState } from 'react';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';

const Categories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: 'Medicamentos',
      subcategories: ['Cuidado de la Piel', 'Dermocosmética', 'Cosmética Natural']
    },
    {
      id: 2,
      name: 'Salud y Bienestar',
      subcategories: ['Productos Saludables', 'Suplementos', 'Vitaminas']
    },
    {
      id: 3,
      name: 'Belleza',
      subcategories: ['Maquillaje', 'Cuidado del Cabello', 'Perfumes']
    }
  ];

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <div className="relative">
      {/* Botón para abrir el menú de categorías */}
      <button 
        className="flex items-center text-xl font-bold text-cyan-500 hover:text-cyan-700 cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="mr-2" /> Categorías
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-white shadow-lg border rounded-md p-4 z-50">
          {categories.map((category) => (
            <div key={category.id}>
              {/* Botón de categoría */}
              <button 
                className="text-cyan-500 font-bold uppercase mb-2 flex justify-between items-center w-full p-2 hover:bg-gray-100 rounded-md"
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
                {openCategory === category.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>

              {/* Subcategorías */}
              {openCategory === category.id && (
                <ul className="pl-4 border-l border-gray-300">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <li 
                      key={subIndex} 
                      className="text-gray-700 hover:text-cyan-600 cursor-pointer p-2"
                    >
                      {subcategory}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
