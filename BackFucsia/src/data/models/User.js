const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'User',
    {
      n_document: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      wdoctype: {
        type: DataTypes.ENUM('RC', 'TI', 'CC','TE', 'CE', 'NIT','PAS', 'DEX', 'PEP','PPT', 'FI', 'NUIP'), // Cambiado de ENUM a STRING
        allowNull: true,
        
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
     
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM('Customer', 'Distributor', 'Cashier', 'Owner'), // Cambiado de ENUM a STRING
        defaultValue: 'Customer',
      
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      wlegalorganizationtype: {
        type: DataTypes.ENUM('person', 'company'), // Cambiado de ENUM a STRING
        allowNull: true,
        defaultValue: 'person',
      
      },
      scostumername: {
        type: DataTypes.STRING,
        allowNull: true,
        
      },
      stributaryidentificationkey: {
        type: DataTypes.ENUM('O-1', 'O-4', 'ZZ', 'ZA'), // Cambiado de ENUM a STRING
        allowNull: true,
        defaultValue: 'O-1',
       
      },
      sfiscalresponsibilities: {
        type: DataTypes.ENUM('O-13', 'O-15', 'O-23', 'O-47', 'R-99-PN'), // Cambiado de ENUM a STRING
        allowNull: true,
        defaultValue: 'R-99-PN',
       
      },
      sfiscalregime: {
        type: DataTypes.ENUM('48', '49'), // Cambiado de ENUM a STRING
        allowNull: true,
        defaultValue: '48',
       
      },
      

      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      paranoid: true,
    }
  );
};