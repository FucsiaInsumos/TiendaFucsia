const { Distributor, User } = require('../../data');

// Crear distribuidor
const createDistributor = async (req, res) => {
  try {
    const {
      userId,
      discountPercentage,
      creditLimit,
      paymentTerm,
      minimumPurchase
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado'
      });
    }

    if (user.role !== 'Distributor') {
      return res.status(400).json({
        error: true,
        message: 'El usuario debe tener rol de Distribuidor'
      });
    }

    const existingDistributor = await Distributor.findOne({ where: { userId } });
    if (existingDistributor) {
      return res.status(400).json({
        error: true,
        message: 'Ya existe un distribuidor para este usuario'
      });
    }

    const distributor = await Distributor.create({
      userId,
      discountPercentage: discountPercentage || 0,
      creditLimit: creditLimit || 0,
      currentCredit: 0,
      paymentTerm: paymentTerm || 30,
      minimumPurchase: minimumPurchase || 0
    });

    return res.status(201).json({
      error: false,
      message: 'Distribuidor creado exitosamente',
      data: distributor
    });

  } catch (error) {
    console.error('Error al crear distribuidor:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Obtener todos los distribuidores
const getDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['n_document', 'first_name', 'last_name', 'email', 'phone', 'city']
        }
      ]
    });

    return res.status(200).json({
      error: false,
      message: 'Distribuidores obtenidos exitosamente',
      data: distributors
    });

  } catch (error) {
    console.error('Error al obtener distribuidores:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener distribuidor por ID de usuario
const getDistributorByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const distributor = await Distributor.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['n_document', 'first_name', 'last_name', 'email', 'phone', 'city']
        }
      ]
    });

    if (!distributor) {
      return res.status(404).json({
        error: true,
        message: 'Distribuidor no encontrado'
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Distribuidor obtenido exitosamente',
      data: distributor
    });

  } catch (error) {
    console.error('Error al obtener distribuidor:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar distribuidor
const updateDistributor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      discountPercentage,
      creditLimit,
      currentCredit,
      paymentTerm,
      minimumPurchase
    } = req.body;

    const distributor = await Distributor.findByPk(id);
    if (!distributor) {
      return res.status(404).json({
        error: true,
        message: 'Distribuidor no encontrado'
      });
    }

    const updateData = {};
    if (discountPercentage !== undefined) updateData.discountPercentage = discountPercentage;
    if (creditLimit !== undefined) updateData.creditLimit = creditLimit;
    if (currentCredit !== undefined) updateData.currentCredit = currentCredit;
    if (paymentTerm !== undefined) updateData.paymentTerm = paymentTerm;
    if (minimumPurchase !== undefined) updateData.minimumPurchase = minimumPurchase;

    await distributor.update(updateData);

    return res.status(200).json({
      error: false,
      message: 'Distribuidor actualizado exitosamente',
      data: distributor
    });

  } catch (error) {
    console.error('Error al actualizar distribuidor:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

module.exports = {
  createDistributor,
  getDistributors,
  getDistributorByUserId,
  updateDistributor
};
