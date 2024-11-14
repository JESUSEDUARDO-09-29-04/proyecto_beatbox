// src/componentes/admin/AdminMenu.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './AdminMenu.css';

const AdminMenu = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [submenuAbierto, setSubmenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const toggleSubmenu = () => setSubmenuAbierto(!submenuAbierto);

  const manejarCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/iniciar-sesion');
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <span>Bienvenido, Admin a Beatbox</span>
        <nav className="nav-enlaces">
          <button className="btn btn-inicio" onClick={manejarCerrarSesion}>
            Cerrar sesión
          </button>
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
          <li><a onClick={() => { navigate('/empresa_admin'); toggleMenu(); }}>Empresa</a></li>
          <li><a onClick={() => { navigate('/deslinde_admin'); toggleMenu(); }}>Documentos Regulatorios</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminMenu;
