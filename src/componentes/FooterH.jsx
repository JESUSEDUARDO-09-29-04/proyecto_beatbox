// src/componentes/admin/AdminMenu.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './FooterH.css';

const FooterH = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: null,
    instagram: null,
    x: null,
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        // Redes sociales esperadas
        const socialTypes = ['facebook', 'instagram', 'x'];
        const fetchPromises = socialTypes.map(async (type) => {
          try {
            const response = await fetch(`https://beatbox-blond.vercel.app/social/ver/${type}`);
            if (response.ok) {
              const data = await response.json();
              return { [type]: data.link || null }; // Guardar link o null si no hay
            } else {
              console.warn(`No se pudo cargar el link para ${type}`);
              return { [type]: null };
            }
          } catch (error) {
            console.warn(`Error al cargar el link para ${type}:`, error);
            return { [type]: null };
          }
        });

        // Resolvemos todas las promesas y consolidamos los resultados
        const results = await Promise.all(fetchPromises);
        const consolidatedLinks = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setSocialLinks(consolidatedLinks);
      } catch (error) {
        console.error('Error al cargar los links de redes sociales:', error);
      }
    };

    fetchSocialLinks();
  }, []);

  return (
    <div>
      <footer className="footer">
        <img src={logo} alt="Logo Beatbox" className="logo-footer" />
        <div className="linea-separacion"></div>

        <h2>Síguenos</h2>
        <div className="redes-sociales">
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {socialLinks.x && (
            <a href={socialLinks.x} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i> {/* Asegúrate del nombre del ícono */}
            </a>
          )}
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

export default FooterH;
