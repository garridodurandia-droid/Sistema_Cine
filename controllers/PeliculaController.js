const storage = require('../data/storage');

class PeliculaController {
    crear(req, res) {
        const { titulo, director, genero, duracion, clasificacion, sinopsis } = req.body;
        const pelicula = storage.agregar('peliculas', {
            titulo,
            director,
            genero,
            duracion: parseInt(duracion),
            clasificacion,
            sinopsis,
            activa: true
        });
        res.status(201).json(pelicula);
    }

   
listar(req, res) {
    try {
        const peliculas = storage.obtenerTodos('peliculas'); // ← TODAS las películas
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

    obtenerPorId(req, res) {
        const pelicula = storage.obtenerPorId('peliculas', req.params.id);
        if (pelicula) {
            res.json(pelicula);
        } else {
            res.status(404).json({ error: 'Película no encontrada' });
        }
    }

    obtenerUltimas5(req, res) {
        const peliculas = storage.obtenerUltimos5('peliculas', 'fechaCreacion');
        res.json(peliculas);
    }

    actualizar(req, res) {
        const pelicula = storage.actualizar('peliculas', req.params.id, req.body);
        if (pelicula) {
            res.json(pelicula);
        } else {
            res.status(404).json({ error: 'Película no encontrada' });
        }
    }

    eliminar(req, res) {
        const pelicula = storage.eliminar('peliculas', req.params.id);
        if (pelicula) {
            res.json({ message: 'Película eliminada correctamente' });
        } else {
            res.status(404).json({ error: 'Película no encontrada' });
        }
    }
}

module.exports = new PeliculaController();
