const { Op } = require('sequelize');
const { StockMovement, Product, User, Order, conn } = require('../../data');

// Obtener movimientos de stock con filtros
const getStockMovements = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      productId, 
      type, 
      startDate, 
      endDate,
      userId 
    } = req.query;

    const whereClause = {};
    if (productId) whereClause.productId = productId;
    if (type) whereClause.type = type;
    if (userId) whereClause.userId = userId;
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }

    const movements = await StockMovement.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'sku', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['n_document', 'first_name', 'last_name']
        },
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'orderNumber']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      error: false,
      message: 'Movimientos de stock obtenidos exitosamente',
      data: {
        movements: movements.rows,
        totalMovements: movements.count,
        totalPages: Math.ceil(movements.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error al obtener movimientos de stock:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Crear movimiento de stock manual
const createStockMovement = async (req, res) => {
  const transaction = await conn.transaction();
  
  try {
    const { 
      productId, 
      quantity, 
      type, 
      reason, 
      notes 
    } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado'
      });
    }

    const previousStock = product.stock;
    let newStock;

    if (type === 'entrada') {
      newStock = previousStock + Math.abs(quantity);
    } else if (type === 'salida') {
      if (previousStock < Math.abs(quantity)) {
        await transaction.rollback();
        return res.status(400).json({
          error: true,
          message: 'Stock insuficiente'
        });
      }
      newStock = previousStock - Math.abs(quantity);
    } else if (type === 'ajuste') {
      newStock = Math.abs(quantity);
    }

    // Crear movimiento de stock
    const movement = await StockMovement.create({
      productId,
      quantity: type === 'salida' ? -Math.abs(quantity) : Math.abs(quantity),
      type,
      reason,
      previousStock,
      currentStock: newStock,
      userId: req.user?.id || req.user?.n_document,
      notes
    }, { transaction });

    // Actualizar stock del producto
    await product.update({ stock: newStock }, { transaction });

    await transaction.commit();

    res.status(201).json({
      error: false,
      message: 'Movimiento de stock creado exitosamente',
      data: {
        movement,
        previousStock,
        newStock,
        product: {
          id: product.id,
          sku: product.sku,
          name: product.name
        }
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear movimiento de stock:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener historial de stock de un producto
const getProductStockHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado'
      });
    }

    const movements = await StockMovement.findAndCountAll({
      where: { productId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['n_document', 'first_name', 'last_name']
        },
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'orderNumber']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      error: false,
      message: 'Historial de stock obtenido exitosamente',
      data: {
        product: {
          id: product.id,
          sku: product.sku,
          name: product.name,
          currentStock: product.stock,
          minStock: product.minStock
        },
        movements: movements.rows,
        totalMovements: movements.count,
        totalPages: Math.ceil(movements.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error al obtener historial de stock:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener productos con stock bajo
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        [Op.and]: [
          { isActive: true },
          conn.where(
            conn.col('stock'),
            Op.lte,
            conn.col('minStock')
          )
        ]
      },
      attributes: ['id', 'sku', 'name', 'stock', 'minStock'],
      order: [['stock', 'ASC']]
    });

    res.json({
      error: false,
      message: 'Productos con stock bajo obtenidos exitosamente',
      data: {
        products,
        totalProducts: products.length,
        alerts: {
          critical: products.filter(p => p.stock === 0).length,
          warning: products.filter(p => p.stock > 0 && p.stock <= p.minStock).length
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Generar reporte de stock
const generateStockReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
    }

    const movements = await StockMovement.findAll({
      where: whereClause,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'sku', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const summary = {
      totalMovements: movements.length,
      entradas: movements.filter(m => m.type === 'entrada').length,
      salidas: movements.filter(m => m.type === 'salida').length,
      ajustes: movements.filter(m => m.type === 'ajuste').length,
      totalEntradas: movements
        .filter(m => m.type === 'entrada')
        .reduce((sum, m) => sum + Math.abs(m.quantity), 0),
      totalSalidas: movements
        .filter(m => m.type === 'salida')
        .reduce((sum, m) => sum + Math.abs(m.quantity), 0)
    };

    res.json({
      error: false,
      message: 'Reporte de stock generado exitosamente',
      data: {
        summary,
        movements,
        period: {
          startDate: startDate || 'Inicio',
          endDate: endDate || 'Fin'
        }
      }
    });

  } catch (error) {
    console.error('Error al generar reporte de stock:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getStockMovements,
  createStockMovement,
  getProductStockHistory,
  getLowStockProducts,
  generateStockReport
};
