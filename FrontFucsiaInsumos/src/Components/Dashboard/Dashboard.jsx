// ✅ SOLUCIÓN: Agregar delay y manejar el área del dropdown

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import DashboardStats from './DashboardStats'; // ✅ IMPORTAR COMPONENTE DE ESTADÍSTICAS

const Dashboard = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ✅ Estado para controlar la vista actual
  const [currentView, setCurrentView] = useState('dashboard');

  // ✅ Estados para dropdowns
  const [isVentasDropdownOpen, setIsVentasDropdownOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isDiscountsDropdownOpen, setIsDiscountsDropdownOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isPagosDropdownOpen, setIsPagosDropdownOpen] = useState(false);
  const [isCajaDropdownOpen, setIsCajaDropdownOpen] = useState(false);

  // ✅ Refs para timeouts
  const ventasTimeoutRef = useRef(null);
  const productsTimeoutRef = useRef(null);
  const discountsTimeoutRef = useRef(null);
  const usersTimeoutRef = useRef(null);
  const pagosTimeoutRef = useRef(null);
  const cajaTimeoutRef = useRef(null);

  // ✅ EFECTO PARA CERRAR DROPDOWNS AL HACER CLIC FUERA
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedElement = event.target;
      const isCardClick = clickedElement.closest('.dropdown-card');
      const isDropdownClick = clickedElement.closest('.dropdown-menu');
      
      // Cerrar dropdowns si se hace clic fuera de tarjetas y menús
      if (!isCardClick && !isDropdownClick) {
        setIsVentasDropdownOpen(false);
        setIsProductsDropdownOpen(false);
        setIsDiscountsDropdownOpen(false);
        setIsUsersDropdownOpen(false);
        setIsPagosDropdownOpen(false);
        setIsCajaDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // ✅ FUNCIÓN PARA DETERMINAR SI EL DROPDOWN DEBE ABRIRSE HACIA ARRIBA
  const shouldOpenUpward = (cardIndex, cardsPerRow = 4) => {
    // Siempre abrir hacia abajo para todas las tarjetas
    // Esto proporciona una experiencia consistente donde todos los dropdowns
    // se despliegan hacia abajo sin importar su posición en el grid
    return false;
  };

  // ✅ FUNCIÓN SIMPLE PARA DETERMINAR SI ES DISPOSITIVO MÓVIL
  const isMobile = () => window.innerWidth < 768;

  // ✅ HANDLERS MEJORADOS - SEPARANDO LÓGICA DESKTOP/MÓVIL

  // HANDLERS PARA VENTAS
  const handleVentasClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) {
      setIsVentasDropdownOpen(!isVentasDropdownOpen);
      // Cerrar otros dropdowns
      setIsProductsDropdownOpen(false);
      setIsDiscountsDropdownOpen(false);
      setIsUsersDropdownOpen(false);
      setIsPagosDropdownOpen(false);
      setIsCajaDropdownOpen(false);
    }
  };

  const handleVentasMouseEnter = () => {
    if (!isMobile()) {
      if (ventasTimeoutRef.current) clearTimeout(ventasTimeoutRef.current);
      setIsVentasDropdownOpen(true);
    }
  };

  const handleVentasMouseLeave = () => {
    if (!isMobile()) {
      ventasTimeoutRef.current = setTimeout(() => {
        setIsVentasDropdownOpen(false);
      }, 300);
    }
  };

  // HANDLERS PARA PRODUCTOS
  const handleProductsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) {
      setIsProductsDropdownOpen(!isProductsDropdownOpen);
      // Cerrar otros dropdowns
      setIsVentasDropdownOpen(false);
      setIsDiscountsDropdownOpen(false);
      setIsUsersDropdownOpen(false);
      setIsPagosDropdownOpen(false);
      setIsCajaDropdownOpen(false);
    }
  };

  const handleProductsMouseEnter = () => {
    if (!isMobile()) {
      if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current);
      setIsProductsDropdownOpen(true);
    }
  };

  const handleProductsMouseLeave = () => {
    if (!isMobile()) {
      productsTimeoutRef.current = setTimeout(() => {
        setIsProductsDropdownOpen(false);
      }, 300);
    }
  };

  // HANDLERS PARA DESCUENTOS
  const handleDiscountsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) {
      setIsDiscountsDropdownOpen(!isDiscountsDropdownOpen);
      // Cerrar otros dropdowns
      setIsVentasDropdownOpen(false);
      setIsProductsDropdownOpen(false);
      setIsUsersDropdownOpen(false);
      setIsPagosDropdownOpen(false);
      setIsCajaDropdownOpen(false);
    }
  };

  const handleDiscountsMouseEnter = () => {
    if (!isMobile()) {
      if (discountsTimeoutRef.current) clearTimeout(discountsTimeoutRef.current);
      setIsDiscountsDropdownOpen(true);
    }
  };

  const handleDiscountsMouseLeave = () => {
    if (!isMobile()) {
      discountsTimeoutRef.current = setTimeout(() => {
        setIsDiscountsDropdownOpen(false);
      }, 300);
    }
  };

  // HANDLERS PARA USUARIOS
  const handleUsersClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) {
      setIsUsersDropdownOpen(!isUsersDropdownOpen);
      // Cerrar otros dropdowns
      setIsVentasDropdownOpen(false);
      setIsProductsDropdownOpen(false);
      setIsDiscountsDropdownOpen(false);
      setIsPagosDropdownOpen(false);
      setIsCajaDropdownOpen(false);
    }
  };

  const handleUsersMouseEnter = () => {
    if (!isMobile()) {
      if (usersTimeoutRef.current) clearTimeout(usersTimeoutRef.current);
      setIsUsersDropdownOpen(true);
    }
  };

  const handleUsersMouseLeave = () => {
    if (!isMobile()) {
      usersTimeoutRef.current = setTimeout(() => {
        setIsUsersDropdownOpen(false);
      }, 300);
    }
  };

  // HANDLERS PARA PAGOS
  const handlePagosClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) {
      setIsPagosDropdownOpen(!isPagosDropdownOpen);
      // Cerrar otros dropdowns
      setIsVentasDropdownOpen(false);
      setIsProductsDropdownOpen(false);
      setIsDiscountsDropdownOpen(false);
      setIsUsersDropdownOpen(false);
      setIsCajaDropdownOpen(false);
    }
  };

  const handlePagosMouseEnter = () => {
    if (!isMobile()) {
      if (pagosTimeoutRef.current) clearTimeout(pagosTimeoutRef.current);
      setIsPagosDropdownOpen(true);
    }
  };

  const handlePagosMouseLeave = () => {
    if (!isMobile()) {
      pagosTimeoutRef.current = setTimeout(() => {
        setIsPagosDropdownOpen(false);
      }, 300);
    }
  };

  // HANDLERS PARA CAJA
  const handleCajaClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) {
      setIsCajaDropdownOpen(!isCajaDropdownOpen);
      // Cerrar otros dropdowns
      setIsVentasDropdownOpen(false);
      setIsProductsDropdownOpen(false);
      setIsDiscountsDropdownOpen(false);
      setIsUsersDropdownOpen(false);
      setIsPagosDropdownOpen(false);
    }
  };

  const handleCajaMouseEnter = () => {
    if (!isMobile()) {
      if (cajaTimeoutRef.current) clearTimeout(cajaTimeoutRef.current);
      setIsCajaDropdownOpen(true);
    }
  };

  const handleCajaMouseLeave = () => {
    if (!isMobile()) {
      cajaTimeoutRef.current = setTimeout(() => {
        setIsCajaDropdownOpen(false);
      }, 300);
    }
  };

  const renderSections = () => {
    switch (user.role) {
      case 'Owner':
        return (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

              {/* ✅ CARD VENTAS Y CAJA - CON ÁREA EXPANDIDA */}

              <div
                className="dropdown-card relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer"
                onMouseEnter={handleVentasMouseEnter}
                onMouseLeave={handleVentasMouseLeave}
                onClick={handleVentasClick}
                style={{
                  zIndex: isVentasDropdownOpen ? 1000 : 1,
                  position: 'relative'
                }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Ventas y Caja</h2>
                      <p className="text-sm text-gray-600">Gestiona ventas y punto de venta</p>
                    </div>
                    <div className="md:hidden">
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isVentasDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {isVentasDropdownOpen && (
                  <div
                    className={`dropdown-menu absolute w-64 bg-white rounded-lg border border-gray-200 shadow-2xl z-50 ${
                      shouldOpenUpward(0) ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                    style={{
                      left: '0',
                      right: window.innerWidth < 768 ? '0' : 'auto',
                      width: window.innerWidth < 768 ? '100%' : '16rem'
                    }}
                    onMouseEnter={handleVentasMouseEnter}
                    onMouseLeave={handleVentasMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-2">
                      <Link
                        to="/caja"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsVentasDropdownOpen(false)}
                      >
                        <span className="mr-3">🏪</span>
                        Punto de Venta (POS)
                      </Link>
                      <Link
                        to="/ordenes"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsVentasDropdownOpen(false)}
                      >
                        <span className="mr-3">📋</span>
                        Gestionar Órdenes
                      </Link>
                      <Link
                        to="/pagos"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsVentasDropdownOpen(false)}
                      >
                        <span className="mr-3">💳</span>
                        Gestionar Pagos
                      </Link>

                    </div>
                  </div>
                )}
              </div>

              {/* ✅ CARD PRODUCTOS - CON ÁREA EXPANDIDA */}
              <div
                className="dropdown-card relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer"
                onMouseEnter={handleProductsMouseEnter}
                onMouseLeave={handleProductsMouseLeave}
                onClick={handleProductsClick}
                style={{
                  zIndex: isProductsDropdownOpen ? 1000 : 1,
                  position: 'relative'
                }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Productos</h2>
                      <p className="text-sm text-gray-600">Gestiona tu inventario</p>
                    </div>
                    <div className="md:hidden">
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {isProductsDropdownOpen && (
                  <div
                    className={`dropdown-menu absolute w-64 bg-white rounded-lg border border-gray-200 shadow-2xl z-50 ${
                      shouldOpenUpward(1) ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                    style={{
                      left: '0',
                      right: window.innerWidth < 768 ? '0' : 'auto',
                      width: window.innerWidth < 768 ? '100%' : '16rem'
                    }}
                    onMouseEnter={handleProductsMouseEnter}
                    onMouseLeave={handleProductsMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-2">
                      <Link
                        to="/productos"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                        onClick={() => setIsProductsDropdownOpen(false)}
                      >
                        <span className="mr-3">📦</span>
                        Gestionar Productos
                      </Link>
                      <Link
                        to="/categorias"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                        onClick={() => setIsProductsDropdownOpen(false)}
                      >
                        <span className="mr-3">🏷️</span>
                        Gestionar Categorías
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ CARD DESCUENTOS - CON ÁREA EXPANDIDA */}
              <div
                className="dropdown-card relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer"
                onMouseEnter={handleDiscountsMouseEnter}
                onMouseLeave={handleDiscountsMouseLeave}
                onClick={handleDiscountsClick}
                style={{
                  zIndex: isDiscountsDropdownOpen ? 1000 : 1,
                  position: 'relative'
                }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Descuentos y Precios</h2>
                      <p className="text-sm text-gray-600">Gestiona descuentos y precios especiales</p>
                    </div>
                    <div className="md:hidden">
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDiscountsDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {isDiscountsDropdownOpen && (
                  <div
                    className={`dropdown-menu absolute w-64 bg-white rounded-lg border border-gray-200 shadow-2xl z-50 ${
                      shouldOpenUpward(2) ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                    style={{
                      left: '0',
                      right: window.innerWidth < 768 ? '0' : 'auto',
                      width: window.innerWidth < 768 ? '100%' : '16rem'
                    }}
                    onMouseEnter={handleDiscountsMouseEnter}
                    onMouseLeave={handleDiscountsMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-2">
                      <Link
                        to="/reglas-descuento"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={() => setIsDiscountsDropdownOpen(false)}
                      >
                        <span className="mr-3">🎯</span>
                        Reglas de Descuento
                      </Link>
                      <Link
                        to="/calculadora-precios"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={() => setIsDiscountsDropdownOpen(false)}
                      >
                        <span className="mr-3">🧮</span>
                        Calculadora de Precios
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ CARD USUARIOS - CON ÁREA EXPANDIDA */}
              <div
                className="dropdown-card relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer"
                onMouseEnter={handleUsersMouseEnter}
                onMouseLeave={handleUsersMouseLeave}
                onClick={handleUsersClick}
                style={{
                  zIndex: isUsersDropdownOpen ? 1000 : 1,
                  position: 'relative'
                }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Gestión de Usuarios</h2>
                      <p className="text-sm text-gray-600">Administra usuarios del sistema</p>
                    </div>
                    <div className="md:hidden">
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isUsersDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {isUsersDropdownOpen && (
                  <div
                    className={`dropdown-menu absolute w-64 bg-white rounded-lg border border-gray-200 shadow-2xl z-50 ${
                      shouldOpenUpward(3) ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                    style={{
                      left: '0',
                      right: window.innerWidth < 768 ? '0' : 'auto',
                      width: window.innerWidth < 768 ? '100%' : '16rem'
                    }}
                    onMouseEnter={handleUsersMouseEnter}
                    onMouseLeave={handleUsersMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-2">
                      <Link
                        to="/usuarios"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                        onClick={() => setIsUsersDropdownOpen(false)}
                      >
                        <span className="mr-3">👥</span>
                        Lista de Usuarios
                      </Link>
                      <Link
                        to="/usuarios/crear"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                        onClick={() => setIsUsersDropdownOpen(false)}
                      >
                        <span className="mr-3">➕</span>
                        Crear Usuario
                      </Link>
                      <Link
                        to="/distribuidores"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                        onClick={() => setIsUsersDropdownOpen(false)}
                      >
                        <span className="mr-3">🚚</span>
                        Gestionar Distribuidores
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ CARD PAGOS - CON ÁREA EXPANDIDA */}
              <div
                className="dropdown-card relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer"
                onMouseEnter={handlePagosMouseEnter}
                onMouseLeave={handlePagosMouseLeave}
                onClick={handlePagosClick}
                style={{
                  zIndex: isPagosDropdownOpen ? 1000 : 1,
                  position: 'relative'
                }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Pagos y Facturación</h2>
                      <p className="text-sm text-gray-600">Gestiona pagos y facturación</p>
                    </div>
                    <div className="md:hidden">
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isPagosDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {isPagosDropdownOpen && (
                  <div
                    className={`dropdown-menu absolute w-64 bg-white rounded-lg border border-gray-200 shadow-2xl z-50 ${
                      shouldOpenUpward(4) ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                    style={{
                      left: '0',
                      right: window.innerWidth < 768 ? '0' : 'auto',
                      width: window.innerWidth < 768 ? '100%' : '16rem'
                    }}
                    onMouseEnter={handlePagosMouseEnter}
                    onMouseLeave={handlePagosMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-2">
                      <Link
                        to="/pagos"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        onClick={() => setIsPagosDropdownOpen(false)}
                      >
                        <span className="mr-3">💰</span>
                        Gestión de Pagos
                      </Link>
                      <Link
                        to="/billing-ordenes"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        onClick={() => setIsPagosDropdownOpen(false)}
                      >
                        <span className="mr-3">🧾</span>
                        Facturación
                      </Link>
                      <Link
                        to="/creditos"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsPagosDropdownOpen(false)}
                      >
                        <span className="mr-3">💳</span>
                        Cargar pagos credito
                      </Link>
                      <Link
                        to="/ordenes"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        onClick={() => setIsPagosDropdownOpen(false)}
                      >
                        <span className="mr-3">🔍</span>
                        Consultar Estados Wompi
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ CARDS SIMPLES SIN DROPDOWN */}
              <Link
                to="/compras"
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Proveedores y Gastos</h2>
                <p className="text-sm text-gray-600">Gestiona proveedores</p>
              </Link>

              {/* ✅ NUEVA TARJETA DE GASTOS */}
              <Link
                to="/gastos"
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Gastos</h2>
                <p className="text-sm text-gray-600">Gestiona gastos empresariales</p>
              </Link>

              {/* ✅ ESTADÍSTICAS - NUEVA FUNCIONALIDAD */}
              <div
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => setCurrentView('estadisticas')}
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Estadísticas</h2>
                <p className="text-sm text-gray-600">Reportes y análisis detallados</p>
              </div>

              <Link
                to="/stock"
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Stock</h2>
                <p className="text-sm text-gray-600">Control de inventario</p>
              </Link>
            </div>
          </div>
        );

      case 'Cashier':
        return (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* ✅ CARD CAJA PARA CASHIER - CON DELAY */}
              <div
                className="dropdown-card relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer"
                onMouseEnter={handleCajaMouseEnter}
                onMouseLeave={handleCajaMouseLeave}
                onClick={handleCajaClick}
                style={{
                  zIndex: isCajaDropdownOpen ? 1000 : 1,
                  position: 'relative'
                }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Caja</h2>
                      <p className="text-sm text-gray-600">Punto de venta y gestión de órdenes</p>
                    </div>
                    <div className="md:hidden">
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCajaDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {isCajaDropdownOpen && (
                  <div
                    className={`dropdown-menu absolute w-64 bg-white rounded-lg border border-gray-200 shadow-2xl z-50 ${
                      shouldOpenUpward(0, 3) ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                    style={{
                      left: '0',
                      right: window.innerWidth < 768 ? '0' : 'auto',
                      width: window.innerWidth < 768 ? '100%' : '16rem'
                    }}
                    onMouseEnter={handleCajaMouseEnter}
                    onMouseLeave={handleCajaMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-2">
                      <Link
                        to="/caja"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsCajaDropdownOpen(false)}
                      >
                        <span className="mr-3">🏪</span>
                        Punto de Venta
                      </Link>
                       <Link
                        to="/calculadora-precios"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        onClick={() => setIsCajaDropdownOpen(false)}
                      >
                        <span className="mr-3">🧮</span>
                        Calculadora de Precios
                      </Link>
                      <Link
                        to="/ordenes"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsCajaDropdownOpen(false)}
                      >
                        <span className="mr-3">📋</span>
                        Ver Órdenes
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No tienes acceso a esta sección</div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ HEADER CON NAVEGACIÓN */}
      {currentView !== 'dashboard' && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver al Dashboard
                </button>
                <div className="text-gray-300">|</div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentView === 'estadisticas' ? 'Estadísticas y Análisis' : 'Dashboard'}
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                {user.email} • {user.role === 'Owner' ? 'Propietario' : 'Cajero'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ CONTENIDO PRINCIPAL */}
      {currentView === 'estadisticas' ? (
        <DashboardStats />
      ) : (
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
             
              <p className="text-xl text-gray-600">
                Bienvenido, <span className="font-semibold text-blue-600">{user.email}</span>
              </p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {user.role === 'Owner' ? '👑 Propietario' : '💼 Cajero'}
              </div>
            </div>

            {renderSections()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;