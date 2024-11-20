import React, { useState, useEffect } from 'react';
import './Home.css';
import logo from '../../assets/logo.png'; // Ruta del logo
import c1 from '../../assets/c1.png'; // Ruta del logo
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import FooterH from '../FooterH';

const Home = () => {
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado del menú
  const navigate = useNavigate(); // Inicializar navigate
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto); // Alternar el menú
  };

  return (
    <div className="contenedor">
      <div>
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <nav className="nav-enlaces">
          {/* Botón de iniciar sesión */}
          <button className="btn btn-inicio" onClick={() => navigate('/iniciar-sesion')}>
            Iniciar sesión
          </button>
          {/* Botón de registrarse */}
          <button className="btn btn-registrarse" onClick={() => navigate('/registro')}>
            Registrarse
          </button>

          {/* Menú Hamburguesa */}
          <button className="menu-icono" onClick={toggleMenu}>
            ☰
          </button>
        </nav>
      </header>

      {/* Menú Desplegable */}
      <div className={`menu-desplegable ${menuAbierto ? 'activo' : ''}`}>
        <button className="btn-cerrar" onClick={toggleMenu}>✖</button>
        <ul>
          <li><a onClick={() => navigate('/')}>Inicio</a></li>
            <li><a href="#">Suscripciones</a></li>
            <li><a href="#">Horarios</a></li>
            <li><a href="#">Perfil de usuario</a></li>
            <li><a href="#">Contáctanos</a></li>
        </ul>
      </div>
    </div>

      {/* Sección de Certificados */}
      <main className="contenido-principal">
        <h1>Certificados del Establecimiento</h1>

        <div className="certificados-container">
          {/* Tarjeta de Certificado 1 */}
          <div className="certificado-card">
            <div className="certificado-img-placeholder">Espacio para imagen del certificado</div>
            <div className="certificado-descripcion">
              <h3>Certificado 1</h3>
              <p>Descripción del certificado. Aquí se muestra información relevante del certificado 1.</p>
            </div>
          </div>

          {/* Tarjeta de Certificado 2 */}
          <div className="certificado-card">
            <div className="certificado-img-placeholder">Espacio para imagen del certificado</div>
            <div className="certificado-descripcion">
              <h3>Certificado 2</h3>
              <p>Descripción del certificado. Aquí se muestra información relevante del certificado 2.</p>
            </div>
          </div>

          {/* Tarjeta de Certificado 3 */}
          <div className="certificado-card">
            <div className="certificado-img-placeholder">Espacio para imagen del certificado</div>
            <div className="certificado-descripcion">
              <h3>Certificado 3</h3>
              <p>Descripción del certificado. Aquí se muestra información relevante del certificado 3.</p>
            </div>
          </div>
        </div>
      </main>

      <FooterH />
    </div>
  );
};

export default Home;
