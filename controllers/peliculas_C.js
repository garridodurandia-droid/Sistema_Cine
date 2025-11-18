var peliculasModels = require('../models/peliculas_M')

class peliculasController {

  todo() {
    return new Promise(async(resolve, reject) => {
      peliculasModels.todo()
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  uno(titulo) {
    return new Promise((resolve, reject) => {
      peliculasModels.uno(titulo)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  uno_id(id) {
    return new Promise((resolve, reject) => {
      peliculasModels.uno_id(id)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  crear(data) {
    return new Promise((resolve, reject) => {
      peliculasModels.crear(data)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  editar(id, data) {
    return new Promise((resolve, reject) => {
      peliculasModels.editar(id, data)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  eliminar(id) {
    return new Promise((resolve, reject) => {
      peliculasModels.eliminar(id)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

}

module.exports = new peliculasController();
