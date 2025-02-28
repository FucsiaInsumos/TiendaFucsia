import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from '../Navbar';

const Dashboard = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const renderSections = () => {
    switch (user.role) {
      case 'Owner':
        return (
          <>
            <div>Sección de Gestión de Productos</div>
            <div>Sección de Gestión de Usuarios</div>
            <div>Sección de Reportes</div>
            <div>Sección de Caja</div>
          </>
        );
      case 'Cashier':
        return <div>Sección de Caja</div>;
      default:
        return <div>No tienes acceso a esta sección</div>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Administrador</h1>
        {renderSections()}
      </div>
    </div>
  );
};

export default Dashboard;