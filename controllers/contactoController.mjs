import { insertarContacto } from '../models/contactoModel.mjs';

export async function crearContacto(req, res) {
  try {
    // Recuperar los datos del cuerpo de la solicitud
    const { tipoContacto, descTipoContacto, numeroDocumento, idTipoDoc, idTipoPersona, descContacto } = req.body;

    // Realizar la inserción en la base de datos utilizando el modelo
    const resultado = await insertarContacto(req.db, tipoContacto, descTipoContacto, numeroDocumento, idTipoDoc, idTipoPersona, descContacto);

    // Responder con un mensaje JSON
    res.json({ mensaje: 'Contacto creado exitosamente', resultado });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error al crear el contacto');
  }
}
