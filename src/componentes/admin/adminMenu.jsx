// src/componentes/admin/AdminMenu.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './AdminMenu.css';

const AdminMenu = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // Función para cerrar sesión
  const manejarCerrarSesion = async () => {
    try {

        // ruta local const response = await fetch('http://localhost:3000/auth/logout', {

        const response = await fetch('https://beatbox-blond.vercel.app/auth/logout', {
        method: 'POST',
        credentials: 'include', // Incluye las cookies en la solicitud
      });

      if (response.ok) {
        navigate('/iniciar-sesion'); // Redirige a la página de inicio de sesión si la respuesta es exitosa
      } else {
        console.error('Error al cerrar sesión');
        alert('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error de red al cerrar sesión', error);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <span>Bienvenido, Admin a Beatbox</span>
        <nav className="nav-enlaces">
          <button className="menu-icono" onClick={toggleMenu}>
            ☰
          </button>
        </nav>
      </header>

      {/* Menú Desplegable */}
      <div className={`menu-desplegable ${menuAbierto ? 'activo' : ''}`}>
        <button className="btn-cerrar" onClick={toggleMenu}>✖</button>
        <ul>
          <li><a onClick={() => { navigate('/home-admin'); toggleMenu(); }}>Inicio</a></li>
          <li><a onClick={() => { navigate('/usuario_admin'); toggleMenu(); }}>Usuarios</a></li>
          <li><a onClick={() => { navigate('/redes_sociales_admin'); toggleMenu(); }}>Redes Sociales</a></li>
          <li><a onClick={() => { navigate('/incidentes_admin'); toggleMenu(); }}>Incidencias</a></li>
          <li><a onClick={() => { navigate('/empresa_admin'); toggleMenu(); }}>Empresa</a></li>
          <li><a onClick={() => { navigate('/deslinde_admin'); toggleMenu(); }}>Documentos Regulatorios</a></li>
          <li><a onClick={() => {manejarCerrarSesion();  toggleMenu(); }}>Cerrar sesión</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminMenu;
