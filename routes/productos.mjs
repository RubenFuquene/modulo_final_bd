import express from 'express';
import { obtenerDatosUltimoPrecioEInventario } from '../controllers/productoController.mjs';

const router = express.Router();

// Ruta para obtener todos los componentes de dirección, cada uno con sus respectivas nomenclaturas
router.get('/obtener-producto-por-ref/:refProducto', obtenerDatosUltimoPrecioEInventario);

export default router;