import React from 'react';

const TopProductsCard = ({ products = [], title = "Productos Más Vendidos", type = "selling" }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMetricValue = (product, type) => {
    if (type === 'selling') {
      return `${product.totalSold} unidades`;
    } else if (type === 'revenue') {
      return formatCurrency(product.totalRevenue);
    } else if (type === 'margin') {
      return `${product.profitMargin?.toFixed(1)}%`;
    }
    return '';
  };

  const getSecondaryMetric = (product, type) => {
    if (type === 'selling') {
      return formatCurrency(product.totalRevenue);
    } else if (type === 'revenue') {
      return `${product.totalSold} unidades`;
    } else if (type === 'margin') {
      return formatCurrency(product.profit);
    }
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📦</div>
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((item, index) => (
            <div key={item.product?.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">#{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.product?.name || 'Producto sin nombre'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    SKU: {item.product?.sku || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {getMetricValue(item, type)}
                </p>
                <p className="text-xs text-gray-500">
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

export default TopProductsCard;
