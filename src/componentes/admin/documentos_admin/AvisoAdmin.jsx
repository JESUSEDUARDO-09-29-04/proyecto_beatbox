import React, { useState } from 'react';
import '../../home/Home.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../adminMenu';

const AvisoAdmin = () => {
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false); // State for menu visibility
  
    // Sample user data with initial block status
    const [usuarios, setUsuarios] = useState([
      { id: 1, nombre: "Usuario 1", email: "usuario1@correo.com", fechaCreacion: "Nov 1, 2024", rol: "Administrador", bloqueado: false },
      { id: 2, nombre: "Usuario 2", email: "usuario2@correo.com", fechaCreacion: "Nov 3, 2024", rol: "Usuario", bloqueado: true },
      // More users can be added here
    ]);
  
    // Function to handle logout
    const manejarCerrarSesion = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/iniciar-sesion');
    };
  
    // Function to toggle user block status
    const toggleBlockStatus = (userId) => {
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === userId ? { ...usuario, bloqueado: !usuario.bloqueado } : usuario
        )
      );
    };
    // Function to toggle the hamburger menu
    const toggleMenu = () => {
      setMenuAbierto(!menuAbierto);
    };
    return (
      <div className="contenedor">
        <AdminMenu />
  
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

export default AvisoAdmin;
