"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import DOMPurify from "dompurify" // 🛡 Protección contra XSS
import { FaEnvelope, FaArrowRight, FaSpinner, FaArrowLeft } from "react-icons/fa"
import "./RecuperarContrasena.css"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import jim from "../../assets/jim.png"

const RecuperarContrasenaCorreo = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [correo, setCorreo] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cargando, setCargando] = useState(false)
  const [correoSugerencias, setCorreoSugerencias] = useState([])

  const dominiosSugeridos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"]

  // 🔒 Validación avanzada del correo
  const evaluarCorreo = (correo) => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const sugerencias = []
    setError("")

    if (!correo) {
      return
    }

    if (!correo.includes("@")) {
      setError("Falta el símbolo @ en el correo electrónico.")
    } else if (!correoRegex.test(correo)) {
      dominiosSugeridos.forEach((dominio) => {
        const [localPart, domainPart] = correo.split("@")
        if (!domainPart || !dominio.startsWith(domainPart)) {
          sugerencias.push(`${localPart}@${dominio}`)
        }
      })
      setError("Formato de correo inválido. Por favor revisa las sugerencias.")
    }

    setCorreoSugerencias(sugerencias)
  }

  // 🔒 Sanitización de entrada del usuario
  const sanitizarEntrada = (input) => {
    const regexPeligroso = /[<>`"';{}()[\]]/g
    return regexPeligroso.test(input) ? "" : DOMPurify.sanitize(input)
  }

  const manejarRecuperacion = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!correo) {
      setError("Por favor, ingresa tu correo electrónico.")
      return
    }

    if (error) {
      return // No enviar el formulario si hay errores
    }

    setCargando(true)

    const datosRecuperacion = {
      correo_electronico: sanitizarEntrada(correo),
    }

    try {
      // Simulación de petición a la API
      setTimeout(() => {
        setSuccess("Correo de recuperación enviado exitosamente.")
        setCargando(false)

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/iniciar-sesion")
        }, 2000)
      }, 1500)

      // Código real para cuando se implemente la API

      const response = await fetch('https://backendbeat-serverbeat.586pa0.easypanel.host/auth/forgot/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosRecuperacion),
      });

      if (response.ok) {
        setSuccess('Correo de recuperación enviado exitosamente.');
        setTimeout(() => {
          navigate('/iniciar-sesion');
        }, 2000);
      } else {
        setError('Error al enviar el correo de recuperación.');
      }
      setCargando(false);

    } catch (err) {
      setError("Error de red. Intenta nuevamente.")
      setCargando(false)
    }
  }

  const handleCorreoChange = (e) => {
    const value = sanitizarEntrada(e.target.value)
    setCorreo(value)
    evaluarCorreo(value)
  }

  const handleSugerenciaClick = (sugerencia) => {
    setCorreo(sugerencia)
    setCorreoSugerencias([])
    setError("")
  }

  const volverAtras = () => {
    navigate("/RecuperarContrasenaOpciones")
  }

  return (
    <div className={`recuperar-container ${theme}`}>
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="recuperar-content">
        <div className="recuperar-main">
          <div className="recuperar-form-container">
            <div className="recuperar-form">
              <div className="form-header">
                <FaEnvelope className="header-icon" />
                <h1>Recuperar Contraseña</h1>
                <p className="form-subtitle">Recuperación mediante correo electrónico</p>
              </div>

              {error && (
                <div className="mensaje-error">
                  <span className="error-icon">⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="mensaje-exito">
                  <span className="exito-icon">✅</span>
                  <p>{success}</p>
                </div>
              )}

              <form onSubmit={manejarRecuperacion}>
                <div className="form-group">
                  <label htmlFor="correo">
                    <FaEnvelope className="label-icon" /> Correo Electrónico
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="correo"
                      placeholder="Ingresa tu correo"
                      value={correo}
                      onChange={handleCorreoChange}
                      disabled={cargando}
                      required
                    />
                  </div>

                  {correoSugerencias.length > 0 && (
                    <div className="sugerencias">
                      <p>¿Quisiste decir?</p>
                      <ul>
                        {correoSugerencias.map((sugerencia, index) => (
                          <li key={index} onClick={() => handleSugerenciaClick(sugerencia)}>
                            {sugerencia}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-principal" disabled={cargando || !!error}>
                  {cargando ? (
                    <>
                      <FaSpinner className="spinner-icon" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Correo de Recuperación
                      <FaArrowRight className="btn-icon" />
                    </>
                  )}
                </button>

                <button type="button" className="btn-secundario" onClick={volverAtras}>
                  <FaArrowLeft className="btn-icon" />
                  Volver a opciones
                </button>
              </form>
            </div>
          </div>

          <div className="recuperar-imagen">
            <img src={jim || "/placeholder.svg?height=600&width=800"} alt="Personas entrenando" />
            <div className="imagen-overlay">
              <h3>¡Recupera tu acceso!</h3>
              <p>Te enviaremos un enlace para restablecer tu contraseña</p>
            </div>
          </div>
        </div>
      </div>

      <FooterH />

      {cargando && (
        <div className="overlay-loading">
          <div className="loading-content">
            <FaSpinner className="spinner-large" />
            <p>Procesando solicitud...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecuperarContrasenaCorreo

