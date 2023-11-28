import express from 'express';
import { crearPersona, obtenerPersonaPorDocumento } from '../controllers/personaController.mjs';

const router = express.Router();

// Ruta para manejar la creación de una nueva persona
router.post('/crear-persona', crearPersona);

// Ruta para obtener información de una persona buscada pr número de documento
router.get('/obtener-por-documento/:numeroDocumento', obtenerPersonaPorDocumento);

export default router;