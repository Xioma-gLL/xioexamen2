const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME     || 'xioexamen2',
  process.env.DB_USER     || 'root',       // Cambia según tu configuración
  process.env.DB_PASSWORD || '',           // Cambia según tu configuración
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle:    10000,
    },
  }
);

module.exports = sequelize;
