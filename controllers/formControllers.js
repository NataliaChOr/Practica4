/**
 * Encargado de procesar las peticiones
 * Responsabilidades:
 *   1. Recibir datos del formulario
 *   2. Procesos de validación adicionales.
 *   3. Llamar a servicios para procesar datos, si es el caso.
 *   4. Devolver respuesta al cliente. 
 */
import jwt from "jsonwebtoken";
import { 
  updatePassword, 
  createUser, 
  loginUser, 
  findUserByEmail 
} from "../models/usuarios.js";

const JWT_SECRET = "mi_clave_secreta_123";

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

  // 1. Generar el token JWT
  const token = jwt.sign(
    { 
      id: user.id, 
      correo: user.correo || user.email, 
      rol: user.rol || 'operativo' 
    },
    JWT_SECRET,
    { expiresIn: '4h' }
  );

  // 2. Guardar en la sesión (agregando el rol)
  req.session.user = {
    id: user.id,
    correo: user.correo || user.email,
    nombre: user.nombre || user.email || user.correo,
    rol: user.rol || 'operativo'
  };

  // 3. Responder enviando el token
  res.json({ 
    success: true,
    msg: "Inicio de sesión exitoso",
    token: token,
    redirect: "/bienvenida"
  });
};

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