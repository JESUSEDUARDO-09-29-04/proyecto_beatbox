import React, { useState } from 'react';
import '../home/Home.css';
import logo from '../../assets/logo.png'; // Ruta del logo
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import FooterH from '../FooterH';
import './Errores.css';
import E404 from '../../assets/404.png';
import HeaderH from '../HeaderH';
import { Link } from 'react-router-dom';

const Error404 = () => {
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado del menú
    const navigate = useNavigate(); // Inicializar navigate
    const toggleMenu = () => {
      setMenuAbierto(!menuAbierto); // Alternar el menú
    };

  return (
    <div className="contenedor">
      <HeaderH />
      {/* Error 404 */}
      <main className="error">
      <section className="error-content">
        <div className="error-text">
          <h1>¡Vaya! No encontramos la página que buscabas.</h1>
          <p>
            Regresa al inicio para continuar navegando en nuestro sitio.
          </p>
          <div className="error-buttons">
            <a href="/" className="btn btn-registrarse">
              Volver al inicio
            </a>
            <a href="/contactanos" className="btn btn-registrarse">
            
              Contactanos
            </a>
          </div>
        </div>
        <div className="error-image">
          {/* Inserta aquí la imagen */}
          <img src={E404} alt="404 ilustración" className="Error" />
        </div>
      </section>
    </main>
      <FooterH />
    </div>
  );
};

export default Error404;
