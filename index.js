const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Conexión local a MongoDB (así evitamos problemas con internet o contraseñas)
mongoose.connect('mongodb://127.0.0.1:27017/esports_db')
    .then(() => console.log('Conectado a MongoDB local'))
    .catch((err) => console.log('Error de Mongo:', err));

// Esquema de Mongoose
const teamSchema = new mongoose.Schema({
    teamName: String,
    captainName: String,
    game: String,
    email: String,
    substitutesCount: Number
});
const Team = mongoose.model('Team', teamSchema);

// Configuración de Handlebars
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.render('home');
});

app.post('/register', async (req, res) => {
    try {
        const { teamName, captainName, game, email, substitutesCount } = req.body;
        const nuevoEquipo = new Team({ teamName, captainName, game, email, substitutesCount });
        await nuevoEquipo.save();
        res.render('success', { teamName, captainName, game });
    } catch (error) {
        console.log(error);
        res.send('Error al registrar');
    }
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
