const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PurchaseOrderItem', {
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
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productSku: {
      type: DataTypes.STRING,
      allowNull: true
    },
    productDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidadRecibida: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    precioVentaSugerido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    precioDistribuidorSugerido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    stockMinimo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 5
    },
    isNewProduct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};
  
