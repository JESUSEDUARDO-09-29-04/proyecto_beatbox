"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import { useLocation } from "react-router-dom"
import DOMPurify from "dompurify"
import "./InicioSesion.css"
import "../home/Home.css"
import jim from "../../assets/jim.png"
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaSignInAlt,
  FaExclamationTriangle,
  FaUserPlus,
  FaQuestionCircle,
  FaSpinner,
  FaShieldAlt,
} from "react-icons/fa"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import SuccessModal from "../SuccessModal"


const InicioSesion = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [errorUsuario, setErrorUsuario] = useState("")
  const [cargando, setCargando] = useState(false)
  const [intentos, setIntentos] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [tiempoRestante, setTiempoRestante] = useState(0)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showAvisoModal, setShowAvisoModal] = useState(false)
  const [mensajeAviso, setMensajeAviso] = useState("")

  const MAX_INTENTOS = 5
  const BLOQUEO_TIEMPO = 60

  const location = useLocation()

  useEffect(() => {
    if (location.state?.aviso) {
      setMensajeAviso(location.state.aviso)
      setShowAvisoModal(true)
    }
  }, [location.state])

  useEffect(() => {
    if (bloqueado) {
      const intervalo = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            setBloqueado(false)
            clearInterval(intervalo)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(intervalo)
    }
  }, [bloqueado])

  const esCorreo = (texto) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)

  // 🔒 Función para validar y limpiar la entrada del usuario
  const validarEntrada = (input) => {
    if (!input) return ""

    // Expresión regular para bloquear caracteres peligrosos
    const regexPeligroso = /[<>`"';{}()[\]]/g

    if (regexPeligroso.test(input)) {
      setError("No se permiten caracteres especiales en los campos.")
      return ""
    }

    // Sanitizar la entrada para prevenir XSS
    return DOMPurify.sanitize(input)
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError("")
    setErrorUsuario("")
    setCargando(true)
  
    if (esCorreo(usuario)) {
      setErrorUsuario("El nombre de usuario no puede ser un correo electrónico")
      setCargando(false)
      return
    }
  
    if (bloqueado) {
      setError(`Cuenta bloqueada. Espera ${tiempoRestante} segundos.`)
      setCargando(false)
      return
    }
  
    const usuarioSanitizado = validarEntrada(usuario)
    const contrasenaSanitizada = validarEntrada(contrasena)
  
    if (!usuarioSanitizado || !contrasenaSanitizada) {
      setCargando(false)
      return
    }
  
    try {
      const loginResponse = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          usuario: usuarioSanitizado,
          password: contrasenaSanitizada,
        }),
      })
  
      if (loginResponse.ok) {
        const userResponse = await fetch("http://localhost:3000/auth/validate-user", {
          method: "GET",
          credentials: "include",
        })
  
        if (userResponse.ok) {
          setShowSuccessModal(true)
        } else {
          setError("Error al obtener datos del usuario")
        }
  
        setCargando(false)
      } else {
        const errorData = await loginResponse.json()
        const mensajeBackend = errorData?.mensaje
  
        setIntentos((prev) => prev + 1)
  
        if (intentos + 1 >= MAX_INTENTOS) {
          setBloqueado(true)
          setTiempoRestante(900) // 15 minutos en segundos
          setError("Cuenta bloqueada. Comuníquese con soporte.")
        } else {
          const intentosRestantes = MAX_INTENTOS - (intentos + 1)
          setError(
            mensajeBackend || `Credenciales incorrectas. Te quedan ${intentosRestantes} intentos.`
          )
        }        
  
        setCargando(false)
      }
    } catch (error) {
      console.error("Error de red:", error)
      setError("Error de conexión. Verifica tu conexión a internet.")
      setCargando(false)
    }
  }
  

  // Manejar cambios en los campos con sanitización en tiempo real
  const handleUsuarioChange = (e) => {
    const value = e.target.value
    // Solo sanitizamos al enviar el formulario para no afectar la experiencia de usuario
    setUsuario(value)
  }

  const handleContrasenaChange = (e) => {
    const value = e.target.value
    // Solo sanitizamos al enviar el formulario para no afectar la experiencia de usuario
    setContrasena(value)
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    navigate("/")
  }

  return (
    <div className={`contenedor ${theme === "dark" ? "dark" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>
      <div className="formulario-imagen">
        <form className="formulario" onSubmit={manejarEnvio}>
          <div className="form-header">
            <FaShieldAlt className="form-icon" />
            <h2>Iniciar Sesión</h2>
            <p className="form-subtitle">Accede a tu cuenta para continuar</p>
          </div>

          {bloqueado && (
            <div className="mensaje-bloqueo">
              <FaExclamationTriangle className="icono-bloqueo" />
              <p>Demasiados intentos, su cuenta a sido bloqueada. Comuníquese con soporte.</p>
            </div>
          )}

          <div className="campo-formulario">
            <label htmlFor="usuario">
              <FaUser className="input-icon" /> Nombre de Usuario
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="usuario"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={handleUsuarioChange}
                disabled={cargando || bloqueado}
                required
                className={errorUsuario ? "input-error" : ""}
              />
            </div>
            {errorUsuario && (
              <p className="mensaje-error-campo">
                <FaExclamationTriangle className="error-icon" /> {errorUsuario}
              </p>
            )}
          </div>

          <div className="campo-formulario">
            <label htmlFor="contrasena">
              <FaLock className="input-icon" /> Contraseña
            </label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="contrasena"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={handleContrasenaChange}
                disabled={cargando || bloqueado}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn-mostrar-contrasena"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mensaje-error">
              <FaExclamationTriangle className="error-icon" /> {error}
            </div>
          )}

          <button type="submit" className="btn-iniciar" disabled={cargando || bloqueado}>
            {cargando ? (
              <>
                <FaSpinner className="spinner-icon" /> Iniciando sesión...
              </>
            ) : (
              <>
                <FaSignInAlt /> Iniciar Sesión
              </>
            )}
          </button>

          <div className="links">
            <Link to="/RecuperarContrasenaOpciones" className="olvidaste-contrasena">
              <FaQuestionCircle /> ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/registro" className="registrarme">
              <FaUserPlus /> Registrarme
            </Link>
          </div>
        </form>

        <div className="imagen-lateral">
          <img src={jim || "/placeholder.svg"} alt="Imagen decorativa" />
          <div className="imagen-overlay">
            <h3>¡Bienvenido a Beatbox!</h3>
            <p>Inicia sesión para acceder a todas las funciones</p>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal
          message="¡Inicio de sesión exitoso!"
          onClose={handleCloseSuccessModal}
          duration={1000}
          loadingDuration={500}
        />
      )}
      {showAvisoModal && (
        <SuccessModal
          message={mensajeAviso}
          onClose={() => setShowAvisoModal(false)}
          duration={2000}
          loadingDuration={500}
        />
      )}

      <FooterH />
    </div>
  )
}

export default InicioSesion

