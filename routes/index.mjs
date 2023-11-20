// Importar módulos necesarios
import express from 'express';

// Crear un enrutador de Express
const router = express.Router();

// Definir rutas

// Ruta principal
router.get('/', (req, res) => {
  res.render('index', { title: 'Mi Aplicación Express' });
});

// Ruta para la creación de persona
router.get('/crear-persona', (req, res) => {
  res.render('crearPersona', { title: 'Crear Persona' });
});

// Ruta para la creación de factura
router.get('/crear-factura', (req, res) => {
  res.render('crearFactura', { title: 'Crear Factura' });
});

// Exportar el enrutador
export default router;
