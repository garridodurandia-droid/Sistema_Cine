const storage = require('../data/storage');

class ClienteController {
    crear(req, res) {
        const { nombre, email, telefono } = req.body;
        const cliente = storage.agregar('clientes', {
            nombre,
            email,
            telefono,
            fechaRegistro: new Date()
        });
        res.status(201).json(cliente);
    }

    listar(req, res) {
        const clientes = storage.obtenerTodos('clientes');
        res.json(clientes);
    }

    obtenerPorId(req, res) {
        const cliente = storage.obtenerPorId('clientes', req.params.id);
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    }

    obtenerUltimos5(req, res) {
        const clientes = storage.obtenerUltimos5('clientes', 'fechaRegistro');
        res.json(clientes);
    }

    actualizar(req, res) {
        const cliente = storage.actualizar('clientes', req.params.id, req.body);
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    }

    eliminar(req, res) {
        const cliente = storage.eliminar('clientes', req.params.id);
        if (cliente) {
            res.json({ message: 'Cliente eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    }
}

module.exports = new ClienteController();