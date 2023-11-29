export async function insertarDetalleFactura(db, detalleData)
{
  try {
    const { nFactura, tipoFac, refProducto, idCatProducto, item, cantidad, precio } = detalleData;

    //Query para la inserción
    const query = `INSERT INTO DETALLEFACTURA (NFACTURA, IDTIPOFAC, REFPRODUCTO, IDCATPRODUCTO, ITEM, CANTIDAD, PRECIO)
      VALUES (:nFactura, :tipoFac, :refProducto, :idCatProducto, CONSECDETFAC_SEQ.nextval, :cantidad, :precio)`;

    const binds = {
      nFactura: nFactura,
      tipoFac: tipoFac,
      refProducto: refProducto,
      idCatProducto: idCatProducto,
      cantidad: cantidad,
      precio: precio,
    };

    const options = {
      autoCommit: true
    };

    const result = await db.execute(query, binds, options);
    console.log('Detalle de fatura insertado correctamente:', result);

    return result;
  } catch (error) {
    // Maneja errores de inserción
    console.error('Error al insertar el detalle de factura:', error);
    throw error;
  }
}