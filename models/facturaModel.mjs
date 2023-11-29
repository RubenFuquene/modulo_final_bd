export async function crearFactura(
    db,
    datosFactura
) {
    const {
        nFactura,
        nDocumento,
        idTipoDoc,
        idTipoPersona,
        idTipoFac,
        codEmpleado,
        fechaFactura,
        totalFactura,
        tipoFacturaAnterior,
        numeroFacturaAnterior
    } = datosFactura;

    try {
        // Inserta en la tabla FACTURA
        const result = await db.execute(`
                INSERT INTO FACTURA (
                    NFACTURA,
                    NDOCUMENTO,
                    IDTIPODOC,
                    IDTIPOPERSONA,
                    IDTIPOFAC,
                    CODEMPLEADO,
                    FECHAFACTURA,
                    TOTALFACTURA,
                    FAC_IDTIPOFAC,
                    FAC_NFACTURA
                )
                VALUES (
                    :nFactura,
                    :nDocumento,
                    :idTipoDoc,
                    :idTipoPersona,
                    :idTipoFac,
                    :codEmpleado,
                    TO_DATE(:fechaFactura, 'DD-MM-RR'),
                    :totalFactura,
                    :tipoFacturaAnterior,
                    :numeroFacturaAnterior
                )`,
                { 
                    nFactura,
                    nDocumento,
                    idTipoDoc,
                    idTipoPersona,
                    idTipoFac,
                    codEmpleado,
                    fechaFactura,
                    totalFactura,
                    tipoFacturaAnterior,
                    numeroFacturaAnterior
                },
                {
                    autoCommit: true
                }
        );

        console.log('Factura insertada correctamente:', result);

        return result;
    } catch (error) {
        console.error('Error al crear factura en modelo:', error);
        throw error;
    }
}

export async function obtenerUltimoNumeroFactura(db) {
    try {
        const query = `
            SELECT MAX(TO_NUMBER(NFACTURA)) AS ULTIMO_NUMERO_FACTURA
            FROM FACTURA`;

        const result = await db.execute(query);
        const ultimoNumero = result.rows[0][0] || 0;

        // Convertir a entero y retornar
        return parseInt(ultimoNumero);
    } catch (error) {
        console.error('Error al obtener el último número de factura:', error);
        throw error;
    }
}

// Modelo para obtener una factura por número, incluyendo los productos asociados usando un JOIN
export async function obtenerFacturaPorNumero(db, numeroFactura) {
    try {
        const query = `
            SELECT 
                F.NFACTURA,
                F.NDOCUMENTO,
                F.IDTIPODOC,
                F.IDTIPOPERSONA,
                F.IDTIPOFAC,
                F.CODEMPLEADO,
                F.FAC_NFACTURA,
                F.FAC_IDTIPOFAC,
                F.FECHAFACTURA,
                F.TOTALFACTURA,
                D.IDCATPRODUCTO,
                D.REFPRODUCTO,
                D.ITEM,
                D.CANTIDAD,
                D.PRECIO,
                P.NOMPRODUCTO
            FROM FACTURA F
            JOIN DETALLEFACTURA D ON F.NFACTURA = D.NFACTURA
            JOIN PRODUCTO P ON D.REFPRODUCTO = P.REFPRODUCTO
            WHERE F.NFACTURA = :numeroFactura
        `;

        const binds = {
            numeroFactura,
        };

        const result = await db.execute(query, binds);

        // Verifica si se encontró la factura
        if (result.rows.length > 0) {
            // Inicializa un objeto de factura
            const factura = {
                numeroFactura: result.rows[0][0],
                documentoPersona: result.rows[0][1],
                tipoDocPersona: result.rows[0][2],
                tipoPersona: result.rows[0][3],
                tipoFactura: result.rows[0][4],
                empleado: result.rows[0][5],
                facturaAnterior: result.rows[0][6],
                tipoFacturaAnterior: result.rows[0][7],
                fechaFactura: result.rows[0][8],
                totalFactura: result.rows[0][9],
                productos: [],
            };

            // Itera sobre los resultados y organiza la información
            result.rows.forEach(row => {
                const producto = {
                    idCatProducto: row[10],
                    refProducto: row[11],
                    item: row[12],
                    cantidad: row[13],
                    precio: row[14],
                    nombre: row[15],
                };

                // Agrega el producto al arreglo de productos de la factura
                factura.productos.push(producto);
            });

            return factura;
        } else {
            // Si no se encuentra la factura, devuelve null
            return null;
        }
    } catch (error) {
        console.error('Error al obtener factura por número:', error);
        throw error;
    }
}
