var express = require('express');
var router = express.Router();
var clientesController = require('../controllers/clientes_C')
const auth = require('../middleware/auth');

/* GET home page. */
router.get('/', auth, function (req, res, next) {
  clientesController.todo()
    .then((result) => {
      res.render('Clientes/index',
        {
          title: 'Clientes',
          rol: req.user.rol,
          data: result.data,
          status: result.status,
          mensaje: result.mensaje
        });
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.get('/api', auth, function (req, res, next) {
  clientesController.todo()
    .then((result) => {
      res.status(result.status).json(result);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/uno/:id', auth, function (req, res, next) {
  clientesController.uno(req.params.id)
    .then((result) => {
      res.render('Clientes/index',
        {
          title: 'Clientes',
          rol: req.user.rol,
          data: result.data,
          status: result.status,
          mensaje: result.mensaje
        });
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.get('/api/uno/:id', auth, function (req, res, next) {
  clientesController.uno(req.params.id)
    .then((result) => {
      res.status(result.status).json(result);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/crear', auth, function (req, res, next) {
  clientesController.crear(req.body)
    .then((crear) => {
      return clientesController.todo()
        .then((todo) => {
          res.render('Clientes/index',
            {
              title: 'Clientes',
              rol: req.user.rol,
              status: crear.status,
              mensaje: crear.mensaje,
              data: todo.data
            })
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/api/crear', auth, function (req, res, next) {
  clientesController.crear(req.body)
    .then((crear) => {
      res.status(crear.status).json(crear);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put('/editar/:id', auth, function (req, res, next) {
  clientesController.editar(req.params.id, req.body)
    .then((editar) => {
      return clientesController.todo()
        .then((todo) => {
          res.render('Clientes/index',
            {
              title: 'Clientes',
              rol: req.user.rol,
              status: editar.status,
              mensaje: editar.mensaje,
              data: todo.data
            })
        });
    }).catch((err) => {
      res.status(500).json(err);
    });
});
router.put('/api/editar/:id', auth, function (req, res, next) {
  clientesController.editar(req.params.id, req.body)
    .then((editar) => {
      res.status(editar.status).json(editar);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.delete('/eliminar/:id', auth, function (req, res, next) {
  clientesController.eliminar(req.params.id)
    .then((eliminar) => {
      return clientesController.todo()
        .then((todo) => {
          res.render('Clientes/index',
            {
              title: 'Clientes',
              rol: req.user.rol,
              status: eliminar.status,
              mensaje: eliminar.mensaje,
              data: todo.data
            })
        });
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.delete('/api/eliminar/:id', auth, function (req, res, next) {
  clientesController.eliminar(req.params.id)
    .then((eliminar) => {
      res.status(eliminar.status).json(eliminar);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
