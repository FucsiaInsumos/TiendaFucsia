import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../Redux/Actions/productActions';
import * as XLSX from 'xlsx';

const CatalogDownloader = ({ 
  className = "",
  buttonText = "Descargar Catálogo",
  compact = false 
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadStats, setDownloadStats] = useState(null);

  // Determinar qué precios mostrar según el rol
  const getPriceColumns = (userRole) => {
    switch (userRole) {
      case 'Distributor':
        return {
          showDistributorPrice: true,
          showRegularPrice: true,
          showPromotionPrice: true,
          showPurchasePrice: false // Los distribuidores no ven precio de compra
        };
      case 'Owner':
      case 'Admin':
        return {
          showDistributorPrice: true,
          showRegularPrice: true,
          showPromotionPrice: true,
          showPurchasePrice: true // Solo admin/owner ven todos los precios
        };
      case 'Customer':
      default:
        return {
          showDistributorPrice: false,
          showRegularPrice: true,
          showPromotionPrice: true,
          showPurchasePrice: false // Clientes solo ven precios de venta
        };
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  // Procesar atributos específicos para Excel
  const formatAttributes = (attributes) => {
    if (!attributes || typeof attributes !== 'object') return '';
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ');
  };

  // Procesar tags para Excel
  const formatTags = (tags) => {
    if (!tags || !Array.isArray(tags)) return '';
    return tags.join(', ');
  };

  // Generar datos para Excel según el rol
  const generateExcelData = (products, userRole) => {
    const priceConfig = getPriceColumns(userRole);
    
    return products.map(product => {
      const baseData = {
        'SKU': product.sku || '',
        'Nombre': product.name || '',
        'Descripción': product.description || '',
        'Categoría': product.category?.parentCategory?.name || product.category?.name || 'Sin categoría',
        'Stock Disponible': product.stock || 0,
        'Stock Mínimo': product.minStock || 0,
        'Estado': product.isActive ? 'Activo' : 'Inactivo',
        'En Promoción': product.isPromotion ? 'Sí' : 'No',
        'Tags': formatTags(product.tags),
        'Atributos': formatAttributes(product.specificAttributes)
      };

      // Agregar precios según el rol
      const priceData = {};
      
      if (priceConfig.showRegularPrice) {
        priceData['Precio Regular'] = formatPrice(product.price);
      }
      
      if (priceConfig.showPromotionPrice && product.isPromotion && product.promotionPrice) {
        priceData['Precio Promoción'] = formatPrice(product.promotionPrice);
      }
      
      if (priceConfig.showDistributorPrice && product.distributorPrice) {
        priceData['Precio Distribuidor'] = formatPrice(product.distributorPrice);
      }
      
      if (priceConfig.showPurchasePrice) {
        priceData['Precio Compra'] = formatPrice(product.purchasePrice);
        // Calcular margen de ganancia para admin/owner
        const margin = product.price && product.purchasePrice 
          ? (((parseFloat(product.price) - parseFloat(product.purchasePrice)) / parseFloat(product.price)) * 100).toFixed(2) + '%'
          : '';
        priceData['Margen (%)'] = margin;
      }

      return { ...baseData, ...priceData };
    });
  };

  // Función principal de descarga
  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Obtener todos los productos
      const response = await dispatch(getProducts());
      
      if (response.error) {
        throw new Error(response.message || 'Error al obtener productos');
      }

      const products = response.data || [];
      
      if (products.length === 0) {
        alert('No hay productos disponibles para descargar');
        return;
      }

      // Generar datos para Excel
      const excelData = generateExcelData(products, user?.role);
      
      // Crear libro de Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Configurar anchos de columna
      const colWidths = [
        { wch: 15 }, // SKU
        { wch: 30 }, // Nombre
        { wch: 40 }, // Descripción
        { wch: 20 }, // Categoría
        { wch: 15 }, // Stock Disponible
        { wch: 15 }, // Stock Mínimo
        { wch: 10 }, // Estado
        { wch: 15 }, // En Promoción
        { wch: 20 }, // Precio Regular
        { wch: 20 }, // Precio Promoción
        { wch: 20 }, // Precio Distribuidor
        { wch: 20 }, // Precio Compra
        { wch: 15 }, // Margen
        { wch: 30 }, // Tags
        { wch: 40 }  // Atributos
      ];
      worksheet['!cols'] = colWidths;

      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo de Productos');
      
      // Generar nombre del archivo
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const roleStr = user?.role === 'Distributor' ? '_Distribuidor' : '';
      const fileName = `Catalogo_Fucsia${roleStr}_${dateStr}.xlsx`;
      
      // Descargar archivo
      XLSX.writeFile(workbook, fileName);
      
      // Mostrar estadísticas
      setDownloadStats({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        inStock: products.filter(p => p.stock > 0).length,
        onPromotion: products.filter(p => p.isPromotion).length,
        fileName: fileName
      });

      console.log(`✅ Catálogo descargado: ${fileName} (${products.length} productos)`);
      
    } catch (error) {
      console.error('Error generando catálogo:', error);
      alert(`Error al generar el catálogo: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Obtener información del usuario para mostrar
  const getUserInfo = () => {
    const role = user?.role;
    switch (role) {
      case 'Distributor':
        return {
          icon: '💼',
          label: 'Distribuidor',
          description: 'Incluye precios especiales para distribuidores',
          color: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'Owner':
      case 'Admin':
        return {
          icon: '👑',
          label: 'Administrador',
          description: 'Incluye todos los precios y márgenes de ganancia',
          color: 'bg-purple-50 border-purple-200 text-purple-800'
        };
      default:
        return {
          icon: '👤',
          label: 'Cliente',
          description: 'Incluye precios de venta y productos disponibles',
          color: 'bg-blue-50 border-blue-200 text-blue-800'
        };
    }
  };

  const userInfo = getUserInfo();

if (compact) {
  // Versión compacta (botón rectangular con icono + texto)
  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generando...
        </>
      ) : (
        <>
          {/* ✅ ICONO DE EXCEL AL LADO DEL TEXTO */}
        
          {buttonText}
        </>
      )}
    </button>
  );
}

  // Versión completa (con tarjeta)
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📊 Descargar Catálogo de Productos
          </h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${userInfo.color}`}>
            <span className="mr-1">{userInfo.icon}</span>
            {userInfo.label}
          </div>
        </div>
        
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando Excel...
            </>
          ) : (
           <>
            {/* ✅ ICONO DE EXCEL AGREGADO */}
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              <path d="M12,12L10,15H12.5L13.5,13.5L14.5,15H17L15,12L17,9H14.5L13.5,10.5L12.5,9H10L12,12Z" />
            </svg>
            Descargar Excel
          </>
          )}
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {userInfo.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">📋 Información incluida:</h4>
          <ul className="text-gray-600 space-y-1">
            <li>• SKU y nombre del producto</li>
            <li>• Descripción y categoría</li>
            <li>• Stock disponible y mínimo</li>
            <li>• Estado de activación</li>
            <li>• Tags y atributos específicos</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">💰 Precios incluidos:</h4>
          <ul className="text-gray-600 space-y-1">
            {getPriceColumns(user?.role).showRegularPrice && <li>• Precio regular de venta</li>}
            {getPriceColumns(user?.role).showPromotionPrice && <li>• Precios en promoción</li>}
            {getPriceColumns(user?.role).showDistributorPrice && <li>• Precios para distribuidores</li>}
            {getPriceColumns(user?.role).showPurchasePrice && <li>• Precio de compra y margen</li>}
          </ul>
        </div>
      </div>

      {/* Estadísticas después de la descarga */}
      {downloadStats && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">✅ Descarga completada</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-700">
            <div>
              <span className="font-medium">{downloadStats.totalProducts}</span>
              <br />Productos totales
            </div>
            <div>
              <span className="font-medium">{downloadStats.activeProducts}</span>
              <br />Productos activos
            </div>
            <div>
              <span className="font-medium">{downloadStats.inStock}</span>
              <br />Con stock
            </div>
            <div>
              <span className="font-medium">{downloadStats.onPromotion}</span>
              <br />En promoción
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            Archivo generado: <code>{downloadStats.fileName}</code>
          </p>
        </div>
      )}
    </div>
  );
};

export default CatalogDownloader;