import { Router } from 'express';
import * as crudSQL from '../controllers/usersSQLServer.js';

const router = Router();

router.get('/sqlserver/users', crudSQL.getUsers);
router.get('/sqlserver/users/:correo', crudSQL.findByEmail);
router.post('/sqlserver/users', crudSQL.registerUser);
router.post('/sqlserver/login', crudSQL.loginUserSQL);
router.post('/sqlserver/pregunta', crudSQL.obtenerPreguntaSQL);
router.post('/sqlserver/recuperar', crudSQL.recuperarPasswordSQL);

export default router;