import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getExpenses } from '../../Redux/Actions/expenseActions';
import { getPurchaseOrders } from '../../Redux/Actions/purchaseActions';

const PurchaseExpensesSummary = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalFromPurchaseOrders: 0,
    totalManualExpenses: 0,
    percentageFromOrders: 0,
    recentPurchaseExpenses: [],
    monthlyTotals: {
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    },
    allTimeExpenses: 0, // ✅ AGREGAR TOTAL DE TODOS LOS GASTOS
    allTimeFromOrders: 0 // ✅ AGREGAR TOTAL DE ÓRDENES DE TODOS LOS TIEMPOS
  });

  useEffect(() => {
    loadSummaryData();
  }, []);

  const loadSummaryData = async () => {
    try {
      setLoading(true);
      
      // Obtener gastos del mes actual
      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const [expensesResponse] = await Promise.all([
        dispatch(getExpenses({
          startDate: firstDayLastMonth.toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0],
          limit: 1000 // Obtener más registros para el análisis
        }))
      ]);

      if (expensesResponse.error === false) {
        const expenses = expensesResponse.data.expenses || [];
        
        // Filtrar gastos del mes actual y anterior
        const thisMonthExpenses = expenses.filter(exp => 
          new Date(exp.expenseDate) >= firstDayThisMonth
        );
        const lastMonthExpenses = expenses.filter(exp => 
          new Date(exp.expenseDate) >= firstDayLastMonth && 
          new Date(exp.expenseDate) <= lastDayLastMonth
        );

        // Calcular totales
        const totalFromOrders = thisMonthExpenses
          .filter(exp => exp.isFromPurchaseOrder)
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        
        const totalManual = thisMonthExpenses
          .filter(exp => !exp.isFromPurchaseOrder)
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        const totalThisMonth = totalFromOrders + totalManual;
        const totalLastMonth = lastMonthExpenses
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        const growth = totalLastMonth > 0 ? 
          ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 : 0;

        // ✅ CALCULAR TOTALES DE TODOS LOS TIEMPOS (SIN FILTRO DE FECHA)
        const allTimeFromOrders = expenses
          .filter(exp => exp.isFromPurchaseOrder)
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        
        const allTimeTotal = expenses
          .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        // Gastos recientes de órdenes de compra
        const recentPurchaseExpenses = thisMonthExpenses
          .filter(exp => exp.isFromPurchaseOrder)
          .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
          .slice(0, 5);

        setSummary({
          totalExpenses: totalThisMonth,
          totalFromPurchaseOrders: totalFromOrders,
          totalManualExpenses: totalManual,
          percentageFromOrders: totalThisMonth > 0 ? (totalFromOrders / totalThisMonth) * 100 : 0,
          recentPurchaseExpenses,
          monthlyTotals: {
            thisMonth: totalThisMonth,
            lastMonth: totalLastMonth,
            growth: growth
          },
          allTimeExpenses: allTimeTotal, // ✅ TOTAL DE TODOS LOS GASTOS
          allTimeFromOrders: allTimeFromOrders // ✅ TOTAL DE ÓRDENES DE TODOS LOS TIEMPOS
        });
      }
    } catch (error) {
      console.error('Error cargando resumen de gastos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Resumen de Gastos - {new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
      </h3>

      {/* ✅ SECCIÓN COMPARATIVA CON GESTIÓN DE GASTOS */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">
          📊 Comparación con Gestión de Gastos
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-yellow-700">Total Histórico (Todos los tiempos)</div>
            <div className="text-xl font-bold text-yellow-900">{formatCurrency(summary.allTimeExpenses)}</div>
            <div className="text-xs text-yellow-600">
              Debe coincidir con "Gestión de Gastos"
            </div>
          </div>
          <div>
            <div className="text-sm text-yellow-700">De Órdenes de Compra (Histórico)</div>
            <div className="text-xl font-bold text-yellow-900">{formatCurrency(summary.allTimeFromOrders)}</div>
            <div className="text-xs text-yellow-600">
              {summary.allTimeExpenses > 0 ? ((summary.allTimeFromOrders / summary.allTimeExpenses) * 100).toFixed(1) : 0}% del total histórico
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas del mes actual */}
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          📅 Estadísticas del Mes Actual
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">Total Gastos</div>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(summary.totalExpenses)}</div>
          <div className="text-sm text-blue-600">
            {summary.monthlyTotals.lastMonth === 0 ? (
              '🆕 Primer mes con gastos registrados'
            ) : (
              <>
                {summary.monthlyTotals.growth > 0 ? '↗️' : summary.monthlyTotals.growth < 0 ? '↘️' : '➡️'} 
                {Math.abs(summary.monthlyTotals.growth).toFixed(1)}% vs mes anterior
              </>
            )}
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600">De Órdenes de Compra</div>
          <div className="text-2xl font-bold text-purple-900">{formatCurrency(summary.totalFromPurchaseOrders)}</div>
          <div className="text-sm text-purple-600">
            {summary.percentageFromOrders.toFixed(1)}% del total
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Gastos Manuales</div>
          <div className="text-2xl font-bold text-green-900">{formatCurrency(summary.totalManualExpenses)}</div>
          <div className="text-sm text-green-600">
            {(100 - summary.percentageFromOrders).toFixed(1)}% del total
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600">Mes Anterior</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.monthlyTotals.lastMonth)}</div>
          <div className="text-sm text-gray-600">
            {summary.monthlyTotals.lastMonth === 0 ? 'Sin registros previos' : 'Comparativo'}
          </div>
        </div>
      </div>

      {/* Separador visual */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Estadísticas históricas (comparación con Gestión de Gastos) */}
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          📊 Total Histórico (Todos los tiempos)
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          Estos totales deben coincidir con "Gestión de Gastos"
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-sm font-medium text-yellow-700">Total Histórico</div>
          <div className="text-2xl font-bold text-yellow-900">{formatCurrency(summary.allTimeExpenses)}</div>
          <div className="text-sm text-yellow-700">
            Todos los gastos registrados
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-sm font-medium text-orange-700">De Órdenes de Compra (Histórico)</div>
          <div className="text-2xl font-bold text-orange-900">{formatCurrency(summary.allTimeFromOrders)}</div>
          <div className="text-sm text-orange-700">
            {summary.allTimeExpenses > 0 ? ((summary.allTimeFromOrders / summary.allTimeExpenses) * 100).toFixed(1) : 0}% del total histórico
          </div>
        </div>
      </div>

      {/* Gastos recientes de órdenes de compra */}
      {summary.recentPurchaseExpenses.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Gastos Recientes de Órdenes de Compra
          </h4>
          <div className="space-y-2">
            {summary.recentPurchaseExpenses.map((expense, index) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-purple-50 rounded border border-purple-100">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {expense.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {expense.vendor} • {formatDate(expense.expenseDate)}
                    {expense.invoiceNumber && ` • Factura: ${expense.invoiceNumber}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-900">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="text-xs text-purple-600">
                    📦 Orden de Compra
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje informativo */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="text-blue-400 mr-3">ℹ️</div>
          <div>
            <h4 className="text-sm font-medium text-blue-800">¿Cómo funciona la integración?</h4>
            <div className="text-sm text-blue-700 mt-1">
              • Los gastos se generan automáticamente cuando se completa una orden de compra<br/>
              • Aparecen en la sección de Expenses con un indicador especial 📦<br/>
              • Se incluyen en todas las estadísticas y reportes de gastos<br/>
              • Los gastos manuales se siguen cargando independientemente
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseExpensesSummary;
