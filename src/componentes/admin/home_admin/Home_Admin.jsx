import React, { useState, useEffect } from 'react';
import '../../home/Home.css';
import logo from '../../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import AdminMenu from '../adminMenu';

const HomeUsuarioAdmin = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [submenuAbierto, setSubmenuAbierto] = useState(false); // Estado para el submenú de Documentos
  const navigate = useNavigate();

  useEffect(() => {

    const verificarRol = async () => {
  
      try {
        //ruta local const userResponse = await fetch('http://localhost:3000/auth/validate-user', {
 
        const userResponse = await fetch('https://beatbox-blond.vercel.app/auth/validate-user', {
          method: 'GET',
          credentials: 'include', // Incluye las cookies en la solicitud
        });

        if (!userResponse.ok) {
          navigate('/iniciar-sesion');
            
          if(navigate('/iniciar-sesion') === ""){
            alert('Error al verificar usuario');
          }
        }

          if (userResponse.ok){
          const userData = await userResponse.json();
          const userRole = userData.role;

          if (userRole !== 'admin' ) {
            navigate('/iniciar-sesion');
          }else{

            alert('Bienvenido');
          }
        }
      
    
    
    } catch (error) {
      console.error('Error de red al iniciar sesión', error);

  }
  };
  
  verificarRol();
  }, [navigate]); // Se ejecuta al montar el componente
  

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const toggleSubmenu = () => {
    setSubmenuAbierto(!submenuAbierto);
  };

  // Función para cerrar sesión
  const manejarCerrarSesion = () => {
    navigate('/iniciar-sesion'); // Redirige a la página de inicio de sesión.

  };

  // Opcional: Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-desplegable') && menuAbierto) {
        setMenuAbierto(false);
        setSubmenuAbierto(false); // Cierra también el submenú
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuAbierto]);

  return (
    <div className="contenedor">
      <AdminMenu />

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
