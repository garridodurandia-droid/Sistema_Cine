var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth')
const logueado = require('../middleware/logueado');

/* GET home page. */
router.get('/', logueado,  function(req, res, next) {
  if (req.logueado) {
    res.redirect('/inicio');
    return;
  } else {
  res.render('UserAuth/login');
  }
});
router.get('/inicio', auth,  function(req, res, next) {
  res.render('index', { title: 'CineSystem', rol: req.user.rol });
});

router.get('/error', function(req, res, next) {
  res.render('Error/error');
});

module.exports = router;
