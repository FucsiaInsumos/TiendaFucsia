import React from 'react';

const DiscountRuleList = ({ discountRules, products, categories, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin límite';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getProductName = (productId) => {
    const product = products?.find(p => p.id === productId);
    return product ? `${product.name} (${product.sku})` : 'Producto no encontrado';
  };

  const getCategoryName = (categoryId) => {
    const category = categories?.find(c => c.id === categoryId);
    return category ? category.name : 'Categoría no encontrada';
  };

  const getApplicableForText = (applicableFor) => {
    const mapping = {
      all: 'Todos',
      customers: 'Clientes',
      distributors: 'Distribuidores'
    };
    return mapping[applicableFor] || applicableFor;
  };

  const getConditionText = (rule) => {
    const parts = [];
    
    if (rule.conditionType === 'quantity' || rule.conditionType === 'both') {
      parts.push(`Cantidad: ${rule.minQuantity}${rule.maxQuantity ? `-${rule.maxQuantity}` : '+'}`);
    }
    
    if (rule.conditionType === 'amount' || rule.conditionType === 'both') {
      parts.push(`Monto: $${rule.minAmount}${rule.maxAmount ? `-$${rule.maxAmount}` : '+'}`);
    }
    
    return parts.join(' | ');
  };

  if (!discountRules || discountRules.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">No hay reglas de descuento creadas</div>
        <p className="text-gray-400 mt-2">Crea tu primera regla de descuento para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discountRules.map((rule) => (
        <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{rule.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  rule.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {rule.isActive ? 'Activa' : 'Inactiva'}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Prioridad: {rule.priority}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Descuento:</strong> {rule.discountValue}
                  {rule.discountType === 'percentage' ? '%' : ' COP'}
                </div>
                
                <div>
                  <strong>Condición:</strong> {getConditionText(rule)}
                </div>
                
                <div>
                  <strong>Aplicable para:</strong> {getApplicableForText(rule.applicableFor)}
                </div>
                
                <div>
                  <strong>Producto:</strong> {rule.productId ? getProductName(rule.productId) : 'Todos'}
                </div>
                
                <div>
                  <strong>Categoría:</strong> {rule.categoryId ? getCategoryName(rule.categoryId) : 'Todas'}
                </div>
                
                <div>
                  <strong>Vigencia:</strong> {formatDate(rule.startDate)} - {formatDate(rule.endDate)}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(rule)}
                className="text-blue-600 hover:text-blue-800 p-2"
                title="Editar regla"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              
              <button
                onClick={() => onDelete(rule)}
                className="text-red-600 hover:text-red-800 p-2"
                title="Eliminar regla"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscountRuleList;
