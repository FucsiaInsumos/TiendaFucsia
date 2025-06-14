const { Op } = require('sequelize');
const { Order, OrderItem, Payment, Product, User, DiscountRule, StockMovement, Distributor, conn } = require('../../data');

// Generar número de orden secuencial
const generateOrderNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const prefix = `${year}${month}${day}`;
  
  const lastOrder = await Order.findOne({
    where: {
      orderNumber: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['orderNumber', 'DESC']]
  });
  
  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.substring(8));
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${String(sequence).padStart(4, '0')}`;
};

// Crear nueva orden/venta
const createOrder = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const {
      userId,
      items, // Se espera que items venga con { productId, quantity }
      orderType,
      paymentMethod,
      paymentDetails = {},
      notes: originalNotes, // Cambiar el nombre para evitar conflicto
      shippingAddress,
      cashierId,
      pickupInfo, // Añadido para ordenes online
      extraDiscountPercentage = 0 // Nuevo: descuento extra del POS
    } = req.body;

    // Validaciones básicas
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Datos de orden inválidos'
      });
    }

    // Validación específica: Ventas online solo pueden usar Wompi
    if (orderType === 'online' && paymentMethod !== 'wompi') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Las compras online solo pueden pagarse con Wompi por seguridad'
      });
    }

    // Verificar que el usuario existe y obtener info del distribuidor
    const customer = await User.findByPk(userId, {
      include: [{ model: Distributor, as: 'distributor', required: false }]
    });
    
    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    }

    // Generar número de orden
    const orderNumber = await generateOrderNumber();

    // Calcular totales y verificar stock
    let subtotal = 0;
    const processedOrderItems = []; // Para guardar los datos finales de OrderItem
    let orderValueForDistributorMinimumCheck = 0;

    // Primera pasada: Calcular precios y el valor total para la verificación del mínimo de distribuidor
    for (const cartItem of items) {
      const { productId, quantity } = cartItem;
      const product = await Product.findByPk(productId);

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ error: true, message: `Producto ${productId} no encontrado` });
      }
      if (product.stock < quantity) {
        await transaction.rollback();
        return res.status(400).json({ error: true, message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}` });
      }

      let effectivePrice = product.price; // Precio normal como base
      let isPromotion = false;

      // Aplicar promoción si es mejor
      if (product.isPromotion && product.promotionPrice && product.promotionPrice < effectivePrice) {
        effectivePrice = product.promotionPrice;
        isPromotion = true;
      }

      // Si es distribuidor, el precio para el chequeo del mínimo es el de distribuidor si es mejor
      if (customer.role === 'Distributor' && customer.distributor && product.distributorPrice) {
        if (product.distributorPrice < effectivePrice) {
          orderValueForDistributorMinimumCheck += quantity * product.distributorPrice;
        } else {
          orderValueForDistributorMinimumCheck += quantity * effectivePrice;
        }
      } else {
        orderValueForDistributorMinimumCheck += quantity * effectivePrice;
      }
      
      processedOrderItems.push({
        productId,
        quantity,
        productData: product, // Para actualizar stock
        // Precios y flags se determinarán en la segunda pasada
        unitPrice: 0, 
        itemSubtotal: 0,
        isPromotionApplied: isPromotion, // Basado en la primera evaluación
        isDistributorPriceApplied: false,
        originalPrice: product.price // Guardar precio de lista
      });
    }

    let applyDistributorPrices = false;
    let distributorMinimumRequiredValue = 0; // Para la respuesta

    if (customer.role === 'Distributor' && customer.distributor) {
      distributorMinimumRequiredValue = parseFloat(customer.distributor.minimumPurchase) || 0;
      if (distributorMinimumRequiredValue > 0 && orderValueForDistributorMinimumCheck >= distributorMinimumRequiredValue) {
        applyDistributorPrices = true;
      } else {
        applyDistributorPrices = false; // No cumple el mínimo, no se aplican precios de distribuidor
      }
    }

    // Segunda pasada: Establecer precios finales y calcular subtotal
    for (const pItem of processedOrderItems) {
      let finalUnitPrice = pItem.originalPrice; // Empezar con precio normal

      // Aplicar promoción si es mejor que el normal
      if (pItem.productData.isPromotion && pItem.productData.promotionPrice && pItem.productData.promotionPrice < finalUnitPrice) {
        finalUnitPrice = pItem.productData.promotionPrice;
        pItem.isPromotionApplied = true; // Confirmar flag
      } else {
        pItem.isPromotionApplied = false; // No aplicó o no era mejor
      }

      // Si aplican precios de distribuidor y es mejor que el precio actual (normal o promo)
      if (applyDistributorPrices && pItem.productData.distributorPrice && pItem.productData.distributorPrice < finalUnitPrice) {
        finalUnitPrice = pItem.productData.distributorPrice;
        pItem.isDistributorPriceApplied = true;
        pItem.isPromotionApplied = false; // Precio de distribuidor anula promo si es mejor
      }
      
      pItem.unitPrice = finalUnitPrice;
      pItem.itemSubtotal = pItem.quantity * pItem.unitPrice;
      subtotal += pItem.itemSubtotal;
    }
    
    // Calcular descuentos
    let totalDiscount = 0;
    let extraDiscountAmount = 0;
    let finalNotes = originalNotes || ''; // Variable para manejar las notas
    
    // Aplicar descuento extra del POS si existe
    if (extraDiscountPercentage > 0 && orderType === 'local') {
      extraDiscountAmount = subtotal * (parseFloat(extraDiscountPercentage) / 100);
      totalDiscount += extraDiscountAmount;
      
      // Agregar nota sobre el descuento aplicado
      const discountNote = `\nDescuento POS aplicado: ${extraDiscountPercentage}% (${formatPrice(extraDiscountAmount)})`;
      finalNotes = finalNotes + discountNote;
      
      console.log(`Descuento extra aplicado: ${extraDiscountPercentage}% = ${formatPrice(extraDiscountAmount)}`);
    }
    
    const total = subtotal - totalDiscount;

    // Crear la orden
    const order = await Order.create({
      orderNumber,
      userId,
      subtotal,
      discount: totalDiscount,
      tax: 0, // Calcular impuestos si es necesario
      total,
      status: 'pending', // Estado inicial
      orderType: orderType || 'local',
      paymentStatus: 'pending',
      cashierId: cashierId || null,
      notes: finalNotes, // Usar la variable finalNotes
      shippingAddress, // Para envíos
      pickupInfo: orderType === 'online' ? pickupInfo : null // Para retiro en tienda
    }, { transaction });

    for (const pItem of processedOrderItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: pItem.productId,
        quantity: pItem.quantity,
        unitPrice: pItem.unitPrice,
        subtotal: pItem.itemSubtotal, // Este es quantity * unitPrice
        appliedDiscount: 0 // Para futuras reglas de descuento por item
      }, { transaction });

      // Actualizar stock
      await pItem.productData.update({
        stock: pItem.productData.stock - pItem.quantity
      }, { transaction });

      // Registrar movimiento de stock
      await StockMovement.create({
        productId: pItem.productId,
        quantity: -pItem.quantity,
        type: 'salida',
        reason: `Venta orden ${orderNumber}`,
        previousStock: pItem.productData.stock + pItem.quantity, // Stock antes de esta venta
        currentStock: pItem.productData.stock, // Stock después de esta venta (ya actualizado)
        userId: cashierId || userId,
        orderId: order.id
      }, { transaction });
    }

    // Crear pago si se especifica método
    if (paymentMethod) {
      // Para pagos locales con descuento extra, ajustar el monto del pago
      const paymentAmount = paymentDetails.finalTotal || total;
      
      await Payment.create({
        orderId: order.id,
        amount: paymentAmount,
        method: paymentMethod,
        status: paymentMethod === 'credito' ? 'pending' : 'completed',
        paymentDetails: {
          ...paymentDetails,
          originalTotal: subtotal,
          extraDiscountPercentage: extraDiscountPercentage || 0,
          extraDiscountAmount: extraDiscountAmount,
          finalTotal: total
        },
        dueDate: paymentMethod === 'credito' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
      }, { transaction });

      // Actualizar estado de pago de la orden
      await order.update({
        paymentStatus: paymentMethod === 'credito' ? 'pending' : 'completed',
        status: paymentMethod === 'credito' ? 'confirmed' : 'completed'
      }, { transaction });
    }

    await transaction.commit();

    // Obtener orden completa para respuesta
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        {
          model: Payment,
          as: 'payments'
        },
        {
          model: User,
          as: 'customer',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    let successMessage = 'Orden creada exitosamente';
    if (customer.role === 'Distributor' && applyDistributorPrices) {
      successMessage = 'Orden de distribuidor creada exitosamente con precios especiales';
    } else if (customer.role === 'Distributor' && !applyDistributorPrices && distributorMinimumRequiredValue > 0) {
      successMessage = 'Orden de distribuidor creada con precios normales/promoción (mínimo no alcanzado)';
    }
    
    if (extraDiscountAmount > 0) {
      successMessage += ` - Descuento POS aplicado: ${extraDiscountPercentage}%`;
    }

    res.status(201).json({
      error: false,
      message: successMessage,
      data: completeOrder
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear orden:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Obtener órdenes del usuario actual (para clientes)
const getMyOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      orderType, 
      paymentStatus,
      startDate,
      endDate
    } = req.query;

    // El userId viene del token decodificado en el middleware
    const userId = req.user.id;

    const whereClause = { userId }; // Solo órdenes del usuario actual
    if (status) whereClause.status = status;
    if (orderType) whereClause.orderType = orderType;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        {
          model: Payment,
          as: 'payments'
        },
        {
          model: User,
          as: 'customer',
          attributes: { exclude: ['password'] }
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      error: false,
      message: 'Mis órdenes obtenidas exitosamente',
      data: {
        orders: orders.rows,
        totalOrders: orders.count,
        totalPages: Math.ceil(orders.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error al obtener mis órdenes:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todas las órdenes
const getOrders = async (req, res) => {
  try {
    // Verificar que el usuario tenga permisos para ver todas las órdenes
    if (req.user.role !== 'Owner' && req.user.role !== 'Admin' && req.user.role !== 'Cashier') {
      return res.status(403).json({
        error: true,
        message: 'No tienes permisos para ver todas las órdenes'
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      status, 
      orderType, 
      paymentStatus,
      startDate,
      endDate,
      userId 
    } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (orderType) whereClause.orderType = orderType;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;
    if (userId) whereClause.userId = userId;
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        {
          model: Payment,
          as: 'payments'
        },
        {
          model: User,
          as: 'customer',
          attributes: { exclude: ['password'] }
        },
        {
          model: User,
          as: 'cashier',
          attributes: { exclude: ['password'] }
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      error: false,
      message: 'Órdenes obtenidas exitosamente',
      data: {
        orders: orders.rows,
        totalOrders: orders.count,
        totalPages: Math.ceil(orders.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener orden por ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            { 
              model: Product, 
              as: 'product' 
            },
            {
              model: DiscountRule,
              as: 'discountRule'
            }
          ]
        },
        {
          model: Payment,
          as: 'payments'
        },
        {
          model: User,
          as: 'customer',
          attributes: { exclude: ['password'] }
        },
        {
          model: User,
          as: 'cashier',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada'
      });
    }

    res.json({
      error: false,
      message: 'Orden obtenida exitosamente',
      data: order
    });

  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar estado de orden
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    await order.update(updateData);

    res.json({
      error: false,
      message: 'Estado de orden actualizado exitosamente',
      data: order
    });

  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Cancelar orden
const cancelOrder = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada'
      });
    }

    if (order.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'La orden ya está cancelada'
      });
    }

    // Restaurar stock
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId);
      await product.update({
        stock: product.stock + item.quantity
      }, { transaction });

      // Registrar movimiento de stock
      await StockMovement.create({
        productId: item.productId,
        quantity: item.quantity,
        type: 'entrada',
        reason: `Cancelación de orden ${order.orderNumber}${reason ? ` - ${reason}` : ''}`,
        previousStock: product.stock,
        currentStock: product.stock + item.quantity,
        userId: req.user?.id || order.userId,
        orderId: order.id
      }, { transaction });
    }

    // Actualizar orden
    await order.update({
      status: 'cancelled',
      notes: `${order.notes || ''}\nCancelada: ${reason || 'Sin razón especificada'}`
    }, { transaction });

    await transaction.commit();

    res.json({
      error: false,
      message: 'Orden cancelada exitosamente',
      data: order
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al cancelar orden:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Helper para formatear precio en mensajes de error del backend
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders, // Nueva función
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
