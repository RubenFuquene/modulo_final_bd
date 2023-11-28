import { getAllTipoContacto, getTipoContactoPorId } from '../models/tipoContactoModel.mjs';

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

export async function obtenerTipoContactoPorId(req, res, next) {
  try {
    const { idTipoContacto } = req.params; // El ID está en los parámetros de la solicitud
    
    // Llama al modelo para obtener el tipo de contacto por ID
    const tipoContacto = await getTipoContactoPorId(req.db, idTipoContacto);

    if (tipoContacto) {
      // Si se encuentra el tipo de contacto, devuelve el resultado
      res.json(tipoContacto);
    } else {
      // Si no se encuentra, devuelve un mensaje indicando que no se encontró
      res.status(404).json({ mensaje: 'Tipo de contacto no encontrado' });
    }
  } catch (error) {
    // Maneja errores
    res.status(500).json({ error: 'Error al obtener tipo de contacto por ID' });
  }
}