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
      items,
      orderType,
      paymentMethod,
      paymentDetails = {},
      notes,
      shippingAddress,
      cashierId
    } = req.body;

    // Validaciones básicas
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Datos de orden inválidos'
      });
    }

    // Verificar que el usuario existe y obtener info del distribuidor
    const customer = await User.findByPk(userId, {
      include: [
        {
          model: Distributor,
          as: 'distributor',
          required: false
        }
      ]
    });
    
    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado'
      });
    }

    // Generar número de orden
    const orderNumber = await generateOrderNumber();

    // Calcular totales y verificar stock
    let subtotal = 0;
    let totalDiscount = 0;
    const processedItems = [];
    let distributorItemsTotal = 0;

    for (const item of items) {
      const { productId, quantity } = item;
      
      const product = await Product.findByPk(productId);
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          error: true,
          message: `Producto ${productId} no encontrado`
        });
      }

      // Verificar stock
      if (product.stock < quantity) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
        });
      }

      // Determinar precio base
      let unitPrice = product.price;
      let isDistributorPrice = false;

      // Verificar promoción primero
      if (product.isPromotion && product.promotionPrice) {
        unitPrice = product.promotionPrice;
      } 
      // Luego verificar precio de distribuidor
      else if (customer.role === 'Distributor' && product.distributorPrice && customer.distributor) {
        unitPrice = product.distributorPrice;
        isDistributorPrice = true;
        distributorItemsTotal += quantity * unitPrice;
      }

      const itemSubtotal = quantity * unitPrice;
      subtotal += itemSubtotal;

      processedItems.push({
        productId,
        quantity,
        unitPrice,
        subtotal: itemSubtotal,
        appliedDiscount: 0,
        product,
        isDistributorPrice
      });
    }

    // VALIDACIÓN CRÍTICA: Verificar monto mínimo para distribuidores
    if (customer.role === 'Distributor' && customer.distributor && distributorItemsTotal > 0) {
      const minimumPurchase = parseFloat(customer.distributor.minimumPurchase) || 0;
      
      if (distributorItemsTotal < minimumPurchase) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message: `Como distribuidor, necesitas un mínimo de compra de $${minimumPurchase.toLocaleString('es-CO')}. Tu total actual es $${distributorItemsTotal.toLocaleString('es-CO')}`,
          data: {
            currentTotal: distributorItemsTotal,
            minimumRequired: minimumPurchase,
            shortfall: minimumPurchase - distributorItemsTotal
          }
        });
      }
    }

    const total = subtotal - totalDiscount;

    // Crear la orden
    const order = await Order.create({
      orderNumber,
      userId,
      subtotal,
      discount: totalDiscount,
      tax: 0,
      total,
      status: 'pending',
      orderType: orderType || 'local',
      paymentStatus: 'pending',
      cashierId: cashierId || null,
      notes,
      shippingAddress
    }, { transaction });

    // Crear items de la orden
    for (const item of processedItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        appliedDiscount: item.appliedDiscount,
        subtotal: item.subtotal
      }, { transaction });

      // Actualizar stock
      await item.product.update({
        stock: item.product.stock - item.quantity
      }, { transaction });

      // Registrar movimiento de stock
      await StockMovement.create({
        productId: item.productId,
        quantity: -item.quantity,
        type: 'salida',
        reason: customer.role === 'Distributor' ? 'Venta a distribuidor' : 'Venta',
        previousStock: item.product.stock,
        currentStock: item.product.stock - item.quantity,
        userId: cashierId || userId,
        orderId: order.id
      }, { transaction });
    }

    // Crear pago si se especifica método
    if (paymentMethod) {
      await Payment.create({
        orderId: order.id,
        amount: total,
        method: paymentMethod,
        status: paymentMethod === 'credito' ? 'pending' : 'completed',
        paymentDetails,
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

    res.status(201).json({
      error: false,
      message: customer.role === 'Distributor' ? 
        'Orden de distribuidor creada exitosamente' : 
        'Orden creada exitosamente',
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

// Obtener todas las órdenes
const getOrders = async (req, res) => {
  try {
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

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
