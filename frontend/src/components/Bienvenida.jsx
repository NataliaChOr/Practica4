import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Bienvenida() {
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <div>
      <h2>Bienvenido/a</h2>
      <p>Has iniciado sesión correctamente.</p>

      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}