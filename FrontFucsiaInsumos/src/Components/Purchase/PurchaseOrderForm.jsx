import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  createPurchaseOrder, 
  getProveedores 
} from '../../Redux/Actions/purchaseActions';
import { getProducts } from '../../Redux/Actions/productActions';
import { getCategories } from '../../Redux/Actions/categoryActions';
import ProductForm from '../Products/ProductForm'; // ✅ IMPORTAR EL COMPONENTE QUE FUNCIONA
import { createProduct } from '../../Redux/Actions/productActions';

const PurchaseOrderForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    proveedorId: '',
    fechaCompra: new Date().toISOString().split('T')[0],
    numeroFactura: '',
    metodoPago: 'efectivo',
    fechaVencimiento: '',
    notas: '',
    impuestos: 0,
    descuentos: 0
  });

  const [items, setItems] = useState([{
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
  }]);

  const [comprobante, setComprobante] = useState(null);

  // ✅ NUEVOS ESTADOS PARA EL MODAL DE PRODUCTO
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);

  // ✅ NUEVOS ESTADOS PARA BÚSQUEDA DE PRODUCTOS
  const [productSearchTerms, setProductSearchTerms] = useState({});
  const [showProductDropdowns, setShowProductDropdowns] = useState({});

  useEffect(() => {
    loadInitialData();
  }, []);

  // ✅ Efecto para cerrar dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar todos los dropdowns si el clic es fuera de ellos
      if (!event.target.closest('.product-search-container')) {
        setShowProductDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar proveedores
      const proveedoresResponse = await dispatch(getProveedores());
      if (proveedoresResponse.error === false) {
        setProveedores(proveedoresResponse.data.proveedores || []);
      }

      // Cargar productos
      const productsResponse = await dispatch(getProducts());
      if (productsResponse.error === false) {
        setProducts(productsResponse.data || []);
      }

      // Cargar categorías
      const categoriesResponse = await dispatch(getCategories());
      if (categoriesResponse.error === false) {
        setCategories(categoriesResponse.data || []);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Si se selecciona un producto existente, llenar automáticamente algunos campos
    if (field === 'productId' && value) {
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          productName: selectedProduct.name,
          productSku: selectedProduct.sku,
          productDescription: selectedProduct.description || '',
          categoryId: selectedProduct.categoryId,
          precioVentaSugerido: selectedProduct.price,
          precioDistribuidorSugerido: selectedProduct.distributorPrice || 0,
          stockMinimo: selectedProduct.minStock || 5,
          isNewProduct: false
        };
      }
    }

    // ✅ VALIDACIÓN DE SKU: Si el usuario ingresa un SKU, verificar si ya existe
    if (field === 'productSku' && value && value.trim()) {
      const existingProduct = products.find(p => 
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
          // Cargar todos los datos del producto existente
          updatedItems[index] = {
            ...updatedItems[index],
            productId: existingProduct.id,
            productName: existingProduct.name,
            productSku: existingProduct.sku,
            productDescription: existingProduct.description || '',
            categoryId: existingProduct.categoryId,
            precioVentaSugerido: existingProduct.price,
            precioDistribuidorSugerido: existingProduct.distributorPrice || 0,
            stockMinimo: existingProduct.minStock || 5,
            isNewProduct: false
          };
          
          // También actualizar el término de búsqueda para mostrar el producto seleccionado
          setProductSearchTerms(prev => ({
            ...prev,
            [index]: existingProduct.name
          }));
          
          alert(`✅ Datos del producto "${existingProduct.name}" cargados automáticamente.`);
        } else {
          // El usuario prefiere crear un producto nuevo con este SKU
          alert(
            `⚠️ ATENCIÓN: Estás creando un producto nuevo con un SKU que ya existe.\n\n` +
            `Esto puede causar confusión en el inventario. Te recomendamos:\n` +
            `• Usar un SKU diferente y único\n` +
            `• O cargar el producto existente si es el mismo\n\n` +
            `Si continúas, asegúrate de que realmente necesitas un producto diferente con el mismo SKU.`
          );
        }
      }
    }

    // Si se marca como nuevo producto, limpiar productId
    if (field === 'isNewProduct' && value) {
      updatedItems[index].productId = '';
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, {
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
    }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + parseFloat(formData.impuestos || 0) - parseFloat(formData.descuentos || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.proveedorId) {
      alert('Debe seleccionar un proveedor');
      return;
    }

    if (items.some(item => !item.productName || item.cantidad <= 0 || item.precioUnitario <= 0)) {
      alert('Todos los items deben tener nombre, cantidad y precio válidos');
      return;
    }

    // ✅ VALIDACIÓN ESPECIAL PARA PRODUCTOS NUEVOS
    const newProducts = items.filter(item => item.isNewProduct);
    if (newProducts.length > 0) {
      for (const item of newProducts) {
        if (!item.categoryId) {
          alert(`El producto "${item.productName}" necesita una categoría asignada. Por favor selecciona una categoría.`);
          return;
        }
        if (!item.productSku) {
          alert(`El producto "${item.productName}" necesita un SKU. Por favor ingresa un código único.`);
          return;
        }
        
        // ✅ VALIDACIÓN FINAL DE SKU: Verificar que no exista en la base de datos
        const existingProduct = products.find(p => 
          p.sku && p.sku.toLowerCase() === item.productSku.toLowerCase()
        );
        
        if (existingProduct) {
          const shouldContinue = window.confirm(
            `⚠️ CONFLICTO DE SKU DETECTADO\n\n` +
            `El SKU "${item.productSku}" ya existe en el sistema:\n` +
            `• Producto existente: "${existingProduct.name}"\n` +
            `• Precio actual: $${existingProduct.price?.toLocaleString('es-CO')}\n\n` +
            `Producto que intentas crear: "${item.productName}"\n\n` +
            `¿Estás seguro de que quieres crear un producto nuevo con el mismo SKU?\n` +
            `Esto puede causar problemas de inventario y confusión.`
          );
          
          if (!shouldContinue) {
            alert('Operación cancelada. Por favor revisa los SKUs antes de continuar.');
            return;
          }
        }
        
        // ✅ VALIDACIÓN INTERNA: Verificar que no haya SKUs duplicados dentro de la misma orden
        const skuCount = items.filter(otherItem => 
          otherItem.productSku && 
          otherItem.productSku.toLowerCase() === item.productSku.toLowerCase()
        ).length;
        
        if (skuCount > 1) {
          alert(
            `❌ ERROR: SKU DUPLICADO EN LA ORDEN\n\n` +
            `El SKU "${item.productSku}" aparece ${skuCount} veces en esta orden.\n` +
            `Cada producto debe tener un SKU único.\n\n` +
            `Por favor corrige los SKUs duplicados antes de continuar.`
          );
          return;
        }
      }
    }

    try {
      setLoading(true);

      // ✅ PREPARAR DATOS CORREGIDOS
      const orderData = {
        proveedorId: formData.proveedorId,
        fechaCompra: formData.fechaCompra,
        numeroFactura: formData.numeroFactura || '',
        metodoPago: formData.metodoPago,
        fechaVencimiento: formData.fechaVencimiento || null,
        notas: formData.notas || '',
        impuestos: parseFloat(formData.impuestos) || 0,
        descuentos: parseFloat(formData.descuentos) || 0,
        items: items.map(item => ({
          productId: item.isNewProduct ? null : (item.productId || null),
          productName: item.productName,
          productSku: item.productSku || `AUTO-${Date.now()}`,
          productDescription: item.productDescription || '',
          categoryId: item.categoryId || null,
          cantidad: parseInt(item.cantidad),
          precioUnitario: parseFloat(item.precioUnitario),
          precioVentaSugerido: parseFloat(item.precioVentaSugerido) || null,
          precioDistribuidorSugerido: parseFloat(item.precioDistribuidorSugerido) || null,
          stockMinimo: parseInt(item.stockMinimo) || 5,
          isNewProduct: item.isNewProduct,
          notas: item.notas || ''
        }))
      };

      console.log('✅ Datos de orden corregidos:', orderData);

      const response = await dispatch(createPurchaseOrder(orderData));
      
      if (response.error === false) {
        alert('Orden de compra creada exitosamente');
        onSuccess && onSuccess();
        onClose && onClose();
      } else {
        alert('Error al crear orden: ' + (response.message || 'Error desconocido'));
      }

    } catch (error) {
      console.error('Error al crear orden:', error);
      alert('Error al crear orden: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  // ✅ NUEVA FUNCIÓN: Abrir modal para crear producto
  const handleCreateNewProduct = (itemIndex) => {
    const item = items[itemIndex];
    setCurrentItemIndex(itemIndex);
    setShowProductModal(true);
  };

  // ✅ FUNCIÓN: Manejar producto creado desde ProductForm - REVERTIR A LA LÓGICA SIMPLE
  const handleProductFormSubmit = async (productData, files) => {
    try {
      setLoading(true);
      
      // Crear el producto usando la misma lógica que ProductManager
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

      console.log('🆕 Creando producto desde orden de compra');
      
      const response = await dispatch(createProduct(formDataToSend));
      
      if (response.error === false) {
        const newProduct = response.data;
        
        // Actualizar el item actual con los datos del producto creado
        if (currentItemIndex !== null) {
          const updatedItems = [...items];
          updatedItems[currentItemIndex] = {
            ...updatedItems[currentItemIndex],
            productId: newProduct.id,
            productName: newProduct.name,
            productSku: newProduct.sku,
            productDescription: newProduct.description || '',
            categoryId: newProduct.categoryId,
            precioVentaSugerido: newProduct.price,
            precioDistribuidorSugerido: newProduct.distributorPrice || 0,
            stockMinimo: newProduct.minStock || 5,
            isNewProduct: false // Ya no es nuevo, ya existe en la BD
          };
          setItems(updatedItems);
        }
        
        // Actualizar la lista de productos disponibles
        await loadInitialData();
        
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

  // ✅ FUNCIÓN AUXILIAR: Verificar si un SKU ya existe
  const checkSkuExists = (sku) => {
    if (!sku || !sku.trim()) return null;
    return products.find(p => p.sku && p.sku.toLowerCase() === sku.toLowerCase());
  };

  // ✅ FUNCIÓN AUXILIAR: Verificar si hay SKUs duplicados en la orden actual
  const checkDuplicateSkuInOrder = (sku, currentIndex) => {
    if (!sku || !sku.trim()) return false;
    return items.some((item, index) => 
      index !== currentIndex && 
      item.productSku && 
      item.productSku.toLowerCase() === sku.toLowerCase()
    );
  };

  // ✅ FUNCIÓN: Obtener datos iniciales para el ProductForm
  const getInitialProductData = () => {
    if (currentItemIndex !== null) {
      const item = items[currentItemIndex];
      return {
        sku: item.productSku || '',
        name: item.productName || '',
        description: item.productDescription || '',
        purchasePrice: item.precioUnitario || 0,
        price: item.precioVentaSugerido || 0,
        distributorPrice: item.precioDistribuidorSugerido || 0,
        stock: item.cantidad || 0, // Stock inicial será la cantidad del pedido
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

  // ✅ NUEVAS FUNCIONES PARA BÚSQUEDA DE PRODUCTOS
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
    if (!searchTerm) return products;
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const selectProduct = (index, product) => {
    // Llenar datos del producto seleccionado
    handleItemChange(index, 'productId', product.id);
    
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  Nueva Orden de Compra
                </h3>
                <p className="text-sm text-gray-600">
                  Complete la información para crear una nueva orden de compra
                </p>
              </div>

              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor *
                  </label>
                  <select
                    name="proveedorId"
                    value={formData.proveedorId}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(proveedor => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre} {proveedor.nit && `(${proveedor.nit})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Compra
                  </label>
                  <input
                    type="date"
                    name="fechaCompra"
                    value={formData.fechaCompra}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Factura
                  </label>
                  <input
                    type="text"
                    name="numeroFactura"
                    value={formData.numeroFactura}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Número de factura del proveedor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago
                  </label>
                  <select
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Contado">Contado</option>
                    <option value="15 días">15 días</option>
                    <option value="30 días">30 días</option>
                    <option value="45 días">45 días</option>
                    <option value="60 días">60 días</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Items de la Orden
                  </h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    + Agregar Item
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {items.map((item, index) => (
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
                          
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              🗑️ Eliminar
                            </button>
                          )}
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
                          
                          {item.isNewProduct && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs text-blue-800">
                                💡 <strong>Tip:</strong> Usa "Crear Producto Completo" para acceder al formulario avanzado con imágenes, categorías, subcategorías y todas las opciones disponibles.
                              </p>
                            </div>
                          )}
                        </div>

                        {!item.isNewProduct && (
                          <div className="relative product-search-container">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Buscar Producto Existente
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={productSearchTerms[index] || ''}
                                onChange={(e) => handleProductSearch(index, e.target.value)}
                                onFocus={() => setShowProductDropdowns(prev => ({ ...prev, [index]: true }))}
                                className={`w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                  item.productId ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                }`}
                                placeholder="Buscar por nombre, SKU o descripción..."
                              />
                              {item.productId && (
                                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-green-600">
                                  ✓
                                </div>
                              )}
                              {productSearchTerms[index] && (
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
                                        <p className="text-sm font-medium text-indigo-600">
                                          ${product.price?.toLocaleString('es-CO')}
                                        </p>
                                        <p className="text-xs text-gray-500">Stock: {product.stock || 0}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {getFilteredProducts(index).length > 10 && (
                                  <div className="px-4 py-2 text-center text-sm text-gray-500 bg-gray-50">
                                    Mostrando 10 de {getFilteredProducts(index).length} resultados. Refina tu búsqueda.
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Mensaje cuando no hay resultados */}
                            {showProductDropdowns[index] && getFilteredProducts(index).length === 0 && productSearchTerms[index] && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                <div className="px-4 py-3 text-center text-gray-500">
                                  No se encontraron productos que coincidan con "{productSearchTerms[index]}"
                                </div>
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                              item.productId && !item.isNewProduct 
                                ? 'border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed' 
                                : 'border-gray-300'
                            }`}
                            placeholder="Nombre del producto"
                            required
                          />
                          {item.productId && !item.isNewProduct && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <span className="mr-1">🔒</span>
                              Campo protegido. Los datos provienen del producto existente en el sistema.
                            </p>
                          )}
                        </div>

                        {/* ✅ MOSTRAR CATEGORÍA PARA PRODUCTOS NUEVOS */}
                        {item.isNewProduct && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Categoría * (Requerida para productos nuevos)
                            </label>
                            <select
                              value={item.categoryId}
                              onChange={(e) => handleItemChange(index, 'categoryId', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required={item.isNewProduct}
                            >
                              <option value="">Seleccionar categoría</option>
                              {categories.map(category => (
                                <optgroup key={category.id} label={category.name}>
                                  <option value={category.id}>{category.name}</option>
                                  {category.subcategories?.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                      └─ {sub.name}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                            {categories.length === 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                ⚠️ No hay categorías disponibles. 
                                <button
                                  type="button"
                                  onClick={() => window.open('/categorias', '_blank')}
                                  className="text-indigo-600 hover:text-indigo-800 underline ml-1"
                                >
                                  Crear categoría primero
                                </button>
                              </p>
                            )}
                          </div>
                        )}

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
                              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                // ✅ INDICADORES VISUALES PARA SKU CON ESTADO DESHABILITADO
                                item.productId && !item.isNewProduct ? 'border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed' :
                                !item.productSku ? 'border-gray-300' :
                                checkDuplicateSkuInOrder(item.productSku, index) ? 'border-red-500 bg-red-50' :
                                checkSkuExists(item.productSku) && item.isNewProduct ? 'border-yellow-500 bg-yellow-50' :
                                item.productSku && !item.isNewProduct ? 'border-green-500 bg-green-50' :
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
                              {item.productSku && !item.isNewProduct && !item.productId && !checkDuplicateSkuInOrder(item.productSku, index) && (
                                <span className="text-green-500" title="Producto existente seleccionado">✅</span>
                              )}
                            </div>
                          </div>
                          
                          {/* ✅ MENSAJES DE ESTADO DETALLADOS */}
                          {item.productSku && (
                            <div className="mt-1">
                              {item.productId && !item.isNewProduct && (
                                <p className="text-xs text-gray-500 flex items-center">
                                  <span className="mr-1">🔒</span>
                                  Campo protegido. El SKU corresponde al producto existente en el sistema.
                                </p>
                              )}
                              {!item.productId && checkDuplicateSkuInOrder(item.productSku, index) && (
                                <p className="text-xs text-red-600 flex items-center">
                                  <span className="mr-1">❌</span>
                                  Este SKU se repite en la orden actual. Cada producto debe tener un SKU único.
                                </p>
                              )}
                              {!item.productId && checkSkuExists(item.productSku) && item.isNewProduct && !checkDuplicateSkuInOrder(item.productSku, index) && (
                                <div className="text-xs text-yellow-700">
                                  <p className="flex items-center mb-1">
                                    <span className="mr-1">⚠️</span>
                                    Este SKU ya existe: "{checkSkuExists(item.productSku).name}"
                                  </p>
                                  <p className="text-yellow-600">
                                    💡 Se recomienda usar el producto existente o elegir un SKU diferente.
                                  </p>
                                </div>
                              )}
                              {item.productSku && !item.isNewProduct && !item.productId && !checkDuplicateSkuInOrder(item.productSku, index) && (
                                <p className="text-xs text-green-600 flex items-center">
                                  <span className="mr-1">✅</span>
                                  Producto existente vinculado correctamente.
                                </p>
                              )}
                            </div>
                          )}
                          
                          {item.isNewProduct && !item.productSku && (
                            <p className="text-xs text-gray-500 mt-1">
                              💡 El SKU debe ser único. Usa un código que no exista en tu inventario.
                            </p>
                          )}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {item.productId && !item.isNewProduct && (
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                              <span className="mr-1">�</span>
                              Precio base del producto. Puedes modificarlo si hubo aumentos o cambios del proveedor.
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Precio Distribuidor Sugerido
                            {item.productId && !item.isNewProduct && (
                              <span className="text-xs text-green-600 ml-2">(Autocompletado - Editable)</span>
                            )}
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.precioDistribuidorSugerido}
                            onChange={(e) => handleItemChange(index, 'precioDistribuidorSugerido', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {item.productId && !item.isNewProduct && (
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                              <span className="mr-1">🏪</span>
                              Precio para distribuidores. Ajústalo según las nuevas condiciones comerciales.
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Mínimo
                            {item.productId && !item.isNewProduct && (
                              <span className="text-xs text-green-600 ml-2">(Autocompletado - Editable)</span>
                            )}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={item.stockMinimo}
                            onChange={(e) => handleItemChange(index, 'stockMinimo', parseInt(e.target.value) || 5)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {item.productId && !item.isNewProduct && (
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                              <span className="mr-1">📦</span>
                              Stock mínimo actual. Puedes ajustarlo según tus necesidades de inventario.
                            </p>
                          )}
                        </div>

                        {/* Subtotal del item */}
                        <div className="md:col-span-3 text-right">
                          <span className="text-sm font-medium">
                            Subtotal: {formatPrice(item.cantidad * item.precioUnitario)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Impuestos
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="impuestos"
                      value={formData.impuestos}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descuentos
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="descuentos"
                      value={formData.descuentos}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatPrice(calculateSubtotal())}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-indigo-600">{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprobante y Notas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comprobante (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setComprobante(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos soportados: JPG, PNG, PDF
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Observaciones adicionales"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Orden'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
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
                
                {/* ✅ USAR EL PRODUCTFORM QUE YA FUNCIONA */}
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

export default PurchaseOrderForm;
         