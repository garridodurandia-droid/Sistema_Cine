var express = require('express');
var router = express.Router();
var salasController = require('../controllers/salas_C')
const auth = require('../middleware/auth');

/* GET home page. */
router.get('/', auth, function (req, res, next) {
  salasController.todo()
    .then((result) => {
      res.render('Salas/index',
        {
          title: 'Salas',
          rol: req.user.rol,
          data: result.data,
          status: result.status,
          mensaje: result.mensaje,
        });
    }).catch((err) => {
      res.status(500).json(err);
    });
});
router.get('/api', auth, function (req, res, next) {
  salasController.todo()
    .then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/uno/:id', auth, function (req, res, next) {
  salasController.uno(req.params.id)
    .then((result) => {
      res.render('Salas/index',
        {
          title: 'Salas',
          rol: req.user.rol,
          data: result.data,
          status: result.status,
          mensaje: result.mensaje,
        });
    }).catch((err) => {
      res.status(500).json(err);
    });
});
router.get('/api/uno/:id', auth, function (req, res, next) {
  salasController.uno(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/crear', auth, function (req, res, next) {
  salasController.crear(req.body)
    .then((crear) => {
      return salasController.todo()
        .then((todo) => {
          res.render('Salas/index',
            {
              title: 'Salas',
              rol: req.user.rol,
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
router.post('/api/crear', auth, function (req, res, next) {
  salasController.crear(req.body)
    .then((crear) => {
      res.status(crear.status).json(crear);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.put('/editar/:id', auth, function (req, res, next) {
  salasController.editar(req.params.id, req.body)
    .then((editar) => {
      return salasController.todo()
        .then((todo) => {
          res.render('Salas/index',
            {
              title: 'Salas',
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
  salasController.editar(req.params.id, req.body)
    .then((editar) => {
      res.status(editar.status).json(editar);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.delete('/eliminar/:id', auth, function (req, res, next) {
  salasController.eliminar(req.params.id)
    .then((eliminar) => {
      return salasController.todo()
        .then((todo) => {
          res.render('Salas/index',
            {
              title: 'Salas',
              rol: req.user.rol,
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

router.delete('/api/eliminar/:id', auth, function (req, res, next) {
  salasController.eliminar(req.params.id)
    .then((eliminar) => {
      res.status(eliminar.status).json(eliminar);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
