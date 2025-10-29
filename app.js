var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var cors = require('cors')
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var peliRouter = require('./routes/peliculasRoutes')
var funcionRouter = require('./routes/funcionRouter')
var salasRouter = require('./routes/salasRouter')
var clientesRouter = require('./routes/clientesRouter')
var reservasRouter = require('./routes/reservasRouter')
var app = express();


const corsEndpoint = process.env.CORS_PORT
//const PORT = 3000;
// view engine setup
// app.use(cors({
//   origin: [corsEndpoint],
//   methods: 'GET,POST,PUT,DELETE'
// }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/peliculas', peliRouter)
app.use('/funciones', funcionRouter);
app.use('/salas', salasRouter);
app.use('/clientes', clientesRouter);
app.use('/reservas', reservasRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
