const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const PORT = 3000;

// Configuración de Handlebars
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/register', (req, res) => {
    const { teamName, captainName, game, email } = req.body;
    console.log('¡Nuevo equipo registrado!', teamName);
    res.render('success', { teamName, captainName, game });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
