var clientesModels = require('../models/clientes_M')

class clientesController {

  todo() {
    return new Promise(async(resolve, reject) => {
      clientesModels.todo()
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
      clientesModels.uno(id)
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
      clientesModels.crear(data)
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
      clientesModels.editar(id, data)
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
      clientesModels.eliminar(id)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

}

module.exports = new clientesController();