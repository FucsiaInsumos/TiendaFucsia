const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Número de orden secuencial'
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
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded']]
      }
    },
    orderType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['local', 'online', 'distributor']]
      }
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'partial', 'completed', 'failed']]
      }
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
      comment: 'Dirección de envío para pedidos online'
    }
  });
};