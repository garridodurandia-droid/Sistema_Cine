const express = require('express');
const router = express.Router();
const PeliculaController = require('../controllers/PeliculaController');

router.get('/', PeliculaController.listar);
router.get('/ultimas', PeliculaController.obtenerUltimas5);
router.get('/:id', PeliculaController.obtenerPorId);
router.post('/', PeliculaController.crear);
router.put('/:id', PeliculaController.actualizar);
router.delete('/:id', PeliculaController.eliminar);

module.exports = router;
