const { Payment, Order, User, conn } = require('../../data');
const { Op } = require('sequelize');

// Procesar pago
const processPayment = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { 
      orderId, 
      amount, 
      method, 
      paymentDetails = {},
      transactionId 
    } = req.body;

    // Verificar que la orden existe
    const order = await Order.findByPk(orderId);
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada'
      });
    }

    // Validar que el monto no exceda el pendiente por pagar
    const totalPaid = await Payment.sum('amount', {
      where: { 
        orderId, 
        status: 'completed' 
      }
    }) || 0;

    const remaining = parseFloat(order.total) - totalPaid;
    
    if (amount > remaining) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: `El monto excede lo pendiente por pagar. Restante: $${remaining}`
      });
    }

    // Crear el pago
    const payment = await Payment.create({
      orderId,
      amount,
      method,
      status: method === 'credito' ? 'pending' : 'completed',
      paymentDetails,
      transactionId,
      dueDate: method === 'credito' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
    }, { transaction });

    // Actualizar estado de pago de la orden
    const newTotalPaid = totalPaid + parseFloat(amount);
    let paymentStatus = 'partial';
    let orderStatus = order.status;

    if (newTotalPaid >= parseFloat(order.total)) {
      paymentStatus = 'completed';
      orderStatus = 'completed';
    }

    await order.update({
      paymentStatus,
      status: orderStatus
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      error: false,
      message: 'Pago procesado exitosamente',
      data: {
        payment,
        orderPaymentStatus: paymentStatus,
        orderStatus,
        totalPaid: newTotalPaid,
        remaining: parseFloat(order.total) - newTotalPaid
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al procesar pago:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Obtener pagos de una orden
const getPaymentsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payments = await Payment.findAll({
      where: { orderId },
      order: [['createdAt', 'DESC']]
    });

    const totalPaid = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    res.json({
      error: false,
      message: 'Pagos obtenidos exitosamente',
      data: {
        payments,
        totalPaid,
        summary: {
          totalPayments: payments.length,
          completedPayments: payments.filter(p => p.status === 'completed').length,
          pendingPayments: payments.filter(p => p.status === 'pending').length,
          failedPayments: payments.filter(p => p.status === 'failed').length
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todos los pagos con filtros
const getAllPayments = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      method, 
      status,
      startDate,
      endDate 
    } = req.query;

    const whereClause = {};
    if (method) whereClause.method = method;
    if (status) whereClause.status = status;
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }

    const payments = await Payment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: User,
              as: 'customer',
              attributes: { exclude: ['password'] }
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      error: false,
      message: 'Pagos obtenidos exitosamente',
      data: {
        payments: payments.rows,
        totalPayments: payments.count,
        totalPages: Math.ceil(payments.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar estado de pago
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionId, paymentDetails } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        error: true,
        message: 'Pago no encontrado'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (transactionId) updateData.transactionId = transactionId;
    if (paymentDetails) updateData.paymentDetails = paymentDetails;

    await payment.update(updateData);

    res.json({
      error: false,
      message: 'Estado de pago actualizado exitosamente',
      data: payment
    });

  } catch (error) {
    console.error('Error al actualizar pago:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Reembolsar pago
const refundPayment = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { id } = req.params;
    const { reason, amount } = req.body;

    const payment = await Payment.findByPk(id, {
      include: [{ model: Order, as: 'order' }]
    });

    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Pago no encontrado'
      });
    }

    if (payment.status !== 'completed') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Solo se pueden reembolsar pagos completados'
      });
    }

    const refundAmount = amount || payment.amount;

    // Crear registro de reembolso
    const refund = await Payment.create({
      orderId: payment.orderId,
      amount: -Math.abs(refundAmount),
      method: payment.method,
      status: 'completed',
      paymentDetails: {
        ...payment.paymentDetails,
        refundReason: reason,
        originalPaymentId: payment.id
      },
      transactionId: `REFUND-${payment.id}-${Date.now()}`
    }, { transaction });

    // Actualizar pago original
    await payment.update({
      status: 'refunded',
      paymentDetails: {
        ...payment.paymentDetails,
        refundId: refund.id,
        refundReason: reason
      }
    }, { transaction });

    await transaction.commit();

    res.json({
      error: false,
      message: 'Reembolso procesado exitosamente',
      data: {
        originalPayment: payment,
        refund
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al procesar reembolso:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  processPayment,
  getPaymentsByOrder,
  getAllPayments,
  updatePaymentStatus,
  refundPayment
};
