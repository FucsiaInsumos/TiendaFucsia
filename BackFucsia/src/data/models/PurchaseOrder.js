const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PurchaseOrder', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    proveedorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Proveedors',
        key: 'id'
      }
    },
    fechaCompra: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    numeroFactura: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    impuestos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    descuentos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pendiente', 'recibida', 'parcial', 'completada', 'cancelada'),
      defaultValue: 'pendiente'
    },
    metodoPago: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechaVencimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    archivoComprobante: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'n_document'
      }
    }
  });
};
