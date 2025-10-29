var express = require('express');
var router = express.Router();
var peliculasController = require('../controllers/peliculas_C')

/* GET home page. */
router.get('/', function (req, res, next) {
  peliculasController.todo()
    .then((result) => {
      res.render('Peliculas/index',
        {
          title: 'Películas',
          data: result.data,
          status: result.status,
          mensaje: result.mensaje
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/uno', function (req, res, next) {
  peliculasController.uno(req.body.pelicula_titulo)
    .then((result) => {
      res.render('Peliculas/index',
        {
          title: 'Películas',
          data: result.data,
          status: result.status,
          mensaje: result.mensaje
        });

    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', function (req, res, next) {
  peliculasController.crear(req.body)
    .then((crear) => {
      return peliculasController.todo()
        .then((todo) => {
          res.render('Peliculas/index',
            {
              title: 'Películas',
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
  peliculasController.editar(req.params.id, req.body)
    .then((editar) => {
      return peliculasController.todo()
        .then((todo) => {
          res.render('Peliculas/index',
            {
              title: 'Películas',
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
  peliculasController.eliminar(req.params.id)
    .then((eliminar) => {
      return peliculasController.todo()
        .then((todo) => {
          res.render('Peliculas/index',
            {
              title: 'Películas',
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
