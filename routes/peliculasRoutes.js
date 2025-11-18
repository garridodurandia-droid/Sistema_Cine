var express = require('express');
var router = express.Router();
var peliculasController = require('../controllers/peliculas_C')
const auth = require('../middleware/auth');

/* GET home page. */
router.get('/', auth, function (req, res, next) {
  peliculasController.todo()
    .then((result) => {
      res.render('Peliculas/index',
        {
          title: 'Películas',
          rol: req.user.rol,
          data: result.data,
          status: result.status,
          mensaje: result.mensaje
        });
    }).catch((err) => {
      res.status(500).json(err);
    });
});
router.post('/uno', auth, function (req, res, next) {
  peliculasController.uno(req.body.pelicula_titulo)
    .then((result) => {
      res.render('Peliculas/index',
        {
          title: 'Películas',
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
  peliculasController.todo()
    .then((result) => {
      res.status(result.status).json(result);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.get('/api/uno/:id', auth, function (req, res, next) {
  peliculasController.uno_id(req.params.id)
    .then((result) => {
      res.status(result.status).json(result);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/crear', auth, function (req, res, next) {
  peliculasController.crear(req.body)
    .then((crear) => {
      return peliculasController.todo()
        .then((todo) => {
          res.render('Peliculas/index',
            {
              title: 'Películas',
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
  peliculasController.crear(req.body)
    .then((crear) => {
      res.status(crear.status).json(crear)
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put('/editar/:id', auth, function (req, res, next) {
  peliculasController.editar(req.params.id, req.body)
    .then((editar) => {
      return peliculasController.todo()
        .then((todo) => {
          res.render('Peliculas/index',
            {
              title: 'Películas',
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
  peliculasController.editar(req.params.id, req.body)
    .then((editar) => {
      res.status(editar.status).json(editar);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.delete('/eliminar/:id', auth, function (req, res, next) {
  peliculasController.eliminar(req.params.id)
    .then((eliminar) => {
      return peliculasController.todo()
        .then((todo) => {
          res.render('Peliculas/index',
            {
              title: 'Películas',
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
  peliculasController.eliminar(req.params.id)
    .then((eliminar) => {
      res.status(eliminar.status).json(eliminar);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
