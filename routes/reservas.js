const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/ReservaController');

router.get('/', ReservaController.listar);
router.get('/rango-fecha', ReservaController.obtenerPorRangoFecha);
router.get('/:id', ReservaController.obtenerPorId);
router.post('/', ReservaController.crear);
router.delete('/:id', ReservaController.eliminar);

module.exports = router;