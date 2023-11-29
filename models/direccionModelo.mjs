// Modelo para agregar una dirección
export async function agregarDireccion(db, direccionData) {
  try {
    const {
      idDireccion,
      posicion,
      idNomen,
      idTipoDoc,
      idTipoPersona,
      nDocumento,
      valorDireccion,
    } = direccionData;

    const query = `
      INSERT INTO DIRECCION (
        IDDIRECCION,
        POSICION,
        IDNOMEN,
        IDTIPODOC,
        IDTIPOPERSONA,
        NDOCUMENTO,
        VALORDIREC
      )
      VALUES (
        CONSECDIR_SEQ.nextval,
        :posicion,
        :idNomen,
        :idTipoDoc,
        :idTipoPersona,
        :nDocumento,
        :valorDireccion
      )
    `;

    const binds = {
      idDireccion,
      posicion,
      idNomen,
      idTipoDoc,
      idTipoPersona,
      nDocumento,
      valorDireccion,
    };

    const options = {
      autoCommit: true,
    };

    const result = await db.execute(query, binds, options);
    console.log('Dirección agregada correctamente:', result);

    return result;
  } catch (error) {
    console.error('Error al agregar dirección:', error);
    throw error;
  }
}