// Función para obtener tipos de personas desde la base de datos utilizando la conexión Singleton
export async function getAllTipoPersona(db) {
  try {
    const query = 'SELECT IDTIPOPERSONA, DESCTIPOPERSONA FROM TIPOPERSONA';
    const result = await db.execute(query);

    // Convertir el resultado a un formato adecuado
    const tiposPersona = result.rows.map(row => ({
      id: row[0],
      descripcion: row[1],
    }));

    return tiposPersona;
  } catch (error) {
    console.error(error.message);
    throw new Error('Error al obtener tipos de persona');
  }
}
