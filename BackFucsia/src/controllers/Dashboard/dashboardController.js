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
        [conn.fn('SUM', conn.col('total')), 'totalSales'],
        [conn.fn('COUNT', conn.col('id')), 'totalOrders']
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
        [conn.fn('SUM', conn.col('total')), 'totalSales'],
        [conn.fn('COUNT', conn.col('id')), 'totalOrders']
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
        [conn.fn('SUM', conn.col('quantity')), 'totalSold'],
        [conn.fn('SUM', conn.col('subtotal')), 'totalRevenue']
      ],
      group: ['productId', 'product.id', 'product.sku', 'product.name'],
      order: [[conn.fn('SUM', conn.col('quantity')), 'DESC']],
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
    const pendingPayments = await Payment.findAll({
      where: {
        status: 'pending'
      },
      attributes: [
        [conn.fn('COUNT', conn.col('id')), 'count'],
        [conn.fn('SUM', conn.col('amount')), 'totalAmount']
      ]
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
            count: parseInt(pendingPayments[0]?.dataValues?.count || 0),
            amount: parseFloat(pendingPayments[0]?.dataValues?.totalAmount || 0)
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
        conn.fn('EXTRACT', conn.literal('MONTH FROM "createdAt"')),
        conn.fn('EXTRACT', conn.literal('YEAR FROM "createdAt"'))
      ];
      dateFormat = 'month';
    } else {
      // Ventas por día del mes actual
      const month = req.query.month || new Date().getMonth();
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
      groupBy = [
        conn.fn('EXTRACT', conn.literal('DAY FROM "createdAt"')),
        conn.fn('EXTRACT', conn.literal('MONTH FROM "createdAt"')),
        conn.fn('EXTRACT', conn.literal('YEAR FROM "createdAt"'))
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
        [conn.fn('SUM', conn.col('total')), 'totalSales'],
        [conn.fn('COUNT', conn.col('id')), 'totalOrders']
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

module.exports = {
  getDashboardStats,
  getSalesChart
};
