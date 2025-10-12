const storage = require('../data/storage');

class SalaController {
    crear(req, res) {
        const { numero, capacidad, tipo, equipamiento } = req.body;
        const sala = storage.agregar('salas', {
            numero: parseInt(numero),
            capacidad: parseInt(capacidad),
            tipo,
            equipamiento: equipamiento || [],
            disponible: true
        });
        res.status(201).json(sala);
    }

    listar(req, res) {
        const salas = storage.obtenerTodos('salas');
        res.json(salas);
    }

    obtenerPorId(req, res) {
        const sala = storage.obtenerPorId('salas', req.params.id);
        if (sala) {
            res.json(sala);
        } else {
            res.status(404).json({ error: 'Sala no encontrada' });
        }
    }

    obtenerUltimas5(req, res) {
        const salas = storage.obtenerUltimos5('salas', 'numero');
        res.json(salas);
    }

    actualizar(req, res) {
        const sala = storage.actualizar('salas', req.params.id, req.body);
        if (sala) {
            res.json(sala);
        } else {
            res.status(404).json({ error: 'Sala no encontrada' });
        }
    }

    eliminar(req, res) {
        const sala = storage.eliminar('salas', req.params.id);
        if (sala) {
            res.json({ message: 'Sala eliminada correctamente' });
        } else {
            res.status(404).json({ error: 'Sala no encontrada' });
        }
    }
}

module.exports = new SalaController();