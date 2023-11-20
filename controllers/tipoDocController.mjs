export async function getTiposDocumento(req, res) {
  try {
    const query = 'SELECT IDTIPODOC, DESCTIPODOC FROM TIPODOC';
    const result = await req.db.execute(query);

    // Convertir el resultado a un formato adecuado
    const tiposDocumento = result.rows.map(row => ({
      id: row[0],
      descripcion: row[1],
    }));

    res.json(tiposDocumento);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error al obtener tipos de documentos');
  }
}
