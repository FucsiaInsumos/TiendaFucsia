import React from 'react';

const TopCustomersCard = ({ customers = [], title = "Mejores Clientes", type = "amount" }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCustomerName = (customer) => {
    if (customer?.firstName && customer?.lastName) {
      return `${customer.firstName} ${customer.lastName}`;
    }
    return customer?.email || 'Cliente sin nombre';
  };

  const getPrimaryMetric = (customer, type) => {
    if (type === 'amount') {
      return formatCurrency(customer.totalSpent);
    } else if (type === 'orders') {
      return `${customer.totalOrders} órdenes`;
    }
    return '';
  };

  const getSecondaryMetric = (customer, type) => {
    if (type === 'amount') {
      return `${customer.totalOrders} órdenes • Promedio: ${formatCurrency(customer.averageOrder)}`;
    } else if (type === 'orders') {
      return `Total: ${formatCurrency(customer.totalSpent)} • Promedio: ${formatCurrency(customer.averageOrder)}`;
    }
    return '';
  };

  const getBadgeColor = (index) => {
    const colors = [
      'bg-yellow-100 text-yellow-800', // Oro
      'bg-gray-100 text-gray-800',     // Plata
      'bg-orange-100 text-orange-800', // Bronce
      'bg-blue-100 text-blue-800',     // Azul
      'bg-green-100 text-green-800'    // Verde
    ];
    return colors[index] || 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {customers.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">👥</div>
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map((item, index) => (
            <div key={item.customer?.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(index)}`}>
                    #{index + 1}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {getCustomerName(item.customer)}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.customer?.email}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {getPrimaryMetric(item, type)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getSecondaryMetric(item, type)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopCustomersCard;
