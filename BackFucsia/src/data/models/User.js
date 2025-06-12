const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'User',
    {
      n_document: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      wdoctype: {
        type: DataTypes.STRING, // Cambiado de ENUM a STRING
        allowNull: true,
        validate: {
          isIn: [['RC', 'TI', 'CC','TE', 'CE', 'NIT','PAS', 'DEX', 'PEP','PPT', 'FI', 'NUIP']]
        }
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
        type: DataTypes.STRING, // Cambiado de ENUM a STRING
        defaultValue: 'Customer',
        validate: {
          isIn: [['Customer', 'Distributor', 'Cashier', 'Owner']]
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      wlegalorganizationtype: {
        type: DataTypes.STRING, // Cambiado de ENUM a STRING
        allowNull: true,
        defaultValue: 'person',
        validate: {
          isIn: [['person', 'company']]
        }
      },
      scostumername: {
        type: DataTypes.STRING,
        allowNull: true,
        
      },
      stributaryidentificationkey: {
        type: DataTypes.STRING, // Cambiado de ENUM a STRING
        allowNull: true,
        defaultValue: 'O-1',
        validate: {
          isIn: [['O-1', 'O-4', 'ZZ', 'ZA']]
        }
      },
      sfiscalresponsibilities: {
        type: DataTypes.STRING, // Cambiado de ENUM a STRING
        allowNull: true,
        defaultValue: 'R-99-PN',
        validate: {
          isIn: [['O-13', 'O-15', 'O-23', 'O-47', 'R-99-PN']]
        }
      },
      sfiscalregime: {
        type: DataTypes.STRING, // Cambiado de ENUM a STRING
        allowNull: true,
        defaultValue: '48',
        validate: {
          isIn: [['48', '49']]
        }
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