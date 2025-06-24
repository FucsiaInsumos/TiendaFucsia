const { Payment, Order, User, CreditPaymentRecord, conn } = require('../../data');
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

// =============================================================================
// FUNCIONES PARA GESTIÓN DE CRÉDITOS
// =============================================================================

// Obtener pagos a crédito
const getCreditPayments = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status,
      startDate,
      endDate 
    } = req.query;

    const whereClause = { method: 'credito' };
    
    // Filtrar por estado de pago
    if (status) {
      if (status === 'overdue') {
        whereClause.dueDate = { [Op.lt]: new Date() };
        whereClause.status = { [Op.in]: ['pending', 'partial'] };
      } else {
        whereClause.status = status;
      }
    }
    
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
        },
        {
          model: CreditPaymentRecord,
          as: 'abonos',
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    // Calcular montos abonados para cada pago
    const paymentsWithAmounts = payments.rows.map(payment => {
      const totalAbonos = payment.abonos?.reduce((sum, abono) => sum + parseFloat(abono.amount), 0) || 0;
      
      return {
        ...payment.toJSON(),
        paidAmount: totalAbonos,
        remainingAmount: parseFloat(payment.amount) - totalAbonos
      };
    });

    res.json({
      error: false,
      message: 'Pagos a crédito obtenidos exitosamente',
      data: {
        payments: paymentsWithAmounts,
        totalPayments: payments.count,
        totalPages: Math.ceil(payments.count / parseInt(limit)),
        currentPage: parseInt(page),
        summary: {
          totalPending: paymentsWithAmounts.reduce((sum, p) => sum + Math.max(0, p.remainingAmount), 0),
          totalOverdue: paymentsWithAmounts.filter(p => p.dueDate && new Date(p.dueDate) < new Date() && p.remainingAmount > 0).reduce((sum, p) => sum + p.remainingAmount, 0)
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener pagos a crédito:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Registrar abono a un pago a crédito
const recordCreditPayment = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { id } = req.params;
    const { amount, notes, paymentMethod = 'efectivo' } = req.body;

    // Buscar el pago original
    const originalPayment = await Payment.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'order',
          include: [{ model: User, as: 'customer' }]
        },
        {
          model: CreditPaymentRecord,
          as: 'abonos'
        }
      ]
    });

    if (!originalPayment) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Pago no encontrado'
      });
    }

    if (originalPayment.method !== 'credito') {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Solo se pueden registrar abonos en pagos a crédito'
      });
    }

    // Calcular monto ya abonado
    const totalAbonado = originalPayment.abonos?.reduce((sum, abono) => sum + parseFloat(abono.amount), 0) || 0;
    const montoRestante = parseFloat(originalPayment.amount) - totalAbonado;

    if (parseFloat(amount) > montoRestante) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: `El abono no puede ser mayor al saldo pendiente: ${montoRestante}`
      });
    }

    // ✅ OBTENER n_document DEL USUARIO AUTENTICADO O DEL CLIENTE DE LA ORDEN
    let recordedByDocument = null;
    
    // Prioridad 1: Usuario autenticado (cajero/administrador registrando el abono)
    if (req.user?.n_document) {
      recordedByDocument = req.user.n_document;
      console.log(`💰 [Abono] Registrado por usuario autenticado: ${recordedByDocument}`);
    } 
    // Prioridad 2: Cliente de la orden (si es el mismo cliente abonando)
    else if (originalPayment.order?.customer?.n_document) {
      recordedByDocument = originalPayment.order.customer.n_document;
      console.log(`💰 [Abono] Registrado por cliente de la orden: ${recordedByDocument}`);
    }
    
    console.log(`💰 [Abono] Documento a registrar: ${recordedByDocument || 'NULL'}`);

    // Registrar el abono
    const abono = await CreditPaymentRecord.create({
      paymentId: originalPayment.id,
      amount: parseFloat(amount),
      paymentMethod,
      notes: notes || 'Abono registrado',
      recordedBy: recordedByDocument, // ✅ USAR n_document O NULL
      recordedAt: new Date()
    }, { transaction });

    // Calcular nuevo saldo
    const nuevoTotalAbonado = totalAbonado + parseFloat(amount);
    const nuevoMontoRestante = parseFloat(originalPayment.amount) - nuevoTotalAbonado;

    // Actualizar estado del pago original
    let nuevoEstado = 'pending';
    if (nuevoMontoRestante <= 0) {
      nuevoEstado = 'completed';
    } else if (nuevoTotalAbonado > 0) {
      nuevoEstado = 'partial';
    }

    await originalPayment.update({
      status: nuevoEstado,
      paymentDetails: {
        ...originalPayment.paymentDetails,
        totalAbonado: nuevoTotalAbonado,
        montoRestante: nuevoMontoRestante,
        ultimoAbono: {
          fecha: new Date(),
          monto: parseFloat(amount),
          metodo: paymentMethod
        }
      }
    }, { transaction });

    // Si el pago se completó, actualizar estado de la orden
    if (nuevoEstado === 'completed') {
      await originalPayment.order.update({
        paymentStatus: 'completed',
        status: 'completed'
      }, { transaction });
    }

    await transaction.commit();

    res.json({
      error: false,
      message: 'Abono registrado exitosamente',
      data: {
        abono,
        paymentStatus: {
          totalAmount: parseFloat(originalPayment.amount),
          totalPaid: nuevoTotalAbonado,
          remaining: nuevoMontoRestante,
          status: nuevoEstado,
          isCompleted: nuevoEstado === 'completed'
        },
        recordedBy: {
          document: recordedByDocument,
          source: req.user?.n_document ? 'authenticated_user' : 'order_customer'
        }
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al registrar abono:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Obtener historial de abonos de un pago
const getCreditPaymentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'order',
          include: [{ model: User, as: 'customer', attributes: { exclude: ['password'] } }]
        },
        {
          model: CreditPaymentRecord,
          as: 'abonos',
          include: [
            {
              model: User,
              as: 'recordedByUser',
              attributes: ['first_name', 'last_name', 'n_document']
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        error: true,
        message: 'Pago no encontrado'
      });
    }

    const totalAbonado = payment.abonos?.reduce((sum, abono) => sum + parseFloat(abono.amount), 0) || 0;
    const montoRestante = parseFloat(payment.amount) - totalAbonado;

    res.json({
      error: false,
      message: 'Historial de abonos obtenido exitosamente',
      data: {
        payment: {
          ...payment.toJSON(),
          totalAbonado,
          montoRestante
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener historial de abonos:', error);
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
  refundPayment,
  getCreditPayments,
  recordCreditPayment,
  getCreditPaymentHistory
};
