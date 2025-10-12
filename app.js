const express = require('express');
const path = require('path');
const app = express();

// Configuración
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas (IMPORTANTE: en este orden)
app.use('/', require('./routes/index'));           // ← PRIMERO
app.use('/peliculas', require('./routes/peliculas'));
app.use('/salas', require('./routes/salas'));
app.use('/funciones', require('./routes/funciones'));
app.use('/clientes', require('./routes/clientes'));
app.use('/reservas', require('./routes/reservas'));
app.use('/api/peliculas', require('./routes/peliculasApi'));
app.use('/api/salas', require('./routes/salas'));
app.use('/api/funciones', require('./routes/funciones'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/reservas', require('./routes/reservas'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Sistema de cine ejecutándose en http://localhost:${PORT}`);
});