import express from 'express';
import { asyncMiddleware } from '../config/middlewares.mjs';
import { crearFacturaController, getNuevoNumeroFactura, getFacturaPorNumero } from '../controllers/facturaController.mjs';

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
  res.render('crearDevolucion', {title: 'Devolucion de venta', valorCampo: 'VENTA'});
});

router.get('/devolucion-compra', (req, res) => {
  res.render('crearDevolucion', {title: 'Devolucion de compra', valorCampo: 'COMPRA'});
});

router.post('/crear-factura', crearFacturaController);

//Ruta para traer una factura
router.get('/get-factura/:numeroFactura', getFacturaPorNumero)

// Exportar el enrutador
export default router;