class Storage {
    constructor() {
        this.peliculas = [
            {
                id: 1,
                titulo: "El Conjuro 4: Last Rites",
                director: "Michael Chaves",
                genero: "Terror",
                duracion: 135,
                clasificacion: "C",
                sinopsis: "La película sigue a los investigadores paranormales Ed y Lorraine Warren mientras investigan su caso más aterrador: el de la familia Smurl",
                activa: true,
                fechaCreacion: new Date()
            },
            {
                id: 2,
                titulo: "Como entrenar a tu dragon",
                director: "Dean DeBlois", 
                genero: "Fantasias/Aventura",
                duracion: 125,
                clasificacion: "A",
                sinopsis: "Un joven vikingo, Hipo, se hace amigo de un dragón salvaje al que llama Desdentado y juntos se embarcan en una aventura que desafía las creencias de su aldea.",
                activa: true,
                fechaCreacion: new Date()
            },
             {
                id: 3,
                titulo: "La Hora de la Desaparicion",
                director: "Zach Cregger", 
                genero: "Thriller/Misterio",
                duracion: 128,
                clasificacion: "C",
                sinopsis: "Un detective de la policía y la maestra de una clase se unen para investigar la misteriosa desaparición de 17 niños de una escuela primaria.",
                activa: true,
                fechaCreacion: new Date()
             },
             {
                id: 4,
                titulo: "Misión Imposible: Sentencia Final",
                director: "Christopher McQuarrie",
                genero: "Acción/Espionaje/Suspenso",
                duracion: 169,
                clasificacion: "B",
                sinopsis: " Ethan Hunt y su equipo se enfrentan a una misión crítica para encontrar y destruir una poderosa inteligencia artificial conocida como La Entidad, que amenaza con controlar las estructuras políticas, financieras y militares de todo el mundo.",
                activa: true,
                fechaCreacion: new Date()
            }
        ];
        this.salas = [
            {
                id: 1,
                numero: "1",  // ← Asegúrate de que tenga 'nombre'
                capacidad: 120,
                tipo: "PREMIUM",
                equipamiento: ["4K", "Dolby Atmos", "Butacas VIP"],
              activa: true,
             fechaCreacion: new Date()  // ← Agrega esta línea
            },
            {
                id: 2,
                numero: "2", 
                capacidad: 80,
                tipo: "STANDARD",
                equipamiento: ["Full HD", "Sonido Surround"],
                activa: true,
                fechaCreacion: new Date()
            },
            {
                id: 3,
                numero: "3",
                capacidad: 100,
                tipo: "3D",
                equipamiento: ["Proyector 3D", "Gafas 3D"],
                activa: true,
                fechaCreacion: new Date()
            },
            {
                id: 4,
                numero: "4",
                capacidad: 90,
                tipo: "PREMIUM", 
                equipamiento: ["4K", "Butacas Reclinables"],
                activa: true,
                fechaCreacion: new Date()
            },
            {
                id: 5,
                numero: "5",
                capacidad: 70,
                tipo: "STANDARD",
                equipamiento: ["Full HD"],
                activa: true,
                fechaCreacion: new Date()
            }
        ];
        this.funciones = [
            {
                id: 1,
                peliculaId: 1, 
                salaId: 1,     
                fecha: "2025-10-15",
                hora: "20:00",
                precio: 5.00,
                asientosDisponibles: 120,
                activa: true
            },
            {
                id: 2,
                peliculaId: 2, 
                salaId: 2,     
                fecha: "2025-10-15",
                hora: "15:00",
                precio: 5.00,
                asientosDisponibles: 80,
                activa: true
            },
            {
                id: 3,
                peliculaId: 3, // The Dark Knight
                salaId: 3,     // Sala 3D
                fecha: "2025-10-16", 
                hora: "19:00",
                precio: 5.00,
                asientosDisponibles: 100,
                activa: true
            },
            {
                id: 4,
                peliculaId: 4, 
                salaId: 4,     
                fecha: "2025-10-16",
                hora: "19:30",
                precio: 5.00,
                asientosDisponibles: 90,
                activa: true
            }
        ];
        this.clientes = [];
        this.reservas = [];
        this.nextIds = {
            peliculas: 3,
            salas: 6,    // Ya tenemos 5 salas
            funciones: 5, // Ya tenemos 4 funciones  
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
