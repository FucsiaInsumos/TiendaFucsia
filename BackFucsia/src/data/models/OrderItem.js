const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('OrderItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Precio unitario al momento de la venta'
    },
    appliedDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      comment: 'Descuento aplicado a este item'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Subtotal del item (quantity * unitPrice - appliedDiscount)'
    },
    discountRuleId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'DiscountRules',
        key: 'id'
      },
      comment: 'Regla de descuento aplicada'
    }
  });
};
