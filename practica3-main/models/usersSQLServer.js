import { getConnection } from '../config/sqlserver.js';

export const getAllUsers = async () => {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT * FROM users
  `);

  return result.recordset;
};

export const createUser = async (user) => {
  const { nombre, correo, contrasena, preguntarc, respuestarc } = user;

  const pool = await getConnection();

  const result = await pool.request()
    .input('nombre', nombre)
    .input('correo', correo)
    .input('contrasena', contrasena)
    .input('preguntarc', preguntarc)
    .input('respuestarc', respuestarc)
    .query(`
      INSERT INTO users (nombre, correo, contrasena, preguntarc, respuestarc)
      VALUES (@nombre, @correo, @contrasena, @preguntarc, @respuestarc);

      SELECT SCOPE_IDENTITY() AS id;
    `);

  return result.recordset[0].id;
};

export const getByEmail = async (correo) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('correo', correo)
    .query(`
      SELECT * FROM users
      WHERE correo = @correo
    `);

  return result.recordset;
};

export const loginSQL = async (correo, contrasena) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('correo', correo)
    .input('contrasena', contrasena)
    .query(`
      SELECT *
      FROM users
      WHERE correo = @correo
      AND contrasena = @contrasena
    `);

  return result.recordset[0] || null;
};

export const getPreguntaByEmail = async (correo) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('correo', correo)
    .query(`
      SELECT preguntarc
      FROM users
      WHERE correo = @correo
    `);

  return result.recordset[0] || null;
};

export const updatePasswordSQL = async (correo, respuesta, nuevaContrasena) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('correo', correo)
    .input('respuesta', respuesta)
    .input('nuevaContrasena', nuevaContrasena)
    .query(`
      UPDATE users
      SET contrasena = @nuevaContrasena
      WHERE correo = @correo
      AND respuestarc = @respuesta;

      SELECT @@ROWCOUNT AS filasAfectadas;
    `);

  return result.recordset[0].filasAfectadas;
};