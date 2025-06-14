import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDiscountRules, createDiscountRule, updateDiscountRule, deleteDiscountRule } from '../../Redux/Actions/discountRuleActions';
import { getProducts } from '../../Redux/Actions/productActions';
import { getCategories } from '../../Redux/Actions/categoryActions';
import DiscountRuleForm from './DiscountRuleForm';
import DiscountRuleList from './DiscountRuleList';

const DiscountRuleManager = () => {
  const dispatch = useDispatch();
  const { discountRules, loading, error } = useSelector(state => state.discountRules);
  const { products } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  useEffect(() => {
    dispatch(getDiscountRules());
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const handleCreateRule = async (ruleData) => {
    try {
      await dispatch(createDiscountRule(ruleData));
      setIsFormOpen(false);
      dispatch(getDiscountRules());
    } catch (error) {
      console.error('Error creating discount rule:', error);
      alert(`Error al crear regla de descuento: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateRule = async (ruleData) => {
    try {
      await dispatch(updateDiscountRule(editingRule.id, ruleData));
      setEditingRule(null);
      setIsFormOpen(false);
      dispatch(getDiscountRules());
    } catch (error) {
      console.error('Error updating discount rule:', error);
      alert(`Error al actualizar regla de descuento: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteRule = async () => {
    try {
      await dispatch(deleteDiscountRule(ruleToDelete.id));
      setShowDeleteModal(false);
      setRuleToDelete(null);
    } catch (error) {
      console.error('Error deleting discount rule:', error);
    }
  };

  const openEditForm = (rule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const openDeleteModal = (rule) => {
    setRuleToDelete(rule);
    setShowDeleteModal(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRule(null);
  };

  if (loading && (!discountRules || discountRules.length === 0)) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3">Cargando reglas de descuento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Botón de regreso */}
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
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Reglas de Descuento</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Nueva Regla de Descuento
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
        <DiscountRuleList
          discountRules={discountRules}
          products={products}
          categories={categories}
          onEdit={openEditForm}
          onDelete={openDeleteModal}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingRule ? 'Editar Regla de Descuento' : 'Nueva Regla de Descuento'}
            </h2>
            <DiscountRuleForm
              rule={editingRule}
              products={products}
              categories={categories}
              onSubmit={editingRule ? handleUpdateRule : handleCreateRule}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p className="mb-4">
              ¿Estás seguro de que quieres eliminar la regla "{ruleToDelete?.name}"?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteRule}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountRuleManager;
