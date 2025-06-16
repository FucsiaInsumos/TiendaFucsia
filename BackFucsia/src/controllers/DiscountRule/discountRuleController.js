const { DiscountRule, Product, Category } = require('../../data');
const { Op } = require('sequelize');

const createDiscountRule = async (req, res) => {
  try {
    const {
      name, discountType, discountValue, conditionType,
      minQuantity, minAmount, maxQuantity, maxAmount,
      applicableFor, productId, categoryId, startDate, endDate, priority
    } = req.body;

    const discountRule = await DiscountRule.create({
      name,
      discountType,
      discountValue,
      conditionType,
      minQuantity,
      minAmount,
      maxQuantity,
      maxAmount,
      applicableFor,
      productId,
      categoryId,
      startDate,
      endDate,
      priority: priority || 0,
      isActive: true
    });

    return res.status(201).json({
      error: false,
      message: 'Regla de descuento creada exitosamente',
      data: discountRule
    });
  } catch (error) {
    console.error('Error al crear regla de descuento:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

const getDiscountRules = async (req, res) => {
  try {
    const discountRules = await DiscountRule.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: Category, as: 'category' }
      ],
      order: [['priority', 'DESC'], ['createdAt', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Reglas de descuento obtenidas exitosamente',
      data: discountRules
    });
  } catch (error) {
    console.error('Error al obtener reglas de descuento:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

const getDiscountRuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const discountRule = await DiscountRule.findByPk(id, {
      include: [
        { model: Product, as: 'product' },
        { model: Category, as: 'category' }
      ]
    });

    if (!discountRule) {
      return res.status(404).json({
        error: true,
        message: 'Regla de descuento no encontrada'
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Regla de descuento obtenida exitosamente',
      data: discountRule
    });
  } catch (error) {
    console.error('Error al obtener regla de descuento:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

const updateDiscountRule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, discountType, discountValue, conditionType,
      minQuantity, minAmount, maxQuantity, maxAmount,
      applicableFor, productId, categoryId, startDate, endDate, priority, isActive
    } = req.body;

    const discountRule = await DiscountRule.findByPk(id);
    if (!discountRule) {
      return res.status(404).json({
        error: true,
        message: 'Regla de descuento no encontrada'
      });
    }

    await discountRule.update({
      name,
      discountType,
      discountValue,
      conditionType,
      minQuantity,
      minAmount,
      maxQuantity,
      maxAmount,
      applicableFor,
      productId,
      categoryId,
      startDate,
      endDate,
      priority,
      isActive
    });

    return res.status(200).json({
      error: false,
      message: 'Regla de descuento actualizada exitosamente',
      data: discountRule
    });
  } catch (error) {
    console.error('Error al actualizar regla de descuento:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor',
      details: error.message
    });
  }
};

const deleteDiscountRule = async (req, res) => {
  try {
    const { id } = req.params;
    const discountRule = await DiscountRule.findByPk(id);
    
    if (!discountRule) {
      return res.status(404).json({
        error: true,
        message: 'Regla de descuento no encontrada'
      });
    }

    await discountRule.destroy();

    return res.status(200).json({
      error: false,
      message: 'Regla de descuento eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar regla de descuento:', error);
    return res.status(500).json({
      error: true,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createDiscountRule,
  getDiscountRules,
  getDiscountRuleById,
  updateDiscountRule,
  deleteDiscountRule
};
