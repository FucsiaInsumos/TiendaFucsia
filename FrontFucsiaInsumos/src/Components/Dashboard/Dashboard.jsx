// ✅ SOLUCIÓN: Agregar delay y manejar el área del dropdown

import React, { useState, useRef } from 'react';
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

  // ✅ HANDLERS MEJORADOS CON DELAY PARA VENTAS
  const handleVentasMouseEnter = () => {
    if (ventasTimeoutRef.current) {
      clearTimeout(ventasTimeoutRef.current);
    }
    setIsVentasDropdownOpen(true);
  };

  const handleVentasMouseLeave = () => {
    ventasTimeoutRef.current = setTimeout(() => {
      setIsVentasDropdownOpen(false);
    }, 300); // ✅ 300ms de delay antes de cerrar
  };

  // ✅ HANDLERS PARA PRODUCTOS CON DELAY
  const handleProductsMouseEnter = () => {
    if (productsTimeoutRef.current) {
      clearTimeout(productsTimeoutRef.current);
    }
    setIsProductsDropdownOpen(true);
  };

  const handleProductsMouseLeave = () => {
    productsTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 300);
  };

  // ✅ HANDLERS PARA DESCUENTOS CON DELAY
  const handleDiscountsMouseEnter = () => {
    if (discountsTimeoutRef.current) {
      clearTimeout(discountsTimeoutRef.current);
    }
    setIsDiscountsDropdownOpen(true);
  };

  const handleDiscountsMouseLeave = () => {
    discountsTimeoutRef.current = setTimeout(() => {
      setIsDiscountsDropdownOpen(false);
    }, 300);
  };

  // ✅ HANDLERS PARA USUARIOS CON DELAY
  const handleUsersMouseEnter = () => {
    if (usersTimeoutRef.current) {
      clearTimeout(usersTimeoutRef.current);
    }
    setIsUsersDropdownOpen(true);
  };

  const handleUsersMouseLeave = () => {
    usersTimeoutRef.current = setTimeout(() => {
      setIsUsersDropdownOpen(false);
    }, 300);
  };

  // ✅ HANDLERS PARA PAGOS CON DELAY
  const handlePagosMouseEnter = () => {
    if (pagosTimeoutRef.current) {
      clearTimeout(pagosTimeoutRef.current);
    }
    setIsPagosDropdownOpen(true);
  };

  const handlePagosMouseLeave = () => {
    pagosTimeoutRef.current = setTimeout(() => {
      setIsPagosDropdownOpen(false);
    }, 300);
  };

  // ✅ HANDLERS PARA CAJA (CASHIER) CON DELAY
  const handleCajaMouseEnter = () => {
    if (cajaTimeoutRef.current) {
      clearTimeout(cajaTimeoutRef.current);
    }
    setIsCajaDropdownOpen(true);
  };

  const handleCajaMouseLeave = () => {
    cajaTimeoutRef.current = setTimeout(() => {
      setIsCajaDropdownOpen(false);
    }, 300);
  };

  const renderSections = () => {
    switch (user.role) {
      case 'Owner':
        return (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

              {/* ✅ CARD VENTAS Y CAJA - CON ÁREA EXPANDIDA */}

              <div
                className="relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
                onMouseEnter={handleVentasMouseEnter}
                onMouseLeave={handleVentasMouseLeave}
                style={{
                  zIndex: isVentasDropdownOpen ? 999 : 1,
                  position: 'relative'
                }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Ventas y Caja</h2>
                  <p className="text-sm text-gray-600">Gestiona ventas y punto de venta</p>
                </div>

                {/* ✅ DROPDOWN FUERA DEL CONTENIDO DE LA CARD */}
                {isVentasDropdownOpen && (
                  <div
                    className="absolute w-64 bg-white rounded-lg border border-gray-200"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '4px',
                      zIndex: 9999,
                      backgroundColor: 'white',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                    onMouseEnter={handleVentasMouseEnter}
                    onMouseLeave={handleVentasMouseLeave}
                  >
                    <div className="py-2">
                      <Link
                        to="/caja"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <span className="mr-3">🏪</span>
                        Punto de Venta (POS)
                      </Link>
                      <Link
                        to="/ordenes"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <span className="mr-3">📋</span>
                        Gestionar Órdenes
                      </Link>
                      <Link
                        to="/pagos"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
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
                className="relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
                onMouseEnter={handleProductsMouseEnter}
                onMouseLeave={handleProductsMouseLeave}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Productos</h2>
                  <p className="text-sm text-gray-600">Gestiona tu inventario</p>
                </div>

                {isProductsDropdownOpen && (
                  <div
                    className="absolute left-0 top-full w-64 bg-white shadow-2xl rounded-lg border border-gray-200 z-50"
                    style={{ marginTop: '4px' }}
                    onMouseEnter={handleProductsMouseEnter}
                    onMouseLeave={handleProductsMouseLeave}
                  >
                    <div className="py-2">
                      <Link
                        to="/productos"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                      >
                        <span className="mr-3">📦</span>
                        Gestionar Productos
                      </Link>
                      <Link
                        to="/categorias"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
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
                className="relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
                onMouseEnter={handleDiscountsMouseEnter}
                onMouseLeave={handleDiscountsMouseLeave}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Descuentos y Precios</h2>
                  <p className="text-sm text-gray-600">Gestiona descuentos y precios especiales</p>
                </div>

                {isDiscountsDropdownOpen && (
                  <div
                    className="absolute left-0 top-full w-64 bg-white shadow-2xl rounded-lg border border-gray-200 z-50"
                    style={{ marginTop: '4px' }}
                    onMouseEnter={handleDiscountsMouseEnter}
                    onMouseLeave={handleDiscountsMouseLeave}
                  >
                    <div className="py-2">
                      <Link
                        to="/reglas-descuento"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      >
                        <span className="mr-3">🎯</span>
                        Reglas de Descuento
                      </Link>
                      <Link
                        to="/calculadora-precios"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
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
                className="relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
                onMouseEnter={handleUsersMouseEnter}
                onMouseLeave={handleUsersMouseLeave}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Gestión de Usuarios</h2>
                  <p className="text-sm text-gray-600">Administra usuarios del sistema</p>
                </div>

                {isUsersDropdownOpen && (
                  <div
                    className="absolute left-0 top-full w-64 bg-white shadow-2xl rounded-lg border border-gray-200 z-50"
                    style={{ marginTop: '4px' }}
                    onMouseEnter={handleUsersMouseEnter}
                    onMouseLeave={handleUsersMouseLeave}
                  >
                    <div className="py-2">
                      <Link
                        to="/usuarios"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        <span className="mr-3">👥</span>
                        Lista de Usuarios
                      </Link>
                      <Link
                        to="/usuarios/crear"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        <span className="mr-3">➕</span>
                        Crear Usuario
                      </Link>
                      <Link
                        to="/distribuidores"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
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
                className="relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
                onMouseEnter={handlePagosMouseEnter}
                onMouseLeave={handlePagosMouseLeave}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Pagos y Facturación</h2>
                  <p className="text-sm text-gray-600">Gestiona pagos y facturación</p>
                </div>

                {isPagosDropdownOpen && (
                  <div
                    className="absolute left-0 top-full w-64 bg-white shadow-2xl rounded-lg border border-gray-200 z-50"
                    style={{ marginTop: '4px' }}
                    onMouseEnter={handlePagosMouseEnter}
                    onMouseLeave={handlePagosMouseLeave}
                  >
                    <div className="py-2">
                      <Link
                        to="/pagos"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <span className="mr-3">💰</span>
                        Gestión de Pagos
                      </Link>
                      <Link
                        to="/billing-ordenes"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <span className="mr-3">🧾</span>
                        Facturación
                      </Link>
                      <Link
                        to="/creditos"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <span className="mr-3">💳</span>
                        Cargar pagos credito
                      </Link>
                      <Link
                        to="/ordenes"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
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
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Proveedores</h2>
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
                className="relative bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
                onMouseEnter={handleCajaMouseEnter}
                onMouseLeave={handleCajaMouseLeave}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Caja</h2>
                  <p className="text-sm text-gray-600">Punto de venta y gestión de órdenes</p>
                </div>

                {isCajaDropdownOpen && (
                  <div
                    className="absolute left-0 top-full w-64 bg-white shadow-2xl rounded-lg border border-gray-200 z-50"
                    style={{ marginTop: '4px' }}
                    onMouseEnter={handleCajaMouseEnter}
                    onMouseLeave={handleCajaMouseLeave}
                  >
                    <div className="py-2">
                      <Link
                        to="/caja"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <span className="mr-3">🏪</span>
                        Punto de Venta
                      </Link>
                       <Link
                        to="/calculadora-precios"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      >
                        <span className="mr-3">🧮</span>
                        Calculadora de Precios
                      </Link>
                      <Link
                        to="/ordenes"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Fucsia</h1>
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