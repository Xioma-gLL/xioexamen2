const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');
const Cliente       = require('./Cliente');

const Reserva = sequelize.define(
  'Reserva',
  {
    id_reserva: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true,
    },
    fecha: {
      type:      DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La fecha es obligatoria.' },
        isDate:   { msg: 'Debe ser una fecha válida.' },
      },
    },
    comprobante_img: {
      type:      DataTypes.STRING(255),
      allowNull: true,
    },
    id_cliente: {
      type:      DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Debe seleccionar un cliente.' },
      },
    },
  },
  {
    tableName:  'reservas',
    timestamps: false,
  }
);

// Asociaciones
Cliente.hasMany(Reserva,  { foreignKey: 'id_cliente', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Reserva.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

module.exports = Reserva;
