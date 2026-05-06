const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Cliente = sequelize.define(
  'Cliente',
  {
    id_cliente: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true,
    },
    nombre: {
      type:      DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre es obligatorio.' },
        len: {
          args: [1, 150],
          msg: 'El nombre no puede superar 150 caracteres.',
        },
      },
    },
  },
  {
    tableName:  'clientes',
    timestamps: false,
  }
);

module.exports = Cliente;
