import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const [isCajaDropdownOpen, setIsCajaDropdownOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isDiscountsDropdownOpen, setIsDiscountsDropdownOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);

  const handleCajaMouseEnter = () => {
    setIsCajaDropdownOpen(true);
  };

  const handleCajaMouseLeave = () => {
    setIsCajaDropdownOpen(false);
  };
  const handleProductsMouseEnter = () => {
    setIsProductsDropdownOpen(true);
  };

  const handleProductsMouseLeave = () => {
    setIsProductsDropdownOpen(false);
  };
  const handleDiscountsMouseEnter = () => {
    setIsDiscountsDropdownOpen(true);
  };

  const handleDiscountsMouseLeave = () => {
    setIsDiscountsDropdownOpen(false);
  };

  const handleUsersMouseEnter = () => {
    setIsUsersDropdownOpen(true);
  };

  const handleUsersMouseLeave = () => {
    setIsUsersDropdownOpen(false);
  };

  const renderSections = () => {
    switch (user.role) {
      case 'Owner':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className="relative bg-white shadow-md rounded-lg p-4 hover:bg-gray-100"
              onMouseEnter={handleCajaMouseEnter}
              onMouseLeave={handleCajaMouseLeave}
            >
              <Link to="/caja">
                <h2 className="text-xl font-semibold uppercase mb-2">Caja</h2>
                <p className='text-principalHover font-semibold'>Selecciona lo que vas a realizar</p>
              </Link>
              {isCajaDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <Link to="/cobrar" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Cobrar</Link>
                  <Link to="/reservar" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Reservar</Link>
                  <Link to="/facturar" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Facturar</Link>
                </div>
              )}
            </div>
            <div
              className="relative bg-white shadow-md rounded-lg p-4 hover:bg-gray-100"
              onMouseEnter={handleProductsMouseEnter}
              onMouseLeave={handleProductsMouseLeave}
            >
              <Link to="/productos">
                <h2 className="text-xl font-semibold uppercase mb-2">Productos</h2>
                <p className='text-principalHover font-semibold'>Selecciona lo que vas a realizar</p>
              </Link>
              {isProductsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <Link to="/productos" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Gestionar Productos</Link>
                  {/* <Link to="/listar-productos" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Listar Productos</Link> */}
                  <Link to="/categorias" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Gestionar Categorías</Link>
                </div>
              )}
            </div>
            <div
              className="relative bg-white shadow-md rounded-lg p-4 hover:bg-gray-100"
              onMouseEnter={handleDiscountsMouseEnter}
              onMouseLeave={handleDiscountsMouseLeave}
            >
              <Link to="/reglas-descuento">
                <h2 className="text-xl font-semibold uppercase mb-2">Descuentos y Precios</h2>
                <p className='text-principalHover font-semibold'>Gestiona descuentos y precios especiales</p>
              </Link>
              {isDiscountsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg z-10">
                  <Link to="/reglas-descuento" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Reglas de Descuento</Link>
                  {/* <Link to="/distribuidores" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Gestionar Distribuidores</Link> */}
                  <Link to="/calculadora-precios" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Calculadora de Precios</Link>
                </div>
              )}
            </div>
            <div
              className="relative bg-white shadow-md rounded-lg p-4 hover:bg-gray-100"
              onMouseEnter={handleUsersMouseEnter}
              onMouseLeave={handleUsersMouseLeave}
            >
              <Link to="/usuarios">
                <h2 className="text-xl font-semibold uppercase mb-2">Gestión de Usuarios</h2>
                <p className='text-principalHover font-semibold'>Administra usuarios del sistema</p>
              </Link>
              {isUsersDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg z-10">
                  <Link to="/usuarios" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Lista de Usuarios</Link>
                  <Link to="/usuarios/crear" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Crear Usuario</Link>
                  <Link to="/distribuidores" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Gestionar Distribuidores</Link>
                </div>
              )}
            </div>
            <Link to="/proveedores" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100">
              <h2 className="text-xl font-semibold uppercase mb-2">Cargar Proveedores</h2>
              <p>Accede a la sección para cargar proveedores</p>
            </Link>
            <Link to="/estadisticas" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100">
              <h2 className="text-xl font-semibold uppercase mb-2">Estadísticas</h2>
              <p>Accede a la sección de estadísticas</p>
            </Link>
            <Link to="/stock" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100">
              <h2 className="text-xl font-semibold uppercase mb-2">Stock</h2>
              <p>Accede a la sección de stock</p>
            </Link>
            <Link to="/pagos" className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100">
              <h2 className="text-xl font-semibold uppercase mb-2">Pagos</h2>
              <p>Accede a la sección de pagos</p>
            </Link>
          </div>
        );
      case 'Cashier':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className="relative bg-white shadow-md rounded-lg p-4 hover:bg-gray-100"
              onMouseEnter={handleCajaMouseEnter}
              onMouseLeave={handleCajaMouseLeave}
            >
              <Link to="/caja">
                <h2 className="text-xl font-semibold uppercase mb-2">Caja</h2>
                <p>Accede a la sección de caja</p>
              </Link>
              {isCajaDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <Link to="/cobrar" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Cobrar</Link>
                  <Link to="/reservar" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Reservar</Link>
                  <Link to="/facturar" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Facturar</Link>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <div>No tienes acceso a esta sección</div>;
    }
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Administrador</h1>
        {renderSections()}
      </div>
    </div>
  );
};

export default Dashboard;