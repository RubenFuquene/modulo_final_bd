// Función para obtener tipos de documentos desde la base de datos utilizando la conexión Singleton
export async function getAllTipoDoc(db) {
  try {
    const query = 'SELECT IDTIPODOC, DESCTIPODOC FROM TIPODOC';
    const result = await db.execute(query);

    // Convertir el resultado a un formato adecuado
    const tiposDoc = result.rows.map(row => ({
      id: row[0],
      descripcion: row[1],
    }));

    return tiposDoc;
  } catch (error) {
    console.error(error.message);
    throw new Error('Error al obtener tipos de documentos');
  }
}
