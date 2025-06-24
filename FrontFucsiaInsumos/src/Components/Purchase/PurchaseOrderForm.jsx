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
    metodoPago: 'Contado',
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

  useEffect(() => {
    loadInitialData();
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Producto Existente
                            </label>
                            <select
                              value={item.productId}
                              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Seleccionar producto</option>
                              {products.map(product => (
                                <option key={product.id} value={product.id}>
                                  {product.name} ({product.sku})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Producto *
                          </label>
                          <input
                            type="text"
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Nombre del producto"
                            required
                          />
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
                          </label>
                          <input
                            type="text"
                            value={item.productSku}
                            onChange={(e) => handleItemChange(index, 'productSku', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={item.isNewProduct ? "Código único requerido" : "Código del producto"}
                            required={item.isNewProduct}
                          />
                          {item.isNewProduct && (
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
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.precioVentaSugerido}
                            onChange={(e) => handleItemChange(index, 'precioVentaSugerido', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
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
         