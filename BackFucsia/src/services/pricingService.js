const { Product, Distributor, DiscountRule } = require('../data');
const { Op } = require('sequelize');

// Obtener precio según tipo de usuario
const getProductPrice = async (productId, userType, userId = null) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    let basePrice = product.price;

    // Si es distribuidor, verificar si tiene precio especial
    if (userType === 'distributors' && product.distributorPrice) {
      // Verificar si el distribuidor cumple con el mínimo de compra
      const distributor = await Distributor.findOne({ where: { userId } });
      if (distributor && distributor.minimumPurchase) {
        // Aquí podrías agregar lógica para verificar historial de compras
        basePrice = product.distributorPrice;
      }
    }

    // Si está en promoción, usar precio promocional
    if (product.isPromotion && product.promotionPrice) {
      basePrice = product.promotionPrice;
    }

    return {
      basePrice,
      distributorPrice: product.distributorPrice,
      promotionPrice: product.promotionPrice,
      isPromotion: product.isPromotion
    };
  } catch (error) {
    console.error('Error al obtener precio del producto:', error);
    throw error;
  }
};

// Calcular precio final con descuentos
const calculateFinalPrice = async (items, userType = 'customers', userId = null) => {
  try {
    const results = [];
    let totalDiscount = 0;
    let subtotal = 0;

    for (const item of items) {
      const { productId, quantity } = item;
      
      // Obtener precio base del producto
      const pricing = await getProductPrice(productId, userType, userId);
      const unitPrice = pricing.basePrice;
      const itemTotal = quantity * unitPrice;
      
      subtotal += itemTotal;

      // Buscar descuentos aplicables
      const applicableDiscounts = await findApplicableDiscounts(
        productId, 
        quantity, 
        itemTotal, 
        userType
      );

      let itemDiscount = 0;
      let appliedRule = null;

      if (applicableDiscounts.length > 0) {
        // Aplicar el descuento de mayor prioridad
        const bestDiscount = applicableDiscounts[0];
        itemDiscount = bestDiscount.discountAmount;
        appliedRule = bestDiscount;
        totalDiscount += itemDiscount;
      }

      results.push({
        productId,
        quantity,
        unitPrice,
        itemTotal,
        itemDiscount,
        finalPrice: itemTotal - itemDiscount,
        appliedRule,
        pricing
      });
    }

    return {
      items: results,
      subtotal,
      totalDiscount,
      total: subtotal - totalDiscount
    };
  } catch (error) {
    console.error('Error al calcular precio final:', error);
    throw error;
  }
};

// Buscar descuentos aplicables
const findApplicableDiscounts = async (productId, quantity, itemTotal, userType) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) return [];

    const rules = await DiscountRule.findAll({
      where: {
        isActive: true,
        applicableFor: { [Op.in]: ['all', userType] },
        [Op.or]: [
          { productId: productId },
          { categoryId: product.categoryId },
          { productId: null, categoryId: null }
        ],
        [Op.or]: [
          { startDate: null },
          { startDate: { [Op.lte]: new Date() } }
        ],
        [Op.or]: [
          { endDate: null },
          { endDate: { [Op.gte]: new Date() } }
        ]
      },
      order: [['priority', 'DESC']]
    });

    const applicableDiscounts = [];

    for (const rule of rules) {
      let applies = false;

      switch (rule.conditionType) {
        case 'quantity':
          applies = quantity >= (rule.minQuantity || 0) && 
                   (rule.maxQuantity ? quantity <= rule.maxQuantity : true);
          break;
        case 'amount':
          applies = itemTotal >= (rule.minAmount || 0) && 
                   (rule.maxAmount ? itemTotal <= rule.maxAmount : true);
          break;
        case 'both':
          applies = quantity >= (rule.minQuantity || 0) && 
                   itemTotal >= (rule.minAmount || 0) &&
                   (rule.maxQuantity ? quantity <= rule.maxQuantity : true) &&
                   (rule.maxAmount ? itemTotal <= rule.maxAmount : true);
          break;
      }

      if (applies) {
        let discountAmount = 0;
        if (rule.discountType === 'percentage') {
          discountAmount = itemTotal * (rule.discountValue / 100);
        } else {
          discountAmount = Math.min(rule.discountValue, itemTotal);
        }

        applicableDiscounts.push({
          ruleId: rule.id,
          ruleName: rule.name,
          discountAmount,
          discountType: rule.discountType,
          discountValue: rule.discountValue
        });
      }
    }

    return applicableDiscounts;
  } catch (error) {
    console.error('Error al buscar descuentos aplicables:', error);
    return [];
  }
};

// Validar mínimo de compra para distribuidores
const validateMinimumPurchase = async (userId, totalAmount) => {
  try {
    const distributor = await Distributor.findOne({ where: { userId } });
    if (!distributor) {
      return { valid: false, message: 'Distribuidor no encontrado' };
    }

    if (totalAmount < distributor.minimumPurchase) {
      return {
        valid: false,
        message: `Monto mínimo de compra requerido: $${distributor.minimumPurchase}`,
        minimumPurchase: distributor.minimumPurchase,
        currentAmount: totalAmount
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error al validar mínimo de compra:', error);
    return { valid: false, message: 'Error interno del servidor' };
  }
};

module.exports = {
  getProductPrice,
  calculateFinalPrice,
  findApplicableDiscounts,
  validateMinimumPurchase
};
