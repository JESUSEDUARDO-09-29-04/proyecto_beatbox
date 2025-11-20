"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import DOMPurify from "dompurify" // 🛡 Protección contra XSS
import "./Registro.css"
import "../home/Home.css"
import { ThemeContext } from "../../context/ThemeContext"
import jim from "../../assets/jim2.jpg"
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaSpinner,
  FaArrowRight,
  FaQuestion,
  FaKey,
} from "react-icons/fa"
import ReCAPTCHA from "react-google-recaptcha"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"

const Registro = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [usuario, setUsuario] = useState("")
  const [usuarioError, setUsuarioError] = useState("")
  const [correo, setCorreo] = useState("")
  const [correoError, setCorreoError] = useState("")
  const [correoSugerencias, setCorreoSugerencias] = useState([])
  const [contrasena, setContrasena] = useState("")
  const [confirmarContrasena, setConfirmarContrasena] = useState("")
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState("")
  const [recommendations, setRecommendations] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [paso, setPaso] = useState(1) // Para formulario por pasos

  // Estados para la pregunta secreta
  const [preguntasSecretas, setPreguntasSecretas] = useState([])
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState("")
  const [respuestaSecreta, setRespuestaSecreta] = useState("")
  const [cargandoPreguntas, setCargandoPreguntas] = useState(false)
  const [preguntaError, setPreguntaError] = useState("")

  const dominiosSugeridos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"]

  // Cargar preguntas secretas al montar el componente
  useEffect(() => {
    const cargarPreguntasSecretas = async () => {
      setCargandoPreguntas(true)
      try {
        const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/preguntas-secretas")
        const data = await response.json()
        setPreguntasSecretas(data)
        setCargandoPreguntas(false)
      } catch (error) {
        console.error("Error al cargar preguntas secretas:", error)
        setCargandoPreguntas(false)
      }
    }

    cargarPreguntasSecretas()
  }, [])

  //sanitizacion de entradas
  const sanitizarEntrada = (input) => {
    return DOMPurify.sanitize(input.replace(/[<>`"';{}()[\]]/g, ""))
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    const trimmedPassword = contrasena.trim()
    const trimmedConfirmPassword = confirmarContrasena.trim()

    if (!correo || correoError) {
      setError("Por favor, ingresa un correo válido")
      setCargando(false)
      return
    }

    if (!usuario || /[<>]/.test(usuario)) {
      setError("El nombre de usuario no debe contener caracteres peligrosos")
      setCargando(false)
      return
    }

    if (!usuario || usuarioError) {
      setError("Por favor, ingresa un nombre de usuario válido")
      setCargando(false)
      return
    }

    // Validar que las contraseñas coincidan
    if (trimmedPassword !== trimmedConfirmPassword) {
      setError("Las contraseñas no coinciden")
      setCargando(false)
      return
    }

    // Validar fortaleza de la contraseña
    if (passwordStrength !== "Fuerte") {
      setError("La contraseña no es lo suficientemente fuerte")
      setCargando(false)
      return
    }

    // Validar pregunta secreta
    if (!preguntaSeleccionada) {
      setError("Por favor, selecciona una pregunta secreta")
      setCargando(false)
      return
    }

    // Validar respuesta secreta
    if (!respuestaSecreta || respuestaSecreta.length < 3) {
      setError("Por favor, ingresa una respuesta válida a la pregunta secreta")
      setCargando(false)
      return
    }

    // Verificar que el CAPTCHA haya sido completado
    if (!recaptchaToken) {
      setError("Por favor, completa el CAPTCHA")
      setCargando(false)
      return
    }

    const datosUsuario = {
      sessionId: Math.random().toString(36).substring(2, 15), // Generate a random session ID
      correo_electronico: correo,
      usuario: usuario,
      password: trimmedPassword,
      preguntaSecretaId: preguntaSeleccionada, // Match the backend field name
      preguntaSrespuesta: respuestaSecreta, // Match the backend field name
    }

    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosUsuario),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("email", JSON.stringify(correo))
        navigate("/verificar-correo", { state: { correo } })
      } else {
        setError(data.message || "Error al registrarse")
      }
    } catch (error) {
      setError("Error de red al registrarse")
    } finally {
      setCargando(false)
    }
  }

  const handleUsuarioChange = (e) => {
    const value = sanitizarEntrada(e.target.value)
    setUsuario(value)

    if (value.length < 6) {
      setUsuarioError("El nombre de usuario debe tener al menos 6 caracteres")
    } else if (value.length > 12) {
      setUsuarioError("El nombre de usuario no debe superar los 12 caracteres")
    } else {
      setUsuarioError("")
    }
  }

  const evaluarFortalezaContrasena = (password) => {
    const patronesInseguros = [
      // Contraseñas numéricas comunes
      "123456",
      "123456789",
      "12345678",
      "1234567",
      "1234567890",
      "123123",
      "000000",
      "111111",
      "222222",
      "333333",
      "444444",
      "555555",
      "666666",
      "777777",
      "888888",
      "999999",
      "1234",
      "12345",
      "987654321",
      "121212",
      "112233",
      // Contraseñas basadas en letras comunes
      "password",
      "password1",
      "passw0rd",
      "password123",
      "admin",
      "welcome",
      "letmein",
      "sunshine",
      "master",
      "shadow",
      "login",
      "default",
      "guest",
      "root",
      // Frases y palabras comunes
      "iloveyou",
      "monkey",
      "football",
      "baseball",
      "dragon",
      "superman",
      "batman",
      "michael",
      "soccer",
      "charlie",
      "buster",
      "tigger",
      "jordan",
      "buster123",
      "hello",
      "freedom",
      "whatever",
      "princess",
      "qwerty",
      "qwerty123",
      "asdfgh",
      "zxcvbn",
      "zxcvb",
      // Contraseñas con patrones en teclado
      "1q2w3e",
      "1q2w3e4r",
      "1qaz2wsx",
      "qwertyuiop",
      "asdfghjkl",
      "zxcvbnm",
      "poiuytrewq",
      "lkjhgfdsa",
      "mnbvcxz",
      "qazwsx",
      "wsxedc",
      "edcrfv",
      // Y muchas más...
    ]

    const recomendaciones = []

    // Longitud mínima
    if (password.length < 6) {
      recomendaciones.push("Debe tener al menos 6 caracteres")
    }

    // Letras mayúsculas
    if (!/[A-Z]/.test(password)) {
      recomendaciones.push("Debe tener al menos una letra mayúscula")
    }

    // Letras minúsculas
    if (!/[a-z]/.test(password)) {
      recomendaciones.push("Debe tener al menos una letra minúscula")
    }

    // Números
    if (!/[0-9]/.test(password)) {
      recomendaciones.push("Debe tener al menos al menos un número")
    }

    // Caracteres especiales
    if (!/[!@#$%^&*()_\-+=;:'",<.>?]/.test(password)) {
      recomendaciones.push("Debe tener al menos un carácter especial (!@#$%&*)")
    }

    // Patrones inseguros
    for (const pattern of patronesInseguros) {
      if (password.toLowerCase().includes(pattern)) {
        recomendaciones.push("No debe contener patrones inseguros como contraseñas comunes")
        break
      }
    }

    // Repeticiones de caracteres
    if (/(\w)\1\1/.test(password)) {
      recomendaciones.push("No debe tener tres o más caracteres repetidos consecutivamente")
    }

    // Secuencias de caracteres
    if (
      /012|123|234|345|456|567|678|789|890/.test(password) ||
      /abc|bcd|cde|def|efg|fgh|ghi|hij/.test(password.toLowerCase())
    ) {
      recomendaciones.push("No debe contener secuencias comunes de números o letras")
    }

    setRecommendations(recomendaciones)

    if (recomendaciones.length === 0) {
      return "Fuerte"
    } else if (password.length >= 6 && recomendaciones.length <= 2) {
      return "Aceptable"
    } else {
      return "Débil"
    }
  }

  const handlePasswordChange = (e) => {
    const password = e.target.value
    setContrasena(password)
    const strength = evaluarFortalezaContrasena(password)
    setPasswordStrength(strength)
  }

  const evaluarCorreo = (correo) => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const sugerencias = []
    setCorreoError("")

    if (!correo) {
      return
    }

    if (!correo.includes("@")) {
      setCorreoError("Falta el símbolo @ en el correo electrónico.")
      dominiosSugeridos.forEach((dominio) => {
        sugerencias.push(`${correo}@${dominio}`)
      })
    } else if (!correoRegex.test(correo)) {
      const [localPart, domainPart] = correo.split("@")

      if (!domainPart || domainPart.trim() === "") {
        dominiosSugeridos.forEach((dominio) => {
          sugerencias.push(`${localPart}@${dominio}`)
        })
        setCorreoError("Falta el dominio después del símbolo @.")
      } else if (!domainPart.includes(".")) {
        dominiosSugeridos.forEach((dominio) => {
          if (dominio.startsWith(domainPart)) {
            sugerencias.push(`${localPart}@${dominio}`)
          }
        })
        setCorreoError("El dominio del correo es inválido.")
      } else {
        setCorreoError("Formato de correo inválido.")
      }
    }

    setCorreoSugerencias(sugerencias)
  }

  const handleCorreoChange = (e) => {
    const value = sanitizarEntrada(e.target.value)
    setCorreo(value)
    evaluarCorreo(value)
  }

  const handlePreguntaChange = (e) => {
    const value = e.target.value
    setPreguntaSeleccionada(value)
    setPreguntaError("")
  }

  const handleRespuestaSecretaChange = (e) => {
    const value = sanitizarEntrada(e.target.value)
    setRespuestaSecreta(value)

    if (value.length < 3) {
      setPreguntaError("La respuesta debe tener al menos 3 caracteres")
    } else {
      setPreguntaError("")
    }
  }

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token)
  }

  const siguientePaso = () => {
    if (paso === 1 && correo && !correoError && usuario && !usuarioError) {
      setPaso(2)
    } else if (
      paso === 2 &&
      contrasena &&
      confirmarContrasena &&
      passwordStrength === "Fuerte" &&
      contrasena === confirmarContrasena
    ) {
      setPaso(3)
    } else if (paso === 3 && preguntaSeleccionada && respuestaSecreta && respuestaSecreta.length >= 3) {
      setPaso(4)
    }
  }

  const pasoAnterior = () => {
    if (paso > 1) {
      setPaso(paso - 1)
    }
  }

  const renderizarIndicadorFortaleza = () => {
    if (!contrasena) return null

    let color = ""
    let width = ""
    let icon = null

    switch (passwordStrength) {
      case "Débil":
        color = "var(--color-error)"
        width = "33%"
        icon = <FaTimesCircle />
        break
      case "Aceptable":
        color = "var(--color-warning)"
        width = "66%"
        icon = <FaInfoCircle />
        break
      case "Fuerte":
        color = "var(--color-success)"
        width = "100%"
        icon = <FaCheckCircle />
        break
      default:
        color = "var(--color-error)"
        width = "10%"
    }

    return (
      <div className="password-strength-container">
        <div className="password-strength-bar">
          <div className="password-strength-indicator" style={{ width, backgroundColor: color }}></div>
        </div>
        <div className="password-strength-text" style={{ color }}>
          {icon} {passwordStrength}
        </div>
      </div>
    )
  }

  return (
    <div className={`registro-contenedor ${theme === "dark" ? "dark" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="formulario-imagenr">
        <form className="formulario registro-form" onSubmit={manejarEnvio}>
          <div className="form-header">
            <FaShieldAlt className="form-icon" />
            <h2>Crear Cuenta</h2>
            <p className="form-subtitle">Únete a nuestra comunidad fitness</p>
          </div>

          <div className="form-progress">
            <div className={`progress-step ${paso >= 1 ? "active" : ""} ${paso > 1 ? "completed" : ""}`}>
              <div className="step-number">1</div>
              <span className="step-label">Datos</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${paso >= 2 ? "active" : ""} ${paso > 2 ? "completed" : ""}`}>
              <div className="step-number">2</div>
              <span className="step-label">Seguridad</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${paso >= 3 ? "active" : ""} ${paso > 3 ? "completed" : ""}`}>
              <div className="step-number">3</div>
              <span className="step-label">Pregunta</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${paso >= 4 ? "active" : ""}`}>
              <div className="step-number">4</div>
              <span className="step-label">Verificación</span>
            </div>
          </div>

          {error && (
            <div className="mensaje-error">
              <FaExclamationTriangle className="error-icon" /> {error}
            </div>
          )}

          {paso === 1 && (
            <div className="form-step fade-in">
              <div className="campo-formulario">
                <label htmlFor="correo">
                  <FaEnvelope className="input-icon" /> Correo Electrónico
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="correo"
                    placeholder="Ingresa tu correo"
                    value={correo}
                    onChange={handleCorreoChange}
                    required
                    className={correoError ? "input-error" : ""}
                  />
                </div>
                {correoError ? (
                  <div className="retroalimentacion">
                    <p className="mensaje-error-campo">
                      <FaExclamationTriangle /> {correoError}
                    </p>
                    {correoSugerencias.length > 0 && (
                      <div className="sugerencias">
                        <p>¿Quisiste decir?</p>
                        <ul>
                          {correoSugerencias.map((sugerencia, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                setCorreo(sugerencia)
                                setCorreoError("")
                                setCorreoSugerencias([])
                              }}
                              className="sugerencia-item"
                            >
                              {sugerencia}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  correo && (
                    <p className="campo-valido">
                      <FaCheckCircle /> El correo es válido
                    </p>
                  )
                )}
              </div>

              <div className="campo-formulario">
                <label htmlFor="usuario">
                  <FaUser className="input-icon" /> Nombre de usuario
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="usuario"
                    placeholder="Ingresa tu nombre de usuario"
                    value={usuario}
                    onChange={handleUsuarioChange}
                    required
                    className={usuarioError ? "input-error" : ""}
                  />
                </div>
                {usuarioError ? (
                  <p className="campo-error">
                    <FaExclamationTriangle /> {usuarioError}
                  </p>
                ) : (
                  usuario && (
                    <p className="campo-valido">
                      <FaCheckCircle /> El nombre de usuario es válido
                    </p>
                  )
                )}
              </div>

              <div className="form-navigation">
                <button
                  type="button"
                  className="btn-siguiente"
                  onClick={siguientePaso}
                  disabled={!correo || correoError || !usuario || usuarioError}
                >
                  Siguiente <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="form-step fade-in">
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
                    onChange={handlePasswordChange}
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

                {contrasena && renderizarIndicadorFortaleza()}

                {recommendations.length > 0 && (
                  <div className="password-recommendations">
                    <p>Recomendaciones:</p>
                    <ul>
                      {recommendations.map((rec, index) => (
                        <li key={index}>
                          <FaExclamationTriangle className="recommendation-icon" /> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="campo-formulario">
                <label htmlFor="confirmarContrasena">
                  <FaLock className="input-icon" /> Confirmar Contraseña
                </label>
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmarContrasena"
                    placeholder="Confirma tu contraseña"
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                    required
                    className={confirmarContrasena && confirmarContrasena !== contrasena ? "input-error" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="btn-mostrar-contrasena"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmarContrasena && confirmarContrasena !== contrasena ? (
                  <p className="campo-error">
                    <FaExclamationTriangle /> Las contraseñas no coinciden
                  </p>
                ) : (
                  confirmarContrasena && (
                    <p className="campo-valido">
                      <FaCheckCircle /> Las contraseñas coinciden
                    </p>
                  )
                )}
              </div>

              <div className="form-navigation">
                <button type="button" className="btn-anterior" onClick={pasoAnterior}>
                  Anterior
                </button>
                <button
                  type="button"
                  className="btn-siguiente"
                  onClick={siguientePaso}
                  disabled={
                    !contrasena ||
                    !confirmarContrasena ||
                    passwordStrength !== "Fuerte" ||
                    contrasena !== confirmarContrasena
                  }
                >
                  Siguiente <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="form-step fade-in">
              <div className="campo-formulario">
                <label htmlFor="preguntaSecreta">
                  <FaQuestion className="input-icon" /> Pregunta Secreta
                </label>
                <div className="select-wrapper">
                  {cargandoPreguntas ? (
                    <div className="cargando-preguntas">
                      <FaSpinner className="spinner-icon" /> Cargando preguntas...
                    </div>
                  ) : (
                    <select
                      id="preguntaSecreta"
                      value={preguntaSeleccionada}
                      onChange={handlePreguntaChange}
                      required
                      className={preguntaError ? "input-error" : ""}
                    >
                      <option value="">Selecciona una pregunta secreta</option>
                      {preguntasSecretas.map((pregunta) => (
                        <option key={pregunta.id} value={pregunta.id}>
                          {pregunta.pregunta}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {!preguntaSeleccionada && (
                  <p className="campo-info">
                    <FaInfoCircle /> Esta pregunta te ayudará a recuperar tu cuenta si olvidas tu contraseña
                  </p>
                )}
              </div>

              <div className="campo-formulario">
                <label htmlFor="respuestaSecreta">
                  <FaKey className="input-icon" /> Tu Respuesta
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="respuestaSecreta"
                    placeholder="Ingresa tu respuesta"
                    value={respuestaSecreta}
                    onChange={handleRespuestaSecretaChange}
                    required
                    className={preguntaError ? "input-error" : ""}
                    disabled={!preguntaSeleccionada}
                  />
                </div>
                {preguntaError ? (
                  <p className="campo-error">
                    <FaExclamationTriangle /> {preguntaError}
                  </p>
                ) : (
                  respuestaSecreta &&
                  respuestaSecreta.length >= 3 && (
                    <p className="campo-valido">
                      <FaCheckCircle /> Respuesta válida
                    </p>
                  )
                )}
                <div className="respuesta-recomendacion">
                  <FaInfoCircle className="info-icon" /> Recuerda esta respuesta, la necesitarás si olvidas tu
                  contraseña
                </div>
              </div>

              <div className="form-navigation">
                <button type="button" className="btn-anterior" onClick={pasoAnterior}>
                  Anterior
                </button>
                <button
                  type="button"
                  className="btn-siguiente"
                  onClick={siguientePaso}
                  disabled={!preguntaSeleccionada || !respuestaSecreta || respuestaSecreta.length < 3}
                >
                  Siguiente <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {paso === 4 && (
            <div className="form-step fade-in">
              <div className="verification-step">
                <div className="verification-info">
                  <h3>Verificación de Seguridad</h3>
                  <p>Por favor, completa el captcha para verificar que no eres un robot.</p>
                </div>

                <div className="recaptcha-container">
                  <ReCAPTCHA
                    sitekey="6LewRWkqAAAAANUGc0gdQDNf-KScA4ZZuZRIe6sE"
                    onChange={handleRecaptchaChange}
                    theme={theme === "dark" ? "dark" : "light"}
                  />
                </div>

                <div className="resumen-registro">
                  <h3>Resumen de Registro</h3>
                  <div className="resumen-item">
                    <span className="resumen-label">Correo:</span>
                    <span className="resumen-value">{correo}</span>
                  </div>
                  <div className="resumen-item">
                    <span className="resumen-label">Usuario:</span>
                    <span className="resumen-value">{usuario}</span>
                  </div>
                  <div className="resumen-item">
                    <span className="resumen-label">Contraseña:</span>
                    <span className="resumen-value">••••••••••</span>
                  </div>
                  <div className="resumen-item">
                    <span className="resumen-label">Pregunta secreta:</span>
                    <span className="resumen-value">
                      {preguntaSeleccionada && preguntasSecretas.find((p) => p.id === preguntaSeleccionada)?.pregunta}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-navigation">
                <button type="button" className="btn-anterior" onClick={pasoAnterior}>
                  Anterior
                </button>
                <button type="submit" className="btn-registrar" disabled={!recaptchaToken || cargando}>
                  {cargando ? (
                    <>
                      <FaSpinner className="spinner-icon" /> Registrando...
                    </>
                  ) : (
                    <>
                      <FaUserPlus /> Completar Registro
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="links">
            <Link to="/iniciar-sesion" className="link-login">
              ¿Ya tienes una cuenta? <span>Iniciar sesión</span>
            </Link>
          </div>
        </form>

        <div className="imagen-lateralr">
          <img src={jim || "/placeholder.svg"} alt="Imagen decorativa" />
          <div className="imagen-overlay">
            <h3>¡Únete a Beatbox!</h3>
            <p>Comienza tu viaje fitness hoy mismo</p>
          </div>
        </div>
      </div>
      <FooterH />
    </div>
  )
}

export default Registro

