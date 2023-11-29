// Importar módulos necesarios
import express from 'express';
import { asyncMiddleware } from '../config/middlewares.mjs';
import { getTiposPersona } from '../controllers/tipoPersonaController.mjs';
import { getTiposDocumento } from '../controllers/tipoDocController.mjs';
import { getTiposContacto } from '../controllers/tipoContactoController.mjs';
import { obtenerComponentesConNomenclaturas } from '../controllers/componenteDireccController.mjs';

// Crear un enrutador de Express
const router = express.Router();

// Definir rutas

// Ruta principal (Logueo)
router.get('/', (req, res) => {
  res.render('login');
});

// Home
router.get('/home', (req, res) => {
  res.render('home', {cargos: req.session.cargos});
});

// Ruta para la creación de persona
router.get('/crear-persona', asyncMiddleware(async (req, res) => {
  const tiposPersona = await getTiposPersona(req, res);
  const tiposDocumento = await getTiposDocumento(req, res);
  const tiposContacto = await getTiposContacto(req, res);
  const componentesConNomenclaturas = await obtenerComponentesConNomenclaturas(req, res);

  res.render('crearPersona', { title: 'Crear Persona', tiposPersona, tiposDocumento, tiposContacto, componentesConNomenclaturas });
}));

// Ruta para la creación de factura
router.get('/crear-factura', (req, res) => {
  res.render('crearFactura', { title: 'Crear Factura' });
});

// Exportar el enrutador
export default router;
