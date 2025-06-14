const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('OrderItem', {
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
      
    },
    appliedDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      
    },
    discountRuleId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'DiscountRules',
        key: 'id'
      },
      
    }
  });
};
