export async function obtenerUltimoPrecioEInventario(db, refProducto) {
  try {
      const query = `
        SELECT
          HP.VALOR AS ULTIMO_PRECIO,
          I.FECHAINVE AS FECHA_ULTIMO_INVENTARIO,
          I.EXISTENCIA AS EXISTENCIA_ULTIMO_INVENTARIO,
          P.NOMPRODUCTO,
          HP.VALORCOMPRA AS ULTIMO_PRECIO_COMPRA,
          P.IDCATPRODUCTO
        FROM
          HISTORICOPRECIO HP
          JOIN INVENTARIO I ON HP.REFPRODUCTO = I.REFPRODUCTO
          JOIN PRODUCTO P ON HP.REFPRODUCTO = P.REFPRODUCTO
        WHERE
          HP.REFPRODUCTO LIKE :refProducto
          AND HP.FECHAFIN IS NULL
        ORDER BY
          I.FECHAINVE DESC
        FETCH FIRST 1 ROW ONLY`;

      const binds = {
          refProducto: '%' + refProducto + '%'
      };

      const result = await db.execute(query, binds);

      // Verifica si se encontró la persona
    if (result.rows.length > 0) {
      // Formatea los resultados como un objeto persona
      const producto = {
        ultimoPrecio: result.rows[0][0],
        ultimoInventario: result.rows[0][1],
        existencia: result.rows[0][2],
        nombre: result.rows[0][3],
        precioCompra: result.rows[0][4],
        categoria: result.rows[0][5]
      };

      return producto;
    } else {
      // Si no se encuentra el producto, devuelve null
      return null;
    }
  } catch (error) {
      console.error('Error al obtener el último precio e inventario:', error);
      throw error;
  }
}
