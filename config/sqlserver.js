import sql from 'mssql';

export const sqlServerConfig = {
  server: '127.0.0.1',
  database: process.env.SQLSERVER_DB,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    // Si tu .env no tiene usuario y contraseña, usa esto:
    trustedConnection: true,
    instanceName: 'SQLEXPRESS'
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(sqlServerConfig);
    return pool;
  } catch (error) {
    console.error('Error detallado de conexión SQL Server:', error.message);
    return null;
  }
};