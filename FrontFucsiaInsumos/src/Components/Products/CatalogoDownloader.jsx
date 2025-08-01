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
  const [includeImages, setIncludeImages] = useState(true);

  // ✅ CORREGIDO: Función para procesar imágenes del producto
  const processProductImages = (product) => {
    let imageUrl = '';
    
    // ✅ PRIMER LUGAR: Buscar en image_url (tu campo actual en la BD)
    if (product.image_url && Array.isArray(product.image_url) && product.image_url.length > 0) {
      // Si image_url es un array con elementos, tomar el primero
      imageUrl = product.image_url.find(url => url && typeof url === 'string' && url.trim() !== '');
    } else if (product.image_url && typeof product.image_url === 'string' && product.image_url.trim() !== '') {
      // Si image_url es una string directa
      imageUrl = product.image_url.trim();
    }
    
    // ✅ SEGUNDO LUGAR: Buscar en images (campo alternativo)
    else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = product.images.find(url => url && typeof url === 'string' && url.trim() !== '');
    }
    
    // ✅ TERCER LUGAR: Buscar en image (campo único)
    else if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
      imageUrl = product.image.trim();
    }
    
    // ✅ CUARTO LUGAR: Buscar en imageUrl
    else if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '') {
      imageUrl = product.imageUrl.trim();
    }

    // ✅ NO MODIFICAR URLs de Cloudinary - ya son absolutas
    if (imageUrl && !imageUrl.startsWith('http')) {
      // Solo agregar base URL si la imagen no es de Cloudinary
      imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    return {
      hasImage: !!imageUrl,
      imageUrl: imageUrl,
      imageName: imageUrl ? imageUrl.split('/').pop().split('?')[0] : 'sin-imagen.jpg' // Remover query params
    };
  };

  // ✅ MEJORADO: Función para cargar imagen como Base64 para PDF
  const loadImageAsBase64 = async (imageUrl) => {
    return new Promise((resolve) => {
      if (!imageUrl) {
        console.warn('No hay URL de imagen para cargar');
        resolve(null);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // ✅ TIMEOUT para evitar que se cuelgue
      const timeout = setTimeout(() => {
        console.warn(`Timeout cargando imagen: ${imageUrl}`);
        resolve(null);
      }, 10000); // 10 segundos
      
      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Redimensionar imagen para miniatura
          const size = 40;
          canvas.width = size;
          canvas.height = size;
          
          // Dibujar imagen redimensionada manteniendo proporción
          const aspectRatio = img.width / img.height;
          let drawWidth = size;
          let drawHeight = size;
          let offsetX = 0;
          let offsetY = 0;
          
          if (aspectRatio > 1) {
            // Imagen más ancha que alta
            drawHeight = size / aspectRatio;
            offsetY = (size - drawHeight) / 2;
          } else {
            // Imagen más alta que ancha
            drawWidth = size * aspectRatio;
            offsetX = (size - drawWidth) / 2;
          }
          
          // Fondo blanco
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, size, size);
          
          // Dibujar imagen
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          // Convertir a base64
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          console.log(`✅ Imagen cargada correctamente: ${imageUrl.substring(0, 50)}...`);
          resolve(dataURL);
        } catch (error) {
          clearTimeout(timeout);
          console.error('Error procesando imagen en canvas:', error);
          resolve(null);
        }
      };
      
      img.onerror = (error) => {
        clearTimeout(timeout);
        console.warn(`Error cargando imagen: ${imageUrl}`, error);
        resolve(null);
      };
      
      // ✅ AGREGAR HEADERS PARA CLOUDINARY
      try {
        img.src = imageUrl;
      } catch (error) {
        clearTimeout(timeout);
        console.error('Error estableciendo src de imagen:', error);
        resolve(null);
      }
    });
  };

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
      showImages: includeImages,
      
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


  // Formatear precio para PDF (con $)
  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  // Formatear precio como número puro para Excel
  const formatPriceNumber = (price) => {
    if (!price) return '';
    return Number(price);
  };

const formatAttributes = (attributes) => {
  // ✅ VERIFICAR si es un objeto válido y no vacío
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return '';
  }
  
  // ✅ FILTRAR campos que NO queremos mostrar en Excel
  const excludedFields = [
    'hasImage', 
    'imageUrl', 
    'imageName', 
    'originalData',
    'categoria', 
    'subcategoria',
    'facturable' // Si estos son campos internos que no quieres mostrar
  ];
  
  const validEntries = Object.entries(attributes)
    .filter(([key, value]) => {
      // Excluir campos específicos
      if (excludedFields.includes(key)) return false;
      
      // Excluir valores null, undefined o vacíos
      if (value === null || value === undefined || value === '') return false;
      
      // Excluir objetos complejos
      if (typeof value === 'object') return false;
      
      return true;
    })
    .map(([key, value]) => `${key}: ${value}`);
  
  return validEntries.length > 0 ? validEntries.join(' | ') : '';
};

// ✅ CORREGIDO: Procesar tags para Excel
const formatTags = (tags) => {
  // ✅ VERIFICAR si es un array válido
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return '';
  }
  
  // ✅ FILTRAR solo strings válidos
  const validTags = tags.filter(tag => 
    tag && 
    typeof tag === 'string' && 
    tag.trim() !== '' &&
    tag !== 'con-imagen' && // ✅ EXCLUIR tags internos
    tag !== 'hasImage'
  );
  
  return validTags.length > 0 ? validTags.join(', ') : '';
};


  // Generar datos para Excel según el rol (precios como número)
  const generateExcelData = (products, userRole) => {
    const fieldsConfig = getVisibleFields(userRole);
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

      // Agregar precios como número
      const priceData = {};
      if (fieldsConfig.showRegularPrice) {
        priceData['Precio Regular'] = formatPriceNumber(product.price);
      }
      if (fieldsConfig.showPromotionPrice && product.isPromotion && product.promotionPrice) {
        priceData['Precio Promoción'] = formatPriceNumber(product.promotionPrice);
      }
      if (fieldsConfig.showDistributorPrice && product.distributorPrice) {
        priceData['Precio Distribuidor'] = formatPriceNumber(product.distributorPrice);
      }
      if (fieldsConfig.showPurchasePrice) {
        priceData['Precio Compra'] = formatPriceNumber(product.purchasePrice);
        // Calcular margen de ganancia para admin/owner
        const margin = product.price && product.purchasePrice 
          ? (((parseFloat(product.price) - parseFloat(product.purchasePrice)) / parseFloat(product.price)) * 100).toFixed(2) + '%'
          : '';
        priceData['Margen (%)'] = margin;
      }
      return { ...baseData, ...priceData };
    });
  };

  // ✅ NUEVA FUNCIÓN - Generar datos según visibilidad de campos (Excel: precios como número)
const generateDataForRole = (products, userRole) => {
  const fieldsConfig = getVisibleFields(userRole);
  return products.map(product => {
    const baseData = {
      'SKU': product.sku || '',
      'Nombre': product.name || '',
    };
    if (fieldsConfig.showDescription) {
      baseData['Descripción'] = product.description || '';
    }
    if (fieldsConfig.showCategory) {
      baseData['Categoría'] = product.category?.parentCategory?.name || product.category?.name || 'Sin categoría';
    }
    if (fieldsConfig.showStock) {
      baseData['Stock Disponible'] = product.stock || 0;
    }
    if (fieldsConfig.showMinStock) {
      baseData['Stock Mínimo'] = product.minStock || 0;
    }
    if (fieldsConfig.showStatus) {
      baseData['Estado'] = product.isActive ? 'Activo' : 'Inactivo';
    }
    baseData['En Promoción'] = product.isPromotion ? 'Sí' : 'No';
    const priceData = {};
    if (fieldsConfig.showRegularPrice) {
      priceData['Precio Regular'] = formatPriceNumber(product.price);
    }
    if (fieldsConfig.showPromotionPrice && product.isPromotion && product.promotionPrice) {
      priceData['Precio Promoción'] = formatPriceNumber(product.promotionPrice);
    }
    if (fieldsConfig.showDistributorPrice && product.distributorPrice) {
      priceData['Precio Distribuidor'] = formatPriceNumber(product.distributorPrice);
    }
    if (fieldsConfig.showPurchasePrice) {
      priceData['Precio Compra'] = formatPriceNumber(product.purchasePrice);
      const margin = product.price && product.purchasePrice 
        ? (((parseFloat(product.price) - parseFloat(product.purchasePrice)) / parseFloat(product.price)) * 100).toFixed(2) + '%'
        : '';
      priceData['Margen (%)'] = margin;
    }
    if (fieldsConfig.showTags) {
      const formattedTags = formatTags(product.tags);
      if (formattedTags) {
        baseData['Tags'] = formattedTags;
      }
    }
    if (fieldsConfig.showAttributes) {
      const formattedAttributes = formatAttributes(product.specificAttributes);
      if (formattedAttributes) {
        baseData['Atributos'] = formattedAttributes;
      }
    }
    return { ...baseData, ...priceData };
  });
};

  // ✅ FUNCIÓN MEJORADA: Generar PDF con mejor manejo de imágenes
  const generatePDF = async (products, userRole) => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const fieldsConfig = getVisibleFields(userRole);
    
    // Header del documento
    doc.setFontSize(18);
    doc.setTextColor(70, 130, 180);
    doc.text('CATALOGO DE PRODUCTOS - TIENDA FUCSIA', 20, 20);
    
    // Información del usuario
    const userInfo = getUserInfo();
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleDateString('es-CO');
    doc.text(`${userInfo.label} - ${dateStr}`, 20, 30);
    
    if (typeof doc.autoTable === 'function') {
      const productsWithImages = [];
      let imagenesCorrectas = 0;
      let imagenesFallidas = 0;
      
      // ✅ MEJORADO: Cargar imágenes con mejor logging
      if (fieldsConfig.showImages) {
        console.log(`📸 Iniciando carga de imágenes para ${products.length} productos...`);
        
        for (const [index, product] of products.entries()) {
          const imageInfo = processProductImages(product);
          let imageBase64 = null;
          
          if (imageInfo.hasImage) {
            console.log(`📸 Cargando imagen ${index + 1}/${products.length}: ${imageInfo.imageUrl}`);
            try {
              imageBase64 = await loadImageAsBase64(imageInfo.imageUrl);
              if (imageBase64) {
                imagenesCorrectas++;
                console.log(`✅ Imagen ${index + 1} cargada correctamente`);
              } else {
                imagenesFallidas++;
                console.warn(`❌ Imagen ${index + 1} falló al cargar`);
              }
            } catch (error) {
              imagenesFallidas++;
              console.error(`❌ Error cargando imagen ${index + 1}:`, error);
            }
          }
          
          productsWithImages.push({
            ...product,
            imageBase64,
            imageInfo
          });
          
          // Mostrar progreso cada 10 productos
          if ((index + 1) % 10 === 0) {
            console.log(`📊 Progreso imágenes: ${index + 1}/${products.length} (${imagenesCorrectas} correctas, ${imagenesFallidas} fallidas)`);
          }
        }
        
        console.log(`📸 Carga de imágenes completada: ${imagenesCorrectas} correctas, ${imagenesFallidas} fallidas`);
      } else {
        productsWithImages.push(...products);
      }

      // Preparar datos para la tabla
      const tableData = productsWithImages.map(product => {
        const row = [];
        
        // ✅ Agregar placeholder para imagen si está habilitada
        if (fieldsConfig.showImages) {
          row.push(product.imageInfo?.hasImage ? '📷' : '📷❌'); // Indicador visual
        }
        
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
      if (fieldsConfig.showImages) columns.push('Imagen');
      columns.push('SKU');
      columns.push('Nombre');
      
      if (fieldsConfig.showCategory) columns.push('Categoria');
      if (fieldsConfig.showRegularPrice) columns.push('Precio');
      if (fieldsConfig.showPromotionPrice) columns.push('Promocion');
      if (fieldsConfig.showDistributorPrice) columns.push('Distribuidor');
      if (fieldsConfig.showStock) columns.push('Stock');
      if (fieldsConfig.showStatus) columns.push('Estado');
      
      // ✅ Configurar estilos de columna
      const columnStyles = {};
      let columnIndex = 0;
      
      if (fieldsConfig.showImages) {
        columnStyles[columnIndex] = { cellWidth: 20, halign: 'center' };
        columnIndex++;
      }
      
      columnStyles[columnIndex] = { cellWidth: 18, halign: 'left' };
      columnStyles[columnIndex + 1] = { cellWidth: fieldsConfig.showImages ? 45 : 55, halign: 'left' };
      
      let currentIndex = columnIndex + 2;
      if (fieldsConfig.showCategory) {
        columnStyles[currentIndex] = { cellWidth: 30, halign: 'left' };
        currentIndex++;
      }
      if (fieldsConfig.showRegularPrice) {
        columnStyles[currentIndex] = { cellWidth: 25, halign: 'right' };
        currentIndex++;
      }
      if (fieldsConfig.showPromotionPrice) {
        columnStyles[currentIndex] = { cellWidth: 25, halign: 'right' };
        currentIndex++;
      }
      if (fieldsConfig.showDistributorPrice) {
        columnStyles[currentIndex] = { cellWidth: 25, halign: 'right' };
        currentIndex++;
      }
      if (fieldsConfig.showStock) {
        columnStyles[currentIndex] = { cellWidth: 15, halign: 'center' };
        currentIndex++;
      }
      if (fieldsConfig.showStatus) {
        columnStyles[currentIndex] = { cellWidth: 15, halign: 'center' };
      }

      // ✅ MEJORADO: Generar tabla con imágenes
      doc.autoTable({
        head: [columns],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'left',
          minCellHeight: fieldsConfig.showImages ? 15 : 8 // Más altura para imágenes
        },
        headStyles: {
          fillColor: [70, 130, 180],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles,
        margin: { top: 40, left: 10, right: 10, bottom: 20 },
        pageBreak: 'auto',
        showHead: 'everyPage',
        theme: 'grid',
        // ✅ MEJORADO: Hook para agregar imágenes
        didDrawCell: function (data) {
          if (fieldsConfig.showImages && data.column.index === 0 && data.section === 'body') {
            const product = productsWithImages[data.row.index];
            if (product && product.imageBase64) {
              try {
                const cellWidth = data.cell.width;
                const cellHeight = data.cell.height;
                const imgSize = Math.min(cellWidth - 2, cellHeight - 2, 12); // Tamaño de imagen
                const x = data.cell.x + (cellWidth - imgSize) / 2;
                const y = data.cell.y + (cellHeight - imgSize) / 2;
                
                doc.addImage(product.imageBase64, 'JPEG', x, y, imgSize, imgSize);
              } catch (error) {
                console.warn('Error agregando imagen al PDF:', error);
                // Agregar texto alternativo
                doc.setFontSize(6);
                doc.text('IMG', data.cell.x + 2, data.cell.y + 8);
              }
            } else if (product && product.imageInfo?.hasImage) {
              // Si tenía imagen pero falló la carga, mostrar indicador
              doc.setFontSize(6);
              doc.setTextColor(255, 0, 0);
              doc.text('❌', data.cell.x + 8, data.cell.y + 8);
              doc.setTextColor(0, 0, 0);
            }
          }
        }
      });
      
      // ✅ Agregar estadísticas de imágenes al final del PDF
      if (fieldsConfig.showImages) {
        const finalY = doc.lastAutoTable.finalY || 40;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`📊 Estadísticas de imágenes: ${imagenesCorrectas} cargadas correctamente, ${imagenesFallidas} fallaron`, 20, finalY + 10);
      }
      
    } else {
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
        
        const imageInfo = processProductImages(product);
        
        doc.setFontSize(10);
        doc.text(`${index + 1}. ${product.sku} - ${product.name}`, 20, yPosition);
        yPosition += 6;
        
        doc.setFontSize(9);
        doc.text(`Precio: ${formatPrice(product.price)}`, 25, yPosition);
        
        if (fieldsConfig.showStock) {
          doc.text(`Stock: ${product.stock || 0}`, 120, yPosition);
        }
        
        if (fieldsConfig.showImages && imageInfo.hasImage) {
          doc.text(`📷 ${imageInfo.imageName}`, 180, yPosition);
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

      // ✅ DEBUG: Mostrar información de productos con imágenes (solo para PDF)
      console.log(' Análisis de productos:');
      console.log(`Total productos: ${products.length}`);
      
      let productosConImagenes = [];
      if (downloadFormat === 'pdf') {
        productosConImagenes = products.filter(p => {
          const info = processProductImages(p);
          return info.hasImage;
        });
        
        console.log(`Productos con imágenes: ${productosConImagenes.length}`);
        
        // Mostrar ejemplos de URLs de imágenes solo para PDF
        productosConImagenes.slice(0, 3).forEach((p, i) => {
          const info = processProductImages(p);
          console.log(`Ejemplo ${i + 1}: ${p.sku} - ${info.imageUrl}`);
        });
      }

      // Generar nombre del archivo
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const roleStr = user?.role === 'Distributor' ? '_Distribuidor' : 
                     user?.role === 'Customer' ? '_Cliente' : '';
      // ✅ CORREGIDO: Solo agregar "_ConImagenes" si es PDF e incluye imágenes
      const imageStr = (downloadFormat === 'pdf' && includeImages) ? '_ConImagenes' : '';

      if (downloadFormat === 'pdf') {
        try {
          console.log('📄 Generando PDF...');
          const doc = await generatePDF(products, user?.role);
          const fileName = `Catalogo_Fucsia${roleStr}${imageStr}_${dateStr}.pdf`;
          doc.save(fileName);
          console.log(`✅ Catálogo PDF descargado: ${fileName}`);
        } catch (pdfError) {
          console.error('Error generando PDF:', pdfError);
          if (window.confirm('Error al generar PDF. ¿Deseas descargar en formato Excel en su lugar?')) {
            setDownloadFormat('excel');
            const excelData = generateDataForRole(products, user?.role);
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo de Productos');
            const fileName = `Catalogo_Fucsia${roleStr}_${dateStr}.xlsx`; // Sin "_ConImagenes"
            XLSX.writeFile(workbook, fileName);
            console.log(`✅ Catálogo Excel descargado (fallback): ${fileName}`);
          }
          return;
        }
      } else {
        console.log(' Generando Excel...');
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
      
      // ✅ CORREGIDO: Mostrar estadísticas según el formato
      setDownloadStats({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        inStock: products.filter(p => p.stock > 0).length,
        onPromotion: products.filter(p => p.isPromotion).length,
        withImages: downloadFormat === 'pdf' ? productosConImagenes.length : 0, // Solo contar para PDF
        format: downloadFormat,
        includeImages: downloadFormat === 'pdf' ? includeImages : false, // Solo true para PDF
        fileName: `Catalogo_Fucsia${roleStr}${imageStr}_${dateStr}.${downloadFormat === 'pdf' ? 'pdf' : 'xlsx'}`
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

  // ✅ CORREGIDO: Un solo return con las dos versiones
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <select
          value={downloadFormat}
          onChange={(e) => setDownloadFormat(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={isGenerating}
        >
          <option value="pdf">📄 PDF</option>
          <option value="excel">📊 Excel</option>
        </select>
        
        {/* ✅ CONDICIONAL: Solo mostrar checkbox de imágenes para PDF */}
        {downloadFormat === 'pdf' && (
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={includeImages}
              onChange={(e) => setIncludeImages(e.target.checked)}
              disabled={isGenerating}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span>📸 Imágenes</span>
          </label>
        )}
        
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

  // ✅ VERSIÓN COMPLETA
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
          
          {/* ✅ CONDICIONAL: Solo mostrar opción de imágenes para PDF */}
          {downloadFormat === 'pdf' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Opciones:</label>
              <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  disabled={isGenerating}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span>📸 Incluir imágenes</span>
              </label>
            </div>
          )}
          
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
        {/* ✅ ACTUALIZADO: Solo mostrar mensaje de imágenes si es PDF */}
        {downloadFormat === 'pdf' && includeImages && (
          <span className="block mt-1 text-xs text-blue-600">
            📸 Se incluirán imágenes en miniatura de los productos (puede aumentar el tiempo de generación).
          </span>
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">📋 Información incluida:</h4>
          <ul className="text-gray-600 space-y-1">
            <li>• SKU y nombre del producto</li>
            {/* ✅ CONDICIONAL: Solo mostrar línea de imagen para PDF */}
            {downloadFormat === 'pdf' && includeImages && (
              <li>• Imagen en miniatura del producto</li>
            )}
            <li>• Descripción y categoría</li>
            {(user?.role === 'Owner' || user?.role === 'Admin') && (
              <>
                <li>• Stock disponible y mínimo</li>
                <li>• Estado de activación</li>
              </>
            )}
            <li>• Tags y atributos específicos</li>
          </ul>

          {/* ✅ NUEVO: Información específica sobre diferencias de formato */}
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 mb-1">📄 Diferencias por formato:</h5>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• <strong>PDF:</strong> Incluye opción de mostrar imágenes en miniatura</li>
              <li>• <strong>Excel:</strong> Datos optimizados para análisis y edición</li>
              <li>• Ambos formatos incluyen la misma información de productos</li>
            </ul>
          </div>
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

      {downloadStats && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">
            ✅ Descarga completada ({downloadStats.format === 'pdf' ? 'PDF' : 'Excel'}
            {downloadStats.includeImages ? ' con imágenes' : ''})
          </h4>
          <div className={`grid gap-4 text-sm text-green-700 ${downloadStats.format === 'pdf' && downloadStats.includeImages ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'}`}>
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