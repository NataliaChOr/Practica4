import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token devuelto por el backend en localStorage
        localStorage.setItem('token', data.token || 'token_sesion_activa');
        
        // Redirigimos a la pantalla de bienvenida
        navigate('/bienvenida');
      } else {
        setMensaje(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      setMensaje('Error de conexión');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}