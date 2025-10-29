var express = require('express');
var router = express.Router();
var clientesController = require('../controllers/clientes_C')

/* GET home page. */
router.get('/', function (req, res, next) {
  clientesController.todo()
    .then((result) => {
      res.render('Clientes/index',
        {
          title: 'Clientes',
          data: result.data,
          status: result.status,
          mensaje: result.mensaje
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/uno/:id', function (req, res, next) {
  clientesController.uno(req.params.id)
    .then((result) => {
      res.render('Clientes/index',
        {
          title: 'Clientes',
          data: result.data,
          status: result.status,
          mensaje: result.mensaje
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', function (req, res, next) {
  clientesController.crear(req.body)
    .then((crear) => {
      return clientesController.todo()
        .then((todo) => {
          res.render('Clientes/index',
            {
              title: 'Clientes',
              status: crear.status,
              mensaje: crear.mensaje,
              data: todo.data
            })
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.put('/editar/:id', function (req, res, next) {
  clientesController.editar(req.params.id, req.body)
    .then((editar) => {
      return clientesController.todo()
        .then((todo) => {
          res.render('Clientes/index',
            {
              title: 'Clientes',
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
  clientesController.eliminar(req.params.id)
    .then((eliminar) => {
      return clientesController.todo()
        .then((todo) => {
          res.render('Clientes/index',
            {
              title: 'Clientes',
              status: eliminar.status,
              mensaje: eliminar.mensaje,
              data: todo.data
            })
        });
    }).catch((err) => {
      res.send(err)
    });
});

module.exports = router;
