// Función para obtener tipos de personas desde la base de datos utilizando la conexión Singleton
export async function getTiposPersona(req, res) {
  try {
    const query = 'SELECT IDTIPOPERSONA, DESCTIPOPERSONA FROM TIPOPERSONA';
    const result = await req.db.execute(query);

    // Convertir el resultado a un formato adecuado
    const tiposPersona = result.rows.map(row => ({
      id: row[0],
      descripcion: row[1],
    }));

    res.json(tiposPersona);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error al obtener tipos de personas');
  }
}