const { v4: uuidv4 } = require('uuid');
const db = require('../database/db')
const { empty, incompletos } = require('../utils/validaciones')

class funcionModels {

  todo() {
    return new Promise(async (resolve, reject) => {

      db.beginTransaction(async function (err) {
        if (err) return reject(err);
        try {
          const data = await new Promise((resolve, reject) => {
            const query = 'SELECT f.id, p.titulo , p.id AS pelicula_id, p.genero , p.duracion , s.numero AS sala, s.id AS sala_id, s.capacidad , s.tipo , f.fecha , f.fecha_creacion, f.hora , f.precio , f.asientos_disponibles FROM funciones f INNER JOIN peliculas p ON f.pelicula_id = p.id INNER JOIN salas s ON f.sala_id = s.id WHERE f.activa = 1 ORDER BY f.fecha DESC;'
            db.query(query, function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              return resolve(results)
            });
          })

          const salas = await new Promise((resolve, reject) => {
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

            resolve({ status: 200, mensaje: 'Datos consultados con exito', data: data, peliculas: peliculas, salas: salas })

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
      const query = 'SELECT f.id, p.titulo , p.genero , p.duracion , s.numero AS sala, s.capacidad , s.tipo , f.fecha , f.fecha_creacion, f.hora , f.precio , f.asientos_disponibles FROM funciones f INNER JOIN peliculas p ON f.pelicula_id = p.id INNER JOIN salas s ON f.sala_id = s.id WHERE f.id = ?'
      db.query(query, [id], function (error, results, fields) {
        if (error) return reject({ status: 400, mensaje: error });
        if (results.length === 0) {
          return resolve({ status: 200, mensaje: 'Función no encontrada', data: results })
        }
        return resolve({ status: 200, mensaje: 'Datos solicitados con éxito', data: results })
      });
    })
  }

  crear(data) {
    return new Promise(async (resolve, reject) => {
      const { pelicula_id, sala_id, fecha, hora, precio } = data;

      const capacidad = await new Promise((resolve, reject) => {
        const queryCap = 'SELECT capacidad FROM salas WHERE id = ?'
        db.query(queryCap, [sala_id], function (error, results, fields) {
          if (error) return reject({ status: 400, mensaje: error });
          resolve(results[0].capacidad)
        });
      })
      const datos = [
        pelicula_id,
        sala_id,
        fecha,
        hora,
        precio,
        capacidad,
        1
      ];
      const query = 'INSERT INTO funciones (pelicula_id, sala_id, fecha, hora, precio, asientos_disponibles, activa) VALUES (?, ?, ?, ?, ?, ?, ?)'
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
      console.log(data)
      const { pelicula_id, sala_id, fecha, hora, precio } = data;

      const fields = [];
      const info = [];

      const vacio = empty(data);
      if (!vacio) {
        return reject({ status: 400, mensaje: 'No se han proporcionado datos para actualizar' });
      }

      if (pelicula_id) {
        fields.push('pelicula_id = ?')
        info.push(pelicula_id)
      }
      if (sala_id) {
        fields.push('sala_id = ?')
        info.push(sala_id)
      }
      if (fecha) {
        fields.push('fecha = ?')
        info.push(fecha)
      }
      if (hora) {
        fields.push('hora = ?')
        info.push(hora)
      }
      if (precio) {
        fields.push('precio = ?')
        info.push(precio)
      }
      const query = `UPDATE funciones SET ${fields.join(', ')} WHERE id = ?`

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
            const query = 'DELETE FROM funciones WHERE id = ?'
            db.query(query, [id], function (error, results, fields) {
              if (error) {
                if (error.errno === 1451) {
                  return resolve({ status: 400, mensaje: 'No se puede eliminar la película porque está asociada a funciones en el sistema.' })
                } else {
                  return reject({ status: 400, mensaje: error })
                }
              }
              if (results.affectedRows === 0) {
                return resolve({ status: 404, mensaje: 'Funcion no encontrada' });
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
            console.log('Delete Row:', deleteRow);
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
    return new Promise((resolve, reject) => {
      const { desde, hasta } = data
      const query = 'SELECT f.id, p.titulo , p.id AS pelicula_id, p.genero , p.duracion , s.numero AS sala, s.id AS sala_id, s.capacidad , s.tipo , f.fecha , f.fecha_creacion, f.hora , f.precio , f.asientos_disponibles FROM funciones f INNER JOIN peliculas p ON f.pelicula_id = p.id INNER JOIN salas s ON f.sala_id = s.id WHERE f.activa = 1 AND f.fecha BETWEEN ? AND ?; '
      db.query(query, [desde, hasta], function (error, results, fields) {
        if (error) return reject({ status: 400, mensaje: error });
        if (results.length === 0) {
          return resolve({ status: 200, mensaje: 'Sin datos para mostrar', data: results })
        }
        return resolve(results)
      });
    })
  }


}

module.exports = new funcionModels();
