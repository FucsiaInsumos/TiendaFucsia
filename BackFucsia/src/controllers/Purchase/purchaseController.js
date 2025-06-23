const { Op } = require('sequelize');
const { PurchaseOrder, PurchaseOrderItem, Product, Proveedor, Category, StockMovement, User, conn } = require('../../data');
const { uploadToCloudinary } = require('../../utils/cloudinaryUploader');

// Generar número de orden de compra
const generatePurchaseOrderNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  const prefix = `PC${year}${month}`;
  
  const lastOrder = await PurchaseOrder.findOne({
    where: {
      orderNumber: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['orderNumber', 'DESC']]
  });
  
  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.substring(prefix.length));
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${String(sequence).padStart(4, '0')}`;
};

// Crear orden de compra
const createPurchaseOrder = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const {
      proveedorId,
      fechaCompra,
      numeroFactura,
      items,
      metodoPago,
      fechaVencimiento,
      notas,
      impuestos = 0,
      descuentos = 0
    } = req.body;

    console.log('📦 [PurchaseOrder] Datos recibidos:', { proveedorId, items: items?.length, metodoPago });

    // ✅ VALIDACIONES MEJORADAS
    if (!proveedorId) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Debe seleccionar un proveedor'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Debe agregar al menos un item a la orden'
      });
    }

    // ✅ VALIDAR CADA ITEM
    for (const [index, item] of items.entries()) {
      if (!item.productName || !item.productName.trim()) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message: `El item ${index + 1} debe tener un nombre de producto`
        });
      }

      if (!item.cantidad || item.cantidad <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message: `El item ${index + 1} debe tener una cantidad válida`
        });
      }

      if (!item.precioUnitario || item.precioUnitario <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message: `El item ${index + 1} debe tener un precio unitario válido`
        });
      }

      // ✅ VALIDACIONES ESPECIALES PARA PRODUCTOS NUEVOS
      if (item.isNewProduct) {
        if (!item.categoryId) {
          await transaction.rollback();
          return res.status(400).json({
            error: true,
            message: `El producto nuevo "${item.productName}" requiere una categoría`
          });
        }

        if (!item.productSku || !item.productSku.trim()) {
          await transaction.rollback();
          return res.status(400).json({
            error: true,
            message: `El producto nuevo "${item.productName}" requiere un SKU`
          });
        }

        // Verificar que el SKU sea único
        const existingProduct = await Product.findOne({ 
          where: { sku: item.productSku.trim() } 
        });
        
        if (existingProduct) {
          await transaction.rollback();
          return res.status(400).json({
            error: true,
            message: `El SKU "${item.productSku}" ya existe. Por favor usa un código único.`
          });
        }
      }
    }

    // Verificar proveedor
    const proveedor = await Proveedor.findByPk(proveedorId);
    if (!proveedor) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Proveedor no encontrado'
      });
    }

    console.log('✅ [PurchaseOrder] Validaciones pasadas, creando orden...');

    // Generar número de orden
    const orderNumber = await generatePurchaseOrderNumber();

    // Calcular subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += parseFloat(item.cantidad) * parseFloat(item.precioUnitario);
    }

    const total = subtotal + parseFloat(impuestos) - parseFloat(descuentos);

    // Subir comprobante si existe
    let archivoComprobante = null;
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, 'fucsia-purchase-receipts');
        archivoComprobante = result.secure_url;
      } catch (uploadError) {
        console.error('Error al subir comprobante:', uploadError);
      }
    }

    // Crear orden de compra
    const purchaseOrder = await PurchaseOrder.create({
      orderNumber,
      proveedorId,
      fechaCompra: fechaCompra || new Date(),
      numeroFactura,
      subtotal,
      impuestos: parseFloat(impuestos),
      descuentos: parseFloat(descuentos),
      total,
      metodoPago,
      fechaVencimiento,
      archivoComprobante,
      notas,
      createdBy: req.user?.n_document || req.user?.id
    }, { transaction });

    // Crear items
    for (const item of items) {
      await PurchaseOrderItem.create({
        purchaseOrderId: purchaseOrder.id,
        productId: item.productId || null,
        productName: item.productName,
        productSku: item.productSku,
        productDescription: item.productDescription,
        categoryId: item.categoryId,
        cantidad: parseInt(item.cantidad),
        precioUnitario: parseFloat(item.precioUnitario),
        subtotal: parseInt(item.cantidad) * parseFloat(item.precioUnitario),
        precioVentaSugerido: item.precioVentaSugerido ? parseFloat(item.precioVentaSugerido) : null,
        precioDistribuidorSugerido: item.precioDistribuidorSugerido ? parseFloat(item.precioDistribuidorSugerido) : null,
        stockMinimo: item.stockMinimo || 5,
        isNewProduct: !item.productId,
        notas: item.notas
      }, { transaction });
    }

    await transaction.commit();

    // Obtener orden completa
    const completePurchaseOrder = await PurchaseOrder.findByPk(purchaseOrder.id, {
      include: [
        {
          model: PurchaseOrderItem,
          as: 'items'
        },
        {
          model: Proveedor,
          as: 'proveedor'
        }
      ]
    });

    res.status(201).json({
      error: false,
      message: 'Orden de compra creada exitosamente',
      data: completePurchaseOrder
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear orden de compra:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// ✅ FUNCIÓN MEJORADA: Recibir mercancía
const receiveOrder = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { id } = req.params;
    const { receivedItems, notes } = req.body;

    console.log('📦 [ReceiveOrder] Iniciando recepción de mercancía:', { 
      orderId: id, 
      itemsCount: receivedItems?.length,
      receivedItems: receivedItems
    });

    // ✅ VALIDACIONES MEJORADAS
    if (!receivedItems || !Array.isArray(receivedItems) || receivedItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Debe proporcionar items para recibir en formato de array',
        received: { receivedItems, notes }
      });
    }

    const purchaseOrder = await PurchaseOrder.findByPk(id, {
      include: [
        { 
          model: PurchaseOrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    if (!purchaseOrder) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Orden de compra no encontrada'
      });
    }

    // ✅ VALIDACIÓN DE ESTADO - NO PERMITIR RECEPCIONES EN ÓRDENES COMPLETADAS O CANCELADAS
    if (purchaseOrder.status === 'completada') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Esta orden ya está completamente recibida. No se pueden realizar más recepciones.',
        currentStatus: purchaseOrder.status
      });
    }

    if (purchaseOrder.status === 'cancelada') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'No se puede recibir mercancía de una orden cancelada.',
        currentStatus: purchaseOrder.status
      });
    }

    console.log('✅ [ReceiveOrder] Orden encontrada:', purchaseOrder.orderNumber, 'Estado:', purchaseOrder.status);

    let updatedProducts = 0;
    let createdProducts = 0;
    let stockMovements = 0;

    // ✅ VALIDAR QUE NO SE EXCEDA LA CANTIDAD ORDENADA
    for (const receivedItem of receivedItems) {
      const orderItem = purchaseOrder.items.find(item => item.id === receivedItem.itemId);
      if (!orderItem) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message: `Item ${receivedItem.itemId} no encontrado en la orden`
        });
      }

      const cantidadYaRecibida = orderItem.cantidadRecibida || 0;
      const cantidadPendiente = orderItem.cantidad - cantidadYaRecibida;
      
      if (receivedItem.cantidadRecibida > cantidadPendiente) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message: `No se puede recibir ${receivedItem.cantidadRecibida} unidades de "${orderItem.productName}". Solo quedan ${cantidadPendiente} unidades pendientes.`,
          itemDetails: {
            productName: orderItem.productName,
            cantidadOrdenada: orderItem.cantidad,
            cantidadYaRecibida: cantidadYaRecibida,
            cantidadPendiente: cantidadPendiente,
            cantidadIntentandoRecibir: receivedItem.cantidadRecibida
          }
        });
      }

      if (receivedItem.cantidadRecibida <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message: `La cantidad a recibir debe ser mayor a 0 para "${orderItem.productName}"`
        });
      }
    }

    // ✅ PROCESAR RECEPCIONES
    for (const receivedItem of receivedItems) {
      console.log('🔄 [ReceiveOrder] Procesando item recibido:', receivedItem);
      
      const orderItem = purchaseOrder.items.find(item => item.id === receivedItem.itemId);
      if (!orderItem) {
        console.log(`❌ [ReceiveOrder] Item ${receivedItem.itemId} no encontrado en la orden`);
        continue;
      }

      console.log(`🔄 [ReceiveOrder] Procesando item: ${orderItem.productName}`);

      let product = null;

      // ✅ CASO 1: PRODUCTO EXISTENTE - ACTUALIZAR STOCK Y PRECIOS
      if (orderItem.productId) {
        product = await Product.findByPk(orderItem.productId);
        if (product) {
          const previousStock = product.stock;
          const newStock = previousStock + receivedItem.cantidadRecibida;

          // Preparar datos de actualización
          const updateData = {
            stock: newStock
          };

          // ✅ ACTUALIZAR PRECIOS SI SE SOLICITA
          if (receivedItem.updatePrices && receivedItem.newPrices) {
            console.log(`💰 [ReceiveOrder] Actualizando precios para ${product.name}:`, receivedItem.newPrices);
            
            updateData.purchasePrice = receivedItem.newPrices.purchasePrice;
            updateData.price = receivedItem.newPrices.price;
            
            if (receivedItem.newPrices.distributorPrice) {
              updateData.distributorPrice = receivedItem.newPrices.distributorPrice;
            }
          }

          await product.update(updateData, { transaction });
          updatedProducts++;

          console.log(`✅ [ReceiveOrder] Producto actualizado: ${product.name} - Stock: ${previousStock} → ${newStock}`);

          // Registrar movimiento de stock
          await StockMovement.create({
            productId: product.id,
            quantity: receivedItem.cantidadRecibida,
            type: 'entrada',
            reason: `Compra ${purchaseOrder.orderNumber} - ${purchaseOrder.proveedor?.nombre || 'Proveedor'}`,
            previousStock,
            currentStock: newStock,
            userId: req.user?.n_document || req.user?.id,
            purchaseOrderId: purchaseOrder.id,
            notes: `Factura: ${purchaseOrder.numeroFactura || 'N/A'}${notes ? ` - ${notes}` : ''}`
          }, { transaction });
          stockMovements++;
        }
      } 
      
      // ✅ CASO 2: PRODUCTO NUEVO - CREAR PRODUCTO
      else if (orderItem.isNewProduct) {
        console.log(`🆕 [ReceiveOrder] Creando producto nuevo: ${orderItem.productName}`);

        // ✅ USAR PRECIOS NUEVOS SI SE PROPORCIONAN, SINO USAR LOS DE LA ORDEN
        const finalPurchasePrice = receivedItem.newPrices?.purchasePrice || orderItem.precioUnitario;
        const finalPrice = receivedItem.newPrices?.price || orderItem.precioVentaSugerido || (finalPurchasePrice * 1.3);
        const finalDistributorPrice = receivedItem.newPrices?.distributorPrice || orderItem.precioDistribuidorSugerido;

        const newProduct = await Product.create({
          sku: orderItem.productSku || `AUTO-${Date.now()}`,
          name: orderItem.productName,
          description: orderItem.productDescription,
          purchasePrice: finalPurchasePrice,
          price: finalPrice,
          distributorPrice: finalDistributorPrice,
          stock: receivedItem.cantidadRecibida,
          minStock: orderItem.stockMinimo || 5,
          categoryId: orderItem.categoryId,
          isActive: true,
          isFacturable: false // Por defecto no facturable
        }, { transaction });

        // Actualizar item con el ID del producto creado
        await orderItem.update({
          productId: newProduct.id
        }, { transaction });

        createdProducts++;

        console.log(`✅ [ReceiveOrder] Producto creado: ${newProduct.name} (ID: ${newProduct.id})`);

        // Registrar movimiento de stock inicial
        await StockMovement.create({
          productId: newProduct.id,
          quantity: receivedItem.cantidadRecibida,
          type: 'entrada',
          reason: `Stock inicial - Compra ${purchaseOrder.orderNumber}`,
          previousStock: 0,
          currentStock: receivedItem.cantidadRecibida,
          userId: req.user?.n_document || req.user?.id,
          purchaseOrderId: purchaseOrder.id,
          notes: `Producto creado desde compra. Factura: ${purchaseOrder.numeroFactura || 'N/A'}${notes ? ` - ${notes}` : ''}`
        }, { transaction });
        stockMovements++;

        product = newProduct;
      }

      // ✅ ACTUALIZAR CANTIDAD RECIBIDA EN EL ITEM
      const newCantidadRecibida = (orderItem.cantidadRecibida || 0) + receivedItem.cantidadRecibida;
      await orderItem.update({
        cantidadRecibida: newCantidadRecibida
      }, { transaction });

      console.log(`📝 [ReceiveOrder] Item actualizado - Cantidad recibida: ${orderItem.cantidadRecibida || 0} → ${newCantidadRecibida}`);
    }

    // ✅ ACTUALIZAR ESTADO DE LA ORDEN CON VALIDACIÓN MEJORADA
    const allItems = await PurchaseOrderItem.findAll({
      where: { purchaseOrderId: purchaseOrder.id }
    });

    const allReceived = allItems.every(item => (item.cantidadRecibida || 0) >= item.cantidad);
    const partialReceived = allItems.some(item => (item.cantidadRecibida || 0) > 0);

    let newStatus = 'pendiente';
    if (allReceived) {
      newStatus = 'completada';
      console.log('🎉 [ReceiveOrder] Orden completamente recibida');
    } else if (partialReceived) {
      newStatus = 'parcial';
      console.log('📦 [ReceiveOrder] Recepción parcial');
    }

    // ✅ AGREGAR NOTAS DETALLADAS DE RECEPCIÓN
    const currentNotes = purchaseOrder.notes || '';
    const itemsSummary = receivedItems.map(ri => {
      const orderItem = allItems.find(item => item.id === ri.itemId);
      return `${orderItem.productName}: +${ri.cantidadRecibida}`;
    }).join(', ');
    
    const receptionNote = `\n[RECEPCIÓN ${new Date().toLocaleString('es-CO')}] ${itemsSummary} | ${updatedProducts} productos actualizados, ${createdProducts} productos creados${notes ? ` | Notas: ${notes}` : ''}`;
    
    await purchaseOrder.update({
      status: newStatus,
      notes: currentNotes + receptionNote
    }, { transaction });

    await transaction.commit();

    console.log(`✅ [ReceiveOrder] Recepción completada:`, {
      orderNumber: purchaseOrder.orderNumber,
      newStatus,
      updatedProducts,
      createdProducts,
      stockMovements
    });

    res.json({
      error: false,
      message: newStatus === 'completada' 
        ? 'Mercancía recibida. ¡Orden completamente recibida!' 
        : 'Mercancía recibida parcialmente. Orden actualizada.',
      data: {
        purchaseOrderId: purchaseOrder.id,
        orderNumber: purchaseOrder.orderNumber,
        previousStatus: purchaseOrder.status,
        newStatus: newStatus,
        isCompleted: newStatus === 'completada',
        summary: {
          updatedProducts,
          createdProducts,
          stockMovements,
          totalItemsReceived: receivedItems.length,
          itemsReceived: receivedItems.map(ri => {
            const orderItem = allItems.find(item => item.id === ri.itemId);
            return {
              productName: orderItem.productName,
              quantityReceived: ri.cantidadRecibida,
              totalQuantity: orderItem.cantidad,
              previouslyReceived: (orderItem.cantidadRecibida || 0) - ri.cantidadRecibida,
              newTotalReceived: orderItem.cantidadRecibida || 0
            };
          })
        }
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ [ReceiveOrder] Error completo:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Obtener órdenes de compra
const getPurchaseOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, proveedorId, startDate, endDate } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (proveedorId) whereClause.proveedorId = proveedorId;
    
    if (startDate || endDate) {
      whereClause.fechaCompra = {};
      if (startDate) whereClause.fechaCompra[Op.gte] = new Date(startDate);
      if (endDate) whereClause.fechaCompra[Op.lte] = new Date(endDate);
    }

    const purchaseOrders = await PurchaseOrder.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: PurchaseOrderItem,
          as: 'items'
        },
        {
          model: Proveedor,
          as: 'proveedor'
        },
        {
          model: User,
          as: 'creator',
          attributes: ['n_document', 'first_name', 'last_name']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['fechaCompra', 'DESC']]
    });

    res.json({
      error: false,
      message: 'Órdenes de compra obtenidas exitosamente',
      data: {
        orders: purchaseOrders.rows,
        totalOrders: purchaseOrders.count,
        totalPages: Math.ceil(purchaseOrders.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error al obtener órdenes de compra:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener orden de compra por ID
const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseOrder = await PurchaseOrder.findByPk(id, {
      include: [
        {
          model: PurchaseOrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            },
            {
              model: Category,
              as: 'category'
            }
          ]
        },
        {
          model: Proveedor,
          as: 'proveedor'
        },
        {
          model: User,
          as: 'creator',
          attributes: ['n_document', 'first_name', 'last_name']
        }
      ]
    });

    if (!purchaseOrder) {
      return res.status(404).json({
        error: true,
        message: 'Orden de compra no encontrada'
      });
    }

    res.json({
      error: false,
      message: 'Orden de compra obtenida exitosamente',
      data: purchaseOrder
    });

  } catch (error) {
    console.error('Error al obtener orden de compra:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  receiveOrder
};
