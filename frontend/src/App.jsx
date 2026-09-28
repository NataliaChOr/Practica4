import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Bienvenida from './components/Bienvenida';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Iniciar Sesión</Link> | 
        <Link to="/register">Registrarse</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bienvenida" element={<Bienvenida />} />
      </Routes>
    </BrowserRouter>
  );
}