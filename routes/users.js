var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth_C');
const logueado = require('../middleware/logueado');

/* GET users listing. */
router.get('/', logueado, function (req, res, next) {
  if (req.logueado) {
    res.redirect('/inicio');
    return;
  } else {
    res.render('UserAuth/login')
  }
});

router.post('/login', logueado, function (req, res, next) {
  authController.login(req.body)
    .then((result) => {
      res.cookie('token', result.token, { httpOnly: true });
      res.redirect('/inicio');
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.get('/registro', function (req, res, next) {
  res.render('UserAuth/registro')
});

router.post('/registro', function (req, res, next) {
  authController.register(req.body)
    .then((result) => {
      res.redirect('/users');
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.get('/logout', function (req, res, next) {
  res.clearCookie('token');
  res.redirect('/users');
});

module.exports = router;
