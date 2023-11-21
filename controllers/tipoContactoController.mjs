import { getAllTipoContacto } from '../models/tipoContactoModel.mjs';

export async function getTiposContacto(req, res) {
  try {
    const result = await getAllTipoContacto(req.db);

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      // Si la solicitud acepta JSON, responde con JSON
      res.json(result);
    } else {
      // Si no, devuelve la colección
      return result;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error al obtener tipos de personas');
  }
}