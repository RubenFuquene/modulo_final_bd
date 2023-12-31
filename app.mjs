// Importar módulos necesarios
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import bodyParser from 'body-parser';
import database from './config/db.mjs';
import config from './config/config.mjs';
import session from 'express-session';

// Crear una instancia de la aplicación Express
const app = express();

// Configuración de la aplicación

// Configurar motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(dirname(fileURLToPath(import.meta.url)), 'views'));

// Middleware para manejar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'public'), {
  extensions: ['html', 'htm', 'mjs'], // Agrega 'mjs' a las extensiones permitidas
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));

// Middleware para conectar a la base de datos en cada solicitud
app.use(async (req, res, next) => {
  try {
    const db = await database.connect(config.database);
    // Adjuntar la conexión a la solicitud para que esté disponible en las rutas
    req.db = db;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error de conexión a la base de datos');
  }
});

// Middleware para liberar la conexión al finalizar la aplicación
app.use((req, res, next) => {
  // Cerrar la conexión cuando la aplicación se apaga
  process.on('SIGINT', async () => {
    if (req.db) {
      await database.close();
    }
    process.exit(0);
  });

  next();
});

// Configuración de express-session
app.use(session({
  secret: 'mi_cookie',
  resave: false,
  saveUninitialized: true,
}));

// Importar y usar los enrutadores
import indexRouter from './routes/index.mjs';
import empleados from './routes/empleados.mjs';
import gets from './routes/gets.mjs';
import personas from './routes/personas.mjs';
import contactos from './routes/contactos.mjs';
import componentesDirecc from './routes/componentesDirecc.mjs';
import facturas from './routes/facturas.mjs';
import productos from './routes/productos.mjs';

app.use('/', indexRouter);
app.use('/empleados', empleados);
app.use('/api', gets);
app.use('/personas', personas);
app.use('/contactos', contactos);
app.use('/comp-dir', componentesDirecc);
app.use('/facturas', facturas);
app.use('/productos', productos);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).send('Página no encontrada');
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});