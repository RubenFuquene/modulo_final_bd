export async function insertarActualizaciónInventario(db, inventarioData)
{
  try {
    const {
      idCatProducto,
      refProducto,
      idTipoFac,
      nFactura,
      fechaInventario,
      salen,
      entran,
      existencia,
      consectivoInventarioDevolucion
    } = inventarioData;

    // Query para la inserción
    const query = `INSERT INTO INVENTARIO (
      CONSECINVEN,
      IDCATPRODUCTO,
      REFPRODUCTO,
      IDTIPOFAC,
      NFACTURA,
      FECHAINVE,
      SALEN,
      ENTRAN,
      EXISTENCIA,
      INV_CONSECINVEN
    ) VALUES (
      CONSECINVENTARIO_SEQ.nextval,
      :idCatProducto,
      :refProducto,
      :idTipoFac,
      :nFactura,
      TO_DATE(:fechaInventario, 'DD-MM-RR'),
      :salen,
      :entran,
      :existencia,
      :consectivoInventarioDevolucion
    )`;

    const binds = {
      idCatProducto,
      refProducto,
      idTipoFac,
      nFactura,
      fechaInventario,
      salen,
      entran,
      existencia,
      consectivoInventarioDevolucion
    };

    const options = {
      autoCommit: true
    };

    const result = await db.execute(query, binds, options);
    console.log('Inventario insertado correctamente:', result);

    return result;
  } catch (error) {
    // Maneja errores de inserción
    console.error('Error al insertar en el inventario:', error);
    throw error;
  }
}

// Obtener inventario más reciente de un producto
export async function obtenerInventarioMasReciente(db, refProducto) {
  try {
    // Query para obtener el inventario más reciente de un producto
    const query = `
      SELECT EXISTENCIA, INV_CONSECINVEN
      FROM INVENTARIO
      WHERE REFPRODUCTO = :refProducto
      ORDER BY CONSECINVEN DESC
      FETCH FIRST 1 ROWS ONLY
    `;

    const binds = {
      refProducto,
    };

    const result = await db.execute(query, binds);
    const inventarioMasReciente = result.rows[0];

    console.log('Inventario más reciente obtenido correctamente:', inventarioMasReciente);

    return { existencia: inventarioMasReciente[0], consecutivo: inventarioMasReciente[1] };
  } catch (error) {
    console.error('Error al obtener el inventario más reciente:', error);
    throw error;
  }
}
