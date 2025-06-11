import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/Actions/authActions';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  // Definir enlaces según el rol
  const getNavigationLinks = () => {
    const commonLinks = [
      { to: "/", label: "Inicio" },
      { to: "/catalogo", label: "Catálogo" },
      { to: "/tienda", label: "Tienda" }
    ];

    if (!isAuthenticated) {
      return commonLinks;
    }

    // Enlaces adicionales según el rol
    const roleSpecificLinks = [];
    
    if (user?.role === 'Owner' || user?.role === 'Cashier' || user?.role === 'Distributor') {
      roleSpecificLinks.push({ to: "/dashboard", label: "Dashboard" });
    }

    return [...commonLinks, ...roleSpecificLinks];
  };

  const navigationLinks = getNavigationLinks();

  return (
    <nav className="bg-principal shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logoBlanco.jpg" 
                alt="Fucsia Logo" 
                className="h-12 w-auto mr-3" 
              />
              <span className="text-white text-xl font-bold hidden sm:block">
                Fucsia Insumos
              </span>
            </Link>
          </div>

          {/* Enlaces de navegación - centrados */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white hover:text-gray-200 transition-colors duration-200 font-medium text-base py-2 px-3 rounded-md hover:bg-white hover:bg-opacity-10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Botones de autenticación */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Información del usuario */}
                <div className="hidden sm:flex items-center text-white text-sm">
                  <span className="mr-2">Hola,</span>
                  <span className="font-medium">{user?.first_name || 'Usuario'}</span>
                  <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                    {user?.role}
                  </span>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="text-white hover:text-gray-200 font-medium text-base py-2 px-4 rounded-md border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="text-white hover:text-gray-200 font-medium text-base py-2 px-4 rounded-md hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                >
                  Registrarse
                </Link>
                <Link 
                  to="/login" 
                  className="text-white hover:text-gray-200 font-medium text-base py-2 px-4 rounded-md border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>

          {/* Menú móvil (hamburguesa) */}
          <div className="md:hidden">
            <button className="text-white hover:text-gray-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil expandido (opcional para implementar después) */}
        <div className="md:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white border-opacity-20">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-10"
              >
                {link.label}
              </Link>
            ))}
            
            {!isAuthenticated && (
              <div className="pt-4 space-y-2">
                <Link
                  to="/register"
                  className="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-10"
                >
                  Registrarse
                </Link>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;