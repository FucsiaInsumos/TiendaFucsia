import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDistributors, createDistributor, updateDistributor } from '../../Redux/Actions/distributorActions';
import DistributorForm from './DistributorForm';
import DistributorList from './DistributorList';

const DistributorManager = () => {
  const dispatch = useDispatch();
  const { distributors, loading, error } = useSelector(state => state.distributors);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState(null);

  useEffect(() => {
    dispatch(getDistributors());
  }, [dispatch]);

  const handleCreateDistributor = async (distributorData) => {
    try {
      await dispatch(createDistributor(distributorData));
      setIsFormOpen(false);
      dispatch(getDistributors());
    } catch (error) {
      console.error('Error creating distributor:', error);
      alert(`Error al crear distribuidor: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateDistributor = async (distributorData) => {
    try {
      await dispatch(updateDistributor(editingDistributor.id, distributorData));
      setEditingDistributor(null);
      setIsFormOpen(false);
      dispatch(getDistributors());
    } catch (error) {
      console.error('Error updating distributor:', error);
      alert(`Error al actualizar distribuidor: ${error.response?.data?.message || error.message}`);
    }
  };

  const openEditForm = (distributor) => {
    setEditingDistributor(distributor);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDistributor(null);
  };

  if (loading && (!distributors || distributors.length === 0)) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3">Cargando distribuidores...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver al Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Distribuidores</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Nuevo Distribuidor
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <DistributorList
          distributors={distributors}
          onEdit={openEditForm}
        />
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingDistributor ? 'Editar Distribuidor' : 'Nuevo Distribuidor'}
            </h2>
            <DistributorForm
              distributor={editingDistributor}
              onSubmit={editingDistributor ? handleUpdateDistributor : handleCreateDistributor}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorManager;
