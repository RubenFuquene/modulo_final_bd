import express from 'express';
import { autenticarEmpleado } from '../controllers/empleadoController.mjs';

const router = express.Router();

// Ruta para manejar la creación de una nueva persona
router.post('/auth', autenticarEmpleado);

export default router;