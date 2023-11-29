import { obtenerUltimoPrecioEInventario } from '../models/productoModel.mjs';

export async function obtenerDatosUltimoPrecioEInventario(req, res) {
    try {
        const { refProducto } = req.params;

        // Suponiendo que db es una instancia válida de la conexión a la base de datos
        const datosProducto = await obtenerUltimoPrecioEInventario(req.db, refProducto);

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
          // Si la solicitud acepta JSON, responde con JSON
          res.json(datosProducto);
        } else {
          // Si no, devuelve la colección
          return datosProducto;
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error al obtener datos del producto');
    }
}
