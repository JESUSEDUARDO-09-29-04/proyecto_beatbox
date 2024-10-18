import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarContrasena.css';
import logo from '../../assets/logo.png'; // Ruta del logo

const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const manejarRecuperacion = (e) => {
    e.preventDefault();
    alert('Correo de recuperación enviado');
    navigate('/iniciar-sesion'); // Redirige al inicio de sesión después de la recuperación
  };

  return (
    <div className="contenedor-inicio-sesion">
      {/* Header */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <button className="menu-icono" onClick={toggleMenu}>☰</button>
      </header>

      {/* Menú Hamburguesa */}
      <div className={`menu-desplegable ${menuAbierto ? 'activo' : ''}`}>
        <button className="btn-cerrar" onClick={toggleMenu}>✖</button>
        <ul>
          <li><a onClick={() => navigate('/')}>Inicio</a></li>
          <li><a href="#">Gimnasios</a></li>
          <li><a href="#">Planes</a></li>
          <li><a href="#">Sustentabilidad</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contáctanos</a></li>
        </ul>
      </div>

      {/* Contenedor del Formulario e Imagen */}
      <div className="formulario-imagen">
        <form className="formulario" onSubmit={manejarRecuperacion}>
          <h2>Recuperar Contraseña</h2>
          <label htmlFor="correo">Correo Electrónico</label>
          <input type="email" id="correo" placeholder="Ingresa tu correo" required />

          <button type="submit" className="btn-recuperar">Enviar Correo de Recuperación</button>
        </form>

        <div className="imagen-lateral">
          <p>Aquí irá una imagen decorativa</p>
        </div>
      </div>

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

export default RecuperarContrasena;
