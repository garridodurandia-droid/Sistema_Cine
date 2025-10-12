const express = require('express');
const router = express.Router();
const FuncionController = require('../controllers/FuncionController');

router.get('/', FuncionController.listar);
router.get('/rango-fecha', FuncionController.obtenerPorRangoFecha);
router.get('/:id', FuncionController.obtenerPorId);
router.post('/', FuncionController.crear);
router.delete('/:id', FuncionController.eliminar);

module.exports = router;