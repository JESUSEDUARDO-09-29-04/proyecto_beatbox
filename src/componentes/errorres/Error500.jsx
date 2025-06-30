import React, { useState } from 'react';
import '../home/Home.css';
import logo from '../../assets/logo.png'; // Ruta del logo
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import FooterH from '../FooterH';
import './Errores.css';
import E500 from '../../assets/500.png';
import HeaderH from '../HeaderH';

const Error500 = () => {
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado del menú
    const navigate = useNavigate(); // Inicializar navigate
    const toggleMenu = () => {
      setMenuAbierto(!menuAbierto); // Alternar el menú
    };

  return (
    <div className="contenedor">
      <HeaderH />
      {/* Error 500 */}
      <main className="error">
      <section className="error-content">
        <div className="error-text">
          <h1>500 Error Interno del Servidor</h1>
          <p>
          Estamos experimentando dificultades técnicas en este momento. 
          </p>
          <p>
          Por favor, intente nuevamente más tarde mientras resolvemos el inconveniente.
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
          <img src={E500} alt="500 ilustración" className="Error" />
        </div>
        
      </section>
    </main>
      <FooterH />
    </div>
  );
};

export default Error500;
