const { Op } = require('sequelize');
const { PurchaseOrder, PurchaseOrderItem, PurchasePayment, Product, Proveedor, Category, StockMovement, User, Expense, conn } = require('../../data');
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
      const previousCantidadRecibida = orderItem.cantidadRecibida || 0;
      const newCantidadRecibida = previousCantidadRecibida + receivedItem.cantidadRecibida;
      
      console.log(`📝 [ReceiveOrder] Actualizando cantidad recibida para ${orderItem.productName}:`);
      console.log(`   - Cantidad ordenada: ${orderItem.cantidad}`);
      console.log(`   - Cantidad previamente recibida: ${previousCantidadRecibida}`);
      console.log(`   - Cantidad recibiendo ahora: ${receivedItem.cantidadRecibida}`);
      console.log(`   - Nueva cantidad total recibida: ${newCantidadRecibida}`);
      
      await orderItem.update({
        cantidadRecibida: newCantidadRecibida
      }, { transaction });

      console.log(`✅ [ReceiveOrder] Item actualizado exitosamente: ${orderItem.productName} (${newCantidadRecibida}/${orderItem.cantidad})`);
    }

    // ✅ ACTUALIZAR ESTADO DE LA ORDEN CON VALIDACIÓN MEJORADA
    // NO volver a consultar - usar los objetos actualizados en memoria
    console.log('🔍 [ReceiveOrder] Verificando estado de items usando objetos en memoria:');
    
    const allReceived = purchaseOrder.items.every(item => {
      const received = item.cantidadRecibida || 0;
      const ordered = item.cantidad;
      const isComplete = received >= ordered;
      console.log(`   📊 ${item.productName}: ${received}/${ordered} = ${isComplete ? 'COMPLETO' : 'PENDIENTE'}`);
      return isComplete;
    });
    
    const partialReceived = purchaseOrder.items.some(item => (item.cantidadRecibida || 0) > 0);

    console.log(`🎯 [ReceiveOrder] Análisis de estado: allReceived=${allReceived}, partialReceived=${partialReceived}`);

    let newStatus = 'pendiente';
    if (allReceived) {
      newStatus = 'completada';
      console.log('🎉 [ReceiveOrder] ¡ORDEN COMPLETAMENTE RECIBIDA! Cambiando estado a completada');
      
      // ✅ CREAR EXPENSE AUTOMÁTICO CUANDO SE COMPLETA LA ORDEN
      try {
        // Generar número de expense único
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const time = String(today.getHours()).padStart(2, '0') + String(today.getMinutes()).padStart(2, '0');
        const expenseNumber = `EXP${year}${month}${day}${time}`;

        await Expense.create({
          expenseNumber,
          categoryType: 'otros', // Categoría que existe en el ENUM
          description: `Compra de Mercancía - ${purchaseOrder.orderNumber}`,
          amount: purchaseOrder.total,
          expenseDate: new Date(),
          paymentMethod: purchaseOrder.metodoPago === 'efectivo' ? 'efectivo' : 
                        purchaseOrder.metodoPago === 'transferencia' ? 'transferencia' :
                        purchaseOrder.metodoPago === 'tarjeta' ? 'tarjeta' : 'credito',
          vendor: purchaseOrder.proveedor?.name || 'Proveedor',
          invoiceNumber: purchaseOrder.numeroFactura || null,
          receiptUrl: purchaseOrder.archivoComprobante || null,
          notes: `Gasto generado automáticamente desde orden de compra completada. Factura: ${purchaseOrder.numeroFactura || 'N/A'}. Items recibidos: ${receivedItems.length}`,
          status: 'pagado', // Asumimos que si se completó la orden, ya se pagó
          isFromPurchaseOrder: true,
          purchaseOrderId: purchaseOrder.id,
          createdBy: req.user?.n_document || req.user?.id || null // ✅ USAR EL USUARIO AUTENTICADO
        }, { transaction });

        console.log(`💰 [ReceiveOrder] Expense automático creado (${expenseNumber}) para orden ${purchaseOrder.orderNumber} por $${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(purchaseOrder.total)}`);
      } catch (expenseError) {
        console.error('⚠️ [ReceiveOrder] Error creando expense automático:', expenseError);
        // No fallar la transacción por esto, solo registrar el error
      }
    } else if (partialReceived) {
      newStatus = 'parcial';
      console.log('📦 [ReceiveOrder] Recepción parcial');
    } else {
      console.log('⏳ [ReceiveOrder] Orden sigue pendiente');
    }

    // ✅ AGREGAR NOTAS DETALLADAS DE RECEPCIÓN
    const currentNotes = purchaseOrder.notas || '';
    const itemsSummary = receivedItems.map(ri => {
      const orderItem = purchaseOrder.items.find(item => item.id === ri.itemId);
      return `${orderItem.productName}: +${ri.cantidadRecibida}`;
    }).join(', ');
    
    const receptionNote = `\n[RECEPCIÓN ${new Date().toLocaleString('es-CO')}] ${itemsSummary} | ${updatedProducts} productos actualizados, ${createdProducts} productos creados${notes ? ` | Notas: ${notes}` : ''}`;
    
    await purchaseOrder.update({
      status: newStatus,
      notas: currentNotes + receptionNote
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
            const orderItem = purchaseOrder.items.find(item => item.id === ri.itemId);
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
        },
        // ✅ INCLUIR INFORMACIÓN DE PAGOS
        {
          model: PurchasePayment,
          as: 'payments',
          required: false
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

// Actualizar orden de compra
const updatePurchaseOrder = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { id } = req.params;
    const {
      proveedorId,
      fechaCompra,
      numeroFactura,
      metodoPago,
      fechaVencimiento,
      notas,
      impuestos = 0,
      descuentos = 0,
      items = []
    } = req.body;

    console.log('📝 [UpdatePurchaseOrder] Actualizando orden:', { id, itemsCount: items.length });

    const existingOrder = await PurchaseOrder.findByPk(id, {
      include: [
        { 
          model: PurchaseOrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });

    if (!existingOrder) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Orden de compra no encontrada'
      });
    }

    // No permitir edición de órdenes completadas
    if (existingOrder.status === 'completada') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'No se puede editar una orden completada'
      });
    }

    // Calcular totales
    let subtotal = 0;
    for (const item of items) {
      subtotal += parseFloat(item.cantidad) * parseFloat(item.precioUnitario);
    }

    const total = subtotal + parseFloat(impuestos) - parseFloat(descuentos);

    // Actualizar orden principal
    await existingOrder.update({
      proveedorId,
      fechaCompra,
      numeroFactura,
      metodoPago,
      fechaVencimiento,
      notas,
      subtotal,
      impuestos,
      descuentos,
      total
    }, { transaction });

    // Eliminar items existentes
    await PurchaseOrderItem.destroy({
      where: { purchaseOrderId: id },
      transaction
    });

    // Crear nuevos items
    const newItems = [];
    for (const item of items) {
      const newItem = await PurchaseOrderItem.create({
        purchaseOrderId: id,
        productId: item.productId,
        productName: item.productName,
        productCode: item.productCode,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        precioVentaSugerido: item.precioVentaSugerido,
        precioDistribuidorSugerido: item.precioDistribuidorSugerido,
        cantidadRecibida: 0 // Reset al editar
      }, { transaction });
      
      newItems.push(newItem);
    }

    await transaction.commit();

    // Obtener orden actualizada
    const updatedOrder = await PurchaseOrder.findByPk(id, {
      include: [
        { 
          model: PurchaseOrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    console.log('✅ [UpdatePurchaseOrder] Orden actualizada exitosamente');

    res.json({
      error: false,
      message: 'Orden de compra actualizada exitosamente',
      data: updatedOrder
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ [UpdatePurchaseOrder] Error:', error);
    res.status(500).json({
      error: true,
      message: 'Error al actualizar orden de compra'
    });
  }
};

// Registrar pago de orden de compra
const registerPayment = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { id } = req.params;
    const {
      amount,
      paymentMethod,
      paymentDate = new Date(),
      reference,
      notes
    } = req.body;

    console.log('💰 [RegisterPayment] Registrando pago:', { orderId: id, amount, paymentMethod });

    // ✅ BUSCAR ORDEN CON INCLUDE PARA PAGOS Y PROVEEDOR
    const purchaseOrder = await PurchaseOrder.findByPk(id, {
      include: [
        { model: PurchasePayment, as: 'payments' },
        { model: Proveedor, as: 'proveedor' }
      ],
      transaction
    });

    if (!purchaseOrder) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Orden de compra no encontrada'
      });
    }

    if (purchaseOrder.status === 'cancelada') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'No se puede registrar pagos en órdenes canceladas'
      });
    }

    // ✅ CREAR REGISTRO DE PAGO EN LA NUEVA TABLA
    await PurchasePayment.create({
      purchaseOrderId: id,
      amount: parseFloat(amount),
      paymentMethod,
      paymentDate,
      reference,
      notes,
      createdBy: req.user?.n_document || req.user?.id || null // ✅ USAR EL USUARIO AUTENTICADO
    }, { transaction });

    // ✅ CALCULAR TOTALES DE PAGO
    const previousTotalPaid = parseFloat(purchaseOrder.totalPaid) || 0;
    const newTotalPaid = previousTotalPaid + parseFloat(amount);
    const orderTotal = parseFloat(purchaseOrder.total);
    
    // ✅ DETERMINAR NUEVO ESTADO DE PAGO
    let newPaymentStatus = 'pendiente';
    if (newTotalPaid >= orderTotal) {
      newPaymentStatus = 'pagada';
    } else if (newTotalPaid > 0) {
      newPaymentStatus = 'parcial';
    }

    // ✅ ACTUALIZAR ORDEN CON NUEVA INFORMACIÓN DE PAGO
    const currentNotes = purchaseOrder.notas || '';
    const paymentNote = `\n[PAGO ${new Date().toLocaleString('es-CO')}] ${paymentMethod}: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount)}${reference ? ` | Ref: ${reference}` : ''}${notes ? ` | ${notes}` : ''}`;
    
    await purchaseOrder.update({
      totalPaid: newTotalPaid,
      paymentStatus: newPaymentStatus,
      notas: currentNotes + paymentNote
    }, { transaction });

    // ✅ CREAR EXPENSE AUTOMÁTICO CUANDO SE COMPLETA EL PAGO (SI LA ORDEN YA ESTÁ COMPLETADA)
    if (newPaymentStatus === 'pagada' && purchaseOrder.status === 'completada') {
      try {
        // Verificar si ya existe un expense para esta orden
        const existingExpense = await Expense.findOne({
          where: {
            purchaseOrderId: purchaseOrder.id,
            isFromPurchaseOrder: true
          },
          transaction
        });

        if (!existingExpense) {
          // Generar número de expense único
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          const time = String(today.getHours()).padStart(2, '0') + String(today.getMinutes()).padStart(2, '0');
          const expenseNumber = `EXP${year}${month}${day}${time}`;

          await Expense.create({
            expenseNumber,
            categoryType: 'otros',
            description: `Compra de Mercancía - ${purchaseOrder.orderNumber}`,
            amount: purchaseOrder.total,
            expenseDate: new Date(),
            paymentMethod: paymentMethod === 'efectivo' ? 'efectivo' : 
                          paymentMethod === 'transferencia' ? 'transferencia' :
                          paymentMethod === 'pse' ? 'transferencia' :
                          paymentMethod === 'tarjeta_credito' || paymentMethod === 'tarjeta_debito' ? 'tarjeta' : 
                          paymentMethod === 'cheque' ? 'cheque' : 'credito',
            vendor: purchaseOrder.proveedor?.nombre || 'Proveedor',
            invoiceNumber: purchaseOrder.numeroFactura || null,
            receiptUrl: purchaseOrder.archivoComprobante || null,
            notes: `Gasto generado automáticamente desde orden de compra pagada completamente. Factura: ${purchaseOrder.numeroFactura || 'N/A'}`,
            status: 'pagado',
            isFromPurchaseOrder: true,
            purchaseOrderId: purchaseOrder.id,
            createdBy: req.user?.n_document || req.user?.id || null
          }, { transaction });

          console.log(`💰 [RegisterPayment] Expense automático creado (${expenseNumber}) para orden ${purchaseOrder.orderNumber} por $${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(purchaseOrder.total)}`);
        } else {
          console.log(`💰 [RegisterPayment] Expense ya existe para la orden ${purchaseOrder.orderNumber}`);
        }
      } catch (expenseError) {
        console.error('⚠️ [RegisterPayment] Error creando expense automático:', expenseError);
        // No fallar la transacción por esto, solo registrar el error
      }
    }

    await transaction.commit();

    console.log(`✅ [RegisterPayment] Pago registrado exitosamente. Total pagado: $${newTotalPaid}/${orderTotal} - Estado: ${newPaymentStatus}`);

    res.json({
      error: false,
      message: 'Pago registrado exitosamente',
      data: {
        orderId: id,
        paymentAmount: amount,
        paymentMethod,
        paymentDate,
        totalPaid: newTotalPaid,
        orderTotal,
        paymentStatus: newPaymentStatus,
        remainingAmount: Math.max(0, orderTotal - newTotalPaid)
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ [RegisterPayment] Error:', error);
    res.status(500).json({
      error: true,
      message: 'Error al registrar pago'
    });
  }
};

// Cambiar estado manualmente con lógica de reversión
const updateOrderStatus = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    console.log('🔄 [UpdateOrderStatus] Cambiando estado:', { orderId: id, newStatus: status });

    const validStatuses = ['pendiente', 'recibida', 'parcial', 'completada', 'cancelada'];
    
    if (!validStatuses.includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: `Estado inválido. Estados válidos: ${validStatuses.join(', ')}`
      });
    }

    const purchaseOrder = await PurchaseOrder.findByPk(id, {
      include: [
        {
          model: PurchaseOrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ],
      transaction
    });

    if (!purchaseOrder) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Orden de compra no encontrada'
      });
    }

    const previousStatus = purchaseOrder.status;
    
    // ✅ LÓGICA ESPECIAL PARA CANCELACIÓN
    if (status === 'cancelada' && (previousStatus === 'recibida' || previousStatus === 'parcial' || previousStatus === 'completada')) {
      console.log('⚠️ [UpdateOrderStatus] Cancelando orden que ya recibió mercancía - REVIRTIENDO STOCK');
      
      // Revertir stock para todos los items que se recibieron
      for (const item of purchaseOrder.items) {
        if (item.cantidadRecibida > 0) {
          const product = item.product;
          const stockToRevert = item.cantidadRecibida;
          
          console.log(`🔄 [UpdateOrderStatus] Revirtiendo stock: ${product.name} - Cantidad: ${stockToRevert}`);
          
          // Reducir stock del producto
          await product.update({
            stock: product.stock - stockToRevert
          }, { transaction });
          
          // Crear movimiento de stock negativo (reversión)
          await StockMovement.create({
            productId: product.id,
            type: 'salida',
            quantity: stockToRevert,
            reason: 'Cancelación de orden de compra',
            description: `Reversión por cancelación de orden ${purchaseOrder.orderNumber}`,
            userId: req.user?.n_document || req.user?.id || null, // ✅ USAR EL USUARIO AUTENTICADO
            purchaseOrderId: purchaseOrder.id
          }, { transaction });
          
          // Resetear cantidad recibida del item
          await item.update({
            cantidadRecibida: 0
          }, { transaction });
        }
      }
      
      // ✅ ELIMINAR GASTO AUTOMÁTICO SI EXISTE
      const deletedExpenses = await Expense.destroy({
        where: {
          purchaseOrderId: purchaseOrder.id,
          isFromPurchaseOrder: true
        },
        transaction
      });
      
      if (deletedExpenses > 0) {
        console.log(`💰 [UpdateOrderStatus] ✅ Eliminados ${deletedExpenses} gastos automáticos asociados a la orden ${purchaseOrder.orderNumber}`);
      } else {
        console.log(`💰 [UpdateOrderStatus] ℹ️ No se encontraron gastos automáticos para eliminar de la orden ${purchaseOrder.orderNumber}`);
      }
    }

    // Actualizar estado y notas
    const currentNotes = purchaseOrder.notas || '';
    const statusNote = `\n[CAMBIO ESTADO ${new Date().toLocaleString('es-CO')}] ${previousStatus} → ${status}${reason ? ` | Motivo: ${reason}` : ''}`;
    
    await purchaseOrder.update({
      status,
      notas: currentNotes + statusNote
    }, { transaction });

    await transaction.commit();
    
    console.log('✅ [UpdateOrderStatus] Estado actualizado exitosamente');

    res.json({
      error: false,
      message: status === 'cancelada' && (previousStatus === 'recibida' || previousStatus === 'parcial' || previousStatus === 'completada') 
        ? 'Orden cancelada y stock revertido exitosamente'
        : 'Estado de orden actualizado exitosamente',
      data: {
        orderId: id,
        previousStatus: previousStatus,
        newStatus: status,
        stockReverted: status === 'cancelada' && (previousStatus === 'recibida' || previousStatus === 'parcial' || previousStatus === 'completada')
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ [UpdateOrderStatus] Error:', error);
    res.status(500).json({
      error: true,
      message: 'Error al actualizar estado de orden'
    });
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  receiveOrder,
  updatePurchaseOrder,
  registerPayment,
  updateOrderStatus
};
