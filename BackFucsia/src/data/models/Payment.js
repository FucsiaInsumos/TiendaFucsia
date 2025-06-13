const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Payment', {
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['wompi', 'nequi', 'bancolombia', 'efectivo', 'tarjeta', 'credito', 'daviplata', 'combinado']]
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'completed', 'failed', 'refunded']]
      }
    },
    paymentDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Detalles específicos del método de pago (referencia, confirmación, etc.)'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ID de transacción del proveedor de pago'
    }
  });
};