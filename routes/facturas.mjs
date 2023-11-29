import express from 'express';
import { asyncMiddleware } from '../config/middlewares.mjs';
import { crearFacturaController, getNuevoNumeroFactura } from '../controllers/facturaController.mjs';

// Crear un enrutador de Express
const router = express.Router();

router.get('/realizar-venta', asyncMiddleware(async (req, res) => {
  const nuevoNumerofacctura = await getNuevoNumeroFactura(req, res);
  res.render('crearFactura', {title: 'Realizar Venta', personaObjetivo: 'cliente', valorCampo: 'VALOR', numeroFactura: nuevoNumerofacctura});
}));

router.get('/realizar-compra', asyncMiddleware(async (req, res) => {
  const nuevoNumerofacctura = await getNuevoNumeroFactura(req, res);
  res.render('crearFactura', {title: 'Realizar Compra', personaObjetivo: 'proveedor', valorCampo: 'VALORCOMPRA', numeroFactura: nuevoNumerofacctura});
}));

router.get('/devolucion-venta', (req, res) => {
  res.render('devolucionVenta');
});

router.get('/devolucion-compra', (req, res) => {
  res.render('devolucionCompra');
});

router.post('/crear-factura', crearFacturaController);

// Exportar el enrutador
export default router;