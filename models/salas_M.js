const db = require('../database/db')
const { empty, incompletos } = require('../utils/validaciones')

class salasModels {

  todo() {
    return new Promise(async (resolve, reject) => {
      db.beginTransaction(async function (err) {
        if (err) return reject(err);
        try {
          const data = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM salas WHERE activa = 1'
            db.query(query, function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              if (results.length === 0) {
                return resolve({ status: 200, mensaje: 'Sin datos para mostrar', data: results })
              }
              return resolve(results)
            });
          })

          const peliculas = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM peliculas WHERE activa = 1'
            db.query(query, function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              if (results.length === 0) {
                return resolve({ status: 200, mensaje: 'Sin datos para mostrar', data: results })
              }
              return resolve(results)
            });
          })

          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                reject({ status: 400, mensaje: err });
              });
            }

            resolve({ status: 200, mensaje: 'Datos consultados con exito', data: data, peliculas: peliculas })

          });
        } catch (error) {
          db.rollback(() => {
            reject(error);
          });
        }
      });

    })
  }

  uno(id) {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM salas WHERE id = ? AND activa = 1'
      db.query(query, [id], function (error, results, fields) {
        if (error) return reject({ status: 400, mensaje: error });
        if (results.length === 0) {
          return resolve({ status: 200, mensaje: 'Sala no encontrada', data: results })
        }
        return resolve({ status: 200, mensaje: 'Datos solicitados con éxito', data: results })
      });
    })
  }

  crear(data) {
    return new Promise(async (resolve, reject) => {
      const { numero, capacidad, tipo, equipamiento } = data;

      const datos = [
        numero,
        capacidad,
        tipo,
        equipamiento,
      ];
      const query = 'INSERT INTO salas (numero, capacidad, tipo, equipamiento, activa, fecha_creacion) VALUES (?, ?, ?, ?, 1, NOW())'
      db.beginTransaction(async function (err) {
        if (err) return reject(err);
        try {
          await new Promise((resolve, reject) => {
            db.query(query, datos, function (error, results, fields) {
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
      const { numero, capacidad, tipo, equipamiento } = data;
      const fields = [];
      const info = [];

      const vacio = empty(data);
      if (!vacio) {
        return reject({ status: 400, mensaje: 'No se han proporcionado datos para actualizar' });
      }

      if (numero) {
        fields.push('numero = ?')
        info.push(numero)
      }
      if (capacidad) {
        fields.push('capacidad = ?')
        info.push(capacidad)
      }
      if (tipo) {
        fields.push('tipo = ?')
        info.push(tipo)
      }
      if (equipamiento) {
        fields.push('equipamiento = ?')
        info.push(equipamiento)
      }
      const query = `UPDATE salas SET ${fields.join(', ')} WHERE id = ?`

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
            const query = 'UPDATE salas set activa = ? WHERE id = ?'
            db.query(query, [0, id], function (error, results, fields) {
              if (error) {
                return reject({ status: 400, mensaje: error })
              }
              if (results.affectedRows === 0) {
                return resolve({ status: 404, mensaje: 'salas no encontrada' });
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

module.exports = new salasModels();