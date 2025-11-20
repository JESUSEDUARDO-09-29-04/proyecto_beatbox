"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import DOMPurify from "dompurify" // 🛡 Protección contra XSS
import { FaUser, FaQuestion, FaArrowRight, FaSpinner, FaArrowLeft } from "react-icons/fa"
import "./RecuperarContrasena.css"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import jim from "../../assets/jim.png"

const RecuperarContrasenaPregunta = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [usuario, setUsuario] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cargando, setCargando] = useState(false)

  // 🔒 Validación del nombre de usuario
  const validarUsuario = (usuario) => {
    setError("")

    if (!usuario) {
      setError("Por favor, ingresa tu nombre de usuario.")
      return false
    }

    if (usuario.length < 4) {
      setError("El nombre de usuario debe tener al menos 4 caracteres.")
      return false
    }

    // Validar que solo contenga caracteres alfanuméricos y guiones
    const usuarioRegex = /^[a-zA-Z0-9_-]+$/
    if (!usuarioRegex.test(usuario)) {
      setError("El nombre de usuario solo puede contener letras, números, guiones y guiones bajos.")
      return false
    }

    return true
  }

  // 🔒 Sanitización de entrada del usuario
  const sanitizarEntrada = (input) => {
    const regexPeligroso = /[<>`"';{}()[\]]/g
    return regexPeligroso.test(input) ? "" : DOMPurify.sanitize(input)
  }

  // Modificar la función manejarRecuperacion para usar la URL correcta
  const manejarRecuperacion = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validar entrada
    if (!validarUsuario(usuario)) {
      return
    }

    // Iniciar carga
    setCargando(true)

    try {
      // Llamar a la API para obtener la pregunta secreta con la URL correcta
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/give/secret-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: sanitizarEntrada(usuario) }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al verificar el usuario")
      }

      // Si la respuesta es exitosa, mostramos mensaje de éxito
      setSuccess("Usuario verificado correctamente.")

      // Esperamos un momento y luego navegamos a la siguiente página
      setTimeout(() => {
        navigate("/ResponderPreguntaSecreta", {
          state: {
            usuario: sanitizarEntrada(usuario),
            preguntaSecreta: data.preguntaSecreta,
          },
        })
      }, 1000)
    } catch (error) {
      setError(error.message || "No se pudo verificar el usuario. Inténtalo de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  const handleUsuarioChange = (e) => {
    const value = sanitizarEntrada(e.target.value)
    setUsuario(value)
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
                <FaQuestion className="header-icon" />
                <h1>Recuperar Contraseña</h1>
                <p className="form-subtitle">Recuperación mediante pregunta secreta</p>
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
                  <label htmlFor="usuario">
                    <FaUser className="label-icon" /> Nombre de Usuario
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="usuario"
                      placeholder="Ingresa tu nombre de usuario"
                      value={usuario}
                      onChange={handleUsuarioChange}
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
                  Volver a opciones
                </button>
              </form>
            </div>
          </div>

          <div className="recuperar-imagen">
            <img src={jim || "/placeholder.svg?height=600&width=800"} alt="Personas entrenando" />
            <div className="imagen-overlay">
              <h3>¡Recupera tu acceso!</h3>
              <p>Responde tu pregunta secreta para restablecer tu contraseña</p>
            </div>
          </div>
        </div>
      </div>

      <FooterH />

      {cargando && (
        <div className="overlay-loading">
          <div className="loading-content">
            <FaSpinner className="spinner-large" />
            <p>Verificando usuario...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecuperarContrasenaPregunta

