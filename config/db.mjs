import oracledb from 'oracledb';

class Database {
  constructor() {
    this.connection = null;
  }

  async connect(dbConfig) {
    if (!this.connection) {
      try {
        this.connection = await oracledb.getConnection(dbConfig);
        console.log('Conexión a la base de datos establecida');
      } catch (error) {
        console.error('Error de conexión a la base de datos:', error.message);
        throw error;
      }
    }

    return this.connection;
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
      console.log('Conexión a la base de datos cerrada');
    }
  }
}

// Instancia singleton
const instanciaBaseDatos = new Database();

export default instanciaBaseDatos;