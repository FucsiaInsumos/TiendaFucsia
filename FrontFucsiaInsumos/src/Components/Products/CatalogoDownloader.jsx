import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../Redux/Actions/productActions';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CatalogDownloader = ({ 
  className = "",
  buttonText = "Descargar Catálogo",
  compact = false 
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadStats, setDownloadStats] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  // Determinar qué campos mostrar según el rol
  const getVisibleFields = (userRole) => {
    const isOwnerOrAdmin = userRole === 'Owner' || userRole === 'Admin';
    
    return {
      // Campos básicos (siempre visibles)
      showBasicInfo: true,
      showCategory: true,
      showDescription: true,
      showTags: true,
      showAttributes: true,
      
      // ✅ CAMPOS SENSIBLES - SOLO PARA OWNER/ADMIN
      showStock: isOwnerOrAdmin,
      showMinStock: isOwnerOrAdmin,
      showStatus: isOwnerOrAdmin,
      
      // Precios según rol
      showRegularPrice: true,
      showPromotionPrice: true,
      showDistributorPrice: userRole === 'Distributor' || isOwnerOrAdmin,
      showPurchasePrice: isOwnerOrAdmin // Solo admin/owner ven precio de compra
    };
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
    const fieldsConfig = getVisibleFields(userRole); // ✅ USAR getVisibleFields EN LUGAR DE getPriceColumns
    
    return products.map(product => {
      const baseData = {
        'SKU': product.sku || '',
        'Nombre': product.name || '',
        'Descripción': product.description || '',
        'Categoría': product.category?.parentCategory?.name || product.category?.name || 'Sin categoría',
        'En Promoción': product.isPromotion ? 'Sí' : 'No',
        'Tags': formatTags(product.tags),
        'Atributos': formatAttributes(product.specificAttributes)
      };

      // ✅ SOLO AGREGAR CAMPOS SENSIBLES PARA OWNER/ADMIN
      if (fieldsConfig.showStock) {
        baseData['Stock Disponible'] = product.stock || 0;
      }
      
      if (fieldsConfig.showMinStock) {
        baseData['Stock Mínimo'] = product.minStock || 0;
      }
      
      if (fieldsConfig.showStatus) {
        baseData['Estado'] = product.isActive ? 'Activo' : 'Inactivo';
      }

      // Agregar precios según el rol
      const priceData = {};
      
      if (fieldsConfig.showRegularPrice) {
        priceData['Precio Regular'] = formatPrice(product.price);
      }
      
      if (fieldsConfig.showPromotionPrice && product.isPromotion && product.promotionPrice) {
        priceData['Precio Promoción'] = formatPrice(product.promotionPrice);
      }
      
      if (fieldsConfig.showDistributorPrice && product.distributorPrice) {
        priceData['Precio Distribuidor'] = formatPrice(product.distributorPrice);
      }
      
      if (fieldsConfig.showPurchasePrice) {
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

  // ✅ NUEVA FUNCIÓN - Generar datos según visibilidad de campos
  const generateDataForRole = (products, userRole) => {
    const fieldsConfig = getVisibleFields(userRole);
    
    return products.map(product => {
      const baseData = {
        'SKU': product.sku || '',
        'Nombre': product.name || '',
      };

      // Solo agregar descripción si está habilitada
      if (fieldsConfig.showDescription) {
        baseData['Descripción'] = product.description || '';
      }

      // Solo agregar categoría si está habilitada
      if (fieldsConfig.showCategory) {
        baseData['Categoría'] = product.category?.parentCategory?.name || product.category?.name || 'Sin categoría';
      }

      // ✅ CAMPOS SENSIBLES - SOLO PARA OWNER/ADMIN
      if (fieldsConfig.showStock) {
        baseData['Stock Disponible'] = product.stock || 0;
      }
      
      if (fieldsConfig.showMinStock) {
        baseData['Stock Mínimo'] = product.minStock || 0;
      }
      
      if (fieldsConfig.showStatus) {
        baseData['Estado'] = product.isActive ? 'Activo' : 'Inactivo';
      }

      // Agregar indicador de promoción
      baseData['En Promoción'] = product.isPromotion ? 'Sí' : 'No';

      // Agregar precios según el rol
      const priceData = {};
      
      if (fieldsConfig.showRegularPrice) {
        priceData['Precio Regular'] = formatPrice(product.price);
      }
      
      if (fieldsConfig.showPromotionPrice && product.isPromotion && product.promotionPrice) {
        priceData['Precio Promoción'] = formatPrice(product.promotionPrice);
      }
      
      if (fieldsConfig.showDistributorPrice && product.distributorPrice) {
        priceData['Precio Distribuidor'] = formatPrice(product.distributorPrice);
      }
      
      if (fieldsConfig.showPurchasePrice) {
        priceData['Precio Compra'] = formatPrice(product.purchasePrice);
        // Calcular margen de ganancia para admin/owner
        const margin = product.price && product.purchasePrice 
          ? (((parseFloat(product.price) - parseFloat(product.purchasePrice)) / parseFloat(product.price)) * 100).toFixed(2) + '%'
          : '';
        priceData['Margen (%)'] = margin;
      }

      // Solo agregar tags si está habilitado
      if (fieldsConfig.showTags) {
        baseData['Tags'] = formatTags(product.tags);
      }

      // Solo agregar atributos si está habilitado
      if (fieldsConfig.showAttributes) {
        baseData['Atributos'] = formatAttributes(product.specificAttributes);
      }

      return { ...baseData, ...priceData };
    });
  };

  // ✅ NUEVA FUNCIÓN - Generar PDF
  const generatePDF = (products, userRole) => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const fieldsConfig = getVisibleFields(userRole);
    
    // Header del documento - LIMPIO Y SIMPLE
    doc.setFontSize(18);
    doc.setTextColor(70, 130, 180);
    doc.text('CATALOGO DE PRODUCTOS - TIENDA FUCSIA', 20, 20);
    
    // Información del usuario - SIN ICONOS
    const userInfo = getUserInfo();
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleDateString('es-CO');
    doc.text(`${userInfo.label} - ${dateStr}`, 20, 30);
    
    // ✅ VERIFICAR SI autoTable ESTÁ DISPONIBLE
    if (typeof doc.autoTable === 'function') {
      // Preparar datos para la tabla
      const tableData = products.map(product => {
        const row = [];
        row.push(product.sku || '');
        row.push(product.name || '');
        
        if (fieldsConfig.showCategory) {
          row.push(product.category?.parentCategory?.name || product.category?.name || 'Sin categoria');
        }
        
        if (fieldsConfig.showRegularPrice) {
          row.push(formatPrice(product.price));
        }
        
        if (fieldsConfig.showPromotionPrice) {
          row.push(product.isPromotion && product.promotionPrice ? formatPrice(product.promotionPrice) : '-');
        }
        
        if (fieldsConfig.showDistributorPrice) {
          row.push(product.distributorPrice ? formatPrice(product.distributorPrice) : '-');
        }
        
        if (fieldsConfig.showStock) {
          row.push(product.stock?.toString() || '0');
        }
        
        if (fieldsConfig.showStatus) {
          row.push(product.isActive ? 'Activo' : 'Inactivo');
        }
        
        return row;
      });
      
      // Definir columnas
      const columns = [];
      columns.push('SKU');
      columns.push('Nombre');
      
      if (fieldsConfig.showCategory) columns.push('Categoria');
      if (fieldsConfig.showRegularPrice) columns.push('Precio');
      if (fieldsConfig.showPromotionPrice) columns.push('Promocion');
      if (fieldsConfig.showDistributorPrice) columns.push('Distribuidor');
      if (fieldsConfig.showStock) columns.push('Stock');
      if (fieldsConfig.showStatus) columns.push('Estado');
      
      // Generar tabla limpia
      doc.autoTable({
        head: [columns],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8, // ✅ REDUCIR FUENTE PARA MÁS ESPACIO
          cellPadding: 2, // ✅ REDUCIR PADDING PARA MÁS ESPACIO
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: {
          fillColor: [70, 130, 180],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'left' },   // SKU - mantener
          1: { cellWidth: 55, halign: 'left' },   // ✅ Nombre - más ancho (45 -> 55)
          2: { cellWidth: 35, halign: 'left' },   // ✅ Categoria - más ancho (30 -> 35)
          3: { cellWidth: 30, halign: 'right' },  // ✅ Precio - más ancho (25 -> 30)
          4: { cellWidth: 30, halign: 'right' },  // ✅ Promocion - más ancho (25 -> 30)
          5: { cellWidth: 30, halign: 'right' },  // ✅ Distribuidor - más ancho (25 -> 30)
          6: { cellWidth: 18, halign: 'center' }, // Stock - mantener
          7: { cellWidth: 18, halign: 'center' }  // Estado - mantener
        },
        margin: { top: 40, left: 10, right: 10, bottom: 20 }, // ✅ REDUCIR MÁRGENES (15 -> 10)
        pageBreak: 'auto',
        showHead: 'everyPage',
        theme: 'grid'
      });
      
      // ✅ SIN FOOTER - CÓDIGO COMENTADO ESTÁ PERFECTO
      
    } else {
      // ✅ FALLBACK simple para cuando autoTable no está disponible
      console.warn('autoTable no disponible, generando PDF simple');
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Lista de Productos:', 20, 50);
      
      let yPosition = 65;
      const pageHeight = doc.internal.pageSize.height;
      const maxYPosition = pageHeight - 30;
      
      products.slice(0, 40).forEach((product, index) => {
        if (yPosition > maxYPosition) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(10);
        doc.text(`${index + 1}. ${product.sku} - ${product.name}`, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(9);
        doc.text(`Precio: ${formatPrice(product.price)}`, 25, yPosition);
        
        if (fieldsConfig.showStock) {
          doc.text(`Stock: ${product.stock || 0}`, 120, yPosition);
        }
        
        yPosition += 8;
      });
    }
    
    return doc;
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

      // Generar nombre del archivo
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const roleStr = user?.role === 'Distributor' ? '_Distribuidor' : 
                     user?.role === 'Customer' ? '_Cliente' : '';

      if (downloadFormat === 'pdf') {
        try {
          const doc = generatePDF(products, user?.role);
          const fileName = `Catalogo_Fucsia${roleStr}_${dateStr}.pdf`;
          doc.save(fileName);
          console.log(`✅ Catálogo PDF descargado: ${fileName}`);
        } catch (pdfError) {
          console.error('Error generando PDF:', pdfError);
          // ✅ FALLBACK: Si falla PDF, sugerir Excel
          if (window.confirm('Error al generar PDF. ¿Deseas descargar en formato Excel en su lugar?')) {
            setDownloadFormat('excel');
            // Regenerar como Excel
            const excelData = generateDataForRole(products, user?.role);
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo de Productos');
            const fileName = `Catalogo_Fucsia${roleStr}_${dateStr}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            console.log(`✅ Catálogo Excel descargado (fallback): ${fileName}`);
          }
          return;
        }
      } else {
        const excelData = generateDataForRole(products, user?.role);
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        const colWidths = [
          { wch: 15 }, { wch: 30 }, { wch: 40 }, { wch: 20 },
          { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 },
          { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
          { wch: 15 }, { wch: 30 }, { wch: 40 }
        ];
        worksheet['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo de Productos');
        const fileName = `Catalogo_Fucsia${roleStr}_${dateStr}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        console.log(`✅ Catálogo Excel descargado: ${fileName}`);
      }
      
      // Mostrar estadísticas
      setDownloadStats({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        inStock: products.filter(p => p.stock > 0).length,
        onPromotion: products.filter(p => p.isPromotion).length,
        format: downloadFormat,
        fileName: `Catalogo_Fucsia${roleStr}_${dateStr}.${downloadFormat === 'pdf' ? 'pdf' : 'xlsx'}`
      });
      
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
          icon: '',
          label: 'Distribuidor',
          description: 'Incluye precios especiales para distribuidores',
          color: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'Owner':
      case 'Admin':
        return {
          icon: '',
          label: 'Administrador',
          description: 'Incluye todos los precios y márgenes de ganancia',
          color: 'bg-purple-50 border-purple-200 text-purple-800'
        };
      default:
        return {
          icon: '',
          label: 'Cliente',
          description: 'Incluye precios de venta y productos disponibles',
          color: 'bg-blue-50 border-blue-200 text-blue-800'
        };
    }
  };

  const userInfo = getUserInfo();

  if (compact) {
    // ✅ VERSIÓN COMPACTA CON SELECTOR DE FORMATO
    return (
      <div className="flex items-center space-x-2">
        {/* Selector de formato */}
        <select
          value={downloadFormat}
          onChange={(e) => setDownloadFormat(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={isGenerating}
        >
          <option value="pdf">📄 PDF</option>
          <option value="excel">📊 Excel</option>
        </select>
        
        {/* Botón de descarga */}
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
              {downloadFormat === 'pdf' ? '📄' : '📊'}
              {buttonText}
            </>
          )}
        </button>
      </div>
    );
  }

  // ✅ VERSIÓN COMPLETA CON SELECTOR DE FORMATO
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
        
        <div className="flex items-center space-x-3">
          {/* Selector de formato */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Formato:</label>
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isGenerating}
            >
              <option value="pdf">📄 PDF</option>
              <option value="excel">📊 Excel</option>
            </select>
          </div>
          
          {/* Botón de descarga */}
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
                Generando {downloadFormat === 'pdf' ? 'PDF' : 'Excel'}...
              </>
            ) : (
              <>
                {downloadFormat === 'pdf' ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    <path d="M12,12L10,15H12.5L13.5,13.5L14.5,15H17L15,12L17,9H14.5L13.5,10.5L12.5,9H10L12,12Z" />
                  </svg>
                )}
                Descargar {downloadFormat === 'pdf' ? 'PDF' : 'Excel'}
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {userInfo.description}
        {(user?.role === 'Customer' || user?.role === 'Distributor') && (
          <span className="block mt-1 text-xs text-orange-600">
            ℹ️ La información de stock está oculta para preservar la confidencialidad del inventario.
          </span>
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">📋 Información incluida:</h4>
          <ul className="text-gray-600 space-y-1">
            <li>• SKU y nombre del producto</li>
            <li>• Descripción y categoría</li>
            {(user?.role === 'Owner' || user?.role === 'Admin') && (
              <>
                <li>• Stock disponible y mínimo</li>
                <li>• Estado de activación</li>
              </>
            )}
            <li>• Tags y atributos específicos</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">💰 Precios incluidos:</h4>
          <ul className="text-gray-600 space-y-1">
            {getVisibleFields(user?.role).showRegularPrice && <li>• Precio regular de venta</li>}
            {getVisibleFields(user?.role).showPromotionPrice && <li>• Precios en promoción</li>}
            {getVisibleFields(user?.role).showDistributorPrice && <li>• Precios para distribuidores</li>}
            {getVisibleFields(user?.role).showPurchasePrice && <li>• Precio de compra y margen</li>}
          </ul>
        </div>
      </div>

      {/* Estadísticas después de la descarga */}
      {downloadStats && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">
            ✅ Descarga completada ({downloadStats.format === 'pdf' ? 'PDF' : 'Excel'})
          </h4>
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