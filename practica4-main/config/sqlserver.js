import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

export const sqlServerConfig = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
 server: 'localhost',
  database: process.env.SQLSERVER_DB,
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};


export const getConnection = async () => {
  try {
    return await sql.connect(sqlServerConfig);
  } catch (error) {
    console.error('SQL Server connection error:', error);
  }
};