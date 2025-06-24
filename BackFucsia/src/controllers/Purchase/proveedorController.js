const { Proveedor, PurchaseOrder } = require('../../data');
const { Op } = require('sequelize');

// Crear proveedor
const createProveedor = async (req, res) => {
  try {
    const {
      nombre,
      nit,
      contacto,
      telefono,
      email,
      direccion,
      terminosPago,
      notas
    } = req.body;

    // Validaciones básicas
    if (!nombre) {
      return res.status(400).json({
        error: true,
        message: 'El nombre del proveedor es requerido'
      });
    }

    // Verificar NIT único si se proporciona
    if (nit) {
      const existingProveedor = await Proveedor.findOne({ where: { nit } });
      if (existingProveedor) {
        return res.status(400).json({
          error: true,
          message: 'Ya existe un proveedor con este NIT'
        });
      }
    }

    const proveedor = await Proveedor.create({
      nombre,
      nit,
      contacto,
      telefono,
      email,
      direccion,
      terminosPago: terminosPago || 'Contado',
      notas,
      isActive: true
    });

    res.status(201).json({
      error: false,
      message: 'Proveedor creado exitosamente',
      data: proveedor
    });

  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Obtener proveedores
const getProveedores = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { nit: { [Op.iLike]: `%${search}%` } },
        { contacto: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    const proveedores = await Proveedor.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: PurchaseOrder,
          as: 'purchaseOrders',
          attributes: ['id', 'orderNumber', 'total', 'status'],
          limit: 5,
          order: [['createdAt', 'DESC']],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['nombre', 'ASC']]
    });

    res.json({
      error: false,
      message: 'Proveedores obtenidos exitosamente',
      data: {
        proveedores: proveedores.rows,
        totalProveedores: proveedores.count,
        totalPages: Math.ceil(proveedores.count / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener proveedor por ID
const getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;

    const proveedor = await Proveedor.findByPk(id, {
      include: [
        {
          model: PurchaseOrder,
          as: 'purchaseOrders',
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!proveedor) {
      return res.status(404).json({
        error: true,
        message: 'Proveedor no encontrado'
      });
    }

    res.json({
      error: false,
      message: 'Proveedor obtenido exitosamente',
      data: proveedor
    });

  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar proveedor
const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({
        error: true,
        message: 'Proveedor no encontrado'
      });
    }

    // Verificar NIT único si se está actualizando
    if (updateData.nit && updateData.nit !== proveedor.nit) {
      const existingProveedor = await Proveedor.findOne({ 
        where: { 
          nit: updateData.nit,
          id: { [Op.ne]: id }
        }
      });
      if (existingProveedor) {
        return res.status(400).json({
          error: true,
          message: 'Ya existe otro proveedor con este NIT'
        });
      }
    }

    await proveedor.update(updateData);

    res.json({
      error: false,
      message: 'Proveedor actualizado exitosamente',
      data: proveedor
    });

  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar/desactivar proveedor
const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;

    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({
        error: true,
        message: 'Proveedor no encontrado'
      });
    }

    // Verificar si tiene órdenes de compra activas
    const activePurchaseOrders = await PurchaseOrder.count({
      where: {
        proveedorId: id,
        status: { [Op.in]: ['pendiente', 'parcial'] }
      }
    });

    if (activePurchaseOrders > 0) {
      // Solo desactivar si tiene órdenes activas
      await proveedor.update({ isActive: false });
      return res.json({
        error: false,
        message: 'Proveedor desactivado (tiene órdenes de compra activas)',
        data: proveedor
      });
    }

    // Eliminar completamente si no tiene órdenes activas
    await proveedor.destroy();

    res.json({
      error: false,
      message: 'Proveedor eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createProveedor,
  getProveedores,
  getProveedorById,
  updateProveedor,
  deleteProveedor
};
