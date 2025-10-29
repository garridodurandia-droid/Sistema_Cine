var express = require('express');
var router = express.Router();
var salasController = require('../controllers/salas_C')

/* GET home page. */
router.get('/', function (req, res, next) {
  salasController.todo()
    .then((result) => {
      res.render('Salas/index',
        {
          title: 'Salas',
          data: result.data,
          status: result.status,
          mensaje: result.mensaje,
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/uno/:id', function (req, res, next) {
  salasController.uno(req.params.id)
    .then((result) => {
      res.render('Salas/index',
        {
          title: 'Salas',
          data: result.data,
          status: result.status,
          mensaje: result.mensaje,
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', function (req, res, next) {
  salasController.crear(req.body)
    .then((crear) => {
      return salasController.todo()
        .then((todo) => {
          res.render('Salas/index',
            {
              title: 'Salas',
              data: todo.data,
              status: crear.status,
              mensaje: crear.mensaje,
            });
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.put('/editar/:id', function (req, res, next) {
  salasController.editar(req.params.id, req.body)
    .then((editar) => {
      return salasController.todo()
        .then((todo) => {
          res.render('Salas/index',
            {
              title: 'Salas',
              status: editar.status,
              mensaje: editar.mensaje,
              data: todo.data
            })
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.delete('/eliminar/:id', function (req, res, next) {
  salasController.eliminar(req.params.id)
    .then((eliminar) => {
      return salasController.todo()
        .then((todo) => {
          res.render('Salas/index',
            {
              title: 'Salas',
              data: todo.data,
              status: eliminar.status,
              mensaje: eliminar.mensaje,
            });
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
