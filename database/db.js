const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user:process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL - Base de datos Sis_Cine_db');
  }
});

module.exports = connection;