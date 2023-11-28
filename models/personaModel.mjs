// Define la función para insertar una persona
export async function insertarPersona(db, nombre, apellido, tipoPersona, tipoDocumento, numeroDocumento) {
  try {
    // Realiza la inserción en la base de datos
    const query = `
        INSERT INTO PESONA (NOMBRE, APELLIDO, IDTIPOPERSONA, IDTIPODOC, NDOCUMENTO)
        VALUES (:nombre, :apellido, :tipoPersona, :tipoDocumento, :numeroDocumento)
      `;

    const binds = {
      nombre: nombre,
      apellido: apellido,
      tipoPersona: tipoPersona,
      tipoDocumento: tipoDocumento,
      numeroDocumento: numeroDocumento
    };

    const options = {
      autoCommit: true
    };

    const result = await db.execute(query, binds, options);
    console.log('Persona insertada correctamente:', result);

    return result;
  } catch (error) {
    // Maneja errores de inserción
    console.error('Error al insertar persona:', error);
    throw error;
  }
}

// Define la función para obtener una persona por número de documento
export async function getPersonaPorDocumento(db, numeroDocumento) {
  try {
    // Realiza la consulta en la base de datos
    const query = `
      SELECT NOMBRE, APELLIDO, IDTIPOPERSONA, IDTIPODOC
      FROM PESONA
      WHERE NDOCUMENTO = :numeroDocumento
    `;

    const binds = {
      numeroDocumento: numeroDocumento,
    };

    // Ejecuta la consulta y obtén los resultados
    const result = await db.execute(query, binds);

    // Verifica si se encontró la persona
    if (result.rows.length > 0) {
      // Formatea los resultados como un objeto persona
      const persona = {
        nombre: result.rows[0][0],
        apellido: result.rows[0][1],
        idTipoPersona: result.rows[0][2],
        idTipoDocumento: result.rows[0][3],
        ndocumento: numeroDocumento
      };

      return persona;
    } else {
      // Si no se encuentra la persona, devuelve null
      return null;
    }
  } catch (error) {
    // Maneja los errores
    console.error('Error al obtener la persona por número de documento:', error);
    throw error;
  }
}
