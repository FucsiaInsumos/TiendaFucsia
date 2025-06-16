import React from 'react';

const DistributorList = ({ distributors, onEdit }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!distributors || distributors.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">No hay distribuidores registrados</div>
        <p className="text-gray-400 mt-2">Crea tu primer distribuidor para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {distributors.map((distributor) => (
        <div key={distributor.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {distributor.user ? `${distributor.user.first_name} ${distributor.user.last_name}` : 'Usuario no encontrado'}
                </h3>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Distribuidor
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Documento:</strong> {distributor.userId}
                </div>
                
                <div>
                  <strong>Email:</strong> {distributor.user?.email || 'N/A'}
                </div>
                
                <div>
                  <strong>Teléfono:</strong> {distributor.user?.phone || 'N/A'}
                </div>
                
                <div>
                  <strong>Ciudad:</strong> {distributor.user?.city || 'N/A'}
                </div>
                
                <div>
                  <strong>Descuento:</strong> {distributor.discountPercentage}%
                </div>
                
                <div>
                  <strong>Límite de Crédito:</strong> {formatCurrency(distributor.creditLimit)}
                </div>
                
                <div>
                  <strong>Crédito Actual:</strong> {formatCurrency(distributor.currentCredit)}
                </div>
                
                <div>
                  <strong>Plazo de Pago:</strong> {distributor.paymentTerm} días
                </div>
                
                <div>
                  <strong>Mínimo de Compra:</strong> {formatCurrency(distributor.minimumPurchase)}
                </div>
              </div>

              {/* Barra de crédito utilizado */}
              {distributor.creditLimit > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Crédito Utilizado</span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(distributor.currentCredit)} / {formatCurrency(distributor.creditLimit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (distributor.currentCredit / distributor.creditLimit) > 0.8
                          ? 'bg-red-500'
                          : (distributor.currentCredit / distributor.creditLimit) > 0.6
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min((distributor.currentCredit / distributor.creditLimit) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(distributor)}
                className="text-blue-600 hover:text-blue-800 p-2"
                title="Editar distribuidor"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DistributorList;
