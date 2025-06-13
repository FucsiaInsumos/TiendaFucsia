import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../Redux/Actions/authActions';
import { toggleCart } from '../Redux/Reducer/cartReducer';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getCartItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCartToggle = () => {
    dispatch(toggleCart());
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'Owner': 'Propietario',
      'Cashier': 'Cajero',
      'Distributor': 'Distribuidor',
      'Customer': 'Cliente'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'Owner': 'text-red-200',
      'Cashier': 'text-yellow-200',
      'Distributor': 'text-green-200',
      'Customer': 'text-blue-200'
    };
    return roleColors[role] || 'text-blue-200';
  };

  return (
    <nav className="bg-principal text-white shadow-lg">
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
                Fucsia
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-12 ml-10">
              <Link 
                to="/catalogo" 
                className="hover:text-blue-200 transition duration-200 font-medium"
              >
                Catálogo
              </Link>
              
              {isAuthenticated && (
                <>
                  {(user?.role === 'Owner' || user?.role === 'Cashier') && (
                    <Link 
                      to="/dashboard" 
                      className="hover:text-blue-200 transition duration-200 font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  {user?.role === 'Owner' && (
                    <>
                      <Link 
                        to="/productos" 
                        className="hover:text-blue-200 transition duration-200 font-medium"
                      >
                        Productos
                      </Link>
                      <Link 
                        to="/usuarios" 
                        className="hover:text-blue-200 transition duration-200 font-medium"
                      >
                        Usuarios
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Carrito y usuario */}
          <div className="flex items-center space-x-4">
            {/* Carrito de compras */}
            <button
              onClick={handleCartToggle}
              className="relative p-2 hover:bg-principalHover rounded-lg transition duration-200 group"
              title="Carrito de compras"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            {/* Usuario autenticado */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-principalHover rounded-lg transition duration-200"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {user?.first_name?.charAt(0)?.toUpperCase()}{user?.last_name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className={`text-xs ${getRoleColor(user?.role)}`}>
                      {getRoleDisplayName(user?.role)}
                    </div>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown del usuario */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      {/* Información del usuario */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {getRoleDisplayName(user?.role)}
                        </div>
                      </div>

                      {/* Enlaces del menú */}
                      <div className="py-1">
                        {user?.role === 'Owner' && (
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                              </svg>
                              Dashboard
                            </div>
                          </Link>
                        )}

                        {(user?.role === 'Owner' || user?.role === 'Cashier') && (
                          <Link
                            to="/caja"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                              </svg>
                              Punto de Venta
                            </div>
                          </Link>
                        )}

                        <Link
                          to="/ordenes"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            Mis Órdenes
                          </div>
                        </Link>

                        <div className="border-t border-gray-200 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            Cerrar Sesión
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Usuario no autenticado */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white hover:text-blue-200 transition duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-sm font-medium text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden border-t border-blue-700 pt-4 pb-2">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/catalogo" 
              className="block py-2 text-sm hover:text-blue-200 transition duration-200"
            >
              Catálogo
            </Link>
            
            {isAuthenticated && (
              <>
                {(user?.role === 'Owner' || user?.role === 'Cashier') && (
                  <Link 
                    to="/dashboard" 
                    className="block py-2 text-sm hover:text-blue-200 transition duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                
                {user?.role === 'Owner' && (
                  <>
                    <Link 
                      to="/productos" 
                      className="block py-2 text-sm hover:text-blue-200 transition duration-200"
                    >
                      Productos
                    </Link>
                    <Link 
                      to="/usuarios" 
                      className="block py-2 text-sm hover:text-blue-200 transition duration-200"
                    >
                      Usuarios
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;