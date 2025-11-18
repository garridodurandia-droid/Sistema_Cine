const db = require('../database/db')
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
require('dotenv').config()
const { empty, incompletos } = require('../utils/validaciones')


class authModel {

  login(data) {
    return new Promise(async (resolve, reject) => {
      const { usuario, clave } = data
      const vacio = empty(data);
      if (!vacio) {
        return resolve({ status: 400, mensaje: 'No se han proporcionado datos' });
      }
      try {
        const user = await new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND activo = ?'
          db.query(sql, [usuario, 1], (error, result) => {
            if (error) return reject({ status: 400, mensaje: error });
            if (result.length === 0) {
              return reject({ status: 404, mensaje: 'Usuario no encontrado o inactivo' });
            }
            resolve(result[0]);
          })
        })

        bcrypt.compare(clave, user.clave, function (err, result) {
          if (err) {
            return reject({ status: 500, mensaje: 'Error al verificar la contraseña' });
          }
          if (!result) {
            return reject({ status: 401, mensaje: 'Contraseña incorrecta' });
          } else {
            const token = jwt.sign({ usuario: usuario, nombre: user.nombre, apellido: user.apellido, rol: user.rol }, process.env.SECRET, { expiresIn: '1h' });
            resolve({ status: 200, mensaje: 'Login exitoso', token: token });
          }
        });
      } catch (error) {
        reject(error);
        return;
      }




    })
  }

  register(data) {
    return new Promise(async (resolve, reject) => {
      const { nombre, apellido, usuario, cedula, email, clave, rol } = data
      const vacio = empty(data);
      if (!vacio) {
        return resolve({ status: 400, mensaje: 'No se han proporcionado datos' });
      }
      const hash = await new Promise((resolve, reject) => {
        bcrypt.hash(clave, saltRounds, function (error, hash) {
          if (error) reject(error)
          resolve(hash);
        });
      })
      const info = [nombre, apellido, usuario, cedula, email, hash, rol, 1]
      const sql = 'INSERT INTO usuarios (nombre, apellido, usuario, cedula, email, clave, rol, activo, fecha_registro) VALUES (?,?,?,?,?,?,?,?,NOW())'
      db.query(sql, info, (error, result) => {
        if (error) return reject({ status: 400, mensaje: error });
        resolve({ status: 200, mensaje: 'Usuario registrado correctamente' });
      })
    })

  }

}

module.exports = new authModel();