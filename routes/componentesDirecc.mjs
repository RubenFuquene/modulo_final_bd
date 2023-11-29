import express from 'express';
import { obtenerComponentesConNomenclaturas } from '../controllers/componenteDireccController.mjs';

const router = express.Router();

// Ruta para obtener todos los componentes de dirección, cada uno con sus respectivas nomenclaturas
router.get('/obtener-comp-dir-con-nom', obtenerComponentesConNomenclaturas);

export default router;