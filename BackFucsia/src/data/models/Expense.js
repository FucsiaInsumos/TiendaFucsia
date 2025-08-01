const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Expense', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    expenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    categoryType: {
      type: DataTypes.ENUM('servicios', 'empleados', 'limpieza', 'mantenimiento', 'oficina', 'marketing', 'transporte', 'otros'),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    expenseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    paymentMethod: {
      type: DataTypes.ENUM('efectivo', 'transferencia', 'tarjeta', 'cheque', 'credito'),
      allowNull: false,
      defaultValue: 'efectivo'
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receiptUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'n_document'
      }
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'n_document'
      }
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurringFrequency: {
      type: DataTypes.ENUM('mensual', 'trimestral', 'semestral', 'anual'),
      allowNull: true
    }
  });
};