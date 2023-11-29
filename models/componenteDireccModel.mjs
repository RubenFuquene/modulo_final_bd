export async function getComponentesConNomenclaturas(db) {
  try {
    const query = `
      SELECT CD.POSICION, CD.DESCPOSICION, CD.OBLIGATORIEDAD, N.IDNOMEN, N.DESCNOMEN
      FROM COMPONENTEDIRECC CD
      LEFT JOIN NOMENCLATURA N ON CD.POSICION = N.POSICION
      ORDER BY CD.POSICION
    `;

    const options = {
      outFormat: db.OBJECT
    };

    const result = await db.execute(query, [], options);
    
    // Organiza los resultados en dos niveles (componentes y nomenclaturas)
    const componentesConNomenclaturas = {};

    result.rows.forEach(row => {
      const POSICION = row[0];
      const DESCPOSICION = row[1];
      const OBLIGATORIEDAD = row[2];
      const IDNOMEN = row[3];
      const DESCNOMEN = row[4];

      // Si el componente aún no está en la estructura, agrégalo
      if (!componentesConNomenclaturas[POSICION]) {
        componentesConNomenclaturas[POSICION] = {
          POSICION,
          DESCPOSICION,
          OBLIGATORIEDAD,
          nomenclaturas: []
        };
      }

      // Agrega la nomenclatura al componente
      if(IDNOMEN && DESCNOMEN)
        componentesConNomenclaturas[POSICION].nomenclaturas.push({
          IDNOMEN,
          DESCNOMEN
        });
    });

    // Convierte el objeto en un array para tener un formato más estándar si es necesario
    const componentesArray = Object.values(componentesConNomenclaturas);

    return componentesArray;
  } catch (error) {
    console.error('Error al obtener componentes con nomenclaturas:', error);
    throw error;
  }
}
