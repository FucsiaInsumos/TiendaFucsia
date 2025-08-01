import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ExpenseStats = ({ stats, summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const statCards = [
    {
      title: 'Total Gastos',
      value: formatCurrency(summary?.totalAmount || 0),
      icon: DollarSign,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Gastos Pendientes',
      value: summary?.pendingCount || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Gastos Aprobados',
      value: summary?.approvedCount || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Mes Actual',
      value: formatCurrency(stats?.currentMonth?.total || 0),
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas por categoría */}
      {stats?.byCategory && stats.byCategory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gastos por Categoría</h3>
          <div className="space-y-3">
            {stats.byCategory.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <span className="font-medium capitalize">{category.categoryType}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(category.total)}</div>
                  <div className="text-sm text-gray-500">{category.count} gastos</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparativa mensual */}
      {stats?.monthlyComparison && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comparativa Mensual</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Mes Anterior</p>
              <p className="text-xl font-bold">{formatCurrency(stats.monthlyComparison.previousMonth)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Mes Actual</p>
              <p className="text-xl font-bold">{formatCurrency(stats.monthlyComparison.currentMonth)}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center">
                {stats.monthlyComparison.difference >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-500 mr-1" />
                )}
                <p className="text-sm text-gray-600">Variación</p>
              </div>
              <p className={`text-xl font-bold ${
                stats.monthlyComparison.difference >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatCurrency(Math.abs(stats.monthlyComparison.difference))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseStats;
