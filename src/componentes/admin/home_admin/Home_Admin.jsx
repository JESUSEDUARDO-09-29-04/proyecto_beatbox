import React, { useState, useEffect } from 'react';
import '../../home/Home.css';
import logo from '../../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import AdminMenu from '../adminMenu';


const HomeUsuarioAdmin = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Función para cerrar sesión
  const manejarCerrarSesion = () => {
    //localStorage.removeItem('token'); // Elimina el token del localStorage
   // localStorage.removeItem('user');  // Elimina el nombre del usuario
    navigate('/iniciar-sesion'); // Redirige a la página de inicio de sesión.
  };

  return (
    <div className="contenedor">
      <AdminMenu />

      {/* Sección de Certificados */}
      <main className="contenido-principal">
        
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

export default HomeUsuarioAdmin;
