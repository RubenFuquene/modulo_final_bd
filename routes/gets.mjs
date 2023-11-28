import express from 'express';
import { getTiposPersona } from '../controllers/tipoPersonaController.mjs';
import { getTiposDocumento } from '../controllers/tipoDocController.mjs';
import { getTiposContacto, obtenerTipoContactoPorId } from '../controllers/tipoContactoController.mjs';

const router = express.Router();

// Endpoint para obtener tipos de personas
router.get('/tipos-persona', getTiposPersona);

// Endpoint para obtener tipos de documentos
router.get('/tipos-documento', getTiposDocumento);

// Endpoint para obtener tipos de contacto
router.get('/tipos-contacto', getTiposContacto);

// Endpoint para obtener un tipo de contacto por id
router.get('/tipo-contacto-por-id/:idTipoContacto', obtenerTipoContactoPorId);

export default router;
