/**
 * Encargado de procesar las peticiones
 * Responsabilidades:
 *   1. Recibir datos del formulario
 *   2. Procesos de validación adicionales.
 *   3. Llamar a servicios para procesar datos, si es el caso.
 *   4. Devolver respuesta al cliente. 
 */
import { updatePassword } from "../models/usuarios.js";

export const recuperarPassword = async (req, res) => {
  const { correo, respuesta, nuevaPassword } = req.body;

  if (!correo || !respuesta || !nuevaPassword) {
    return res.json({ msg: "Faltan datos" });
  }

  const user = await updatePassword(
    correo,
    respuesta,
    nuevaPassword
  );

  if (!user) {
    return res.json({ msg: "Datos incorrectos" });
  }

  res.json({ msg: "Contraseña actualizada correctamente" });
};


import { createUser } from "../models/usuarios.js";

export const registrarUsuario = async (req, res) => {
  const { correo, password, pregunta, respuesta } = req.body;

  if (!correo || !password || !pregunta || !respuesta) {
    return res.json({ msg: "Faltan datos" });
  }

  const user = await createUser({
    email: correo,
    password,
    pregunta,
    respuesta
  });

  if (!user) {
    return res.json({ msg: "El usuario ya existe" });
  }

  res.json({ msg: "Usuario registrado correctamente" });
};

import { loginUser } from "../models/usuarios.js";

export const login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.json({ 
      success: false,
      msg: "Faltan datos" 
    });
  }

  const user = await loginUser(correo, password);

  if (!user) {
    return res.json({ 
      success: false,
      msg: "Correo o contraseña incorrectos" 
    });
  }

  req.session.user = {
    id: user.id,
    correo: user.correo || user.email,
    nombre: user.nombre || user.email || user.correo
  };

  res.json({ 
    success: true,
    msg: "Inicio de sesión exitoso",
    redirect: "/bienvenida"
  });
};

import { findUserByEmail } from "../models/usuarios.js";

export const obtenerPregunta = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.json({ msg: "Correo requerido" });
  }

  const user = await findUserByEmail(correo);

  if (!user) {
    return res.json({ msg: "Usuario no encontrado" });
  }

  res.json({ pregunta: user.pregunta });
};