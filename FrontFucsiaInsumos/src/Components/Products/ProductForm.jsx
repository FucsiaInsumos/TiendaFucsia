import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, categories, onSubmit, onCancel, user }) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    purchasePrice: '',
    price: '',
    distributorPrice: '', // Nuevo campo
    stock: '',
    minStock: '',
    isPromotion: false,
    isFacturable: false,
    promotionPrice: '',
    categoryId: '',
    tags: [],
    specificAttributes: {},
    isActive: true,
    image_url: product?.image_url || [],
    ...product
  });

  const [files, setFiles] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const isCashierEditing = user?.role === 'Cashier' && !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        purchasePrice: product.purchasePrice || '',
        price: product.price || '',
        distributorPrice: product.distributorPrice || '', // Nuevo campo
        stock: product.stock || '',
        minStock: product.minStock || '',
        isPromotion: product.isPromotion || false,
        isFacturable: product.isFacturable || false,
        promotionPrice: product.promotionPrice || '',
        categoryId: product.categoryId || '',
        tags: product.tags || [],
        specificAttributes: product.specificAttributes || {},
        image_url: product.image_url || []
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addAttribute = () => {
    if (attributeKey.trim() && attributeValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specificAttributes: {
          ...(prev.specificAttributes || {}), // Validación adicional
          [attributeKey.trim()]: attributeValue.trim()
        }
      }));
      setAttributeKey('');
      setAttributeValue('');
    }
  };

  const removeAttribute = (keyToRemove) => {
    setFormData(prev => {
      const newAttributes = { ...(prev.specificAttributes || {}) }; // Validación adicional
      delete newAttributes[keyToRemove];
      return {
        ...prev,
        specificAttributes: newAttributes
      };
    });
  };

  const removeImageUrl = (urlToRemove) => {
    setFormData(prev => ({
      ...prev,
      image_url: prev.image_url.filter(url => url !== urlToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.sku || !formData.name || !formData.categoryId || !formData.purchasePrice || !formData.price || formData.stock === '') {
      alert('Por favor completa todos los campos requeridos (SKU, Nombre, Categoría, Precios y Stock)');
      return;
    }
    if (formData.isFacturable) {
      if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
        alert('Los productos facturables requieren un precio de compra válido');
        return;
      }
    }

    // Validar que los precios sean números positivos
    if (parseFloat(formData.purchasePrice) < 0 || parseFloat(formData.price) < 0) {
      alert('Los precios deben ser números positivos');
      return;
    }

    // Validar que el stock sea un número no negativo
    if (parseInt(formData.stock) < 0) {
      alert('El stock no puede ser negativo');
      return;
    }

    // Limpiar y formatear datos antes de enviar
    const cleanedData = {
      ...formData,
      // Convertir strings vacíos a null para campos numéricos
      promotionPrice: formData.promotionPrice === '' ? null : formData.promotionPrice,
      minStock: formData.minStock === '' ? null : formData.minStock,
      // Asegurar que isPromotion sea boolean
      isPromotion: Boolean(formData.isPromotion),
      isFacturable: Boolean(formData.isFacturable),
    };

    console.log('Submitting form data:', cleanedData);
    console.log('Files to upload:', files);

    onSubmit(cleanedData, files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isCashierEditing ? (
        // SOLO imágenes para cashier editando
        <div>
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Imágenes del Producto
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />
            {/* Mostrar archivos seleccionados para subir */}
            {files.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Nuevas imágenes a subir:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Nueva imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = files.filter((_, i) => i !== index);
                          setFiles(newFiles);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {file.name.slice(0, 8)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Mostrar imágenes actuales */}
            {product && (formData.image_url || []).length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales del producto:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(formData.image_url || []).map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Producto imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FcnJvcjwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar imagen"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        Imagen {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                {(formData.image_url || []).length === 0 && (
                  <p className="text-sm text-gray-500 italic">No hay imágenes actuales</p>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Puedes subir múltiples imágenes. Formatos permitidos: JPG, PNG, WEBP. Tamaño máximo: 5MB por imagen.
            </p>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Actualizar imágenes
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="F00001"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción del producto"
            />
          </div>

          {/* Precios y stock */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Compra *
              </label>
              <input
                type="number"
                step="0.01"
                id="purchasePrice"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Venta *
              </label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="distributorPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio Distribuidor
              </label>
              <input
                type="number"
                step="0.01"
                id="distributorPrice"
                name="distributorPrice"
                value={formData.distributorPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Precio especial para distribuidores
              </p>
            </div>

            <div>
              <label htmlFor="promotionPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Promoción
              </label>
              <input
                type="number"
                step="0.01"
                id="promotionPrice"
                name="promotionPrice"
                value={formData.promotionPrice}
                onChange={handleChange}
                disabled={!formData.isPromotion}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="minStock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Mínimo
              </label>
              <input
                type="number"
                id="minStock"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPromotion"
                name="isPromotion"
                checked={formData.isPromotion}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="isPromotion" className="text-sm font-medium text-gray-700">
                En promoción
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFacturable"
                name="isFacturable"
                checked={formData.isFacturable}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="isFacturable" className="text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  📄 Producto Codificado
                  <span className="ml-1 text-xs text-gray-500" title="Si está marcado, este producto aparecerá en las facturas">
                    ℹ️
                  </span>
                </span>
              </label>
            </div>

          </div>


          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Añadir etiqueta"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Atributos específicos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Atributos Específicos
            </label>
            <div className="flex mb-2 space-x-2">
              <input
                type="text"
                value={attributeKey}
                onChange={(e) => setAttributeKey(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Clave (ej: curvature)"
              />
              <input
                type="text"
                value={attributeValue}
                onChange={(e) => setAttributeValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttribute())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Valor (ej: D)"
              />
              <button
                type="button"
                onClick={addAttribute}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                +
              </button>
            </div>
            <div className="space-y-1">
              {Object.entries(formData.specificAttributes || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                  <span className="text-sm"><strong>{key}:</strong> {value}</span>
                  <button
                    type="button"
                    onClick={() => removeAttribute(key)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Imágenes del Producto
            </label>

            {/* Subir nuevas imágenes */}
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />

            {/* Mostrar archivos seleccionados para subir */}
            {files.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Nuevas imágenes a subir:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Nueva imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = files.filter((_, i) => i !== index);
                          setFiles(newFiles);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {file.name.slice(0, 8)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mostrar imágenes actuales del producto */}
            {product && (formData.image_url || []).length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales del producto:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(formData.image_url || []).map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Producto imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FcnJvcjwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar imagen"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        Imagen {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                {(formData.image_url || []).length === 0 && (
                  <p className="text-sm text-gray-500 italic">No hay imágenes actuales</p>
                )}
              </div>
            )}

            {/* Información adicional */}
            <p className="text-xs text-gray-500 mt-2">
              Puedes subir múltiples imágenes. Formatos permitidos: JPG, PNG, WEBP. Tamaño máximo: 5MB por imagen.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              {product ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default ProductForm;
