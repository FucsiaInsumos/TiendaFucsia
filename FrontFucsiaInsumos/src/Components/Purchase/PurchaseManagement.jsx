import React, { useState } from 'react';
import ProveedorManager from './ProveedorManager';
import PurchaseOrderManager from './PurchaseOrderManager';
import ExpenseManager from '../Expenses/ExpenseManager';

const PurchaseManagement = () => {
  const [activeTab, setActiveTab] = useState('proveedores'); // 'proveedores', 'orders'

  const tabs = [
    { 
      id: 'proveedores', 
      label: 'Proveedores', 
      icon: '🏭',
      description: 'Gestiona proveedores y distribuidores'
    },
    { 
      id: 'orders', 
      label: 'Órdenes de Compra', 
      icon: '📦',
      description: 'Gestiona compras y recepción de mercancía'
    },
       { 
      id: 'gastos', 
      label: 'Gastos', 
      icon: '💰',
      description: 'Gestiona gastos diarios y mensuales'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Compras y Gastos
          </h1>
          <p className="text-gray-600">
            Gestiona proveedores, órdenes de compra, recepción de mercancía y gastos empresariales
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {tab.description}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg">
          {activeTab === 'proveedores' && <ProveedorManager />}
          {activeTab === 'orders' && <PurchaseOrderManager />}
          {activeTab === 'gastos' && <ExpenseManager />}
        </div>
      </div>
    </div>
  );
};

export default PurchaseManagement;
