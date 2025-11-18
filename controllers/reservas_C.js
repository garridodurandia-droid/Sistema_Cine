var reservasModels = require('../models/reservas_M')

class reservasController {

  todo() {
    return new Promise(async(resolve, reject) => {
      reservasModels.todo()
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
      reservasModels.uno(id)
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
      reservasModels.crear(data)
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
      reservasModels.editar(id, data)
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
      reservasModels.eliminar(id)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  rango(data) {
    return new Promise((resolve, reject) => {
      reservasModels.rango(data)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

}

module.exports = new reservasController();
