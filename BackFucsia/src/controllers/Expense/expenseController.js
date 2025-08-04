const { Expense, User } = require('../../data');
const { Op } = require('sequelize');
const { uploadBufferToCloudinary } = require('../../utils/cloudinaryUploader');

// Crear un nuevo gasto
const createExpense = async (req, res) => {
  try {
    const {
      categoryType,
      description,
      amount,
      expenseDate,
      paymentMethod,
      vendor,
      invoiceNumber,
      notes,
      status,
      dueDate,
      isRecurring,
      recurringFrequency
    } = req.body;

    const { id: createdBy } = req.user;

    // Validaciones básicas
    if (!categoryType || !description || !amount) {
      return res.status(400).json({
        error: true,
        message: 'Categoría, descripción y monto son requeridos'
      });
    }

    if (!createdBy) {
      return res.status(400).json({
        error: true,
        message: 'Usuario no autenticado correctamente'
      });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: true,
        message: 'El monto debe ser mayor a 0'
      });
    }

    // Generar número único de gasto
    const expenseCount = await Expense.count();
    const expenseNumber = `EXP-${String(expenseCount + 1).padStart(6, '0')}`;

    // Manejo de archivo de comprobante
    let receiptUrl = null;
    if (req.file) {
      try {
        const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
          folder: 'expenses',
          mimetype: req.file.mimetype, // ¡IMPORTANTE! Pasar el mimetype
          originalName: req.file.originalname,
          public_id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
        receiptUrl = uploadResult.secure_url;
        console.log('Archivo subido exitosamente:', {
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          url: receiptUrl,
          resource_type: uploadResult.resource_type
        });
      } catch (uploadError) {
        console.error('Error al subir comprobante:', uploadError);
        return res.status(500).json({
          error: true,
          message: 'Error al subir el comprobante'
        });
      }
    }

    const expense = await Expense.create({
      expenseNumber,
      categoryType,
      description,
      amount: parseFloat(amount),
      expenseDate: expenseDate || new Date(),
      paymentMethod,
      vendor,
      invoiceNumber,
      receiptUrl,
      notes,
      status: status || 'pendiente',
      dueDate: dueDate || null,
      createdBy,
      isRecurring: isRecurring === 'true' || isRecurring === true,
      recurringFrequency: isRecurring ? recurringFrequency : null
    });

    // Incluir información del creador en la respuesta
    const expenseWithCreator = await Expense.findByPk(expense.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['n_document', 'first_name', 'last_name', 'email']
        }
      ]
    });

    res.status(201).json({
      error: false,
      message: 'Gasto creado exitosamente',
      data: expenseWithCreator
    });

  } catch (error) {
    console.error('Error al crear gasto:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todos los gastos con filtros
const getExpenses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      categoryType,
      status,
      startDate,
      endDate,
      paymentMethod,
      search,
      sortBy = 'expenseDate',
      sortOrder = 'DESC'
    } = req.query;

    // Construir filtros
    const where = {};

    if (categoryType) {
      where.categoryType = categoryType;
    }

    if (status) {
      where.status = status;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (startDate && endDate) {
      where.expenseDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      where.expenseDate = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      where.expenseDate = {
        [Op.lte]: new Date(endDate)
      };
    }

    if (search) {
      where[Op.or] = [
        { description: { [Op.iLike]: `%${search}%` } },
        { vendor: { [Op.iLike]: `%${search}%` } },
        { invoiceNumber: { [Op.iLike]: `%${search}%` } },
        { expenseNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const expenses = await Expense.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['n_document', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['n_document', 'first_name', 'last_name', 'email'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    // Calcular estadísticas básicas para el período filtrado
    const totalAmount = await Expense.sum('amount', { where });
    const expensesByCategory = await Expense.findAll({
      where,
      attributes: [
        'categoryType',
        [Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'total'],
        [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count']
      ],
      group: ['categoryType']
    });

    // Calcular estadísticas por estado
    const expensesByStatus = await Expense.findAll({
      where,
      attributes: [
        'status',
        [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count'],
        [Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'total']
      ],
      group: ['status']
    });

    // Convertir estadísticas por estado a un formato más fácil de usar
    const statusSummary = {
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      totalCount: expenses.count
    };

    expensesByStatus.forEach(item => {
      const status = item.status;
      const count = parseInt(item.dataValues.count || 0);
      
      if (status === 'pendiente' || status === 'pending') {
        statusSummary.pendingCount += count;
      } else if (status === 'pagado' || status === 'approved') {
        statusSummary.approvedCount += count;
      } else if (status === 'cancelado' || status === 'rejected') {
        statusSummary.rejectedCount += count;
      }
    });

    res.status(200).json({
      error: false,
      data: {
        expenses: expenses.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(expenses.count / parseInt(limit)),
          totalItems: expenses.count,
          itemsPerPage: parseInt(limit),
          total: expenses.count // Agregar total para compatibilidad
        },
        summary: {
          totalAmount: totalAmount || 0,
          ...statusSummary,
          expensesByCategory: expensesByCategory.map(item => ({
            category: item.categoryType,
            total: parseFloat(item.dataValues.total || 0),
            count: parseInt(item.dataValues.count || 0)
          }))
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener gastos:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un gasto por ID
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['n_document', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['n_document', 'first_name', 'last_name', 'email'],
          required: false
        }
      ]
    });

    if (!expense) {
      return res.status(404).json({
        error: true,
        message: 'Gasto no encontrado'
      });
    }

    res.status(200).json({
      error: false,
      data: expense
    });

  } catch (error) {
    console.error('Error al obtener gasto:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar un gasto
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoryType,
      description,
      amount,
      expenseDate,
      paymentMethod,
      vendor,
      invoiceNumber,
      notes,
      status,
      dueDate,
      isRecurring,
      recurringFrequency
    } = req.body;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        error: true,
        message: 'Gasto no encontrado'
      });
    }

    // Solo el creador o un Owner puede editar
    const { id: userId, role } = req.user;
    if (expense.createdBy !== userId && role !== 'Owner') {
      return res.status(403).json({
        error: true,
        message: 'No tienes permisos para editar este gasto'
      });
    }

    // Manejo de nuevo archivo de comprobante
    let receiptUrl = expense.receiptUrl;
    if (req.file) {
      try {
        const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
          folder: 'expenses',
          mimetype: req.file.mimetype, // ¡IMPORTANTE! Pasar el mimetype
          originalName: req.file.originalname,
          public_id: `expense_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
        receiptUrl = uploadResult.secure_url;
        console.log('Archivo actualizado exitosamente:', {
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          url: receiptUrl,
          resource_type: uploadResult.resource_type
        });
      } catch (uploadError) {
        console.error('Error al subir comprobante:', uploadError);
        return res.status(500).json({
          error: true,
          message: 'Error al subir el comprobante'
        });
      }
    }

    await expense.update({
      categoryType: categoryType || expense.categoryType,
      description: description || expense.description,
      amount: amount ? parseFloat(amount) : expense.amount,
      expenseDate: expenseDate || expense.expenseDate,
      paymentMethod: paymentMethod || expense.paymentMethod,
      vendor: vendor !== undefined ? vendor : expense.vendor,
      invoiceNumber: invoiceNumber !== undefined ? invoiceNumber : expense.invoiceNumber,
      receiptUrl,
      notes: notes !== undefined ? notes : expense.notes,
      status: status || expense.status,
      dueDate: dueDate !== undefined ? dueDate : expense.dueDate,
      isRecurring: isRecurring !== undefined ? (isRecurring === 'true' || isRecurring === true) : expense.isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : null
    });

    // Obtener el gasto actualizado con relaciones
    const updatedExpense = await Expense.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['n_document', 'first_name', 'last_name', 'email']
        }
      ]
    });

    res.status(200).json({
      error: false,
      message: 'Gasto actualizado exitosamente',
      data: updatedExpense
    });

  } catch (error) {
    console.error('Error al actualizar gasto:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Aprobar un gasto (solo Owner o Cashier)
const approveExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: approvedBy, role } = req.user;

    if (role !== 'Owner' && role !== 'Cashier') {
      return res.status(403).json({
        error: true,
        message: 'No tienes permisos para aprobar gastos'
      });
    }

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        error: true,
        message: 'Gasto no encontrado'
      });
    }

    await expense.update({
      status: 'pagado',
      approvedBy,
      approvedAt: new Date()
    });

    const updatedExpense = await Expense.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['n_document', 'first_name', 'last_name', 'email']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['n_document', 'first_name', 'last_name', 'email']
        }
      ]
    });

    res.status(200).json({
      error: false,
      message: 'Gasto aprobado exitosamente',
      data: updatedExpense
    });

  } catch (error) {
    console.error('Error al aprobar gasto:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar un gasto (solo Owner)
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'Owner') {
      return res.status(403).json({
        error: true,
        message: 'Solo el propietario puede eliminar gastos'
      });
    }

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        error: true,
        message: 'Gasto no encontrado'
      });
    }

    await expense.destroy();

    res.status(200).json({
      error: false,
      message: 'Gasto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de gastos
const getExpenseStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate, endDate;

    // Definir período
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    const where = {
      expenseDate: {
        [Op.between]: [startDate, endDate]
      }
    };

    // Total de gastos
    const totalExpenses = await Expense.sum('amount', { where });

    // Gastos por categoría
    const expensesByCategory = await Expense.findAll({
      where,
      attributes: [
        'categoryType',
        [Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'total'],
        [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count']
      ],
      group: ['categoryType'],
      order: [[Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'DESC']]
    });

    // Gastos por método de pago
    const expensesByPaymentMethod = await Expense.findAll({
      where,
      attributes: [
        'paymentMethod',
        [Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'total'],
        [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count']
      ],
      group: ['paymentMethod']
    });

    // Gastos por estado
    const expensesByStatus = await Expense.findAll({
      where,
      attributes: [
        'status',
        [Expense.sequelize.fn('SUM', Expense.sequelize.col('amount')), 'total'],
        [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Gastos pendientes próximos a vencer (próximos 7 días)
    const upcomingDueExpenses = await Expense.findAll({
      where: {
        status: 'pendiente',
        dueDate: {
          [Op.between]: [now, new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)]
        }
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['first_name', 'last_name']
        }
      ],
      order: [['dueDate', 'ASC']]
    });

    // Calcular estadísticas del mes anterior para comparación
    const previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousEndDate = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const previousMonthExpenses = await Expense.sum('amount', {
      where: {
        expenseDate: {
          [Op.between]: [previousStartDate, previousEndDate]
        }
      }
    });

    const currentMonthTotal = totalExpenses || 0;
    const previousMonthTotal = previousMonthExpenses || 0;

    res.status(200).json({
      error: false,
      data: {
        period,
        dateRange: { startDate, endDate },
        summary: {
          totalExpenses: currentMonthTotal,
          totalCount: await Expense.count({ where })
        },
        currentMonth: {
          total: currentMonthTotal,
          count: await Expense.count({ where })
        },
        monthlyComparison: {
          currentMonth: currentMonthTotal,
          previousMonth: previousMonthTotal,
          difference: currentMonthTotal - previousMonthTotal
        },
        byCategory: expensesByCategory.map(item => ({
          categoryType: item.categoryType,
          total: parseFloat(item.dataValues.total || 0),
          count: parseInt(item.dataValues.count || 0)
        })),
        expensesByPaymentMethod: expensesByPaymentMethod.map(item => ({
          method: item.paymentMethod,
          total: parseFloat(item.dataValues.total || 0),
          count: parseInt(item.dataValues.count || 0)
        })),
        expensesByStatus: expensesByStatus.map(item => ({
          status: item.status,
          total: parseFloat(item.dataValues.total || 0),
          count: parseInt(item.dataValues.count || 0)
        })),
        upcomingDueExpenses: upcomingDueExpenses.slice(0, 10) // Solo las primeras 10
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de gastos:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  approveExpense,
  deleteExpense,
  getExpenseStats
};
