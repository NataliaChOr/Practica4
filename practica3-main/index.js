/**
 * APIREST
 * 
 * Arquitecta básica
 * 
 *   Models - Operaciones CRUD en la tablas Users
 *   Routes - Cada ruta accede a una operación
 *            en la BD.
 *   Controllers - gestiona la petición y determina
 *              - que operación debe ejecutarse y
 *              - retorna los datos.
 *    Config - configurar las conexiones a las BD:
 *             MySQL y SQLServer
 *   
 *   Métodos HTTP: GET | POST | PUT | DELETE 
 * 
 *   Conector a BD - MySQL y SQLServer
 *      
 *   Thunderclient 
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';

import formRoutes from './routes/formRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config({ path: './.env' });

console.log('PORT leído:', process.env.PORT);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Motor EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(session({
  secret: 'mi_clave_secreta',
  resave: false,
  saveUninitialized: false
}));

// Archivos estáticos
app.use('/', express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api', formRoutes);
app.use('/api', apiRoutes);

// Vista bienvenida protegida
app.get('/bienvenida', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/html/login.html');
  }

  res.render('bienvenida', {
    usuario: req.session.user
  });
});

// Cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/html/login.html');
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});