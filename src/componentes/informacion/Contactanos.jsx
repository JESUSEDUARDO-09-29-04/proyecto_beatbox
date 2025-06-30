"use client"

import { useState, useContext } from "react"
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaUser, FaPaperPlane, FaBuilding } from "react-icons/fa"
import { ThemeContext } from "../../context/ThemeContext"
import "./Contactanos.css"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"

const Contactanos = () => {
  const { theme } = useContext(ThemeContext)
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: "",
  })
  const [enviando, setEnviando] = useState(false)
  const [mensajeEnviado, setMensajeEnviado] = useState(false)

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const manejarEnvio = (e) => {
    e.preventDefault()
    setEnviando(true)

    // Simulación de envío
    setTimeout(() => {
      setEnviando(false)
      setMensajeEnviado(true)
      setFormulario({ nombre: "", correo: "", asunto: "", mensaje: "" })

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setMensajeEnviado(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className={`contacto-container ${theme}`}>
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="contacto-wrapper">
        {/* Sección de información de contacto */}
        <div className="contacto-info">
          <h2 className="contacto-titulo">Información de Contacto</h2>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="info-content">
                <h3>Dirección</h3>
                <p>Prof. Toribio Reyes 33A, Huejutla, Hidalgo, 43000</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaUser />
              </div>
              <div className="info-content">
                <h3>Contacto</h3>
                <p>Brenda Baltazar Santiago</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div className="info-content">
                <h3>Correo Electrónico</h3>
                <a href="mailto:Brendabalt@hotmail.com">Brendabalt@hotmail.com</a>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaPhone />
              </div>
              <div className="info-content">
                <h3>Teléfono</h3>
                <a href="tel:+525530478516">5530478516</a>
              </div>
            </div>
          </div>

          <div className="horario-atencion">
            <div className="info-icon">
              <FaBuilding />
            </div>
            <div className="info-content">
              <h3>Horario de Atención</h3>
              <p>Lunes a Viernes: 8:00 AM - 8:00 PM</p>
              <p>Sábados: 9:00 AM - 2:00 PM</p>
              <p>Domingos: Cerrado</p>
            </div>
          </div>
        </div>

        {/* Sección del mapa y formulario */}
        <div className="contacto-mapa-form">
          <div className="contacto-mapa">
            <iframe
              title="Mapa Ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.7064680228297!2d-98.41925702425789!3d20.37143861350627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d131540e6a5d1b%3A0x768ed528166761ae!2sProf.%20Toribio%20Reyes%2033A%2C%20Huejutla%2C%20Hgo.%2C%2043000!5e0!3m2!1ses-419!2smx!4v1700000000000!5m2!1ses-419!2smx"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          <div className="contacto-form">
            <h2 className="contacto-titulo">Envíanos un Mensaje</h2>

            {mensajeEnviado && (
              <div className="mensaje-exito">
                <FaEnvelope className="icono-exito" />
                <p>¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</p>
              </div>
            )}

            <form onSubmit={manejarEnvio}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">
                    <FaUser className="icono" />
                    <span>Nombre</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="correo">
                    <FaEnvelope className="icono" />
                    <span>Correo</span>
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    placeholder="Tu correo electrónico"
                    value={formulario.correo}
                    onChange={manejarCambio}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="asunto">
                  <FaPaperPlane className="icono" />
                  <span>Asunto</span>
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  placeholder="Asunto del mensaje"
                  value={formulario.asunto}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">
                  <span>Mensaje</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Escribe tu mensaje aquí..."
                  rows="5"
                  value={formulario.mensaje}
                  onChange={manejarCambio}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-enviar" disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <FooterH />
    </div>
  )
}

export default Contactanos

