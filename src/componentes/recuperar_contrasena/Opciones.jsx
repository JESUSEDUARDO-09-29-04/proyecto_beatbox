"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import { FaLock, FaQuestion, FaEnvelope, FaArrowRight, FaSpinner } from "react-icons/fa"
import "./RecuperarContrasenaOpciones.css"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"

const RecuperarContrasenaOpciones = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [metodo, setMetodo] = useState("")
  const [cargando, setCargando] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!metodo) return

    setCargando(true)

    // Simulamos un tiempo de carga antes de redirigir
    setTimeout(() => {
      if (metodo === "correo") {
        navigate("/recuperar-contrasena")
      } else if (metodo === "pregunta") {
        navigate("/recuperar-contrasenaPS")
      }
      setCargando(false)
    }, 1000)
  }

  return (
    <div className={`recuperar-container ${theme}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>
      <div className="recuperar-content">
        <div className="recuperar-card">
          <div className="recuperar-header">
            <div className="icon-circle">
              <FaLock className="icon-lock" />
            </div>
            <h1 className="recuperar-title">Recuperar contraseña</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <p className="recuperar-subtitle">Selecciona el método para recuperar contraseña</p>

            <div className="recuperar-options">
              <label className={`option-card ${metodo === "pregunta" ? "selected" : ""}`}>
                <div className="option-radio">
                  <input
                    type="radio"
                    name="metodo"
                    value="pregunta"
                    checked={metodo === "pregunta"}
                    onChange={() => setMetodo("pregunta")}
                  />
                  <span className="radio-custom"></span>
                </div>
                <div className="option-icon">
                  <FaQuestion />
                </div>
                <div className="option-info">
                  <span className="option-text">Pregunta secreta</span>
                  <span className="option-desc">Responde tu pregunta de seguridad</span>
                </div>
              </label>

              <label className={`option-card ${metodo === "correo" ? "selected" : ""}`}>
                <div className="option-radio">
                  <input
                    type="radio"
                    name="metodo"
                    value="correo"
                    checked={metodo === "correo"}
                    onChange={() => setMetodo("correo")}
                  />
                  <span className="radio-custom"></span>
                </div>
                <div className="option-icon">
                  <FaEnvelope />
                </div>
                <div className="option-info">
                  <span className="option-text">Correo Electrónico</span>
                  <span className="option-desc">Recibe un enlace en tu correo</span>
                </div>
              </label>
            </div>

            <button type="submit" className={`btn-aceptar ${!metodo ? "disabled" : ""}`} disabled={!metodo || cargando}>
              {cargando ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  PROCESANDO...
                </>
              ) : (
                <>
                  ACEPTAR
                  <FaArrowRight className="arrow-icon" />
                </>
              )}
            </button>

            <div className="recuperar-footer">
              <a href="/iniciar-sesion" className="link-inicio">
                Inicio de Sesión
              </a>
            </div>
          </form>

          {cargando && (
            <div className="overlay-loading">
              <div className="loading-content">
                <FaSpinner className="spinner-large" />
                <p>Redirigiendo...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <FooterH />
    </div>
  )
}

export default RecuperarContrasenaOpciones

