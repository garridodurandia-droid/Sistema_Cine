var express = require('express');
var router = express.Router();
var reservasController = require('../controllers/reservas_C')

/* GET home page. */
router.get('/', function (req, res, next) {
  reservasController.todo()
    .then((result) => {
      res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
      res.locals.asientos_vendiodos = res.locals.asientos_vendiodos || 0;
      res.locals.totalIngresos = res.locals.totalIngresos || 0;

      result.data.forEach((item) => {
        const hoy = new Date().toDateString();
        const fechaFuncion = new Date(item.fecha).toDateString();
        if (fechaFuncion === hoy) {
          res.locals.funcionesHoy++;
        }
        res.locals.asientos_vendiodos = (res.locals.asientos_vendiodos || 0) + Number(item.asientos || 0);
        res.locals.totalIngresos = (res.locals.totalIngresos || 0) + Number(item.total || 0);
      })
      res.render('Reservas/index',
        {
          title: 'Reservas',
          data: result.data,
          status: result.status,
          mensaje: result.mensaje,
          clientes: result.clientes,
          funciones: result.funciones,
          funcionesHoy: res.locals.funcionesHoy,
          asientos: res.locals.asientos_vendiodos,
          total: res.locals.totalIngresos
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/uno/:id', function (req, res, next) {
  reservasController.uno(req.params.id)
    .then((result) => {
      res.render('Reservas/index',
        {
          title: 'Reservas',
          data: result.data,
          status: result.status,
          mensaje: result.mensaje
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/crear', function (req, res, next) {
  reservasController.crear(req.body)
    .then((crear) => {
      return reservasController.todo()
        .then((todo) => {
          res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
          res.locals.asientos_vendiodos = res.locals.asientos_vendiodos || 0;
          res.locals.totalIngresos = res.locals.totalIngresos || 0;

          todo.data.forEach((item) => {
            const hoy = new Date().toDateString();
            const fechaFuncion = new Date(item.fecha).toDateString();
            if (fechaFuncion === hoy) {
              res.locals.funcionesHoy++;
            }
            res.locals.asientos_vendiodos = (res.locals.asientos_vendiodos || 0) + Number(item.asientos || 0);
            res.locals.totalIngresos = (res.locals.totalIngresos || 0) + Number(item.total || 0);
          })
          res.render('Reservas/index',
            {
              title: 'Reservas',
              status: crear.status,
              mensaje: crear.mensaje,
              data: todo.data,
              clientes: todo.clientes,
              funciones: todo.funciones,
              funcionesHoy: res.locals.funcionesHoy,
              asientos: res.locals.asientos_vendiodos,
              total: res.locals.totalIngresos
            })
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.put('/editar/:id', function (req, res, next) {
  reservasController.editar(req.params.id, req.body)
    .then((editar) => {
      return reservasController.todo()
        .then((todo) => {
          res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
          res.locals.asientos_vendiodos = res.locals.asientos_vendiodos || 0;
          res.locals.totalIngresos = res.locals.totalIngresos || 0;

          todo.data.forEach((item) => {
            const hoy = new Date().toDateString();
            const fechaFuncion = new Date(item.fecha).toDateString();
            if (fechaFuncion === hoy) {
              res.locals.funcionesHoy++;
            }
            res.locals.asientos_vendiodos = (res.locals.asientos_vendiodos || 0) + Number(item.asientos || 0);
            res.locals.totalIngresos = (res.locals.totalIngresos || 0) + Number(item.total || 0);
          })
          res.render('Reservas/index',
            {
              title: 'Reservas',
              status: editar.status,
              mensaje: editar.mensaje,
              data: todo.data,
              clientes: todo.clientes,
              funciones: todo.funciones,
              funcionesHoy: res.locals.funcionesHoy,
              asientos: res.locals.asientos_vendiodos,
              total: res.locals.totalIngresos
            })
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.delete('/eliminar/:id', function (req, res, next) {
  reservasController.eliminar(req.params.id)
    .then((eliminar) => {
      return reservasController.todo()
        .then((todo) => {
          res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
          res.locals.asientos_vendiodos = res.locals.asientos_vendiodos || 0;
          res.locals.totalIngresos = res.locals.totalIngresos || 0;

          todo.data.forEach((item) => {
            const hoy = new Date().toDateString();
            const fechaFuncion = new Date(item.fecha).toDateString();
            if (fechaFuncion === hoy) {
              res.locals.funcionesHoy++;
            }
            res.locals.asientos_vendiodos = (res.locals.asientos_vendiodos || 0) + Number(item.asientos || 0);
            res.locals.totalIngresos = (res.locals.totalIngresos || 0) + Number(item.total || 0);
          })
          res.render('Reservas/index',
            {
              title: 'Reservas',
              status: eliminar.status,
              mensaje: eliminar.mensaje,
              data: todo.data,
              clientes: todo.clientes,
              funciones: todo.funciones,
              funcionesHoy: res.locals.funcionesHoy,
              asientos: res.locals.asientos_vendiodos,
              total: res.locals.totalIngresos
            })
        });
    }).catch((err) => {
      res.send(err)
    });
});

router.post('/rango', function (req, res, next) {
  reservasController.rango(req.body)
    .then((rango) => {
      res.locals.funcionesHoy = res.locals.funcionesHoy || 0;
      res.locals.asientos_vendiodos = res.locals.asientos_vendiodos || 0;
      res.locals.totalIngresos = res.locals.totalIngresos || 0;

      rango.data.forEach((item) => {
        const hoy = new Date().toDateString();
        const fechaFuncion = new Date(item.fecha).toDateString();
        if (fechaFuncion === hoy) {
          res.locals.funcionesHoy++;
        }
        res.locals.asientos_vendiodos = (res.locals.asientos_vendiodos || 0) + Number(item.asientos || 0);
        res.locals.totalIngresos = (res.locals.totalIngresos || 0) + Number(item.total || 0);
      })
      res.render('Reservas/index',
        {
          title: 'Reservas',
          status: rango.status,
          mensaje: rango.mensaje,
          data: rango.data,
          clientes: rango.clientes,
          funciones: rango.funciones,
          funcionesHoy: res.locals.funcionesHoy,
          asientos: res.locals.asientos_vendiodos,
          total: res.locals.totalIngresos
        })

    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
