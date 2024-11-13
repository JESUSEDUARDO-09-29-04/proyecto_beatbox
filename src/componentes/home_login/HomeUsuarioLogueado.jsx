import React, { useState, useEffect } from 'react';
import '../home/Home.css';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';


const HomeUsuarioLogueado = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [username, setUsername] = useState(''); // Estado para almacenar el nombre del usuario
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el token existe en localStorage
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('user');
    if (!token || !storedUsername ) {
      // Si no hay token o nombre de usuario, redirige a la página de inicio de sesión
      navigate('/iniciar-sesion');
    } else {
      // Si existe, almacena el nombre del usuario en el estado
      setUsername(storedUsername);
    }
  }, [navigate]); // Se ejecuta al montar el componente


  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Función para cerrar sesión
  const manejarCerrarSesion = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage
    localStorage.removeItem('user');  // Elimina el nombre del usuario
    navigate('/iniciar-sesion'); // Redirige a la página de inicio de sesión.
  };

  return (
    <div className="contenedor">
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <span>Bienvenido, {username} a Beatbox</span> {/* Mostrar el nombre del usuario */}
        <nav className="nav-enlaces">
          {/* Botón de cerrar sesión */}
          <button className="btn btn-inicio" onClick={manejarCerrarSesion}>
            Cerrar sesión
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
          <li><a href="#">Gimnasios</a></li>
          <li><a href="#">Planes</a></li>
          <li><a href="#">Sustentabilidad</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contáctanos</a></li>
        </ul>
      </div>

      {/* Sección de Certificados */}
      <main className="contenido-principal">
        <h1>Certificados del Establecimiento</h1>

        <div className="certificados-container">
          {/* Tarjeta de Certificado 1 */}
          <div className="certificado-card">
            <div className="certificado-img-placeholder">Espacio para imagen del certificado</div>
            <div className="certificado-logo-placeholder">Espacio para logo</div>
            <div className="certificado-descripcion">
              <h3>Certificado 1</h3>
              <p>Descripción del certificado. Aquí se muestra información relevante del certificado 1.</p>
            </div>
          </div>

          {/* Tarjeta de Certificado 2 */}
          <div className="certificado-card">
            <div className="certificado-img-placeholder">Espacio para imagen del certificado</div>
            <div className="certificado-logo-placeholder">Espacio para logo</div>
            <div className="certificado-descripcion">
              <h3>Certificado 2</h3>
              <p>Descripción del certificado. Aquí se muestra información relevante del certificado 2.</p>
            </div>
          </div>

          {/* Tarjeta de Certificado 3 */}
          <div className="certificado-card">
            <div className="certificado-img-placeholder">Espacio para imagen del certificado</div>
            <div className="certificado-logo-placeholder">Espacio para logo</div>
            <div className="certificado-descripcion">
              <h3>Certificado 3</h3>
              <p>Descripción del certificado. Aquí se muestra información relevante del certificado 3.</p>
            </div>
          </div>
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

export default HomeUsuarioLogueado;
