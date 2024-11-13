import React, { useState } from 'react';
import '../../home/Home.css';
import './UsuariosAdmin.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const UsuariosAdmin = () => {
  const navigate = useNavigate();

  // Sample user data with initial block status
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Usuario 1", email: "usuario1@correo.com", fechaCreacion: "Nov 1, 2024", rol: "Administrador", bloqueado: false },
    { id: 2, nombre: "Usuario 2", email: "usuario2@correo.com", fechaCreacion: "Nov 3, 2024", rol: "Usuario", bloqueado: true },
    // More users can be added here
  ]);

  // Function to handle logout
  const manejarCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/iniciar-sesion');
  };

  // Function to toggle user block status
  const toggleBlockStatus = (userId) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id === userId ? { ...usuario, bloqueado: !usuario.bloqueado } : usuario
      )
    );
  };

  return (
    <div className="contenedor">
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <span>Bienvenido, Admin a Beatbox</span>
        <nav className="nav-enlaces">
          <button className="btn btn-inicio" onClick={manejarCerrarSesion}>
            Cerrar sesión
          </button>
          <button className="menu-icono" onClick={() => setMenuAbierto(!menuAbierto)}>
            ☰
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="contenido-principal">
        <div className="usuarios-admin-contenedor">
          <header className="usuarios-admin-header">
            <h1>Usuarios Administrativos</h1>
            <button className="btn-agregar">Agregar Nuevo Usuario</button>
          </header>
          
          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha de Creación</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.fechaCreacion}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <button
                      className={`btn-estado ${usuario.bloqueado ? 'bloqueado' : 'activo'}`}
                      onClick={() => toggleBlockStatus(usuario.id)}
                    >
                      {usuario.bloqueado ? "Desbloquear" : "Bloquear"}
                    </button>
                  </td>
                  <td>
                    <button className="btn-editar">Editar</button>
                    <button className="btn-eliminar">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <img src={logo} alt="Logo Beatbox" className="logo-footer" />
        <div className="linea-separacion"></div>
        <h2>Síguenos</h2>
        <div className="redes-sociales">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
        </div>
        <div className="linea-separacion"></div>
        <div className="footer-secciones">
          <div>
            <h3>Beatbox</h3>
            <ul>
              <li><a href="#">Quiénes somos</a></li>
              <li><a href="#">Contáctanos</a></li>
              <li><a href="#">Aviso de Privacidad</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UsuariosAdmin;
