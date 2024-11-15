import React, { useState, useEffect } from 'react';
import AdminMenu from '../adminMenu';
import './UsuariosAdmin.css';
import '../../home/Home.css';
import logo from '../../../assets/logo.png';

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios



  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await fetch('https://beatbox-blond.vercel.app/usuarios', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };
    cargarUsuarios();
  }, []);

  const eliminarUsuario = async (userId, userName) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar a ${userName}?`);
    if (!confirmacion) return;

    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/usuarios/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario._id !== userId));
        alert(`El usuario ${userName} ha sido eliminado exitosamente.`);
      } else {
        console.error('Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error de red al eliminar usuario:', error);
    }
  };

  // Bloqueo/desbloqueo con duración anual
  const toggleBloqueoUsuario = async (userId, bloqueado) => {
    const endpoint = bloqueado 
      ? `https://beatbox-blond.vercel.app/incidents/unblock/${userId}`
      : `https://beatbox-blond.vercel.app/block/${userId}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario._id === userId ? { ...usuario, bloqueado: !usuario.bloqueado } : usuario
          )
        );
        alert(`El usuario ha sido ${bloqueado ? 'desbloqueado' : 'bloqueado'} exitosamente.`);
      } else {
        console.error('Error al cambiar estado de bloqueo');
      }
    } catch (error) {
      console.error('Error de red al cambiar estado de bloqueo:', error);
    }
  };

  return (
    <div className="contenedor">
      <AdminMenu />

      {/* Contenido Principal */}
      <main className="contenido-principal">
        <div className="usuarios-admin-contenedor">
          <header className="usuarios-admin-header">
            <h1>Usuarios Administrativos</h1>
            
          </header>
          
          <table className="tabla-admin">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha de Creación</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario._id}>
                  <td data-label="Nombre">{usuario.usuario}</td>
                  <td data-label="Email">{usuario.correo_Electronico}</td>
                  <td style={{ color: usuario.role === 'admin' ? 'green' : 'black' }}>
                    {usuario.role}
                  </td>
                  <td>
                    <button
                      className={`btn-estado ${usuario.bloqueado ? 'bloqueado' : 'activo'}`}
                      onClick={() => toggleBloqueoUsuario(usuario._id, usuario.bloqueado)}
                    >
                      {usuario.bloqueado ? 'Desbloquear' : 'Bloquear'}
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarUsuario(usuario._id, usuario.usuario)}
                    >
                      Eliminar
                    </button>
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
