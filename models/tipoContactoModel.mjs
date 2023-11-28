// Función para obtener tipos de contacto desde la base de datos utilizando la conexión Singleton
export async function getAllTipoContacto(db) {
  try {
    const query = 'SELECT IDTIPOCONTACTO, DESCTIPOCONTACTO FROM TIPOCONTACTO';
    const result = await db.execute(query);

    // Convertir el resultado a un formato adecuado
    const tiposContacto = result.rows.map(row => ({
      id: row[0],
      descripcion: row[1],
    }));

    return tiposContacto;
  } catch (error) {
    console.error(error.message);
    throw new Error('Error al obtener tipos de contacto');
  }
}

// Función para obtener un tipo de contacto por id
export async function getTipoContactoPorId(db, idTipoContacto) {
  try {
    const query = `
      SELECT IDTIPOCONTACTO, DESCTIPOCONTACTO FROM TIPOCONTACTO
      WHERE IDTIPOCONTACTO = :idTipoContacto
    `;

    const binds = {
      idTipoContacto: idTipoContacto
    };

    const options = {
      outFormat: db.OBJECT
    };

    const result = await db.execute(query, binds, options);

    return result.rows[0]; // Devuelve la primera fila (debería ser única por la clave primaria)
  } catch (error) {
    console.error('Error al obtener tipo de contacto por ID:', error);
    throw error;
  }
}