const storage = require('../data/storage');

class FuncionController {
    crear(req, res) {
        const { peliculaId, salaId, fecha, hora, precio } = req.body;
        
        const pelicula = storage.obtenerPorId('peliculas', peliculaId);
        const sala = storage.obtenerPorId('salas', salaId);
        
        if (!pelicula || !sala) {
            return res.status(400).json({ error: 'Película o Sala no encontrada' });
        }

        const funcion = storage.agregar('funciones', {
            peliculaId: parseInt(peliculaId),
            salaId: parseInt(salaId),
            fecha: new Date(fecha),
            hora,
            precio: parseFloat(precio),
            asientosDisponibles: sala.capacidad,
            activa: true
        });
        res.status(201).json(funcion);
    }

    listar(req, res) {
        const funciones = storage.obtenerTodos('funciones');
        const funcionesCompletas = funciones.map(funcion => {
            const pelicula = storage.obtenerPorId('peliculas', funcion.peliculaId);
            const sala = storage.obtenerPorId('salas', funcion.salaId);
            return {
                ...funcion,
                pelicula: pelicula ? { titulo: pelicula.titulo, duracion: pelicula.duracion } : null,
                sala: sala ? { numero: sala.numero, capacidad: sala.capacidad } : null
            };
        });
        res.json(funcionesCompletas);
    }

    obtenerPorId(req, res) {
        const funcion = storage.obtenerPorId('funciones', req.params.id);
        if (funcion) {
            const pelicula = storage.obtenerPorId('peliculas', funcion.peliculaId);
            const sala = storage.obtenerPorId('salas', funcion.salaId);
            res.json({
                ...funcion,
                pelicula,
                sala
            });
        } else {
            res.status(404).json({ error: 'Función no encontrada' });
        }
    }

    obtenerPorRangoFecha(req, res) {
        const { fechaInicio, fechaFin } = req.query;
        const funciones = storage.obtenerPorRangoFecha('funciones', fechaInicio, fechaFin);
        res.json(funciones);
    }

    eliminar(req, res) {
        const funcion = storage.eliminar('funciones', req.params.id);
        if (funcion) {
            res.json({ message: 'Función eliminada correctamente' });
        } else {
            res.status(404).json({ error: 'Función no encontrada' });
        }
    }
}

module.exports = new FuncionController();