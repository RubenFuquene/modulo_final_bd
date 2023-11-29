import { getComponentesConNomenclaturas } from '../models/componenteDireccModel.mjs';

export async function obtenerComponentesConNomenclaturas(req, res) {
  try {
    // Llama al modelo para obtener las componentes con nomenclaturas
    const componentes = await getComponentesConNomenclaturas(req.db);

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      // Si la solicitud acepta JSON, responde con JSON
      res.json(componentes);
    } else {
      // Si no, devuelve la colección
      return componentes;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error al obtener componentes con nomenclaturas');
  }
}
