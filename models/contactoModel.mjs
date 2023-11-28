export async function insertarContacto(db, idTipoContacto, descTipoContacto, nDocumento, idTipoDoc, idTipoPersona, descContacto) {
  try {
    const query = `
      INSERT INTO CONTACTO (IDTIPOCONTACTO, DESCTIPOCONTACTO, NDOCUMENTO, IDTIPODOC, IDTIPOPERSONA, DESCCONTACTO, CONSECCONTACTO)
      VALUES (:idTipoContacto, :descTipoContacto, :nDocumento, :idTipoDoc, :idTipoPersona, :descContacto, CONSECCONTACTO_SEQ.nextval)
    `;

    const binds = {
      idTipoContacto: idTipoContacto,
      descTipoContacto: descTipoContacto,
      nDocumento: nDocumento,
      idTipoDoc: idTipoDoc,
      idTipoPersona: idTipoPersona,
      descContacto: descContacto
    };

    const options = {
      autoCommit: true
    };

    // Realiza la inserción en la base de datos
    const result = await db.execute(query, binds, options);
    console.log('Contacto insertado correctamente:', result);

    return result;
  } catch (error) {
    // Maneja errores de inserción
    console.error('Error al insertar contacto:', error);
    throw error;
  }
}
