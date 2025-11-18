const authModel = require('../models/auth_M')

class authController {

  login(data) {
    return new Promise((resolve, reject) => {
      authModel.login(data)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  register(data) {
    return new Promise((resolve, reject) => {
      authModel.register(data)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}


module.exports = new authController();