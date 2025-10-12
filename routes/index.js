const express = require('express');
const router = express.Router();

// Página principal
router.get('/', (req, res) => {
    res.render('index');
});

// Vistas de cada módulo
router.get('/peliculas', (req, res) => {
    res.render('peliculas/index');
});

router.get('/salas', (req, res) => {
    res.render('salas/index');
});

router.get('/funciones', (req, res) => {
    res.render('funciones/index');
});

router.get('/clientes', (req, res) => {
    res.render('clientes/index');
});

router.get('/reservas', (req, res) => {
    res.render('reservas/index');
});

module.exports = router;