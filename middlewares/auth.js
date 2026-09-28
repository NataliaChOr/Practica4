import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  // 👇 PERMITIR EL TOKEN DE PRUEBA TEMPORAL PARA EL EQUIPO
  if (token === 'jwt-token-falso-para-pruebas') {
    req.usuario = { correo: "andrea@correo.com", rol: "Administrador" };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

export const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'Administrador') {
    next();
  } else {
    return res.status(403).json({ mensaje: "Acceso denegado. Se requiere rol de Administrador" });
  }
};