const express = require('express');
const hbs = require('hbs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://micaelalujan387_db_user:rZ1UHF3VnQgJbUwb@cluster0.ugzwynk.mongodb.net/torneo?appName=Cluster0', {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Conectado a Atlas'))
.catch(err => console.log('Error:', err));

const equipoSchema = new mongoose.Schema({
    nombreEquipo: { type: String, required: true },
    nombreCapitan: { type: String, required: true },
    juego: { type: String, required: true },
    correo: { type: String, required: true },
    suplentes: { type: Number, required: true }
});

const Equipo = mongoose.model('Equipo', equipoSchema, 'equipos');

hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.get('/equipos', async (req, res) => {
    try {
        const listaEquipos = await Equipo.find();
        res.render('equipos', { equipos: listaEquipos });
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        res.status(500).send("Error al cargar la lista de equipos.");
    }
});

app.post('/registro', async (req, res) => {
    try {
        const nuevoEquipo = new Equipo({
            nombreEquipo: req.body.nombreEquipo,
            nombreCapitan: req.body.nombreCapitan,
            juego: req.body.juego,
            correo: req.body.correo,
            suplentes: req.body.suplentes
        });

        await nuevoEquipo.save();
        console.log("Equipo guardado en MongoDB:", nuevoEquipo);

        res.redirect('/equipos');
    } catch (error) {
        console.error("Error al guardar:", error);
        res.status(500).send("Hubo un error al procesar la inscripción.");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor andando en http://localhost:${PORT}`);
});

app.use((req, res) => {
    res.status(404).send("<h1>404 - Página no encontrada</h1><a href='/'>Volver al inicio</a>");
});