import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProveedores, getProducts } from '../../Redux/Actions/purchaseActions';
import axios from '../../utils/axios';

const EditPurchaseOrderModal = ({ order, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
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

  useEffect(() => {
    loadProveedores();
    loadProductos();
    initializeFormData();
  }, [order]);

  const initializeFormData = () => {
    if (order) {
      setFormData({
        proveedorId: order.proveedorId || '',
        fechaCompra: order.fechaCompra ? new Date(order.fechaCompra).toISOString().split('T')[0] : '',
        numeroFactura: order.numeroFactura || '',
        metodoPago: order.metodoPago || 'efectivo',
        fechaVencimiento: order.fechaVencimiento ? new Date(order.fechaVencimiento).toISOString().split('T')[0] : '',
        notas: order.notas || '',
        impuestos: order.impuestos || 0,
        descuentos: order.descuentos || 0,
        items: order.items ? order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productCode: item.productCode,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          precioVentaSugerido: item.precioVentaSugerido || 0,
          precioDistribuidorSugerido: item.precioDistribuidorSugerido || 0,
          cantidadRecibida: item.cantidadRecibida || 0
        })) : []
      });
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
        setProductos(response.data.products || []);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

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
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: '',
        productName: '',
        productCode: '',
        cantidad: 1,
        precioUnitario: 0,
        precioVentaSugerido: 0,
        precioDistribuidorSugerido: 0
      }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleProductSelect = (index, productId) => {
    const product = productos.find(p => p.id === parseInt(productId));
    if (product) {
      handleItemChange(index, 'productId', productId);
      handleItemChange(index, 'productName', product.name);
      handleItemChange(index, 'productCode', product.code);
      handleItemChange(index, 'precioUnitario', product.cost || 0);
      handleItemChange(index, 'precioVentaSugerido', product.price || 0);
      handleItemChange(index, 'precioDistribuidorSugerido', product.distributorPrice || 0);
    }
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

    try {
      setLoading(true);

      const response = await axios.put(`/purchase/orders/${order.id}`, {
        ...formData,
        subtotal: calculateSubtotal(),
        total: calculateTotal()
      });

      if (response.data.error === false) {
        alert('Orden actualizada exitosamente');
        onSuccess();
      } else {
        alert(response.data.message || 'Error al actualizar orden');
      }
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      alert('Error al actualizar la orden');
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

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Producto
                        </label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Seleccionar producto</option>
                          {productos.map(producto => (
                            <option key={producto.id} value={producto.id}>
                              {producto.name} ({producto.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                          min="1"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio Unitario
                        </label>
                        <input
                          type="number"
                          value={item.precioUnitario}
                          onChange={(e) => handleItemChange(index, 'precioUnitario', e.target.value)}
                          min="0"
                          step="0.01"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {item.cantidadRecibida > 0 && (
                      <div className="mt-2 text-sm text-green-600">
                        ✅ Cantidad ya recibida: {item.cantidadRecibida}
                      </div>
                    )}
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
    </div>
  );
};

export default EditPurchaseOrderModal;
