const express        = require('express');
const path           = require('path');
const methodOverride = require('method-override');
const session        = require('express-session');

const sequelize      = require('./src/config/db');
// Importar modelos para registrar asociaciones antes de sync
require('./src/models/Cliente');
require('./src/models/Reserva');

const clientesRouter  = require('./src/routes/clientes');
const reservasRouter  = require('./src/routes/reservas');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Motor de vistas ──────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// ── Middlewares globales ─────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Archivos estáticos (CSS, imágenes subidas, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sesiones (para mensajes flash simples)
app.use(
  session({
    secret: 'xioexamen2_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

// Pasar mensajes flash a todas las vistas
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || {};
  delete req.session.flash;
  next();
});

// ── Rutas ────────────────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/clientes'));

app.use('/clientes', clientesRouter);
app.use('/reservas', reservasRouter);

// ── Manejo de errores 404 ────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { titulo: 'Página no encontrada' });
});

// ── Manejo de errores generales ──────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { titulo: 'Error del servidor', mensaje: err.message });
});

// ── Iniciar servidor ─────────────────────────────────────────
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  });
