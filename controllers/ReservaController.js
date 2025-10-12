const storage = require('../data/storage');

class ReservaController {
    crear(req, res) {
        const { funcionId, clienteId, asientos, total } = req.body;
        
        const funcion = storage.obtenerPorId('funciones', funcionId);
        const cliente = storage.obtenerPorId('clientes', clienteId);
        
        if (!funcion || !cliente) {
            return res.status(400).json({ error: 'Función o Cliente no encontrado' });
        }

        if (funcion.asientosDisponibles < asientos) {
            return res.status(400).json({ error: 'No hay suficientes asientos disponibles' });
        }

        // Actualizar asientos disponibles
        funcion.asientosDisponibles -= asientos;
        storage.actualizar('funciones', funcionId, { asientosDisponibles: funcion.asientosDisponibles });

        const reserva = storage.agregar('reservas', {
            funcionId: parseInt(funcionId),
            clienteId: parseInt(clienteId),
            asientos: parseInt(asientos),
            total: parseFloat(total),
            fechaReserva: new Date(),
            estado: 'confirmada'
        });
        res.status(201).json(reserva);
    }

    listar(req, res) {
        const reservas = storage.obtenerTodos('reservas');
        const reservasCompletas = reservas.map(reserva => {
            const funcion = storage.obtenerPorId('funciones', reserva.funcionId);
            const cliente = storage.obtenerPorId('clientes', reserva.clienteId);
            const pelicula = funcion ? storage.obtenerPorId('peliculas', funcion.peliculaId) : null;
            
            return {
                ...reserva,
                funcion: funcion ? { 
                    fecha: funcion.fecha, 
                    hora: funcion.hora,
                    pelicula: pelicula ? { titulo: pelicula.titulo } : null
                } : null,
                cliente: cliente ? { nombre: cliente.nombre, email: cliente.email } : null
            };
        });
        res.json(reservasCompletas);
    }

    obtenerPorId(req, res) {
        const reserva = storage.obtenerPorId('reservas', req.params.id);
        if (reserva) {
            const funcion = storage.obtenerPorId('funciones', reserva.funcionId);
            const cliente = storage.obtenerPorId('clientes', reserva.clienteId);
            res.json({
                ...reserva,
                funcion,
                cliente
            });
        } else {
            res.status(404).json({ error: 'Reserva no encontrada' });
        }
    }

    obtenerPorRangoFecha(req, res) {
        const { fechaInicio, fechaFin } = req.query;
        const reservas = storage.obtenerPorRangoFecha('reservas', fechaInicio, fechaFin);
        res.json(reservas);
    }

    eliminar(req, res) {
        const reserva = storage.eliminar('reservas', req.params.id);
        if (reserva) {
            res.json({ message: 'Reserva eliminada correctamente' });
        } else {
            res.status(404).json({ error: 'Reserva no encontrada' });
        }
    }
}

module.exports = new ReservaController();