import React, { useState } from 'react';
import Categories from './Categories';

const LandingSections = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 border-b">
      <div className="hidden md:flex space-x-8 items-center">
        <Categories />
        <h2 className="text-lg font-bold text-gray-800 hover:text-principalHover cursor-pointer">Ofertas</h2>
        <h2 className="text-lg font-bold text-gray-800 hover:text-principalHover cursor-pointer">Sobre Nosotros</h2>
        <h2 className="text-lg font-bold text-gray-800 hover:text-principalHover cursor-pointer">Contacto</h2>

        
      </div>
      <div className="md:hidden">
        <button
          className="text-lg font-bold text-gray-800 hover:text-principalHover cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          Menú
        </button>
        {isOpen && (
          <div className="flex flex-col space-y-4 mt-2">
            <Categories />
            <h2 className="text-lg font-bold text-gray-800 hover:text-principalHover cursor-pointer">Ofertas</h2>
            <h2 className="text-lg font-bold text-gray-800 hover:text-principalHover cursor-pointer">Sobre Nosotros</h2>
            <h2 className="text-lg font-bold text-gray-800 hover:text-principalHover cursor-pointer">Contacto</h2>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingSections;