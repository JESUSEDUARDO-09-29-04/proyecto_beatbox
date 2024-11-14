import React, { useState } from 'react';
import AdminMenu from '../adminMenu';
import './UsuariosAdmin.css';
import '../../home/Home.css';
import logo from '../../../assets/logo.png';

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Usuario 1", email: "usuario1@correo.com", fechaCreacion: "Nov 1, 2024", rol: "Administrador", bloqueado: false },
    { id: 2, nombre: "Usuario 2", email: "usuario2@correo.com", fechaCreacion: "Nov 3, 2024", rol: "Usuario", bloqueado: true },
  ]);

  // Función para alternar el estado de bloqueo
  const toggleBlockStatus = (userId) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id === userId ? { ...usuario, bloqueado: !usuario.bloqueado } : usuario
      )
    );
  };

  // Función para agregar un nuevo usuario
  const agregarUsuario = () => {
    alert("Agregar Nuevo Usuario");
  };

  // Función para eliminar un usuario
  const eliminarUsuario = (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmar) {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
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
            <button className="btn-agregar" onClick={agregarUsuario}>Agregar Nuevo Usuario</button>
          </header>
          
          <table className="tabla-admin">
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
                  <td data-label="Nombre">{usuario.nombre}</td>
                  <td data-label="Email">{usuario.email}</td>
                  <td data-label="Fecha de Creación">{usuario.fechaCreacion}</td>
                  <td data-label="Rol">{usuario.rol}</td>
                  <td data-label="Estado">
                    <button
                      className={`btn-estado ${usuario.bloqueado ? 'bloqueado' : 'activo'}`}
                      onClick={() => toggleBlockStatus(usuario.id)}
                    >
                      {usuario.bloqueado ? "Desbloquear" : "Bloquear"}
                    </button>
                  </td>
                  <td data-label="Acciones">
                    <button className="btn-accion modificar">Editar</button>
                    <button className="btn-accion eliminar" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
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
