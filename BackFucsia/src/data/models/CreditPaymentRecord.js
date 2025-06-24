// Modelo para registrar abonos a créditos
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('CreditPaymentRecord', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    paymentId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    paymentMethod: {
      type: DataTypes.ENUM('efectivo', 'transferencia', 'tarjeta'),
      allowNull: false,
      defaultValue: 'efectivo'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    recordedBy: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ PERMITIR NULL para abonos sin usuario específico
      defaultValue: null
    },
    recordedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'credit_payment_records',
    timestamps: true
  });
};