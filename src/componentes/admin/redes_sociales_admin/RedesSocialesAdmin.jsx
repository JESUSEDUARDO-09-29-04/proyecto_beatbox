import React, { useState } from 'react';
import '../../home/Home.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../adminMenu';
import { FaFacebook } from 'react-icons/fa';  // Importa el ícono de Facebook
import './RedesSocialesAdmin.css';
const RedesSocialesAdmin = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [facebookLink, setFacebookLink] = useState('https://facebook.com/tu-pagina'); // Estado para el enlace de Facebook
  const [loading, setLoading] = useState(false); // Estado para el estado de carga

  const manejarCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/iniciar-sesion');
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Función para manejar el cambio del enlace de Facebook
  const handleFacebookLinkChange = (e) => {
    setFacebookLink(e.target.value);
  };

  // Función para actualizar el enlace en la base de datos
  const actualizarEnlaceFacebook = async () => {
    setLoading(true);
    try {
      // Aquí reemplaza con tu API de actualización
      const response = await fetch('/api/enlaces/facebook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: facebookLink }),
      });

      if (response.ok) {
        alert('El enlace de Facebook se ha actualizado correctamente');
      } else {
        alert('Hubo un error al actualizar el enlace');
      }
    } catch (error) {
      alert('Error de red al actualizar el enlace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contenedor">
      <AdminMenu />

      {/* Sección para actualizar el enlace de Facebook */}
      <div className="admin-redes">
        <h2>Actualizar Enlace de Redes Sociales</h2>
        
        <div className="red-social">
          <FaFacebook size={30} color="black" /> {/* Icono de Facebook en color negro */}
          <input
            type="text"
            value={facebookLink}
            onChange={handleFacebookLinkChange}
            placeholder="Ingrese el nuevo enlace de Facebook"
            className="input-enlace"
          />
          <button onClick={actualizarEnlaceFacebook} disabled={loading} className="btn-actualizar">
            {loading ? 'Actualizando...' : 'Actualizar enlace'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <img src={logo} alt="Logo Beatbox" className="logo-footer" />
        <div className="linea-separacion"></div>
        <h2>Síguenos</h2>
        <div className="redes-sociales">
          <a href={facebookLink} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
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

export default RedesSocialesAdmin;
