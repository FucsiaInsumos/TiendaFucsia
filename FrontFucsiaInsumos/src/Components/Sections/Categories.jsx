import React, { useState } from 'react';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';

const Categories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: 'Micro Pigmentación',
      subcategories: ['Cuidado de la Piel', 'Dermocosmética', 'Cosmética Natural']
    },
    {
      id: 2,
      name: 'Cejas',
      subcategories: ['Productos Saludables', 'Suplementos', 'Vitaminas']
    },
    {
      id: 3,
      name: 'Organización',
      subcategories: ['Maquillaje', 'Cuidado del Cabello', 'Perfumes']
    },
    {
      id: 4,
      name: 'Pestañas',
      subcategories: ['Maquillaje', 'Cuidado del Cabello', 'Perfumes']
    },
    {
      id: 5,
      name: 'Accesorios',
      subcategories: ['Maquillaje', 'Cuidado del Cabello', 'Perfumes']
    },
    {
      id: 6,
      name: 'Lifting',
      subcategories: ['Maquillaje', 'Cuidado del Cabello', 'Perfumes']
    },
    {
      id: 7,
      name: 'Laminado',
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
        className="flex items-center text-xl font-bold text-principal hover:text-principalHover cursor-pointer" 
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
                className="text-principalHover font-bold uppercase mb-2 flex justify-between items-center w-full p-2 hover:bg-gray-100 rounded-md"
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
                      className="text-gray-700 hover:text-principalHover cursor-pointer p-2"
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
