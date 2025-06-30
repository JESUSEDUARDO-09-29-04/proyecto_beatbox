"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import DOMPurify from "dompurify" // 🛡 Protección contra XSS
import "./VerificarCorreo.css"
import "../home/Home.css"
import "../inicio_sesion/InicioSesion.css"
import jim from "../../assets/jim.png"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"

const VerificarCorreo = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState("")
  const [correo, setCorreo] = useState(location.state?.correo || "")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [intentos, setIntentos] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [tiempoRestante, setTiempoRestante] = useState(0)

  const MAX_INTENTOS = 5
  const BLOQUEO_TIEMPO = 60

  useEffect(() => {
    if (!correo) {
      setError("No se detectó un correo electrónico. Por favor, regístrate primero.")
      setTimeout(() => navigate("/registro"), 3000)
    }
  }, [correo, navigate])

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

  // 🔒 Validación del código de verificación (solo números y letras)
  const validarCodigo = (input) => {
    const regexSeguro = /^[a-zA-Z0-9]{6,8}$/ // Código de 6 a 8 caracteres alfanuméricos
    return regexSeguro.test(input) ? DOMPurify.sanitize(input) : ""
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!codigo) {
      setError("Por favor, ingresa el código de verificación.")
      return
    }

    if (!validarCodigo(codigo)) {
      setError("El código debe contener entre 6 y 8 caracteres alfanuméricos.")
      return
    }

    if (bloqueado) {
      setError(`Cuenta bloqueada. Espera ${tiempoRestante} segundos.`)
      return
    }

    const datosVerificacion = {
      correo_electronico: correo,
      otp: codigo,
    }

    try {
      const response = await fetch("http://localhost:3000/auth/verify/otp/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosVerificacion),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Verificación exitosa. Redirigiendo...")
        setTimeout(() => navigate("/iniciar-sesion"), 2000)
      } else {
        setIntentos((prev) => prev + 1)
        if (intentos + 1 >= MAX_INTENTOS) {
          setBloqueado(true)
          setTiempoRestante(BLOQUEO_TIEMPO)
          setError(`Demasiados intentos fallidos. Espera ${BLOQUEO_TIEMPO} segundos.`)
        } else {
          setError(data.message || "Error al verificar el código. Inténtalo de nuevo.")
        }
      }
    } catch (err) {
      setError("Error de red. Por favor, inténtalo de nuevo.")
    }
  }

  return (
    <div className="verificar-correo-container">
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="verificar-correo-content">
        <div className="verificar-form-container">
          <div className="verificar-form">
            <div className="form-header">
              <div className="icon-circle">
                <span className="icon-envelope">✉️</span>
              </div>
              <h2>Verificación de Correo Electrónico</h2>
              <p className="form-subtitle">Ingresa el código que te enviamos a tu correo electrónico</p>
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

            {correo && (
              <div className="correo-info">
                <span className="correo-icon">📧</span>
                <div className="correo-content">
                  <p>Hemos enviado un código de verificación a:</p>
                  <p className="correo-destacado">{correo}</p>
                </div>
              </div>
            )}

            <form onSubmit={manejarEnvio}>
              <div className="campo-formulario">
                <label htmlFor="codigo">Código de verificación</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="codigo"
                    placeholder="Ingresa el código de verificación"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    maxLength={8}
                    disabled={bloqueado}
                    required
                  />
                </div>
                <p className="input-help">El código debe contener entre 6 y 8 caracteres alfanuméricos</p>
              </div>

              {bloqueado ? (
                <div className="mensaje-bloqueo">
                  <span className="bloqueo-icon">🕒</span>
                  <p>Intentos agotados. Espera {tiempoRestante} segundos para intentar nuevamente.</p>
                </div>
              ) : (
                <button type="submit" className="btn-verificar">
                  <span>Verificar</span>
                  <span className="btn-icon">→</span>
                </button>
              )}
            </form>

            <div className="form-footer">
              <p>
                ¿No recibiste el código? <button className="btn-reenviar">Reenviar código</button>
              </p>
              <div className="links">
                <a href="/registro" className="link-volver">
                  Volver al registro
                </a>
                <a href="/iniciar-sesion" className="link-login">
                  Ir a iniciar sesión
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="verificar-imagen">
          <img src={jim || "/placeholder.svg?height=600&width=800"} alt="Personas entrenando" />
          <div className="imagen-overlay">
            <h3>¡Estás a un paso!</h3>
            <p>Verifica tu correo para completar tu registro</p>
          </div>
        </div>
      </div>

      <FooterH />
    </div>
  )
}

export default VerificarCorreo

