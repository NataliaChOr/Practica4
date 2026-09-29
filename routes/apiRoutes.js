import { Router } from 'express';
import {
  getUsers,
  registerUser,
  findByEmail,
  loginUserSQL,
  obtenerPreguntaSQL,
  recuperarPasswordSQL,
  updateUser,
  deleteUserLogical
} from '../controllers/usersSQLServer.js';

import { verificarToken, esAdmin } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS (No requieren token JWT)
// ==========================================
router.post('/registro', registerUser);
router.post('/register', registerUser); // <--- Agregamos esta por si la llamas en inglés
router.post('/login', loginUserSQL);
router.post('/pregunta', obtenerPreguntaSQL);
router.post('/recuperar', recuperarPasswordSQL);

// ==========================================
// RUTAS PROTEGIDAS (Requieren Token JWT)
// ==========================================
// Listar usuarios (Requiere estar autenticado)
router.get('/users', verificarToken, getUsers);

// Buscar usuario por correo (Requiere estar autenticado)
router.get('/users/:correo', verificarToken, findByEmail);

// Editar usuario (Requiere estar autenticado)
router.put('/users/:id', verificarToken, updateUser);

// Desactivar usuario / Eliminación Lógica (Solo Administrador)
router.patch('/users/:id/desactivar', verificarToken, esAdmin, deleteUserLogical);

export default router;