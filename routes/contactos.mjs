import express from 'express';
import { crearContacto } from '../controllers/contactoController.mjs';

const router = express.Router();

// Ruta para manejar la creación de un nuevo contacto
router.post('/crear-contacto', crearContacto);

export default router;