const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
 return sequelize.define('DiscountRule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    discountType: {
      type: DataTypes.ENUM("percentage", "fixed_amount"), 
      allowNull: false,
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    conditionType: {
      type: DataTypes.ENUM("quantity", "amount", "both" ),
      allowNull: false,
    },
    minQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
     
    },
    minAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      
    },
    maxQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    maxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      
    },
    applicableFor: {
      type: DataTypes.ENUM("all", "customers", "distributors"), // Cambiado de ENUM a STRING
      defaultValue: 'all',
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'id'
      },
     
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      },
     
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      
    }
  });
};
