import jwt from 'jsonwebtoken';
import {
  getAllUsers,
  createUser,
  getByEmail,
  loginSQL,
  getPreguntaByEmail,
  updatePasswordSQL,
  updateUserSQL,
  deactivateUserSQL as deleteUserLogicalSQL // Renombramos aquí mismo para que coincida
} from '../models/usersSQLServer.js';

import { validateUser } from '../models/validator.js';

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';

// 1. OBTENER USUARIOS (solo usuarios activos)
export const getUsers = async (req, res) => {
  try {
    // Lista simulada de usuarios para que el equipo pueda probar la galería en React
    const usuariosMock = [
      { id: 1, nombre: "Andrea", correo: "andrea@correo.com", rol: "Administrador", activo: 1 }
    ];

    return res.status(200).json({
      success: true,
      data: usuariosMock
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 2. REGISTRAR USUARIO (procesa y guarda el rol)
export const registerUser = async (req, res) => {
  try {
    const { nombre, correo, contrasena, preguntarc, respuestarc, rol } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ success: false, error: "Faltan datos obligatorios" });
    }

    // Respuesta simulada de éxito para el equipo
    return res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente (Modo de prueba)",
      usuario: {
        id: 1,
        nombre,
        correo,
        rol: rol || "Operativo",
        activo: 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. BUSCAR POR CORREO
export const findByEmail = async (req, res) => {
  try {
    const users = await getByEmail(req.params.correo);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. INICIO DE SESIÓN CON JWT (Firma token con id, correo y rol)
// Simulación temporal para liberar el proyecto y pasárselo a tus amigas
export const loginUserSQL = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ success: false, error: "Faltan datos" });
    }

    // Respuesta simulada para liberar el proyecto al equipo
    return res.status(200).json({
      success: true,
      message: "Login exitoso",
      token: "jwt-token-falso-para-pruebas",
      usuario: { correo, rol: "Administrador" }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 5. OBTENER PREGUNTA DE RECUPERACIÓN
export const obtenerPreguntaSQL = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ msg: "Correo requerido" });
    }

    const user = await getPreguntaByEmail(correo);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({
      pregunta: user.preguntarc
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. RECUPERAR CONTRASEÑA
export const recuperarPasswordSQL = async (req, res) => {
  try {
    const { correo, respuesta, nuevaContrasena } = req.body;

    if (!correo || !respuesta || !nuevaContrasena) {
      return res.status(400).json({ msg: "Faltan datos" });
    }

    const filasAfectadas = await updatePasswordSQL(
      correo,
      respuesta,
      nuevaContrasena
    );

    if (filasAfectadas === 0) {
      return res.status(401).json({
        msg: "Respuesta incorrecta o usuario no encontrado"
      });
    }

    res.json({
      msg: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. EDITAR USUARIO (CRUD)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { correo, rol } = req.body; // Aseguramos capturar los campos necesarios para la BD

    const filasAfectadas = await updateUserSQL(id, correo, rol);

    if (filasAfectadas === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({ msg: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. ELIMINACIÓN LÓGICA (Desactivar usuario -> activo = 0)
export const deleteUserLogical = async (req, res) => {
  try {
    const { id } = req.params;

    const filasAfectadas = await deleteUserLogicalSQL(id);

    if (filasAfectadas === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado o ya inactivo" });
    }

    res.json({ msg: "Usuario desactivado correctamente (eliminación lógica)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};