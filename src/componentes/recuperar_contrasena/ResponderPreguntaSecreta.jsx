"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import DOMPurify from "dompurify" // 🛡 Protección contra XSS
import { FaKey, FaQuestion, FaArrowRight, FaSpinner, FaArrowLeft, FaEnvelope } from "react-icons/fa"
import "./RecuperarContrasena.css"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import jim from "../../assets/jim.png"

const ResponderPreguntaSecreta = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useContext(ThemeContext)
  const [respuesta, setRespuesta] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cargando, setCargando] = useState(false)
  const [usuario, setUsuario] = useState("")
  const [preguntaSecreta, setPreguntaSecreta] = useState("")
  const [emailEnviado, setEmailEnviado] = useState(false)

  useEffect(() => {
    // Verificar si tenemos los datos necesarios
    if (!location.state || !location.state.usuario || !location.state.preguntaSecreta) {
      setError("Información incompleta. Por favor, vuelve a iniciar el proceso.")
      setTimeout(() => {
        navigate("/RecuperarContrasenaOpciones")
      }, 3000)
      return
    }

    // Establecer los datos recibidos
    setUsuario(location.state.usuario)
    setPreguntaSecreta(location.state.preguntaSecreta)
  }, [location, navigate])

  // 🔒 Sanitización de entrada del usuario
  const sanitizarEntrada = (input) => {
    const regexPeligroso = /[<>`"';{}()[\]]/g
    return regexPeligroso.test(input) ? "" : DOMPurify.sanitize(input)
  }

  const manejarRespuesta = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validar que haya una respuesta
    if (!respuesta.trim()) {
      setError("Por favor, ingresa tu respuesta.")
      return
    }

    // Iniciar carga
    setCargando(true)

    try {
      // Llamar a la API para verificar la respuesta
      const response = await fetch("http://localhost:3000/auth/reset/password/verify-secret-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          preguntaSrespuesta : sanitizarEntrada(respuesta),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al verificar la respuesta")
      }

      // Si la respuesta es exitosa, mostramos mensaje de éxito
      setSuccess(
        "Respuesta verificada correctamente. Se ha enviado un enlace de restablecimiento a tu correo electrónico.",
      )
      setEmailEnviado(true)

      // Redirigir al home después de un tiempo
      setTimeout(() => {
        navigate("/")
      }, 5000)
    } catch (error) {
      setError(error.message || "La respuesta no es correcta. Inténtalo de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  const handleRespuestaChange = (e) => {
    const value = sanitizarEntrada(e.target.value)
    setRespuesta(value)
  }

  const volverAtras = () => {
    navigate("/RecuperarContrasenaPregunta")
  }

  const irAlHome = () => {
    navigate("/")
  }

  if (!preguntaSecreta) {
    return (
      <div className={`recuperar-container ${theme}`}>
        <HeaderH />
        <div className="recuperar-content">
          <div className="mensaje-error">
            <span className="error-icon">⚠️</span>
            <p>{error || "Cargando información..."}</p>
          </div>
        </div>
        <FooterH />
      </div>
    )
  }

  if (emailEnviado) {
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
                  <h1>Correo Enviado</h1>
                  <p className="form-subtitle">Revisa tu bandeja de entrada</p>
                </div>

                <div className="mensaje-exito">
                  <span className="exito-icon">✅</span>
                  <p>{success}</p>
                </div>

                <div className="email-sent-info">
                  <p>Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña.</p>
                  <p>Si no lo encuentras en tu bandeja de entrada, revisa tu carpeta de spam.</p>
                  <p>El enlace será válido por 24 horas.</p>
                </div>

                <button type="button" className="btn-principal" onClick={irAlHome}>
                  Ir al inicio
                  <FaArrowRight className="btn-icon" />
                </button>
              </div>
            </div>

            <div className="recuperar-imagen">
              <img src={jim || "/placeholder.svg?height=600&width=800"} alt="Personas entrenando" />
              <div className="imagen-overlay">
                <h3>¡Revisa tu correo!</h3>
                <p>Te hemos enviado las instrucciones para restablecer tu contraseña</p>
              </div>
            </div>
          </div>
        </div>
        <FooterH />
      </div>
    )
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
                <FaQuestion className="header-icon" />
                <h1>Pregunta Secreta</h1>
                <p className="form-subtitle">Responde tu pregunta secreta para continuar</p>
              </div>

              {error && (
                <div className="mensaje-error">
                  <span className="error-icon">⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {success && !emailEnviado && (
                <div className="mensaje-exito">
                  <span className="exito-icon">✅</span>
                  <p>{success}</p>
                </div>
              )}

              <form onSubmit={manejarRespuesta}>
                <div className="form-group">
                  <label htmlFor="pregunta">
                    <FaKey className="label-icon" /> Tu Pregunta Secreta
                  </label>
                  <div className="pregunta-secreta">{preguntaSecreta?.pregunta}</div>
                </div>

                <div className="form-group">
                  <label htmlFor="respuesta">
                    <FaKey className="label-icon" /> Tu Respuesta
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="respuesta"
                      placeholder="Ingresa tu respuesta"
                      value={respuesta}
                      onChange={handleRespuestaChange}
                      disabled={cargando}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-principal" disabled={cargando || !!error}>
                  {cargando ? (
                    <>
                      <FaSpinner className="spinner-icon" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Continuar
                      <FaArrowRight className="btn-icon" />
                    </>
                  )}
                </button>

                <button type="button" className="btn-secundario" onClick={volverAtras}>
                  <FaArrowLeft className="btn-icon" />
                  Volver atrás
                </button>
              </form>
            </div>
          </div>

          <div className="recuperar-imagen">
            <img src={jim || "/placeholder.svg?height=600&width=800"} alt="Personas entrenando" />
            <div className="imagen-overlay">
              <h3>¡Un paso más!</h3>
              <p>Responde correctamente para recibir el enlace de restablecimiento</p>
            </div>
          </div>
        </div>
      </div>

      <FooterH />

      {cargando && (
        <div className="overlay-loading">
          <div className="loading-content">
            <FaSpinner className="spinner-large" />
            <p>Verificando respuesta...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResponderPreguntaSecreta
