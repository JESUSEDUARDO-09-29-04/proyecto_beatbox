"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { verificarSesion } from "../../utils/verificarSesion" // ajusta el path si cambia
import { ThemeContext } from "../../context/ThemeContext"
import DOMPurify from "dompurify"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import "./Suscripcion.css"
import {
  FaArrowLeft,
  FaArrowRight,
  FaExclamationTriangle,
  FaCreditCard,
  FaCalendarAlt,
  FaLock,
  FaUser,
  FaPaypal,
  FaApplePay,
  FaGooglePay,
  FaMoneyBillWave,
} from "react-icons/fa"

const PagoSuscripcion = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useContext(ThemeContext)
  const [planId, setPlanId] = useState(null)
  const [datosPersonales, setDatosPersonales] = useState(null)
  const [metodoPago, setMetodoPago] = useState("tarjeta")
  const [formData, setFormData] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaExpiracion: "",
    cvv: "",
  })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [planInfo, setPlanInfo] = useState(null)

  useEffect(() => {
      const checarUsuario = async () => {
        const usuario = await verificarSesion()
        if (!usuario) {
          navigate("/iniciar-sesion")
        }
      }
    
      checarUsuario()
    }, [])

  // Planes de suscripción
  const planes = [
    {
      id: 1,
      tipo: "Semanal",
      precio: "199",
      periodo: "/semana",
    },
    {
      id: 2,
      tipo: "Mensual",
      precio: "599",
      periodo: "/mes",
    },
    {
      id: 3,
      tipo: "Anual",
      precio: "5,999",
      periodo: "/año",
    },
  ]

  // Verificar si hay un plan seleccionado en la URL y datos personales en sessionStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const plan = params.get("plan")
    if (!plan) {
      navigate("/suscripcion")
      return
    }

    setPlanId(plan)

    // Obtener información del plan
    const planSeleccionado = planes.find((p) => p.id === Number.parseInt(plan))
    if (planSeleccionado) {
      setPlanInfo(planSeleccionado)
    }

    // Obtener datos personales de sessionStorage
    const datosGuardados = sessionStorage.getItem("datosSuscripcion")
    if (!datosGuardados) {
      navigate(`/suscripcion/datos?plan=${plan}`)
      return
    }

    try {
      const datos = JSON.parse(datosGuardados)
      setDatosPersonales(datos)
    } catch (error) {
      console.error("Error al parsear datos:", error)
      navigate(`/suscripcion/datos?plan=${plan}`)
    }
  }, [location.search, navigate])

  // Función para sanitizar entradas
  const sanitizarEntrada = (input) => {
    if (!input) return ""
    return DOMPurify.sanitize(input)
  }

  // Función para manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target

    // Validaciones específicas para cada campo
    let valorProcesado = value

    if (name === "numeroTarjeta") {
      // Solo permitir números y formatear con espacios cada 4 dígitos
      valorProcesado = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim()
      // Limitar a 19 caracteres (16 dígitos + 3 espacios)
      valorProcesado = valorProcesado.substring(0, 19)
    } else if (name === "fechaExpiracion") {
      // Solo permitir números y formatear como MM/YY
      valorProcesado = value.replace(/\D/g, "")
      if (valorProcesado.length > 2) {
        valorProcesado = `${valorProcesado.substring(0, 2)}/${valorProcesado.substring(2, 4)}`
      }
      // Limitar a 5 caracteres (MM/YY)
      valorProcesado = valorProcesado.substring(0, 5)
    } else if (name === "cvv") {
      // Solo permitir números y limitar a 4 dígitos
      valorProcesado = value.replace(/\D/g, "").substring(0, 4)
    }

    setFormData({
      ...formData,
      [name]: valorProcesado,
    })

    // Limpiar error del campo cuando el usuario escribe
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: "",
      })
    }
  }

  // Función para cambiar el método de pago
  const cambiarMetodoPago = (metodo) => {
    setMetodoPago(metodo)
    // Limpiar errores al cambiar de método
    setErrores({})
  }

  // Función para validar el formulario
  const validarFormulario = () => {
    const nuevosErrores = {}

    if (metodoPago === "tarjeta") {
      // Validar número de tarjeta
      const numeroSinEspacios = formData.numeroTarjeta.replace(/\s/g, "")
      if (!numeroSinEspacios) {
        nuevosErrores.numeroTarjeta = "El número de tarjeta es obligatorio"
      } else if (numeroSinEspacios.length < 15 || numeroSinEspacios.length > 16) {
        nuevosErrores.numeroTarjeta = "El número de tarjeta debe tener 15 o 16 dígitos"
      }

      // Validar nombre del titular
      if (!formData.nombreTitular.trim()) {
        nuevosErrores.nombreTitular = "El nombre del titular es obligatorio"
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombreTitular)) {
        nuevosErrores.nombreTitular = "El nombre solo debe contener letras"
      }

      // Validar fecha de expiración
      if (!formData.fechaExpiracion) {
        nuevosErrores.fechaExpiracion = "La fecha de expiración es obligatoria"
      } else if (!/^\d{2}\/\d{2}$/.test(formData.fechaExpiracion)) {
        nuevosErrores.fechaExpiracion = "Formato inválido (MM/YY)"
      } else {
        const [mes, anio] = formData.fechaExpiracion.split("/")
        const fechaActual = new Date()
        const anioActual = fechaActual.getFullYear() % 100
        const mesActual = fechaActual.getMonth() + 1

        if (Number.parseInt(mes) < 1 || Number.parseInt(mes) > 12) {
          nuevosErrores.fechaExpiracion = "Mes inválido"
        } else if (
          Number.parseInt(anio) < anioActual ||
          (Number.parseInt(anio) === anioActual && Number.parseInt(mes) < mesActual)
        ) {
          nuevosErrores.fechaExpiracion = "La tarjeta ha expirado"
        }
      }

      // Validar CVV
      if (!formData.cvv) {
        nuevosErrores.cvv = "El código de seguridad es obligatorio"
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        nuevosErrores.cvv = "El CVV debe tener 3 o 4 dígitos"
      }
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    if (validarFormulario()) {
      setEnviando(true)

      // Sanitizar todos los datos antes de enviar
      const datosSanitizados = {
        metodoPago,
        ...formData,
        numeroTarjeta: metodoPago === "tarjeta" ? sanitizarEntrada(formData.numeroTarjeta) : "",
        nombreTitular: metodoPago === "tarjeta" ? sanitizarEntrada(formData.nombreTitular) : "",
        fechaExpiracion: metodoPago === "tarjeta" ? sanitizarEntrada(formData.fechaExpiracion) : "",
        cvv: metodoPago === "tarjeta" ? sanitizarEntrada(formData.cvv) : "",
      }

      // Simular envío al backend
      setTimeout(() => {
        setEnviando(false)
        // Guardar datos en sessionStorage para el siguiente paso
        sessionStorage.setItem("datosPago", JSON.stringify(datosSanitizados))
        navigate(`/suscripcion/confirmacion?plan=${planId}`)
      }, 1500)
    }
  }

  // Función para volver al paso anterior
  const volverPasoAnterior = () => {
    navigate(`/suscripcion/datos?plan=${planId}`)
  }

  return (
    <div className={`contenedor ${theme === "dark" ? "dark" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>
      <main className="suscripcion-contenedor">
        <div className="suscripcion-header">
          <h1>Método de Pago</h1>
          <p>Selecciona tu método de pago preferido para completar la suscripción.</p>
        </div>

        <div className="suscripcion-pasos">
          <div className="paso completado">
            <div className="paso-numero">1</div>
            <div className="paso-texto">Elegir plan</div>
          </div>
          <div className="paso-linea completado"></div>
          <div className="paso completado">
            <div className="paso-numero">2</div>
            <div className="paso-texto">Datos personales</div>
          </div>
          <div className="paso-linea completado"></div>
          <div className="paso activo">
            <div className="paso-numero">3</div>
            <div className="paso-texto">Pago</div>
          </div>
          <div className="paso-linea"></div>
          <div className="paso">
            <div className="paso-numero">4</div>
            <div className="paso-texto">Confirmación</div>
          </div>
        </div>

        <div className="pago-container">
          <div className="resumen-pago">
            <h3>Resumen de tu Suscripción</h3>
            {planInfo && (
              <div className="plan-seleccionado">
                <div className="plan-info">
                  <h4>Plan {planInfo.tipo}</h4>
                  <p className="plan-precio">
                    ${planInfo.precio}
                    <span>{planInfo.periodo}</span>
                  </p>
                </div>
                <div className="plan-detalles">
                  <p>
                    <strong>Nombre:</strong> {datosPersonales?.nombre} {datosPersonales?.apellidos}
                  </p>
                  <p>
                    <strong>Email:</strong> {datosPersonales?.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="metodos-pago">
            <h3>Selecciona un método de pago</h3>

            <div className="metodos-tabs">
              <button
                className={`metodo-tab ${metodoPago === "tarjeta" ? "activo" : ""}`}
                onClick={() => cambiarMetodoPago("tarjeta")}
              >
                <FaCreditCard /> Tarjeta
              </button>
              <button
                className={`metodo-tab ${metodoPago === "paypal" ? "activo" : ""}`}
                onClick={() => cambiarMetodoPago("paypal")}
              >
                <FaPaypal /> PayPal
              </button>
              <button
                className={`metodo-tab ${metodoPago === "applepay" ? "activo" : ""}`}
                onClick={() => cambiarMetodoPago("applepay")}
              >
                <FaApplePay /> Apple Pay
              </button>
              <button
                className={`metodo-tab ${metodoPago === "googlepay" ? "activo" : ""}`}
                onClick={() => cambiarMetodoPago("googlepay")}
              >
                <FaGooglePay /> Google Pay
              </button>
              <button
                className={`metodo-tab ${metodoPago === "efectivo" ? "activo" : ""}`}
                onClick={() => cambiarMetodoPago("efectivo")}
              >
                <FaMoneyBillWave /> Efectivo
              </button>
            </div>

            <form className="pago-form" onSubmit={handleSubmit}>
              {metodoPago === "tarjeta" && (
                <div className="tarjeta-form">
                  <div className="campos-grid">
                    <div className="campo-formulario-sus">
                      <label htmlFor="numeroTarjeta">
                        <FaCreditCard className="form-icon-sus" /> Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        id="numeroTarjeta"
                        name="numeroTarjeta"
                        value={formData.numeroTarjeta}
                        onChange={handleChange}
                        className={errores.numeroTarjeta ? "error" : ""}
                        placeholder="0000 0000 0000 0000"
                      />
                      {errores.numeroTarjeta && (
                        <div className="error-mensaje">
                          <FaExclamationTriangle /> {errores.numeroTarjeta}
                        </div>
                      )}
                    </div>

                    <div className="campo-formulario-sus">
                      <label htmlFor="nombreTitular">
                        <FaUser className="form-icon-sus" /> Nombre del Titular
                      </label>
                      <input
                        type="text"
                        id="nombreTitular"
                        name="nombreTitular"
                        value={formData.nombreTitular}
                        onChange={handleChange}
                        className={errores.nombreTitular ? "error" : ""}
                        placeholder="Como aparece en la tarjeta"
                      />
                      {errores.nombreTitular && (
                        <div className="error-mensaje">
                          <FaExclamationTriangle /> {errores.nombreTitular}
                        </div>
                      )}
                    </div>

                    <div className="form-row tarjeta-detalles">
                      <div className="campo-formulario-sus">
                        <label htmlFor="fechaExpiracion">
                          <FaCalendarAlt className="form-icon-sus" /> Fecha de Expiración
                        </label>
                        <input
                          type="text"
                          id="fechaExpiracion"
                          name="fechaExpiracion"
                          value={formData.fechaExpiracion}
                          onChange={handleChange}
                          className={errores.fechaExpiracion ? "error" : ""}
                          placeholder="MM/YY"
                        />
                        {errores.fechaExpiracion && (
                          <div className="error-mensaje">
                            <FaExclamationTriangle /> {errores.fechaExpiracion}
                          </div>
                        )}
                      </div>

                      <div className="campo-formulario-sus">
                        <label htmlFor="cvv">
                          <FaLock className="form-icon-sus" /> Código de Seguridad
                        </label>
                        <input
                          type="password"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          className={errores.cvv ? "error" : ""}
                          placeholder="CVV"
                        />
                        {errores.cvv && (
                          <div className="error-mensaje">
                            <FaExclamationTriangle /> {errores.cvv}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {metodoPago === "paypal" && (
                <div className="metodo-alternativo">
                  <FaPaypal className="metodo-icono" />
                  <p>Serás redirigido a PayPal para completar el pago.</p>
                </div>
              )}

              {metodoPago === "applepay" && (
                <div className="metodo-alternativo">
                  <FaApplePay className="metodo-icono" />
                  <p>Serás redirigido a Apple Pay para completar el pago.</p>
                </div>
              )}

              {metodoPago === "googlepay" && (
                <div className="metodo-alternativo">
                  <FaGooglePay className="metodo-icono" />
                  <p>Serás redirigido a Google Pay para completar el pago.</p>
                </div>
              )}

              {metodoPago === "efectivo" && (
                <div className="metodo-alternativo">
                  <FaMoneyBillWave className="metodo-icono" />
                  <p>Podrás pagar en efectivo en nuestras instalaciones. Se generará un código de referencia.</p>
                </div>
              )}

              <div className="pago-seguro">
                <FaLock className="seguro-icon" />
                <p>Pago 100% seguro. Tus datos están protegidos.</p>
              </div>

              <div className="suscripcion-acciones">
                <button type="button" className="btn btn-volver" onClick={volverPasoAnterior} disabled={enviando}>
                  <FaArrowLeft /> Volver
                </button>
                <button type="submit" className="btn btn-continuar" disabled={enviando}>
                  {enviando ? "Procesando..." : "Finalizar Pago"} {!enviando && <FaArrowRight />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <FooterH />
    </div>
  )
}

export default PagoSuscripcion

