import { insertarPersona, getPersonaPorDocumento } from '../models/personaModel.mjs';

// Define la ruta para crear una persona
export async function crearPersona(req, res) {
  try {
    // Recuperar los datos del cuerpo del formulario
    const { nombre, apellido, tipoPersona, tipoDocumento, numeroDocumento } = req.body;

    // Realizar la inserción en la base de datos utilizando tu modelo
    const resultado = await insertarPersona(req.db, nombre, apellido, tipoPersona, tipoDocumento, numeroDocumento);

    res.json({ mensaje: 'Persona creada exitosamente', resultado });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error al crear la persona');
  }
}

// Define la ruta para obtener una persona por número de documento
export async function obtenerPersonaPorDocumento(req, res) {
  try {
    // Obtén el número de documento desde los parámetros de la ruta
    const { numeroDocumento } = req.params;

    // Llama a la función del modelo para obtener la persona
    const persona = await getPersonaPorDocumento(req.db, numeroDocumento);

    // Verifica si se encontró la persona
    if (persona) {
      // Envía la persona como respuesta
      res.json(persona);
    } else {
      // Si no se encuentra, devuelve un mensaje indicando que no se encontró la persona
      res.status(404).json({ mensaje: 'Persona no encontrada' });
    }
  } catch (error) {
    // Maneja los errores
    console.error(error.message);
    res.status(500).send('Error al obtener la persona por número de documento');
  }
}