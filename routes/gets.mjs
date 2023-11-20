import express from 'express';
import { getTiposPersona } from '../controllers/tipoPersonaController.mjs';
import { getTiposDocumento } from '../controllers/tipoDocController.mjs';
import { getTiposContacto } from '../controllers/tipoContactoController.mjs';

const router = express.Router();

// Endpoint para obtener tipos de personas
router.get('/tipos-persona', getTiposPersona);

// Nuevo endpoint para obtener tipos de documentos
router.get('/tipos-documento', getTiposDocumento);

// Nuevo endpoint para obtener tipos de contacto
router.get('/tipos-contacto', getTiposContacto);

export default router;
