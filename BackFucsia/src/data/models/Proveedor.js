const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Proveedor', {
    id: {
      type: DataTypes.UUID, // ✅ CAMBIAR DE INTEGER A UUID
      defaultValue: DataTypes.UUIDV4, // ✅ AGREGAR GENERACIÓN AUTOMÁTICA DE UUID
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nit: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    contacto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    terminosPago: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Contado'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};