var jwt = require('jsonwebtoken');
require('dotenv').config()


function auth(req, res, next) {
  const token = req.cookies.token || null;
  if (!token) {
    res.render('Error/error');
  } else {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.render('Error/error');
      } else {
        req.user = decoded;
        next();
      }
    });
  }
}

module.exports = auth;


