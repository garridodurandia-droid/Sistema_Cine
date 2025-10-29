var funcionModels = require('../models/funcion_M')

class funcionController {

  todo() {
    return new Promise(async(resolve, reject) => {
      funcionModels.todo()
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
      funcionModels.uno(id)
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
      funcionModels.crear(data)
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
      funcionModels.rango(data)
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
      funcionModels.editar(id, data)
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
      funcionModels.eliminar(id)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

}

module.exports = new funcionController();
