import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerificarCorreo.css';
import logo from '../../assets/logo.png'; // Ruta del logo

const VerificarCorreo = () => {
  const [codigo, setCodigo] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado del menú
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto); // Alternar el menú hamburguesa
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    alert('Código de verificación enviado correctamente');
    // Lógica para la verificación del código
    navigate('/'); // Volver al inicio o a la página que desees
  };

  return (
    <div className="contenedor-verificar-correo">
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <button className="menu-icono" onClick={toggleMenu}>
          ☰
        </button>
      </header>

      {/* Menú Desplegable */}
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
        <form className="formulario" onSubmit={manejarEnvio}>
          <h2>Verificación de Correo Electrónico</h2>
          <p>Ingresa el código que te enviamos a tu correo electrónico</p>

          <label htmlFor="codigo">Código de verificación</label>
          <input
            type="text"
            id="codigo"
            placeholder="Ingresar el código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />

          <button type="submit" className="btn-verificar">Verificar</button>
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

export default VerificarCorreo;
