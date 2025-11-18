var salasModels = require('../models/salas_M')

class salasController {

  todo() {
    return new Promise(async(resolve, reject) => {
      salasModels.todo()
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  uno(id) {
    return new Promise((resolve, reject) => {
      salasModels.uno(id)
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
      salasModels.crear(data)
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
      salasModels.editar(id, data)
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
      salasModels.eliminar(id)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

}

module.exports = new salasController();