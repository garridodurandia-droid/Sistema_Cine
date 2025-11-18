const { v4: uuidv4 } = require('uuid');
const db = require('../database/db')
const { empty, incompletos } = require('../utils/validaciones')

class clientesModels {

  todo() {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM clientes'
      db.query(query, function (error, results, fields) {
        if (error) return reject({ status: 400, mensaje: error });
        if (results.length === 0) {
          return resolve({ status: 200, mensaje: 'Sin datos para mostrar', data: results })
        }
        return resolve({ status: 200, mensaje: 'Datos solicitados con éxito', data: results })
      });
    })
  }

  uno(id) {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM clientes WHERE id = ?'
      db.query(query, [id], function (error, results, fields) {
        if (error) return reject({ status: 400, mensaje: error });
        if (results.length === 0) {
          return resolve({ status: 200, mensaje: 'Cliente no encontrada', data: results })
        }
        return resolve({ status: 200, mensaje: 'Datos solicitados con éxito', data: results })
      });
    })
  }

  crear(data) {
    return new Promise(async (resolve, reject) => {
      const { nombre, email, telefono } = data;
      const query = 'INSERT INTO clientes (nombre, email, telefono, fechaRegistro) VALUES (?,?,?,NOW())'
      db.beginTransaction(async function (err) {
        if (err) return reject(err);
        try {
          await new Promise((resolve, reject) => {
            db.query(query, [nombre, email, telefono], function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              resolve()
            });
          })
          const data = {
            nombre: nombre,
            email: email,
            telefono: telefono
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                reject({ status: 400, mensaje: err });
              });
            }
            resolve({ status: 201, mensaje: 'Creada con éxito', data: data })
          });
        } catch (error) {
          db.rollback(() => {
            reject(error);
          });
        }
      });

    })
  }

  editar(id, data) {
    return new Promise(async (resolve, reject) => {
      const { nombre, email, telefono } = data;
      const fields = [];
      const info = [];

      const vacio = empty(data);
      if (!vacio) {
        return reject({ status: 400, mensaje: 'No se han proporcionado datos para actualizar' });
      }

      if (nombre) {
        fields.push('nombre = ?')
        info.push(nombre)
      }
      if (email) {
        fields.push('email = ?')
        info.push(email)
      }
      if (telefono) {
        fields.push('telefono = ?')
        info.push(telefono)
      }
      const query = `UPDATE clientes SET ${fields.join(', ')} WHERE id = ?`

      db.beginTransaction(async function (err) {
        if (err) return reject({ status: 400, mensaje: err });
        try {
          await new Promise((resolve, reject) => {
            db.query(query, [...info, id], function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              resolve()
            });
          })
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                reject({ status: 400, mensaje: err });
              });
            }
          });
          resolve({ status: 202, mensaje: 'Actualizada con éxito', datos_modificados: { ...data, id: id } })
        } catch (error) {
          db.rollback(() => {
            reject(error);
          });
        }
      });
    })
  }

  eliminar(id) {
    return new Promise(async (resolve, reject) => {
      db.beginTransaction(async function (err) {
        if (err) return reject(err);
        try {
          const deleteRow = await new Promise((resolve, reject) => {
            const query = 'DELETE FROM clientes WHERE id = ?'
            db.query(query, [id], function (error, results, fields) {
              if (error) {
                if (error.errno === 1451) {
                  return resolve({ status: 400, mensaje: 'No se puede eliminar la película porque está asociada a funciones en el sistema.' })
                } else {
                  return reject({ status: 400, mensaje: error })
                }
              }
              if (results.affectedRows === 0) {
                return resolve({ status: 404, mensaje: 'Cliente no encontrada' });
              } else {
                resolve({ status: 200, mensaje: 'Eliminado con éxito' })
              }
            });
          })
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                reject({ status: 400, mensaje: err });
              });
            }
            resolve({ status: deleteRow.status, mensaje: deleteRow.mensaje })

          });
        } catch (error) {
          db.rollback(() => {
            reject(error);
          });
        }
      });
    })
  }
}

module.exports = new clientesModels();