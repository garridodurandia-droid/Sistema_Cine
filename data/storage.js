class Storage {
    constructor() {
        this.peliculas = [
            {
                id: 1,
                titulo: "The Dark Knight",
                director: "Christopher Nolan",
                genero: "Acción",
                duracion: 152,
                clasificacion: "PG-13",
                sinopsis: "Batman se enfrenta al Joker en Gotham City",
                activa: true,
                fechaCreacion: new Date()
            },
            {
                id: 2,
                titulo: "Inception",
                director: "Christopher Nolan", 
                genero: "Ciencia Ficción",
                duracion: 148,
                clasificacion: "PG-13",
                sinopsis: "Un ladrón que roba secretos del subconsciente",
                activa: true,
                fechaCreacion: new Date()
            }
        ];
        this.salas = [];
        this.funciones = [];
        this.clientes = [];
        this.reservas = [];
        this.nextIds = {
            peliculas: 3, // ← Cambia a 3 porque ya hay 2 películas
            salas: 1,
            funciones: 1,
            clientes: 1,
            reservas: 1
        };
    }

    agregar(entidad, datos) {
        const id = this.nextIds[entidad]++;
        const elemento = { id, ...datos, fechaCreacion: new Date() };
        this[entidad].push(elemento);
        return elemento;
    }

    obtenerTodos(entidad) {
        return this[entidad];
    }

    obtenerPorId(entidad, id) {
        return this[entidad].find(item => item.id === parseInt(id));
    }

    obtenerUltimos5(entidad, campoOrden = 'id') {
        return this[entidad]
            .sort((a, b) => b[campoOrden] - a[campoOrden])
            .slice(0, 5);
    }

    obtenerPorRangoFecha(entidad, fechaInicio, fechaFin) {
        return this[entidad].filter(item => {
            const fechaItem = new Date(item.fechaCreacion);
            return fechaItem >= new Date(fechaInicio) && fechaItem <= new Date(fechaFin);
        });
    }

    eliminar(entidad, id) {
        const index = this[entidad].findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            return this[entidad].splice(index, 1)[0];
        }
        return null;
    }

    actualizar(entidad, id, datos) {
        const index = this[entidad].findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            this[entidad][index] = { ...this[entidad][index], ...datos, fechaActualizacion: new Date() };
            return this[entidad][index];
        }
        return null;
    }

    eliminarRelacion(entidad, id, campoRelacion) {
        const index = this[entidad].findIndex(item => item.id === parseInt(id));
        if (index !== -1 && this[entidad][index][campoRelacion]) {
            delete this[entidad][index][campoRelacion];
            return true;
        }
        return false;
    }
}

module.exports = new Storage();