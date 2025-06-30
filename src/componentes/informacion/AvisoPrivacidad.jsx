"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import "./AvisoPrivacidad.css"

const AvisoPrivacidad = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)

  return (
    <div className={`aviso-privacidad-container ${theme}`}>
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <main className="privacidad-contenedor">
        <h1 className="title">Políticas de Privacidad</h1>
        <p className="last-updated">Última actualización: 17/01/2025</p>

        <div className="privacy-content">
          <p className="intro-text">
            En Beatbox, valoramos tu privacidad y nos comprometemos a proteger la información personal que compartes con
            nosotros. Este documento detalla cómo recopilamos, usamos y protegemos tus datos.
          </p>

          <div className="privacy-section">
            <div className="section-header">
              <div className="icon-circle">
                <span className="section-icon">📊</span>
              </div>
              <h2>1. Información que recopilamos</h2>
            </div>
            <p>Recopilamos los siguientes datos cuando utilizas nuestro sitio web:</p>
            <ul className="privacy-list">
              <li>
                <strong>Información personal:</strong> Nombre, correo electrónico, número de teléfono, dirección, y
                datos sobre enfermedades o discapacidades (opcional y bajo tu consentimiento).
              </li>
              <li>
                <strong>Información de pago:</strong> Datos necesarios para procesar transacciones, como el método de
                pago (estos datos son manejados por proveedores de pago seguros y no se almacenan directamente en
                nuestros servidores).
              </li>
              <li>
                <strong>Información técnica:</strong> Dirección IP, navegador y sistema operativo, y datos de navegación
                en nuestro sitio.
              </li>
            </ul>
          </div>

          <div className="privacy-section">
            <div className="section-header">
              <div className="icon-circle">
                <span className="section-icon">🔍</span>
              </div>
              <h2>2. Uso de la información</h2>
            </div>
            <p>Utilizamos la información recopilada para:</p>
            <ul className="privacy-list">
              <li>Gestionar el registro y el perfil de usuario.</li>
              <li>Ofrecer servicios personalizados, como planes de entrenamiento adaptados a tus necesidades.</li>
              <li>Mostrar perfiles de instructores y sus certificaciones.</li>
              <li>Procesar pagos de suscripciones.</li>
              <li>Mejorar nuestro sitio y servicios mediante análisis de datos.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <div className="section-header">
              <div className="icon-circle">
                <span className="section-icon">🔒</span>
              </div>
              <h2>3. Protección de tus datos</h2>
            </div>
            <p>
              Implementamos medidas de seguridad físicas, electrónicas y administrativas para proteger tu información.
              Sin embargo, ninguna transmisión de datos por Internet es 100% segura.
            </p>
          </div>

          <div className="privacy-section">
            <div className="section-header">
              <div className="icon-circle">
                <span className="section-icon">🔄</span>
              </div>
              <h2>4. Compartir información</h2>
            </div>
            <p>No compartimos tus datos personales con terceros, salvo en los siguientes casos:</p>
            <ul className="privacy-list">
              <li>
                <strong>Proveedores de servicios:</strong> Plataformas de pago y servicios de correo electrónico.
              </li>
              <li>
                <strong>Obligaciones legales:</strong> Cuando sea requerido por ley o autoridad competente.
              </li>
            </ul>
          </div>

          <div className="privacy-section">
            <div className="section-header">
              <div className="icon-circle">
                <span className="section-icon">⚖️</span>
              </div>
              <h2>5. Tus derechos</h2>
            </div>
            <p>Tienes derecho a:</p>
            <ul className="privacy-list">
              <li>Acceder, corregir o eliminar tus datos personales.</li>
              <li>Retirar tu consentimiento para el procesamiento de datos sensibles en cualquier momento.</li>
              <li>Solicitar la portabilidad de tus datos.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <div className="section-header">
              <div className="icon-circle">
                <span className="section-icon">📞</span>
              </div>
              <h2>6. Contacto</h2>
            </div>
            <p>
              Si tienes preguntas o inquietudes sobre nuestras políticas de privacidad, contáctanos en:
              <br />
              <strong>Correo electrónico:</strong>{" "}
              <a href="mailto:soportebeatbox@gmail.com">soportebeatbox@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="privacy-cta">
          <button className="cta-button" onClick={() => navigate("/contactanos")}>
            ¿Tienes preguntas? Contáctanos
          </button>
        </div>
      </main>

      <FooterH />
    </div>
  )
}

export default AvisoPrivacidad

