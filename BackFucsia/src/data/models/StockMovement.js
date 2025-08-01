const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
 return sequelize.define('StockMovement', {
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
     
    },
    type: {
      type: DataTypes.ENUM('entrada', 'salida', 'ajuste', 'transferencia'),
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    previousStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    },
    currentStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'n_document'
      },
     
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    purchaseOrderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'PurchaseOrders',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};