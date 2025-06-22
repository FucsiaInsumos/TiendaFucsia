const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Payment', {
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM('wompi', 'nequi', 'bancolombia', 'efectivo', 'tarjeta', 'credito', 'daviplata', 'combinado'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      
    }
  });
};