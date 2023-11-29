export async function login(db, codeEmpleado) {
  try {
    const query = `SELECT CODEMPLEADO, NOMEMPLEADO, APELLEMPLEADO, CORREO FROM EMPLEADO WHERE CODEMPLEADO = :codeEmpleado`;

    const binds = {
      codeEmpleado: codeEmpleado,
    };

    // Ejecuta la consulta y obtiene los resultados
    const result = await db.execute(query, binds);

    // Verifica si se encontró algún empleado con el código proporcionado
    if (result.rows.length > 0) {
      const empleado = result.rows[0];

      // Obtener los cargos
      const cargos = await obtenerCargos(db, codeEmpleado);

      return { empleado, cargos };
    } else {
      return null; // No se encontró ningún empleado con el código proporcionado
    }
  } catch (error) {
    // Maneja los errores
    console.error('Error al obtener el empleado por código:', error);
    throw error;
  }
}

async function obtenerCargos(db, codeEmpleado) {
  try {
    const query = `SELECT C.NOMCARGO FROM CARGO C
                   INNER JOIN EMPLEADOCARGO EC ON C.CODCARGO = EC.CODCARGO
                   WHERE EC.CODEMPLEADO = :codeEmpleado`;

    const binds = {
      codeEmpleado: codeEmpleado,
    };

    const result = await db.execute(query, binds);

    if (result.rows.length > 0) {
      return result.rows.map(row => row.NOMCARGO);
    } else {
      return []; // No se encontraron cargos para el empleado
    }
  } catch (error) {
    console.error('Error al obtener los cargos del empleado:', error);
    throw error;
  }
}