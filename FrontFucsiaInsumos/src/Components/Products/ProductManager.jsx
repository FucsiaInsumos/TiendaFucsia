import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts, createProduct, createProductWithFiles, updateProduct, updateProductWithFiles, deleteProduct } from '../../Redux/Actions/productActions';
import { getCategories } from '../../Redux/Actions/categoryActions';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import ProductFilters from './ProductFilters';
import CatalogDownloader from './CatalogoDownloader';

const ProductManager = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);
  const { user } = useSelector(state => state.auth); // ✅ OBTENER USUARIO ACTUAL
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const handleCreateProduct = async (productData, files) => {
    try {
      console.log('Creating product with data:', productData);
      console.log('Files:', files);
      
      if (files && files.length > 0) {
        const formData = new FormData();
        
        // Añadir archivos
        files.forEach(file => {
          formData.append('images', file);
        });
        
        // Añadir datos del producto
        Object.keys(productData).forEach(key => {
          if (key === 'tags' || key === 'specificAttributes') {
            formData.append(key, JSON.stringify(productData[key]));
          } else if (productData[key] !== '' && productData[key] !== null && productData[key] !== undefined) {
            formData.append(key, productData[key]);
          }
        });
        
        // Debug: mostrar contenido del FormData
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
        
        await dispatch(createProductWithFiles(formData));
      } else {
        // Limpiar campos vacíos
        const cleanData = Object.keys(productData).reduce((acc, key) => {
          if (productData[key] !== '' && productData[key] !== null && productData[key] !== undefined) {
            acc[key] = productData[key];
          }
          return acc;
        }, {});
        
        await dispatch(createProduct(cleanData));
      }
      
      setIsFormOpen(false);
      dispatch(getProducts());
    } catch (error) {
      console.error('Error creating product:', error);
      // Mostrar el error al usuario
      alert(`Error al crear producto: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateProduct = async (productData, files) => {
    try {
      console.log('Updating product with data:', productData);
      console.log('Files:', files);
      
      // Limpiar datos antes de enviar
      const cleanData = Object.keys(productData).reduce((acc, key) => {
        const value = productData[key];
        
        // Para campos numéricos, convertir strings vacíos a null
        if (['promotionPrice', 'minStock'].includes(key) && value === '') {
          acc[key] = null;
        }
        // Para otros campos, incluir solo si no están vacíos
        else if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        // Incluir campos booleanos y arrays siempre
        else if (typeof value === 'boolean' || Array.isArray(value)) {
          acc[key] = value;
        }
        
        return acc;
      }, {});
      
      if (files && files.length > 0) {
        const formData = new FormData();
        
        files.forEach(file => {
          formData.append('images', file);
        });
        
        Object.keys(cleanData).forEach(key => {
          if (key === 'tags' || key === 'specificAttributes') {
            formData.append(key, JSON.stringify(cleanData[key]));
          } else {
            formData.append(key, cleanData[key]);
          }
        });
        
        await dispatch(updateProductWithFiles(editingProduct.id, formData));
      } else {
        await dispatch(updateProduct(editingProduct.id, cleanData));
      }
      
      setEditingProduct(null);
      setIsFormOpen(false);
      dispatch(getProducts());
    } catch (error) {
      console.error('Error updating product:', error);
      alert(`Error al actualizar producto: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await dispatch(deleteProduct(productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      console.log('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Loading inicial
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3">Cargando productos...</span>
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
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
        <div className="flex space-x-3">
          <CatalogDownloader compact={true} />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"/>
            </svg>
            Filtros
          </button>
          {/* ✅ SOLO OWNER, ADMIN Y CASHIER PUEDEN CREAR PRODUCTOS */}
          {(user?.role === 'Owner' || user?.role === 'Admin' || user?.role === 'Cashier') && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Nuevo Producto
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filtros */}
      {showFilters && (
        <div className="mb-6">
          <ProductFilters categories={categories} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ProductList
          products={products}
          categories={categories}
          onEdit={openEditForm}
          onDelete={openDeleteModal}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (user?.role === 'Owner' || user?.role === 'Admin' || user?.role === 'Cashier') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && user?.role === 'Owner' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p className="mb-4">
              ¿Estás seguro de que quieres eliminar el producto "{productToDelete?.name}"?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProduct}
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

export default ProductManager;
