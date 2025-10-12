const express = require('express');
const router = express.Router();
const SalaController = require('../controllers/SalaController');

router.get('/', SalaController.listar);
router.get('/ultimas', SalaController.obtenerUltimas5);
router.get('/:id', SalaController.obtenerPorId);
router.post('/', SalaController.crear);
router.put('/:id', SalaController.actualizar);
router.delete('/:id', SalaController.eliminar);

module.exports = router;