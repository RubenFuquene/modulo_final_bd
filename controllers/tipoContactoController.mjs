// Función para obtener tipos de contacto desde la base de datos utilizando la conexión Singleton
export async function getTiposContacto(req, res) {
  try {
    const query = 'SELECT IDTIPOCONTACTO, DESCTIPOCONTACTO FROM TIPOCONTACTO';
    const result = await req.db.execute(query);

    // Convertir el resultado a un formato adecuado
    const tiposContacto = result.rows.map(row => ({
      id: row[0],
      descripcion: row[1],
    }));

    res.json(tiposContacto);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error al obtener tipos de contacto');
  }
}
