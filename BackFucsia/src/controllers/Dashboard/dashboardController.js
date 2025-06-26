const { Op } = require('sequelize');
const { Order, Payment, Product, User, OrderItem, StockMovement, conn } = require('../../data');

// Obtener estadísticas generales del dashboard
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Ventas del día
    const dailySales = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfDay
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      attributes: [
        [conn.fn('SUM', conn.col('Order.total')), 'totalSales'],
        [conn.fn('COUNT', conn.col('Order.id')), 'totalOrders']
      ]
    });

    // Ventas del mes
    const monthlySales = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      attributes: [
        [conn.fn('SUM', conn.col('Order.total')), 'totalSales'],
        [conn.fn('COUNT', conn.col('Order.id')), 'totalOrders']
      ]
    });

    // Productos con stock bajo
    const lowStockProducts = await Product.count({
      where: {
        [Op.and]: [
          { isActive: true },
          conn.where(
            conn.col('stock'),
            Op.lte,
            conn.col('minStock')
          )
        ]
      }
    });

    // Productos más vendidos (este mes)
    const topProducts = await OrderItem.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'sku', 'name']
        },
        {
          model: Order,
          as: 'order',
          where: {
            createdAt: {
              [Op.gte]: startOfMonth
            },
            status: {
              [Op.notIn]: ['cancelled']
            }
          },
          attributes: []
        }
      ],
      attributes: [
        'productId',
        [conn.fn('SUM', conn.col('OrderItem.quantity')), 'totalSold'],
        [conn.fn('SUM', conn.col('OrderItem.subtotal')), 'totalRevenue']
      ],
      group: ['productId', 'product.id', 'product.sku', 'product.name'],
      order: [[conn.fn('SUM', conn.col('OrderItem.quantity')), 'DESC']],
      limit: 5
    });

    // Órdenes pendientes
    const pendingOrders = await Order.count({
      where: {
        status: {
          [Op.in]: ['pending', 'confirmed', 'processing']
        }
      }
    });

    // Pagos pendientes
    const pendingPayments = await Payment.findOne({
      where: {
        status: {
          [Op.in]: ['pending', 'partial']
        }
      },
      attributes: [
        [conn.fn('COUNT', conn.col('id')), 'count'],
        [conn.fn('SUM', conn.col('amount')), 'totalAmount']
      ],
      raw: true
    });

    // Clientes registrados este mes
    const newCustomers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        },
        role: 'Customer'
      }
    });

    res.json({
      error: false,
      message: 'Estadísticas del dashboard obtenidas exitosamente',
      data: {
        sales: {
          daily: {
            total: parseFloat(dailySales[0]?.dataValues?.totalSales || 0),
            orders: parseInt(dailySales[0]?.dataValues?.totalOrders || 0)
          },
          monthly: {
            total: parseFloat(monthlySales[0]?.dataValues?.totalSales || 0),
            orders: parseInt(monthlySales[0]?.dataValues?.totalOrders || 0)
          }
        },
        inventory: {
          lowStockProducts,
          topProducts: topProducts.map(item => ({
            product: item.product,
            totalSold: parseInt(item.dataValues.totalSold),
            totalRevenue: parseFloat(item.dataValues.totalRevenue)
          }))
        },
        orders: {
          pending: pendingOrders
        },
        payments: {
          pending: {
            count: parseInt(pendingPayments?.count || 0),
            amount: parseFloat(pendingPayments?.totalAmount || 0)
          }
        },
        customers: {
          newThisMonth: newCustomers
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener gráfico de ventas por período
const getSalesChart = async (req, res) => {
  try {
    const { period = 'month', year = new Date().getFullYear() } = req.query;

    let groupBy, dateFormat;
    let startDate, endDate;

    if (period === 'year') {
      // Ventas por mes del año
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
      groupBy = [
        conn.fn('EXTRACT', conn.literal('MONTH FROM "Order"."createdAt"')),
        conn.fn('EXTRACT', conn.literal('YEAR FROM "Order"."createdAt"'))
      ];
      dateFormat = 'month';
    } else {
      // Ventas por día del mes actual
      const month = req.query.month || new Date().getMonth();
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
      groupBy = [
        conn.fn('EXTRACT', conn.literal('DAY FROM "Order"."createdAt"')),
        conn.fn('EXTRACT', conn.literal('MONTH FROM "Order"."createdAt"')),
        conn.fn('EXTRACT', conn.literal('YEAR FROM "Order"."createdAt"'))
      ];
      dateFormat = 'day';
    }

    const salesData = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      attributes: [
        ...groupBy,
        [conn.fn('SUM', conn.col('Order.total')), 'totalSales'],
        [conn.fn('COUNT', conn.col('Order.id')), 'totalOrders']
      ],
      group: groupBy,
      order: groupBy
    });

    res.json({
      error: false,
      message: 'Gráfico de ventas obtenido exitosamente',
      data: {
        period,
        dateFormat,
        salesData: salesData.map(item => ({
          period: dateFormat === 'month' 
            ? item.dataValues.date_part 
            : `${item.dataValues.date_part}`,
          totalSales: parseFloat(item.dataValues.totalSales),
          totalOrders: parseInt(item.dataValues.totalOrders)
        }))
      }
    });

  } catch (error) {
    console.error('Error al obtener gráfico de ventas:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener ventas semanales
const getWeeklySales = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), week } = req.query;
    
    // Si se especifica una semana, usar esa semana, sino usar las últimas 12 semanas
    let startDate, endDate;
    
    if (week) {
      // Calcular fechas para una semana específica
      const firstDayOfYear = new Date(year, 0, 1);
      const daysToFirstMonday = (8 - firstDayOfYear.getDay()) % 7;
      startDate = new Date(year, 0, 1 + daysToFirstMonday + (week - 1) * 7);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else {
      // Últimas 12 semanas
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(endDate.getDate() - (12 * 7));
    }

    const weeklyData = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      attributes: [
        [conn.fn('EXTRACT', conn.literal('WEEK FROM "Order"."createdAt"')), 'week'],
        [conn.fn('EXTRACT', conn.literal('YEAR FROM "Order"."createdAt"')), 'year'],
        [conn.fn('SUM', conn.col('Order.total')), 'totalSales'],
        [conn.fn('COUNT', conn.col('Order.id')), 'totalOrders']
      ],
      group: [
        conn.fn('EXTRACT', conn.literal('WEEK FROM "Order"."createdAt"')),
        conn.fn('EXTRACT', conn.literal('YEAR FROM "Order"."createdAt"'))
      ],
      order: [
        [conn.fn('EXTRACT', conn.literal('YEAR FROM "Order"."createdAt"')), 'DESC'],
        [conn.fn('EXTRACT', conn.literal('WEEK FROM "Order"."createdAt"')), 'DESC']
      ]
    });

    res.json({
      error: false,
      message: 'Ventas semanales obtenidas exitosamente',
      data: {
        period: 'week',
        startDate,
        endDate,
        weeklyData: weeklyData.map(item => ({
          week: parseInt(item.dataValues.week),
          year: parseInt(item.dataValues.year),
          totalSales: parseFloat(item.dataValues.totalSales),
          totalOrders: parseInt(item.dataValues.totalOrders)
        }))
      }
    });

  } catch (error) {
    console.error('Error al obtener ventas semanales:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener ventas mensuales
const getMonthlySales = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), months = 12 } = req.query;

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const monthlyData = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      attributes: [
        [conn.fn('EXTRACT', conn.literal('MONTH FROM "Order"."createdAt"')), 'month'],
        [conn.fn('EXTRACT', conn.literal('YEAR FROM "Order"."createdAt"')), 'year'],
        [conn.fn('SUM', conn.col('Order.total')), 'totalSales'],
        [conn.fn('COUNT', conn.col('Order.id')), 'totalOrders']
      ],
      group: [
        conn.fn('EXTRACT', conn.literal('MONTH FROM "Order"."createdAt"')),
        conn.fn('EXTRACT', conn.literal('YEAR FROM "Order"."createdAt"'))
      ],
      order: [
        [conn.fn('EXTRACT', conn.literal('YEAR FROM "Order"."createdAt"')), 'DESC'],
        [conn.fn('EXTRACT', conn.literal('MONTH FROM "Order"."createdAt"')), 'DESC']
      ]
    });

    res.json({
      error: false,
      message: 'Ventas mensuales obtenidas exitosamente',
      data: {
        period: 'month',
        year: parseInt(year),
        monthlyData: monthlyData.map(item => ({
          month: parseInt(item.dataValues.month),
          year: parseInt(item.dataValues.year),
          totalSales: parseFloat(item.dataValues.totalSales),
          totalOrders: parseInt(item.dataValues.totalOrders)
        }))
      }
    });

  } catch (error) {
    console.error('Error al obtener ventas mensuales:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de ingresos y ganancias
const getRevenueStats = async (req, res) => {
  try {
    const { period = 'month', year = new Date().getFullYear() } = req.query;
    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Calcular ganancias (ventas - costos)
    const revenueQuery = `
      SELECT 
        SUM(oi.subtotal) as totalRevenue,
        SUM(oi.quantity * p."purchasePrice") as totalCost,
        SUM(oi.subtotal - (oi.quantity * p."purchasePrice")) as totalProfit,
        COUNT(DISTINCT o.id) as totalOrders
      FROM "Orders" o
      JOIN "OrderItems" oi ON o.id = oi."orderId"
      JOIN "Products" p ON oi."productId" = p.id
      WHERE o.status NOT IN ('cancelled')
        AND o."createdAt" >= :startDate
        AND o."createdAt" <= :endDate
    `;

    let startDate, endDate;
    if (period === 'month') {
      startDate = startOfMonth;
      endDate = today;
    } else {
      startDate = startOfYear;
      endDate = today;
    }

    const [revenueResults] = await conn.query(revenueQuery, {
      replacements: { startDate, endDate }
    });

    // Comparación con período anterior
    let previousStartDate, previousEndDate;
    if (period === 'month') {
      previousStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      previousEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
    } else {
      previousStartDate = new Date(today.getFullYear() - 1, 0, 1);
      previousEndDate = new Date(today.getFullYear() - 1, 11, 31);
    }

    const [previousResults] = await conn.query(revenueQuery, {
      replacements: { startDate: previousStartDate, endDate: previousEndDate }
    });

    const current = revenueResults[0];
    const previous = previousResults[0];

    // Calcular porcentajes de crecimiento
    const revenueGrowth = previous.totalrevenue ? 
      ((current.totalrevenue - previous.totalrevenue) / previous.totalrevenue * 100) : 0;
    const profitGrowth = previous.totalprofit ? 
      ((current.totalprofit - previous.totalprofit) / previous.totalprofit * 100) : 0;

    res.json({
      error: false,
      message: 'Estadísticas de ingresos obtenidas exitosamente',
      data: {
        period,
        current: {
          revenue: parseFloat(current.totalrevenue || 0),
          cost: parseFloat(current.totalcost || 0),
          profit: parseFloat(current.totalprofit || 0),
          orders: parseInt(current.totalorders || 0),
          profitMargin: current.totalrevenue ? 
            (current.totalprofit / current.totalrevenue * 100) : 0
        },
        previous: {
          revenue: parseFloat(previous.totalrevenue || 0),
          cost: parseFloat(previous.totalcost || 0),
          profit: parseFloat(previous.totalprofit || 0),
          orders: parseInt(previous.totalorders || 0)
        },
        growth: {
          revenue: parseFloat(revenueGrowth.toFixed(2)),
          profit: parseFloat(profitGrowth.toFixed(2))
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de ingresos:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de productos
const getProductStats = async (req, res) => {
  try {
    const { period = 'month', limit = 10 } = req.query;
    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    const startDate = period === 'month' ? startOfMonth : startOfYear;

    // Productos más vendidos
    const topSelling = await OrderItem.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'sku', 'name', 'purchasePrice', 'price']
        },
        {
          model: Order,
          as: 'order',
          where: {
            createdAt: { [Op.gte]: startDate },
            status: { [Op.notIn]: ['cancelled'] }
          },
          attributes: []
        }
      ],
      attributes: [
        'productId',
        [conn.fn('SUM', conn.col('OrderItem.quantity')), 'totalSold'],
        [conn.fn('SUM', conn.col('OrderItem.subtotal')), 'totalRevenue'],
        [conn.fn('COUNT', conn.col('OrderItem.id')), 'timesOrdered']
      ],
      group: ['productId', 'product.id', 'product.sku', 'product.name', 'product.purchasePrice', 'product.price'],
      order: [[conn.fn('SUM', conn.col('OrderItem.quantity')), 'DESC']],
      limit: parseInt(limit)
    });

    // Productos con mejor margen
    const bestMargin = await OrderItem.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'sku', 'name', 'purchasePrice', 'price']
        },
        {
          model: Order,
          as: 'order',
          where: {
            createdAt: { [Op.gte]: startDate },
            status: { [Op.notIn]: ['cancelled'] }
          },
          attributes: []
        }
      ],
      attributes: [
        'productId',
        [conn.fn('SUM', conn.col('OrderItem.quantity')), 'totalSold'],
        [conn.fn('SUM', conn.col('OrderItem.subtotal')), 'totalRevenue']
      ],
      group: ['productId', 'product.id', 'product.sku', 'product.name', 'product.purchasePrice', 'product.price'],
      order: [[conn.literal('SUM("OrderItem"."subtotal") - SUM("OrderItem"."quantity" * "product"."purchasePrice")'), 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      error: false,
      message: 'Estadísticas de productos obtenidas exitosamente',
      data: {
        period,
        topSelling: topSelling.map(item => ({
          product: item.product,
          totalSold: parseInt(item.dataValues.totalSold),
          totalRevenue: parseFloat(item.dataValues.totalRevenue),
          timesOrdered: parseInt(item.dataValues.timesOrdered),
          profit: parseFloat(item.dataValues.totalRevenue) - 
                 (parseInt(item.dataValues.totalSold) * parseFloat(item.product.purchasePrice)),
          profitMargin: item.product.price ? 
            ((item.product.price - item.product.purchasePrice) / item.product.price * 100) : 0
        })),
        bestMargin: bestMargin.map(item => ({
          product: item.product,
          totalSold: parseInt(item.dataValues.totalSold),
          totalRevenue: parseFloat(item.dataValues.totalRevenue),
          profit: parseFloat(item.dataValues.totalRevenue) - 
                 (parseInt(item.dataValues.totalSold) * parseFloat(item.product.purchasePrice)),
          profitMargin: item.product.price ? 
            ((item.product.price - item.product.purchasePrice) / item.product.price * 100) : 0
        }))
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de productos:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener top clientes
const getTopCustomers = async (req, res) => {
  try {
    const { period = 'month', limit = 10 } = req.query;
    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    const startDate = period === 'month' ? startOfMonth : startOfYear;

    // Clientes con más compras por monto
    const topByAmount = await Order.findAll({
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['n_document', 'first_name', 'last_name', 'email'],
          where: {
            role: 'Customer'
          }
        }
      ],
      where: {
        createdAt: { [Op.gte]: startDate },
        status: { [Op.notIn]: ['cancelled'] }
      },
      attributes: [
        'userId',
        [conn.fn('SUM', conn.col('Order.total')), 'totalSpent'],
        [conn.fn('COUNT', conn.col('Order.id')), 'totalOrders'],
        [conn.fn('AVG', conn.col('Order.total')), 'averageOrder']
      ],
      group: ['userId', 'customer.n_document', 'customer.first_name', 'customer.last_name', 'customer.email'],
      order: [[conn.fn('SUM', conn.col('Order.total')), 'DESC']],
      limit: parseInt(limit)
    });

    // Clientes con más órdenes
    const topByOrders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['n_document', 'first_name', 'last_name', 'email'],
          where: {
            role: 'Customer'
          }
        }
      ],
      where: {
        createdAt: { [Op.gte]: startDate },
        status: { [Op.notIn]: ['cancelled'] }
      },
      attributes: [
        'userId',
        [conn.fn('SUM', conn.col('Order.total')), 'totalSpent'],
        [conn.fn('COUNT', conn.col('Order.id')), 'totalOrders'],
        [conn.fn('AVG', conn.col('Order.total')), 'averageOrder']
      ],
      group: ['userId', 'customer.n_document', 'customer.first_name', 'customer.last_name', 'customer.email'],
      order: [[conn.fn('COUNT', conn.col('Order.id')), 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      error: false,
      message: 'Top clientes obtenidos exitosamente',
      data: {
        period,
        topByAmount: topByAmount.map(item => ({
          customer: {
            id: item.customer.n_document,
            firstName: item.customer.first_name,
            lastName: item.customer.last_name,
            email: item.customer.email
          },
          totalSpent: parseFloat(item.dataValues.totalSpent),
          totalOrders: parseInt(item.dataValues.totalOrders),
          averageOrder: parseFloat(item.dataValues.averageOrder)
        })),
        topByOrders: topByOrders.map(item => ({
          customer: {
            id: item.customer.n_document,
            firstName: item.customer.first_name,
            lastName: item.customer.last_name,
            email: item.customer.email
          },
          totalSpent: parseFloat(item.dataValues.totalSpent),
          totalOrders: parseInt(item.dataValues.totalOrders),
          averageOrder: parseFloat(item.dataValues.averageOrder)
        }))
      }
    });

  } catch (error) {
    console.error('Error al obtener top clientes:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getDashboardStats,
  getSalesChart,
  getWeeklySales,
  getMonthlySales,
  getRevenueStats,
  getProductStats,
  getTopCustomers
};
