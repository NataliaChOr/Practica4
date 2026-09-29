import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Shield, Trash2, Edit, UserCheck } from 'lucide-react';

function App() {
  // Estados para guardar los usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [rolActual, setRolActual] = useState('Administrador');
  const [error, setError] = useState('');

  // Simulación
  useEffect(() => {
    // Ejemplo de datos para mientras conectamos el backend real
    setUsuarios([
      { id: 1, nombre: 'Natalia', correo: 'natalia@mail.com', rol: 'Administrador' },
      { id: 2, nombre: 'Andrea', correo: 'andrea@mail.com', rol: 'Operativo' },
      { id: 3, nombre: 'Vero', correo: 'vero@mail.com', rol: 'Operativo' }
    ]);
  }, []);

  // Eliminar usuario 
  const eliminarUsuario = (id) => {
    if (rolActual !== 'Administrador') {
      alert(' Solo el Administrador puede eliminar usuarios.');
      return;
    }
    setUsuarios(usuarios.filter(user => user.id !== id));
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fefaf6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px #e3a4a4' }}>
        
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid  black', paddingBottom: '15px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'black' }}>
            <Users /> Tablero Usuarios 
          </h2>
          <div>
            <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Rol del Usuario:</label>
            <select 
              value={rolActual} 
              onChange={(e) => setRolActual(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #c6d3be' }}
            >
              <option value="Administrador">Administrador</option>
              <option value="Operativo">Operativo</option>
            </select>
          </div>
        </div>

        {/* Alerta de Rol */}
        <div style={{ margin: '20px 0', padding: '10px', backgroundColor: rolActual === 'Administrador' ? '#e1f5fe' : '#fff3e0', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield color={rolActual === 'Administrador' ? '#c6d3be' : '#f57c00'} />
          <span>Rol activo: <strong>{rolActual}</strong> ({rolActual === 'Administrador' ? 'Control total' : 'Permiso restringido a edición propia'})</span>
        </div>

        {/* Galería / Tabla de Usuarios */}
        <h3 style={{ color: 'black' }}>Usuarios Registrados: </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#94cfc4', color: '#396a61', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Nombre</th>
              <th style={{ padding: '10px' }}>Correo</th>
              <th style={{ padding: '10px' }}>Rol</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #94cfc4' }}>
                <td style={{ padding: '10px' }}>{user.id}</td>
                <td style={{ padding: '10px' }}>{user.nombre}</td>
                <td style={{ padding: '10px' }}>{user.correo}</td>
                <td style={{ padding: '10px' }}>{user.rol}</td>
                <td style={{ padding: '10px', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  {/* Botón de Editar si es admin o editra su perfil*/}
                  {(rolActual === 'Administrador' || user.id === 1) && (
                    <button 
                      onClick={() => alert(`Editando a ${user.nombre}`)}
                      style={{ background: '#dfa1a7', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Edit size={16} /> Editar
                    </button>
                  )}

                  {/* Botón de Eliminar: Solo lo tiene el admin */}
                  {rolActual === 'Administrador' && (
                    <button 
                      onClick={() => eliminarUsuario(user.id)}
                      style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default App;