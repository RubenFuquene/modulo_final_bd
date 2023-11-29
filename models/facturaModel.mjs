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
        facnFactura,
        facidTipoFactura,
        fechaFactura,
        totalFactura
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
                    FAC_NFACTURA,
                    FAC_IDTIPOFAC,
                    FECHAFACTURA,
                    TOTALFACTURA
                )
                VALUES (
                    :nFactura,
                    :nDocumento,
                    :idTipoDoc,
                    :idTipoPersona,
                    :idTipoFac,
                    :codEmpleado,
                    :facnFactura,
                    :facidTipoFactura,
                    TO_DATE(:fechaFactura, 'DD-MM-RR'),
                    :totalFactura
                )`,
                { 
                    nFactura,
                    nDocumento,
                    idTipoDoc,
                    idTipoPersona,
                    idTipoFac,
                    codEmpleado,
                    facnFactura,
                    facidTipoFactura,
                    fechaFactura,
                    totalFactura
                },
                {
                    autoCommit: true
                }
        );

        console.log('Factura insertada correctamente:', result);

        return result;
    } catch (error) {
        console.error('Error al crear factura:', error);
        throw error;
    }
}

export async function obtenerUltimoNumeroFactura(db) {
    try {
        const query = `
            SELECT MAX(NFACTURA) AS ULTIMO_NUMERO_FACTURA
            FROM FACTURA`;

        const result = await db.execute(query);
        const ultimoNumero = result.rows[0][0] || 0;

        // Convertir a entero y retornar
        return parseInt(ultimoNumero, 10);
    } catch (error) {
        console.error('Error al obtener el último número de factura:', error);
        throw error;
    }
}
