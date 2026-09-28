import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    preguntarc: '',
    respuestarc: ''
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
      const response = await fetch('http://localhost:5000/api/sqlserver/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('¡Registro exitoso!');
      } else {
        setMensaje(data.error || data.message || 'Error al registrar');
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
      <h2>Registro</h2>
      {mensaje && <p>{mensaje}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Correo:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
  <label>Pregunta de recuperación:</label>
  <select
    name="preguntarc"
    value={formData.preguntarc}
    onChange={handleChange}
    required
    style={{ width: '100%', padding: '5px' }}
  >
    <option value="">Seleccione una pregunta</option>
    <option value="¿Nombre de tu primera mascota?">¿Nombre de tu primera mascota?</option>
    <option value="¿Nombre de tu escuela primaria?">¿Nombre de tu escuela primaria?</option>
    <option value="¿Comida favorita?">¿Comida favorita?</option>
  </select>
</div>
<div style={{ marginBottom: '10px' }}>
  <label>Respuesta de recuperación:</label>
  <input
    type="text"
    name="respuestarc"
    value={formData.respuestarc}
    onChange={handleChange}
    required
    style={{ width: '100%' }}
  />
</div>

        <button type="submit" style={{ width: '100%' }}>Registrarse</button>
      </form>
    </div>
  );
}