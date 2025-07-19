"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaFacebook } from "react-icons/fa"
import { ThemeContext } from "../context/ThemeContext"
import { useEmpresa } from "../context/EmpresaContext"
import logo from "../assets/logo.png"
import "./FooterH.css"

const FooterH = () => {
  const { theme } = useContext(ThemeContext)
  const { logoVigente, cargando } = useEmpresa()
  const [socialLinks, setSocialLinks] = useState({
    facebook: null,
    instagram: null,
    x: null,
  })
  const [currentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        // Redes sociales esperadas
        const socialTypes = ["facebook", "instagram", "x"]
        const fetchPromises = socialTypes.map(async (type) => {
          try {
            const response = await fetch(`http://localhost:3000/social/ver/${type}`)

            if (response.ok) {
              const data = await response.json()
              return { [type]: data.linkRed || null }
              // Guardar link o null si no hay
            } else {
              console.warn(`No se pudo cargar el link para ${type}`)
              return { [type]: null }
            }
          } catch (error) {
            console.warn(`Error al cargar el link para ${type}:`, error)
            return { [type]: null }
          }
        })

        // Resolvemos todas las promesas y consolidamos los resultados
        const results = await Promise.all(fetchPromises)
        const consolidatedLinks = results.reduce((acc, curr) => ({ ...acc, ...curr }), {})
        setSocialLinks(consolidatedLinks)
      } catch (error) {
        console.error("Error al cargar los links de redes sociales:", error)
      }
    }

    fetchSocialLinks()
  }, [])

  // Determinar qué logo usar: vigente del backend o logo por defecto
  const getLogoSrc = () => {
    if (cargando) return logo // Usar logo por defecto mientras carga
    return logoVigente || logo // Usar logo vigente si existe, sino el por defecto
  }

  return (
    <footer className={`footer ${theme === "dark" ? "dark-mode" : ""}`}>
      <div className="footer-main">
        <div className="footer-logo-container">
          <img src={getLogoSrc() || "/placeholder.svg"} alt="Logo Beatbox" className="logo-footer" />
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h3>Beatbox</h3>
            <ul>
              <li>
                <Link to="/quienes_somos">Quiénes Somos</Link>
              </li>
              <li>
                <Link to="/contactanos">Contáctanos</Link>
              </li>
              <li>
                <Link to="/aviso_privacidad">Aviso de Privacidad</Link>
              </li>
              <li>
                <Link to="/Preguntas_Frecuentes">Preguntas Frecuentes</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Servicios</h3>
            <ul>
              <li>
                <Link to="/Tienda">Tienda</Link>
              </li>
              <li>
                <Link to="/">Membresías</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Síguenos</h3>
            <div className="footer-social">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i> {/* O usa react-icons si tienes FaInstagram */}
                </a>
              )}
              {socialLinks.x && (
                <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
                  <i className="fab fa-x-twitter"></i> {/* O un icono personalizado */}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">&copy; {currentYear} Beatbox. Todos los derechos reservados.</p>
        <p className="made-with">
          Hecho con <FaHeart className="heart-icon" /> en México
        </p>
      </div>
    </footer>
  )
}

export default FooterH
