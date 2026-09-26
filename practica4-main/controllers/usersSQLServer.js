import {
  getAllUsers,
  createUser,
  getByEmail,
  loginSQL,
  getPreguntaByEmail,
  updatePasswordSQL
} from '../models/usersSQLServer.js';

import { validateUser } from '../models/validator.js';

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    validateUser(req.body);

    const id = await createUser(req.body);

    res.status(201).json({
      msg: "Usuario registrado correctamente",
      id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const findByEmail = async (req, res) => {
  try {
    const users = await getByEmail(req.params.correo);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUserSQL = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ msg: "Faltan datos" });
    }

    const user = await loginSQL(correo, contrasena);

    if (!user) {
      return res.status(401).json({
        msg: "Correo o contraseña incorrectos"
      });
    }

    req.session.user = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo
    };

    res.json({
      msg: "Inicio de sesión exitoso"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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