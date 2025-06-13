const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('StockMovement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
      comment: 'Cantidad (positiva para entrada, negativa para salida)'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['entrada', 'salida', 'ajuste', 'transferencia']]
      }
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Razón del movimiento (venta, compra, ajuste, etc.)'
    },
    previousStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Stock anterior al movimiento'
    },
    currentStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Stock actual después del movimiento'
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'n_document'
      },
      comment: 'Usuario que realizó el movimiento'
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      },
      comment: 'Orden relacionada (si aplica)'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};