import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProveedores, updatePurchaseOrder } from '../../Redux/Actions/purchaseActions';
import { getCategories } from '../../Redux/Actions/categoryActions';
import { getProducts, createProduct } from '../../Redux/Actions/productActions';
import ProductForm from '../Products/ProductForm';
import axios from '../../utils/axios';

const EditPurchaseOrderModal = ({ order, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // ✅ NUEVOS ESTADOS PARA FUNCIONALIDADES AVANZADAS
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [productSearchTerms, setProductSearchTerms] = useState({});
  const [showProductDropdowns, setShowProductDropdowns] = useState({});
  
  const [formData, setFormData] = useState({
    proveedorId: '',
    fechaCompra: '',
    numeroFactura: '',
    metodoPago: 'efectivo',
    fechaVencimiento: '',
    notas: '',
    impuestos: 0,
    descuentos: 0,
    items: []
  });

  const initializeFormData = () => {
    if (order) {
      // Función auxiliar para formatear fechas de manera segura
      const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error al formatear fecha:', error);
          return '';
        }
      };

      setFormData({
        proveedorId: order.proveedorId || '',
        fechaCompra: formatDate(order.fechaCompra),
        numeroFactura: order.numeroFactura || '',
        metodoPago: order.metodoPago || 'efectivo',
        fechaVencimiento: formatDate(order.fechaVencimiento),
        notas: order.notas || '',
        impuestos: order.impuestos || 0,
        descuentos: order.descuentos || 0,
        items: order.items ? order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku || item.productCode,
          productDescription: item.productDescription || '',
          categoryId: item.categoryId || '',
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          precioVentaSugerido: item.precioVentaSugerido || 0,
          precioDistribuidorSugerido: item.precioDistribuidorSugerido || 0,
          stockMinimo: item.stockMinimo || 5,
          cantidadRecibida: item.cantidadRecibida || 0,
          isNewProduct: !item.productId // Si no tiene productId, es nuevo
        })) : []
      });
    }
  };

  const loadCategories = async () => {
    try {
      const response = await dispatch(getCategories());
      if (response.error === false) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadProveedores = async () => {
    try {
      const response = await dispatch(getProveedores());
      if (response.error === false) {
        setProveedores(response.data.proveedores || []);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const loadProductos = async () => {
    try {
      const response = await dispatch(getProducts());
      if (response.error === false) {
        setProductos(response.data || []);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    loadProveedores();
    loadProductos();
    loadCategories();
    initializeFormData();
  }, [order]);

  // ✅ Efecto para cerrar dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.product-search-container')) {
        setShowProductDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));

    // ✅ VALIDACIÓN DE SKU: Si el usuario ingresa un SKU, verificar si ya existe
    if (field === 'productSku' && value && value.trim()) {
      const existingProduct = productos.find(p => 
        p.sku && p.sku.toLowerCase() === value.toLowerCase()
      );
      
      if (existingProduct) {
        // ✅ SKU EXISTE: Cargar automáticamente los datos del producto
        const shouldLoadData = window.confirm(
          `¡El SKU "${value}" ya existe en el sistema!\n\n` +
          `Producto encontrado: "${existingProduct.name}"\n` +
          `Precio actual: $${existingProduct.price?.toLocaleString('es-CO')}\n` +
          `Stock actual: ${existingProduct.stock || 0} unidades\n\n` +
          `¿Deseas cargar automáticamente los datos de este producto existente?`
        );
        
        if (shouldLoadData) {
          setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => 
              i === index ? {
                ...item,
                productId: existingProduct.id,
                productName: existingProduct.name,
                productSku: existingProduct.sku,
                productDescription: existingProduct.description || '',
                categoryId: existingProduct.categoryId,
                precioVentaSugerido: existingProduct.price,
                precioDistribuidorSugerido: existingProduct.distributorPrice || 0,
                stockMinimo: existingProduct.minStock || 5,
                isNewProduct: false
              } : item
            )
          }));
          
          // También actualizar el término de búsqueda para mostrar el producto seleccionado
          setProductSearchTerms(prev => ({
            ...prev,
            [index]: existingProduct.name
          }));
          
          alert(`✅ Datos del producto "${existingProduct.name}" cargados automáticamente.`);
        }
      }
    }

    // Si se marca como nuevo producto, limpiar productId
    if (field === 'isNewProduct' && value) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) => 
          i === index ? { ...item, productId: '' } : item
        )
      }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: '',
        productName: '',
        productSku: '',
        productDescription: '',
        categoryId: '',
        cantidad: 1,
        precioUnitario: 0,
        precioVentaSugerido: 0,
        precioDistribuidorSugerido: 0,
        stockMinimo: 5,
        isNewProduct: false,
        notas: ''
      }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // ✅ FUNCIÓN AUXILIAR: Verificar si un SKU ya existe
  const checkSkuExists = (sku) => {
    if (!sku || !sku.trim()) return null;
    return productos.find(p => p.sku && p.sku.toLowerCase() === sku.toLowerCase());
  };

  // ✅ FUNCIÓN AUXILIAR: Verificar si hay SKUs duplicados en la orden actual
  const checkDuplicateSkuInOrder = (sku, currentIndex) => {
    if (!sku || !sku.trim()) return false;
    return formData.items.some((item, index) => 
      index !== currentIndex && 
      item.productSku && 
      item.productSku.toLowerCase() === sku.toLowerCase()
    );
  };

  // ✅ FUNCIONES PARA BÚSQUEDA DE PRODUCTOS
  const handleProductSearch = (index, searchTerm) => {
    setProductSearchTerms(prev => ({
      ...prev,
      [index]: searchTerm
    }));
    
    setShowProductDropdowns(prev => ({
      ...prev,
      [index]: searchTerm.length > 0
    }));
  };

  const getFilteredProducts = (index) => {
    const searchTerm = productSearchTerms[index] || '';
    if (!searchTerm) return productos;
    
    return productos.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const selectProduct = (index, product) => {
    // Llenar datos del producto seleccionado
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? {
          ...item,
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          productDescription: product.description || '',
          categoryId: product.categoryId,
          precioVentaSugerido: product.price,
          precioDistribuidorSugerido: product.distributorPrice || 0,
          stockMinimo: product.minStock || 5,
          isNewProduct: false
        } : item
      )
    }));
    
    // Actualizar el término de búsqueda con el nombre del producto
    setProductSearchTerms(prev => ({
      ...prev,
      [index]: product.name
    }));
    
    // Ocultar dropdown
    setShowProductDropdowns(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const clearProductSearch = (index) => {
    setProductSearchTerms(prev => ({
      ...prev,
      [index]: ''
    }));
    setShowProductDropdowns(prev => ({
      ...prev,
      [index]: false
    }));
    handleItemChange(index, 'productId', '');
  };

  // ✅ FUNCIÓN: Abrir modal para crear producto
  const handleCreateNewProduct = (itemIndex) => {
    setCurrentItemIndex(itemIndex);
    setShowProductModal(true);
  };

  // ✅ FUNCIÓN: Manejar producto creado desde ProductForm
  const handleProductFormSubmit = async (productData, files) => {
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      
      // Agregar datos del producto
      Object.keys(productData).forEach(key => {
        if (key !== 'image_url') {
          if (typeof productData[key] === 'object' && productData[key] !== null) {
            formDataToSend.append(key, JSON.stringify(productData[key]));
          } else {
            formDataToSend.append(key, productData[key] || '');
          }
        }
      });
      
      // Agregar archivos si los hay
      if (files && files.length > 0) {
        files.forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      const response = await dispatch(createProduct(formDataToSend));
      
      if (response.error === false) {
        const newProduct = response.data;
        
        // Actualizar el item actual con los datos del producto creado
        if (currentItemIndex !== null) {
          setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => 
              i === currentItemIndex ? {
                ...item,
                productId: newProduct.id,
                productName: newProduct.name,
                productSku: newProduct.sku,
                productDescription: newProduct.description || '',
                categoryId: newProduct.categoryId,
                precioVentaSugerido: newProduct.price,
                precioDistribuidorSugerido: newProduct.distributorPrice || 0,
                stockMinimo: newProduct.minStock || 5,
                isNewProduct: false
              } : item
            )
          }));
        }
        
        // Actualizar la lista de productos disponibles
        await loadProductos();
        
        alert(`Producto "${newProduct.name}" creado exitosamente y agregado a la orden`);
        setShowProductModal(false);
        setCurrentItemIndex(null);
      } else {
        alert('Error al crear producto: ' + response.message);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Error al crear producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN: Cancelar creación de producto
  const handleProductFormCancel = () => {
    setShowProductModal(false);
    setCurrentItemIndex(null);
  };

  // ✅ FUNCIÓN: Obtener datos iniciales para el ProductForm
  const getInitialProductData = () => {
    if (currentItemIndex !== null) {
      const item = formData.items[currentItemIndex];
      return {
        sku: item.productSku || '',
        name: item.productName || '',
        description: item.productDescription || '',
        purchasePrice: item.precioUnitario || 0,
        price: item.precioVentaSugerido || 0,
        distributorPrice: item.precioDistribuidorSugerido || 0,
        stock: item.cantidad || 0,
        minStock: item.stockMinimo || 5,
        categoryId: item.categoryId || '',
        isPromotion: false,
        isFacturable: false,
        promotionPrice: '',
        tags: [],
        specificAttributes: {},
        isActive: true
      };
    }
    return null;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.cantidad) * parseFloat(item.precioUnitario));
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + parseFloat(formData.impuestos) - parseFloat(formData.descuentos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      alert('Debe agregar al menos un item');
      return;
    }

    if (!formData.proveedorId) {
      alert('Debe seleccionar un proveedor');
      return;
    }

    // ✅ VALIDACIÓN DE SKUs DUPLICADOS EN LA ORDEN
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (item.productSku && checkDuplicateSkuInOrder(item.productSku, i)) {
        alert(
          `❌ ERROR: SKU DUPLICADO EN LA ORDEN\n\n` +
          `El SKU "${item.productSku}" aparece más de una vez en esta orden.\n` +
          `Cada producto debe tener un SKU único.\n\n` +
          `Por favor corrige los SKUs duplicados antes de continuar.`
        );
        return;
      }
    }

    try {
      setLoading(true);

      const orderData = {
        proveedorId: formData.proveedorId,
        fechaCompra: formData.fechaCompra,
        numeroFactura: formData.numeroFactura,
        metodoPago: formData.metodoPago,
        fechaVencimiento: formData.fechaVencimiento || null, // Usar null si está vacío
        notas: formData.notas,
        impuestos: parseFloat(formData.impuestos) || 0,
        descuentos: parseFloat(formData.descuentos) || 0,
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
        items: formData.items.map(item => ({
          id: item.id, // Mantener ID para items existentes
          productId: item.isNewProduct ? null : (item.productId || null),
          productName: item.productName,
          productSku: item.productSku || item.productCode,
          productDescription: item.productDescription || '',
          categoryId: item.categoryId || null,
          cantidad: parseInt(item.cantidad),
          precioUnitario: parseFloat(item.precioUnitario),
          precioVentaSugerido: parseFloat(item.precioVentaSugerido) || null,
          precioDistribuidorSugerido: parseFloat(item.precioDistribuidorSugerido) || null,
          stockMinimo: parseInt(item.stockMinimo) || 5,
          isNewProduct: item.isNewProduct,
          cantidadRecibida: item.cantidadRecibida || 0
        }))
      };

      const response = await dispatch(updatePurchaseOrder(order.id, orderData));

      if (response.error === false) {
        alert('Orden actualizada exitosamente');
        onSuccess();
      } else {
        alert(response.message || 'Error al actualizar orden');
      }
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      alert('Error al actualizar la orden: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Editar Orden de Compra - {order.orderNumber}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {order.status === 'completada' && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              ⚠️ Esta orden está completada. Los cambios pueden afectar el inventario ya registrado.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <select
                  name="proveedorId"
                  value={formData.proveedorId}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre} - {proveedor.nit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Compra *
                </label>
                <input
                  type="date"
                  name="fechaCompra"
                  value={formData.fechaCompra}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Factura
                </label>
                <input
                  type="text"
                  name="numeroFactura"
                  value={formData.numeroFactura}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="credito">Crédito</option>
                  <option value="cheque">Cheque</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Items de la Orden</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  + Agregar Item
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {formData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-800">Item {index + 1}</h5>
                      <div className="flex items-center space-x-3">
                        {/* ✅ INDICADOR DE ESTADO DEL PRODUCTO */}
                        {item.productId && !item.isNewProduct && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                            <span className="text-green-600 text-xs">🔗</span>
                            <span className="text-green-700 text-xs font-medium">Producto Vinculado</span>
                          </div>
                        )}
                        {item.isNewProduct && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 rounded-full">
                            <span className="text-blue-600 text-xs">🆕</span>
                            <span className="text-blue-700 text-xs font-medium">Producto Nuevo</span>
                          </div>
                        )}
                        {item.cantidadRecibida > 0 && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 rounded-full">
                            <span className="text-yellow-600 text-xs">📦</span>
                            <span className="text-yellow-700 text-xs font-medium">Parcialmente Recibido</span>
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>

                    {/* ✅ BANNER INFORMATIVO PARA PRODUCTOS VINCULADOS */}
                    {item.productId && !item.isNewProduct && (
                      <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <span className="text-green-600">ℹ️</span>
                          <div className="flex-1">
                            <p className="text-sm text-green-800 font-medium">
                              Producto existente vinculado: "{item.productName}"
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              🔒 <strong>Campos protegidos:</strong> Nombre, SKU, Descripción<br/>
                              ✏️ <strong>Campos editables:</strong> Cantidad, Precio Unitario, Precios Sugeridos, Stock Mínimo
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ✅ MOSTRAR ESTADO DE RECEPCIÓN SI APLICA */}
                    {item.cantidadRecibida > 0 && (
                      <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-600">📦</span>
                          <div className="flex-1">
                            <p className="text-sm text-yellow-800 font-medium">
                              Cantidad ya recibida: {item.cantidadRecibida} de {item.cantidad}
                            </p>
                            <p className="text-xs text-yellow-700">
                              ⚠️ Cambios en este item pueden afectar el inventario ya registrado
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Producto existente o nuevo */}
                      <div className="md:col-span-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.isNewProduct}
                              onChange={(e) => handleItemChange(index, 'isNewProduct', e.target.checked)}
                              className="mr-2"
                            />
                            <span className="text-sm">Es un producto nuevo</span>
                          </label>
                          
                          {/* ✅ BOTÓN PARA CREAR PRODUCTO CON PRODUCTFORM */}
                          {item.isNewProduct && (
                            <button
                              type="button"
                              onClick={() => handleCreateNewProduct(index)}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors flex items-center space-x-1"
                            >
                              <span>🆕</span>
                              <span>Crear Producto Completo</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {!item.isNewProduct && (
                        <div className="relative product-search-container">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar Producto Existente
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={productSearchTerms[index] || item.productName || ''}
                              onChange={(e) => handleProductSearch(index, e.target.value)}
                              onFocus={() => setShowProductDropdowns(prev => ({ ...prev, [index]: true }))}
                              className={`w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                item.productId ? 'border-green-300 bg-green-50' : 'border-gray-300'
                              }`}
                              placeholder="Buscar por nombre, SKU o descripción..."
                            />
                            {item.productId && (
                              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-green-600">
                                ✓
                              </div>
                            )}
                            {(productSearchTerms[index] || item.productName) && (
                              <button
                                type="button"
                                onClick={() => clearProductSearch(index)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          
                          {/* Dropdown de resultados */}
                          {showProductDropdowns[index] && getFilteredProducts(index).length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {getFilteredProducts(index).slice(0, 10).map(product => (
                                <div
                                  key={product.id}
                                  onClick={() => selectProduct(index, product)}
                                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{product.name}</p>
                                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                                      {product.description && (
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                          {product.description.substring(0, 80)}...
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right ml-4">
                                      <p className="text-sm font-medium text-blue-600">
                                        ${product.price?.toLocaleString('es-CO')}
                                      </p>
                                      <p className="text-xs text-gray-500">Stock: {product.stock || 0}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Producto *
                          {item.productId && !item.isNewProduct && (
                            <span className="text-xs text-gray-500 ml-2">(Autocompletado - No editable)</span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                          disabled={item.productId && !item.isNewProduct}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            item.productId && !item.isNewProduct 
                              ? 'border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed' 
                              : 'border-gray-300'
                          }`}
                          placeholder="Nombre del producto"
                          required
                        />
                      </div>

                      {/* ✅ SKU CON VALIDACIÓN */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SKU {item.isNewProduct && '*'}
                          {item.productId && !item.isNewProduct && (
                            <span className="text-xs text-gray-500 ml-2">(Autocompletado - No editable)</span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={item.productSku}
                            onChange={(e) => handleItemChange(index, 'productSku', e.target.value)}
                            disabled={item.productId && !item.isNewProduct}
                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              item.productId && !item.isNewProduct ? 'border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed' :
                              !item.productSku ? 'border-gray-300' :
                              checkDuplicateSkuInOrder(item.productSku, index) ? 'border-red-500 bg-red-50' :
                              checkSkuExists(item.productSku) && item.isNewProduct ? 'border-yellow-500 bg-yellow-50' :
                              'border-gray-300'
                            }`}
                            placeholder={item.isNewProduct ? "Código único requerido" : "Código del producto"}
                            required={item.isNewProduct}
                          />
                          
                          {/* ✅ ICONOS DE ESTADO */}
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {item.productId && !item.isNewProduct && (
                              <span className="text-gray-500" title="Campo protegido - Producto existente">🔒</span>
                            )}
                            {!item.productId && checkDuplicateSkuInOrder(item.productSku, index) && (
                              <span className="text-red-500" title="SKU duplicado en esta orden">❌</span>
                            )}
                            {!item.productId && checkSkuExists(item.productSku) && item.isNewProduct && !checkDuplicateSkuInOrder(item.productSku, index) && (
                              <span className="text-yellow-500" title="SKU ya existe en el sistema">⚠️</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cantidad *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => handleItemChange(index, 'cantidad', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Unitario *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.precioUnitario}
                          onChange={(e) => handleItemChange(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Venta Sugerido
                          {item.productId && !item.isNewProduct && (
                            <span className="text-xs text-green-600 ml-2">(Autocompletado - Editable)</span>
                          )}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.precioVentaSugerido}
                          onChange={(e) => handleItemChange(index, 'precioVentaSugerido', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Subtotal del item */}
                      <div className="md:col-span-3 text-right">
                        <span className="text-sm font-medium">
                          Subtotal: ${(item.cantidad * item.precioUnitario).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impuestos
                </label>
                <input
                  type="number"
                  name="impuestos"
                  value={formData.impuestos}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuentos
                </label>
                <input
                  type="number"
                  name="descuentos"
                  value={formData.descuentos}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Subtotal: ${calculateSubtotal().toLocaleString()}</div>
                <div className="text-lg font-bold text-gray-800">
                  Total: ${calculateTotal().toLocaleString()}
                </div>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Notas adicionales sobre la orden..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Actualizando...' : 'Actualizar Orden'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ MODAL PARA PRODUCTFORM */}
      {showProductModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleProductFormCancel}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    🆕 Crear Nuevo Producto para Orden de Compra
                  </h3>
                  <p className="text-sm text-gray-600">
                    El producto se creará y se agregará automáticamente a la orden
                  </p>
                </div>
                
                <ProductForm
                  product={getInitialProductData()}
                  categories={categories}
                  onSubmit={handleProductFormSubmit}
                  onCancel={handleProductFormCancel}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPurchaseOrderModal;
