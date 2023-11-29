import { crearFactura, obtenerUltimoNumeroFactura, obtenerFacturaPorNumero } from '../models/facturaModel.mjs';
import { getPersonaPorDocumento } from '../models/personaModel.mjs';
import { insertarDetalleFactura } from '../models/detalleFacturaModel.mjs';
import { obtenerUltimoPrecioEInventario } from '../models/productoModel.mjs';
import { insertarActualizaciónInventario, obtenerInventarioMasReciente } from '../models/inventarioModel.mjs';

export async function crearFacturaController(req, res) {
    try {
        const { persona, total, tipoFactura, productos, tipoFacturaAnterior, numeroFacturaAnterior } = req.body;

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
            totalFactura: total,
            tipoFacturaAnterior,
            numeroFacturaAnterior,
        }
        // Llama al modelo para insertar en la tabla FACTURA
        await crearFactura(req.db, datosFactura);

        for (const detalle of productos) {

            const productoBD = await obtenerUltimoPrecioEInventario(req.db, detalle.codigoProducto);

            const detalles = {
                nFactura: nuevoNumeroFactura,
                tipoFac: tipoFactura,
                refProducto: detalle.codigoProducto,
                idCatProducto: productoBD.categoria,
                item: detalle.codigoProducto,
                cantidad: detalle.cantidadProductos,
                precio: detalle.precioProducto,
            };

            await insertarDetalleFactura(req.db, detalles);
        }

        for (const detalle of productos) {
            
            const productoBD = await obtenerUltimoPrecioEInventario(req.db, detalle.codigoProducto);

            const ultimoInventario = await obtenerInventarioMasReciente(req.db, detalle.codigoProducto);

            let consectivoInventarioDevolucion;

            const existencia = tipoFactura == 1 || tipoFactura == 4 ? 
                    parseInt(ultimoInventario.existencia) - parseInt(detalle.cantidadProductos) :
                    parseInt(ultimoInventario.existencia) + parseInt(detalle.cantidadProductos);

            if(tipoFacturaAnterior && numeroFacturaAnterior)
            {
                consectivoInventarioDevolucion = ultimoInventario.consecutivo;
            }

            const inventarioData = {
              idCatProducto: productoBD.categoria,
              refProducto: detalle.codigoProducto,
              idTipoFac: tipoFactura,
              nFactura: nuevoNumeroFactura,
              fechaInventario: fechaFormateada,
              salen: tipoFactura == 1 ? detalle.cantidadProductos : 0,
              entran: tipoFactura == 2 ? detalle.cantidadProductos : 0,
              existencia: existencia,
              consectivoInventarioDevolucion
            };
          
            await insertarActualizaciónInventario(req.db, inventarioData);
          }

        // Envía una respuesta de éxito
        res.status(201).send('Factura creada con éxito');

    } catch (error) {
        console.error('Error al crear factura en controlador:', error);
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

export async function getFacturaPorNumero(req, res) {
    try {
        // Obtén el número de factura desde los parámetros de la ruta
        const { numeroFactura } = req.params;
    
        // Llama a la función del modelo para obtener la factura
        const factura = await obtenerFacturaPorNumero(req.db, numeroFactura);
        
        // Verifica si se encontró la factura
        if (factura) {
            if (req.headers.accept && req.headers.accept.includes('application/json'))
            {
                // Si la solicitud acepta JSON, responde con JSON
                res.json(factura);
            } else {
                // Si no, devuelve la colección
                return factura;
            }
        } else {
          // Si no se encuentra, devuelve un mensaje indicando que no se encontró la factura
          res.status(404).json({ mensaje: 'Factura no encontrada' });
        }
      } catch (error) {
        // Maneja los errores
        console.error(error.message);
        res.status(500).send('Error al obtener la factura');
      }
}