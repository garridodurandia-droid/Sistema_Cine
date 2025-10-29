var express = require('express');
var router = express.Router();
var funcionController = require('../controllers/funcion_C')

/* GET home page. */
router.get('/', function (req, res, next) {
  funcionController.todo()
    .then((result) => {
      res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
      res.locals.totalAsientos = res.locals.totalAsientos || 0;
      res.locals.ingresos = res.locals.ingresos || 0;

      result.data.forEach((item) => {
        const hoy = new Date().toDateString();
        const fechaFuncion = new Date(item.fecha).toDateString();
        if (fechaFuncion === hoy) {
          res.locals.funcionesHoy++;
        }
        res.locals.totalAsientos = (res.locals.totalAsientos || 0) + Number(item.asientos_disponibles || 0);
        res.locals.ingresos = (res.locals.ingresos || 0) + ((item.capacidad - item.asientos_disponibles) * item.precio || 0);
      })
      res.render('Funciones/index',
        {
          title: 'Películas',
          data: result.data,
          status: result.status,
          mensaje: result.mensaje,
          asientos: res.locals.totalAsientos,
          total: res.locals.ingresos,
          funcionesHoy: res.locals.funcionesHoy,
          peliculas: result.peliculas,
          salas: result.salas
        });

    }).catch((err) => {
      res.send(err)
    });
});

router.post('/uno/:id', function (req, res, next) {
  funcionController.uno(req.params.id)
    .then((result) => {
      res.render('Funciones/index',
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
  funcionController.crear(req.body)
    .then((crear) => {
      return funcionController.todo()
        .then((todo) => {
          res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
          res.locals.totalAsientos = res.locals.totalAsientos || 0;
          res.locals.ingresos = res.locals.ingresos || 0;

          todo.data.forEach((item) => {
            const hoy = new Date().toDateString();
            const fechaFuncion = new Date(item.fecha).toDateString();
            if (fechaFuncion === hoy) {
              res.locals.funcionesHoy++;
            }
            res.locals.totalAsientos = (res.locals.totalAsientos || 0) + Number(item.asientos_disponibles || 0);
            res.locals.ingresos = (res.locals.ingresos || 0) + ((item.capacidad - item.asientos_disponibles) * item.precio || 0);
          })
          res.render('Funciones/index',
            {
              title: 'Películas',
              data: todo.data,
              status: crear.status,
              mensaje: crear.mensaje,
              asientos: res.locals.totalAsientos,
              total: res.locals.ingresos,
              funcionesHoy: res.locals.funcionesHoy,
              peliculas: todo.peliculas,
              salas: todo.salas
            });
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/rango', function (req, res, next) {
  funcionController.rango(req.body)
    .then((rango) => {
      return funcionController.todo()
        .then((todo) => {
          res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
          res.locals.totalAsientos = res.locals.totalAsientos || 0;
          res.locals.ingresos = res.locals.ingresos || 0;

          todo.data.forEach((item) => {
            const hoy = new Date().toDateString();
            const fechaFuncion = new Date(item.fecha).toDateString();
            if (fechaFuncion === hoy) {
              res.locals.funcionesHoy++;
            }
            res.locals.totalAsientos = (res.locals.totalAsientos || 0) + Number(item.asientos_disponibles || 0);
            res.locals.ingresos = (res.locals.ingresos || 0) + ((item.capacidad - item.asientos_disponibles) * item.precio || 0);
          })
          res.render('Funciones/index',
            {
              title: 'Películas',
              data: rango,
              status: rango.status,
              mensaje: rango.mensaje,
              asientos: res.locals.totalAsientos,
              total: res.locals.ingresos,
              funcionesHoy: res.locals.funcionesHoy,
              peliculas: todo.peliculas,
              salas: todo.salas
            });
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.put('/editar/:id', function (req, res, next) {
  funcionController.editar(req.params.id,req.body)
    .then((editar) => {
      return funcionController.todo()
        .then((todo) => {
          res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
          res.locals.totalAsientos = res.locals.totalAsientos || 0;
          res.locals.ingresos = res.locals.ingresos || 0;

          todo.data.forEach((item) => {
            const hoy = new Date().toDateString();
            const fechaFuncion = new Date(item.fecha).toDateString();
            if (fechaFuncion === hoy) {
              res.locals.funcionesHoy++;
            }
            res.locals.totalAsientos = (res.locals.totalAsientos || 0) + Number(item.asientos_disponibles || 0);
            res.locals.ingresos = (res.locals.ingresos || 0) + ((item.capacidad - item.asientos_disponibles) * item.precio || 0);
          })
          res.render('Funciones/index',
            {
              title: 'Películas',
              data: todo.data,
              status: editar.status,
              mensaje: editar.mensaje,
              asientos: res.locals.totalAsientos,
              total: res.locals.ingresos,
              funcionesHoy: res.locals.funcionesHoy,
              peliculas: todo.peliculas,
              salas: todo.salas
            });
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.delete('/eliminar/:id', function (req, res, next) {
  funcionController.eliminar(req.params.id)
    .then((eliminar) => {
      return funcionController.todo()
        .then((todo) => {
          res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
          res.locals.totalAsientos = res.locals.totalAsientos || 0;
          res.locals.ingresos = res.locals.ingresos || 0;

          todo.data.forEach((item) => {
            const hoy = new Date().toDateString();
            const fechaFuncion = new Date(item.fecha).toDateString();
            if (fechaFuncion === hoy) {
              res.locals.funcionesHoy++;
            }
            res.locals.totalAsientos = (res.locals.totalAsientos || 0) + Number(item.asientos_disponibles || 0);
            res.locals.ingresos = (res.locals.ingresos || 0) + ((item.capacidad - item.asientos_disponibles) * item.precio || 0);
          })
          res.render('Funciones/index',
            {
              title: 'Películas',
              data: todo.data,
              status: eliminar.status,
              mensaje: eliminar.mensaje,
              asientos: res.locals.totalAsientos,
              total: res.locals.ingresos,
              funcionesHoy: res.locals.funcionesHoy,
              peliculas: todo.peliculas,
              salas: todo.salas
            });
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
