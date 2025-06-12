const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('DiscountRule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nombre descriptivo de la regla de descuento'
    },
    discountType: {
      type: DataTypes.STRING, // Cambiado de ENUM a STRING
      allowNull: false,
      validate: {
        isIn: [['percentage', 'fixed_amount']], // Validación para restringir valores
      },
      comment: 'Tipo de descuento: porcentaje o monto fijo'
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Valor del descuento (% o monto)'
    },
    conditionType: {
      type: DataTypes.STRING, // Cambiado de ENUM a STRING
      allowNull: false,
      validate: {
        isIn: [['quantity', 'amount', 'both']], // Validación para restringir valores
      },
      comment: 'Tipo de condición: por cantidad, monto o ambos'
    },
    minQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Cantidad mínima requerida'
    },
    minAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Monto mínimo requerido'
    },
    maxQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Cantidad máxima para aplicar descuento'
    },
    maxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Monto máximo para aplicar descuento'
    },
    applicableFor: {
      type: DataTypes.STRING, // Cambiado de ENUM a STRING
      defaultValue: 'all',
      validate: {
        isIn: [['all', 'customers', 'distributors']], // Validación para restringir valores
      },
      comment: 'A quién aplica el descuento'
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'id'
      },
      comment: 'Producto específico (null = aplica a todos)'
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      },
      comment: 'Categoría específica (null = aplica a todas)'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de inicio de vigencia'
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de fin de vigencia'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Prioridad de aplicación (mayor número = mayor prioridad)'
    }
  });
};
