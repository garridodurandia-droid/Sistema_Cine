const { v4: uuidv4 } = require('uuid');
const db = require('../database/db')
const { empty, incompletos } = require('../utils/validaciones')

class reservasModels {

  todo() {
    return new Promise(async (resolve, reject) => {
      const reservas = await new Promise((resolve, reject) => {
        const query = 'SELECT r.id AS id_reserva, r.id_cliente, c.nombre AS cliente, r.id_funcion, r.cantidad AS asientos, r.total, r.fechaReserva, r.estado, p.id, p.titulo, f.fecha, f.hora FROM reservas r INNER JOIN clientes c ON c.id = r.id_cliente INNER JOIN funciones f ON f.id = r.id_funcion INNER JOIN peliculas p ON p.id = f.pelicula_id;'
        db.query(query, function (error, results, fields) {
          if (error) return reject({ status: 400, mensaje: error });
          return resolve(results)
        });
      })
      const clientes = await new Promise((resolve, reject) => {
        const query = 'SELECT id, nombre FROM clientes'
        db.query(query, function (error, results, fields) {
          if (error) return reject({ status: 400, mensaje: error });
          if (results.length === 0) {
            return resolve({ status: 200, mensaje: 'Sin datos para mostrar', data: results })
          }
          return resolve(results)
        });
      })
      const funciones = await new Promise((resolve, reject) => {
        const query = 'SELECT f.id, f.pelicula_id, p.titulo, s.numero AS sala, f.precio FROM funciones f INNER JOIN salas s ON s.id = f.sala_id INNER JOIN peliculas p ON p.id = f.pelicula_id ORDER BY f.id DESC'
        db.query(query, function (error, results, fields) {
          if (error) return reject({ status: 400, mensaje: error });
          if (results.length === 0) {
            return resolve({ status: 200, mensaje: 'Sin datos para mostrar', data: results })
          }
          return resolve(results)
        });
      })

      resolve({ status: 200, mensaje: 'Datos consultados con exito', data: reservas, clientes: clientes, funciones: funciones })

    })
  }

  uno(id) {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM reservas WHERE id = ?'
      db.query(query, [id], function (error, results, fields) {
        if (error) return reject({ status: 400, mensaje: error });
        if (results.length === 0) {
          return resolve({ status: 200, mensaje: 'Reserva no encontrada', data: results })
        }
        return resolve({ status: 200, mensaje: 'Datos solicitados con éxito', data: results })
      });
    })
  }

  crear(data) {
    return new Promise(async (resolve, reject) => {
      const { funcion_id, cliente_id, cantidad, total } = data;
      const query = 'INSERT INTO reservas (id_funcion, id_cliente, cantidad, total, fechaReserva, estado) VALUES (?,?,?,?,NOW(),?)'
      db.beginTransaction(async function (err) {
        if (err) return reject(err);
        try {
          await new Promise((resolve, reject) => {
            db.query(query, [funcion_id, cliente_id, cantidad, total, 'confirmada'], function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              resolve()
            });
          })
          await new Promise((resolve, reject) => {
            const actualizarAsientosQuery = 'UPDATE funciones SET asientos_disponibles = asientos_disponibles - ? WHERE id = ?'
            db.query(actualizarAsientosQuery, [cantidad, funcion_id], function (error, results, fields) {
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
      const { funcion_id, cliente_id, cantidad, total } = data;
      const fields = [];
      const info = [];

      const vacio = empty(data);
      if (!vacio) {
        return reject({ status: 400, mensaje: 'No se han proporcionado datos para actualizar' });
      }

      if (funcion_id) {
        fields.push('id_funcion = ?')
        info.push(funcion_id)
      }
      if (cliente_id) {
        fields.push('id_cliente = ?')
        info.push(cliente_id)
      }
      if (cantidad) {
        fields.push('cantidad = ?')
        info.push(cantidad)
      }
      if (total) {
        fields.push('total = ?')
        info.push(total)
      }
      const query = `UPDATE reservas SET ${fields.join(', ')} WHERE id = ?`

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
          })
          resolve({ status: 202, mensaje: 'Actualizada con éxito', datos_modificados: {...data, id:id} })
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

          const row = await new Promise((resolve, reject) => {
            const query = 'SELECT r.id AS id_reserva, r.id_cliente, c.nombre AS cliente, r.id_funcion, r.cantidad AS asientos, r.total, r.fechaReserva, r.estado, p.id, p.titulo, f.fecha, f.hora FROM reservas r INNER JOIN clientes c ON c.id = r.id_cliente INNER JOIN funciones f ON f.id = r.id_funcion INNER JOIN peliculas p ON p.id = f.pelicula_id WHERE r.id = ?;'
            db.query(query, [id], function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              return resolve(results)
            });
          })

          await new Promise((resolve, reject) => {
            const actualizarAsientosQuery = 'UPDATE funciones SET asientos_disponibles = asientos_disponibles + ? WHERE id = ?'
            db.query(actualizarAsientosQuery, [row[0].asientos, row[0].id_funcion], function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              resolve()
            });
          })

          const deleteRow = await new Promise((resolve, reject) => {
            const query = 'DELETE FROM reservas WHERE id = ?'
            db.query(query, [id], function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error }
              )
              if (results.affectedRows === 0) {
                return resolve({ status: 404, mensaje: 'Reserva no encontrada' });
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

  rango(data) {
    return new Promise(async (resolve, reject) => {
      const { desde, hasta } = data
      const inicio = new Date(desde)
      const fin = new Date(hasta)

      console.log(inicio)
      console.log(fin)

      const reservas = await new Promise((resolve, reject) => {
        const query = 'SELECT r.id AS id_reserva, r.id_cliente, c.nombre AS cliente, r.id_funcion, r.cantidad AS asientos, r.total, r.fechaReserva, r.estado, p.id, p.titulo, f.fecha, f.hora FROM reservas r INNER JOIN clientes c ON c.id = r.id_cliente INNER JOIN funciones f ON f.id = r.id_funcion INNER JOIN peliculas p ON p.id = f.pelicula_id AND r.fechaReserva BETWEEN ? AND ?; '
        db.query(query, [inicio, fin], function (error, results, fields) {
          if (error) return reject({ status: 400, mensaje: error });
          if (results.length === 0) {
            return resolve(results)
          }
          return resolve(results)
        });
      })
      const clientes = await new Promise((resolve, reject) => {
        const query = 'SELECT id, nombre FROM clientes'
        db.query(query, function (error, results, fields) {
          if (error) return reject({ status: 400, mensaje: error });
          if (results.length === 0) {
            return resolve({ status: 200, mensaje: 'Sin datos para mostrar', data: results })
          }
          return resolve(results)
        });
      })
      const funciones = await new Promise((resolve, reject) => {
        const query = 'SELECT f.id, f.pelicula_id, p.titulo, s.numero AS sala, f.precio FROM funciones f INNER JOIN salas s ON s.id = f.sala_id INNER JOIN peliculas p ON p.id = f.pelicula_id ORDER BY f.id DESC'
        db.query(query, function (error, results, fields) {
          if (error) return reject({ status: 400, mensaje: error });
          if (results.length === 0) {
            return resolve({ status: 200, mensaje: 'Sin datos para mostrar', data: results })
          }
          return resolve(results)
        });
      })
      resolve({ status: 200, mensaje: 'Datos consultados con exito', data: reservas, clientes: clientes, funciones: funciones })
    })
  }

}

module.exports = new reservasModels();
