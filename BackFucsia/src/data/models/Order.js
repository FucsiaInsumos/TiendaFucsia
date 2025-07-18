const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'n_document'
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed', 'confirmed'), // Añadido 'confirmed'
      allowNull: false,
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'partial', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    orderType: {
      type: DataTypes.ENUM('local', 'online', 'distributor'),
      allowNull: false
    },
    cashierId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'n_document'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      
    },
    // En el modelo Order
appliedDiscounts: {
  type: DataTypes.JSON,
  allowNull: true,
  defaultValue: null
}
  });
};