import { crearFactura, obtenerUltimoNumeroFactura } from '../models/facturaModel.mjs';
import { getPersonaPorDocumento } from '../models/personaModel.mjs';
import { insertarDetalleFactura } from '../models/detalleFacturaModel.mjs';
import { obtenerDatosUltimoPrecioEInventario } from './productoController.mjs';

export async function crearFacturaController(req, res) {
    try {
        const { persona, total, tipoFactura, productos } = req.body;

        // Obtener el último número de factura + 1
        const ultimoNumeroFactura = await obtenerUltimoNumeroFactura(req.db);
        const nuevoNumeroFactura = ultimoNumeroFactura + 1;
        const personaCompleta = await getPersonaPorDocumento(req.db, persona);
        
        const fechaActual = new Date();
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth() + 1; // Sumar 1 porque los meses son indexados desde 0
        const anio = fechaActual.getFullYear();

        // Formatear la fecha en el formato esperado por Oracle
        const fechaFormateada = `${dia}/${mes}/${anio}`;

        const datosFactura = {
            nFactura: nuevoNumeroFactura,
            nDocumento: personaCompleta.ndocumento,
            idTipoDoc: personaCompleta.idTipoDocumento,
            idTipoPersona: personaCompleta.idTipoPersona,
            idTipoFac: tipoFactura,
            codEmpleado: req.session.empleado[0],
            fechaFactura: fechaFormateada,
            totalFactura: total
        }
        // Llama al modelo para insertar en la tabla FACTURA
        await crearFactura(req.db, datosFactura);

        for (const detalle of detalleFacturaData) {

            const productoBD = await obtenerDatosUltimoPrecioEInventario(req.db, detalle.codigoProducto);

            const detalles = {
                nFactura: nuevoNumeroFactura,
                tipoFac: tipoFactura,
                refProducto: detalle.codigoProducto,
                idCatProducto: productoBD,
                item: item,
                cantidad: cantidad,
                precio: precio,
            };

            await insertarDetalleFactura(req.db, );
        }

        // Envía una respuesta de éxito
        res.status(201).send('Factura creada con éxito');

    } catch (error) {
        console.error('Error al crear factura:', error);
        res.status(500).send('Error al crear factura');
    }
}

export async function getNuevoNumeroFactura(req, res) {
    try {
        // Obtener el último número de factura
        const ultimoNumeroFactura = await obtenerUltimoNumeroFactura(req.db);

        // Incrementa el número para la nueva factura
        const nuevoNumeroFactura = ultimoNumeroFactura + 1;

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            // Si la solicitud acepta JSON, responde con JSON
            res.json({nuevoNumeroFactura: nuevoNumeroFactura});
        } else {
            // Si no, devuelve el número
            return nuevoNumeroFactura;
        }
    } catch (error) {
        // Maneja los errores
        console.error(error.message);
        res.status(500).send('Error al obtener el nuevo número de factura');
    }
}