import React, { useState } from 'react';
import '../home/Home.css';
import logo from '../../assets/logo.png'; // Ruta del logo
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import FooterH from '../FooterH';
import './Errores.css';
import E400 from '../../assets/400.png';
import HeaderH from '../HeaderH';

const Error400 = () => {
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado del menú
    const navigate = useNavigate(); // Inicializar navigate
    const toggleMenu = () => {
      setMenuAbierto(!menuAbierto); // Alternar el menú
    };

  return (
    <div className="contenedor">
      <HeaderH />
      {/* Error 400 */}
      <main className="error">
      <section className="error-content">
        <div className="error-text">
          <h1>400 Solicitud incorrecta</h1>
          <p>
            Lo sentimos, hubo un problema con su solicitud. 
          </p>
          <p>
          Por favor, revise la información ingresada e intente nuevamente.
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
          <img src={E400} alt="400 ilustración" className="Error" />
        </div>
      </section>
    </main>
      <FooterH />
    </div>
  );
};

export default Error400;
