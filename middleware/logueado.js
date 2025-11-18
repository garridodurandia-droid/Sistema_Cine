var jwt = require('jsonwebtoken');
require('dotenv').config()


function logueado(req, res, next) {
  const token = req.cookies.token || null;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          req.logueado = false;
          return next();
        } else {
          res.render('Error/error');

        }
      } else {
        req.user = decoded;
        req.logueado = true;
      }
    });
  } else {
    req.logueado = false;
  }
  next();
}

module.exports = logueado;
