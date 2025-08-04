import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDashboardStats,
  getSalesChart,
  getWeeklySales,
  getMonthlySales,
  getRevenueStats,
  getProductStats,
  getTopCustomers
} from '../../Redux/Actions/dashboardActions';
import { getExpenseStats } from '../../Redux/Actions/expenseActions';

import StatCard from './StatCard';
import SalesChart from './SalesChart';
import TopProductsCard from './TopProductsCard';
import TopCustomersCard from './TopCustomersCard';

const DashboardStats = () => {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    stats,
    salesChart,
    weeklySales,
    monthlySales,
    revenueStats,
    productStats,
    topCustomers
  } = useSelector(state => state.dashboard);

  // Estado para estadísticas de gastos
  const [expenseStats, setExpenseStats] = useState({
    summary: { totalExpenses: 0, totalCount: 0 },
    currentMonth: { total: 0, count: 0 },
    monthlyComparison: { currentMonth: 0, previousMonth: 0, difference: 0 },
    byCategory: [],
    expensesByPaymentMethod: [],
    expensesByStatus: [],
    upcomingDueExpenses: []
  });
  const [expenseLoading, setExpenseLoading] = useState(false);

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedChartType, setSelectedChartType] = useState('line');

  useEffect(() => {
    // Cargar datos iniciales
    dispatch(getDashboardStats());
    dispatch(getRevenueStats('month'));
    dispatch(getProductStats('month'));
    dispatch(getTopCustomers('month'));
    dispatch(getSalesChart('month', selectedYear));
    
    // Cargar estadísticas de gastos
    loadExpenseStats();
  }, [dispatch, selectedYear]);

  useEffect(() => {
    // Actualizar gráficos cuando cambie el período
    if (selectedPeriod === 'week') {
      dispatch(getWeeklySales(selectedYear));
    } else if (selectedPeriod === 'month') {
      dispatch(getMonthlySales(selectedYear));
    } else {
      dispatch(getSalesChart(selectedPeriod, selectedYear));
    }
    
    // Recargar estadísticas de gastos cuando cambie el período
    loadExpenseStats();
  }, [dispatch, selectedPeriod, selectedYear]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const loadExpenseStats = async () => {
    try {
      setExpenseLoading(true);
      console.log('🔍 Cargando estadísticas de gastos para período:', selectedPeriod);
      const response = await dispatch(getExpenseStats(selectedPeriod));
      console.log('📊 Respuesta de estadísticas de gastos:', response);
      
      if (response && response.data) {
        console.log('✅ Datos de gastos recibidos:', response.data);
        setExpenseStats(response.data);
      } else {
        console.log('⚠️ No se recibieron datos de gastos o estructura incorrecta');
        console.log('Respuesta completa:', response);
      }
    } catch (error) {
      console.error('❌ Error loading expense stats:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setExpenseLoading(false);
    }
  };

  const getChartData = () => {
    if (selectedPeriod === 'week') {
      return weeklySales.weeklyData || [];
    } else if (selectedPeriod === 'month') {
      return monthlySales.monthlyData || [];
    } else {
      return salesChart.salesData || [];
    }
  };

  const getChartTitle = () => {
    if (selectedPeriod === 'week') {
      return 'Ventas Semanales';
    } else if (selectedPeriod === 'month') {
      return 'Ventas Mensuales';
    } else {
      return 'Ventas Diarias';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar estadísticas</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estadísticas del Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resumen de rendimiento y métricas de negocio
          </p>
        </div>
        
        {/* Controles */}
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-lg border border-gray-300 p-1">
            {['day', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {period === 'day' ? 'Diario' :
                 period === 'week' ? 'Semanal' :
                 period === 'month' ? 'Mensual' : 'Anual'}
              </button>
            ))}
          </div>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas del Día"
          value={formatCurrency(stats.sales?.daily?.total || 0)}
          subValue={`${stats.sales?.daily?.orders || 0} órdenes`}
          icon="💰"
          color="green"
        />
        
        <StatCard
          title="Ventas del Mes"
          value={formatCurrency(stats.sales?.monthly?.total || 0)}
          subValue={`${stats.sales?.monthly?.orders || 0} órdenes`}
          icon="📈"
          color="blue"
        />
        
        <StatCard
          title="Gastos del Período"
          value={expenseLoading ? "Cargando..." : formatCurrency(expenseStats.summary?.totalExpenses || 0)}
          subValue={expenseLoading ? "..." : `${expenseStats.summary?.totalCount || 0} gastos`}
          icon="💸"
          color="red"
        />
        
        <StatCard
          title="Gastos del Mes"
          value={expenseLoading ? "Cargando..." : formatCurrency(expenseStats.currentMonth?.total || 0)}
          subValue={expenseLoading ? "..." : `${expenseStats.currentMonth?.count || 0} gastos`}
          icon="📉"
          color="orange"
        />
        
        <StatCard
          title="Ganancia"
          value={formatCurrency(revenueStats.current?.profit || 0)}
          subValue={`Margen: ${revenueStats.current?.profitMargin?.toFixed(1) || 0}%`}
          icon="💵"
          color="purple"
          trend={revenueStats.growth?.profit}
        />
        
        <StatCard
          title="Ganancia Neta"
          value={formatCurrency((revenueStats.current?.profit || 0) - (expenseStats.currentMonth?.total || 0))}
          subValue="Ganancia - Gastos"
          icon="💎"
          color="emerald"
        />
        
        <StatCard
          title="Órdenes Pendientes"
          value={stats.orders?.pending || 0}
          subValue="Requieren atención"
          icon="📋"
          color="yellow"
        />
        
        <StatCard
          title="Stock Bajo"
          value={stats.inventory?.lowStockProducts || 0}
          subValue="Productos críticos"
          icon="📦"
          color="red"
        />
        
        <StatCard
          title="Clientes Nuevos"
          value={stats.customers?.newThisMonth || 0}
          subValue="Este mes"
          icon="👥"
          color="indigo"
        />
        
        <StatCard
          title="Pagos Pendientes"
          value={stats.payments?.pending?.count || 0}
          subValue={formatCurrency(stats.payments?.pending?.amount || 0)}
          icon="💳"
          color="yellow"
        />
        
        <StatCard
          title="Ingresos"
          value={formatCurrency(revenueStats.current?.revenue || 0)}
          subValue="Total del período"
          icon="💸"
          color="green"
          trend={revenueStats.growth?.revenue}
        />
        
        <StatCard
          title="Ratio Gastos/Ingresos"
          value={`${revenueStats.current?.revenue > 0 ? 
            ((expenseStats.currentMonth?.total || 0) / revenueStats.current.revenue * 100).toFixed(1) : 0}%`}
          subValue="Control de gastos"
          icon="⚖️"
          color="slate"
        />
        
        <StatCard
          title="Variación Mensual"
          value={formatCurrency(expenseStats.monthlyComparison?.difference || 0)}
          subValue="vs mes anterior"
          icon="📊"
          color={expenseStats.monthlyComparison?.difference > 0 ? "red" : "green"}
        />
        
        <StatCard
          title="Gastos Pendientes"
          value={expenseStats.upcomingDueExpenses?.length || 0}
          subValue="Por vencer (7 días)"
          icon="⏰"
          color="yellow"
        />
      </div>

      {/* Gráfico de ventas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{getChartTitle()}</h2>
          <div className="mt-3 sm:mt-0 flex gap-2">
            <button
              onClick={() => setSelectedChartType('line')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedChartType === 'line'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Línea
            </button>
            <button
              onClick={() => setSelectedChartType('bar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedChartType === 'bar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Barras
            </button>
          </div>
        </div>
        
        <SalesChart
          data={getChartData()}
          type={selectedChartType}
          title=""
          period={selectedPeriod}
        />
      </div>

      {/* Productos y clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsCard
          products={productStats.topSelling || []}
          title="Productos Más Vendidos"
          type="selling"
        />
        
        <TopCustomersCard
          customers={topCustomers.topByAmount || []}
          title="Mejores Clientes (Por Monto)"
          type="amount"
        />
        
        <TopProductsCard
          products={productStats.bestMargin || []}
          title="Productos con Mejor Margen"
          type="margin"
        />
        
        <TopCustomersCard
          customers={topCustomers.topByOrders || []}
          title="Clientes Más Frecuentes"
          type="orders"
        />
      </div>
    </div>
  );
};

export default DashboardStats;
