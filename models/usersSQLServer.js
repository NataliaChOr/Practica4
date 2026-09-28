import sql from 'mssql'; // Importamos sql para los tipos de datos si se requiere
import { getConnection } from '../config/sqlserver.js';

// 1. Listar solo usuarios activos (Eliminación lógica: activo = 1)
export const getAllUsers = async () => {
  const pool = await getConnection();

  const result = await pool.request().query(`
    SELECT id, nombre, correo, rol, activo FROM users WHERE activo = 1
  `);

  return result.recordset;
};

// 2. Crear usuario incluyendo el rol (Por defecto 'Operativo' o el que envíes)
export const createUser = async (user) => {
  const { nombre, correo, contrasena, preguntarc, respuestarc, rol = 'Operativo' } = user;
  const pool = await getConnection();

  const result = await pool.request()
    .input('nombre', sql.VarChar, nombre)
    .input('correo', sql.VarChar, correo)
    .input('contrasena', sql.VarChar, contrasena)
    .input('preguntarc', sql.VarChar, preguntarc || null)
    .input('respuestarc', sql.VarChar, respuestarc || null)
    .input('rol', sql.VarChar, rol)
    .query(`
      INSERT INTO users (nombre, correo, contrasena, preguntarc, respuestarc, rol, activo)
      VALUES (@nombre, @correo, @contrasena, @preguntarc, @respuestarc, @rol, 1);

      SELECT SCOPE_IDENTITY() AS id;
    `);

  return result.recordset[0].id;
};

export const getByEmail = async (correo) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('correo', sql.VarChar, correo)
    .query(`
      SELECT * FROM users
      WHERE correo = @correo AND activo = 1
    `);

  return result.recordset;
};

// 3. Login validando que el usuario esté activo
// 3. Login validando que el usuario esté activo
export const loginSQL = async (correo, contrasena) => {
  const pool = await getConnection();
  
  if (!pool) {
    throw new Error("No se pudo establecer la conexión con la base de datos");
  }

  const result = await pool.request()
    .input('correo', sql.VarChar, correo)
    .input('contrasena', sql.VarChar, contrasena)
    .query(`
      SELECT *
      FROM users
      WHERE correo = @correo
      AND contrasena = @contrasena
      AND activo = 1
    `);

  return result.recordset[0] || null;
};

export const getPreguntaByEmail = async (correo) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('correo', sql.VarChar, correo)
    .query(`
      SELECT preguntarc
      FROM users
      WHERE correo = @correo AND activo = 1
    `);

  return result.recordset[0] || null;
};

export const updatePasswordSQL = async (correo, respuesta, nuevaContrasena) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('correo', sql.VarChar, correo)
    .input('respuesta', sql.VarChar, respuesta)
    .input('nuevaContrasena', sql.VarChar, nuevaContrasena)
    .query(`
      UPDATE users
      SET contrasena = @nuevaContrasena
      WHERE correo = @correo
      AND respuestarc = @respuesta
      AND activo = 1;

      SELECT @@ROWCOUNT AS filasAfectadas;
    `);

  return result.recordset[0].filasAfectadas;
};

// 4. NUEVO: Editar usuario (correo, rol)
export const updateUserSQL = async (id, correo, rol) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('correo', sql.VarChar, correo)
    .input('rol', sql.VarChar, rol)
    .query(`
      UPDATE users
      SET correo = @correo, rol = @rol
      WHERE id = @id;

      SELECT @@ROWCOUNT AS filasAfectadas;
    `);

  return result.recordset[0].filasAfectadas;
};

// 5. NUEVO: Desactivar usuario (Eliminación lógica: activo = 0)
export const deactivateUserSQL = async (id) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      UPDATE users
      SET activo = 0
      WHERE id = @id;

      SELECT @@ROWCOUNT AS filasAfectadas;
    `);

  return result.recordset[0].filasAfectadas;
};