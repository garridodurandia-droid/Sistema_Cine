const { v4: uuidv4 } = require('uuid');
const db = require('../database/db')
const { empty, incompletos } = require('../utils/validaciones')

class peliculasModels {

  todo() {
    return new Promise(async (resolve, reject) => {
      const query = 'SELECT * FROM peliculas WHERE activa = 1'
      db.query(query, function (error, results, fields) {
        if (error) return reject({ status: 400, mensaje: error });
        if (results.length === 0) {
          return resolve({ status: 200, mensaje: 'Sin datos para mostrar', data: results })
        }
        return resolve({ status: 200, mensaje: 'Datos solicitados con éxito', data: results })
      });
    })
  }

  uno(titulo) {
    return new Promise(async (resolve, reject) => {
      const data = titulo + '%'
      const query = 'SELECT * FROM peliculas WHERE titulo LIKE ?'
      db.query(query, [data], function (error, results, fields) {
        if (error) return reject({ status: 400, mensaje: error });
        if (results.length === 0) {
          return resolve({ status: 200, mensaje: 'Pelicula no encontrada', data: results })
        }
        return resolve({ status: 200, mensaje: 'Datos solicitados con éxito', data: results })
      });
    })
  }

  uno_id(id) {
    return new Promise(async (resolve, reject) => {
      const data = id
      const query = 'SELECT * FROM peliculas WHERE id = ?'
      db.query(query, [data], function (error, results, fields) {
        if (error) return reject({ status: 400, mensaje: error });
        if (results.length === 0) {
          return resolve({ status: 200, mensaje: 'Pelicula no encontrada', data: results })
        }
        return resolve({ status: 200, mensaje: 'Datos solicitados con éxito', data: results })
      });
    })
  }

  crear(data) {
    return new Promise(async (resolve, reject) => {
      const { titulo, director, genero, duracion, clasificacion, sinopsis } = data;
      const secue = 'SELECT MAX(numero_secuencial) as ultimo FROM peliculas'
      const query = 'INSERT INTO peliculas (titulo, director, genero, duracion, clasificacion, sinopsis, activa, numero_secuencial) VALUES (?, ?, ?, ?, ?, ?, 1, ?)'
      db.beginTransaction(async function (err) {
        if (err) return reject(err);
        try {
          const numero = await new Promise((resolve, reject) => {
            db.query(secue, function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              const siguienteNumero = (results[0].ultimo || 0) + 1;
              resolve(siguienteNumero);
            });
          })
          await new Promise((resolve, reject) => {
            db.query(query, [titulo, director, genero, duracion, clasificacion, sinopsis, numero], function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              resolve()
            });
          })
          const data = {
            titulo: titulo,
            director: director,
            genero: genero,
            duracion: duracion,
            clasificacion: clasificacion,
            sinopsis: sinopsis,
            numero_secuencial: numero
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
      const { titulo, director, genero, duracion, clasificacion, sinopsis } = data;
      const fields = [];
      const info = [];

      const vacio = empty(data);
      if (!vacio) {
        return reject({ status: 400, mensaje: 'No se han proporcionado datos para actualizar' });
      }

      if (titulo) {
        fields.push('titulo = ?')
        info.push(titulo)
      }
      if (director) {
        fields.push('director = ?')
        info.push(director)
      }
      if (genero) {
        fields.push('genero = ?')
        info.push(genero)
      }
      if (duracion) {
        fields.push('duracion = ?')
        info.push(duracion)
      }
      if (clasificacion) {
        fields.push('clasificacion = ?')
        info.push(clasificacion)
      }
      if (sinopsis) {
        fields.push('sinopsis = ?')
        info.push(sinopsis)
      }
      const query = `UPDATE peliculas SET ${fields.join(', ')} WHERE id = ?`

      db.beginTransaction(async function (err) {
        if (err) return reject({ status: 400, mensaje: err });
        try {
          await new Promise((resolve, reject) => {
            db.query(query, [...info, id], function (error, results, fields) {
              if (error) return reject({ status: 400, mensaje: error });
              resolve()
            });
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
          const deleteRow = await new Promise((resolve, reject) => {
            const query = 'UPDATE peliculas SET activa = ? WHERE id = ?'
            db.query(query, [0, id], function (error, results, fields) {
              if (error) {
                if (error.errno === 1451) {
                  return resolve({ status: 400, mensaje: 'No se puede eliminar la película porque está asociada a funciones en el sistema.' })
                } else {
                  return reject({ status: 400, mensaje: error })
                }
              }
              if (results.affectedRows === 0) {
                return resolve({ status: 404, mensaje: 'Pelicula no encontrada' });
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

module.exports = new peliculasModels();
