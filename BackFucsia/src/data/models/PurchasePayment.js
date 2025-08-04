const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PurchasePayment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    purchaseOrderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'PurchaseOrders',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('efectivo', 'transferencia', 'cheque', 'tarjeta_credito', 'tarjeta_debito', 'pse', 'credito', 'otro'),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Referencia del pago (número de transferencia, cheque, etc.)'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ PERMITIR NULL para usuarios del sistema
      references: {
        model: 'Users',
        key: 'n_document'
      }
    }
  }, {
    tableName: 'purchase_payments',
    timestamps: true
  });
};
