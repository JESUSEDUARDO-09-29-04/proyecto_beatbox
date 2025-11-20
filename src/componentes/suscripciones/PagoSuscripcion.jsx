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
import { FaArrowLeft, FaArrowRight, FaLock, FaPaypal, FaMoneyBillWave } from "react-icons/fa"

const PagoSuscripcion = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useContext(ThemeContext)
  const [planId, setPlanId] = useState(null)
  const [datosPersonales, setDatosPersonales] = useState(null)
  const [metodoPago, setMetodoPago] = useState("paypal")
  const [formData, setFormData] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaExpiracion: "",
    cvv: "",
  })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [planInfo, setPlanInfo] = useState(null)

  // Verificar autenticación - CORREGIDO
  useEffect(() => {
    const checarUsuario = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))

        const usuario = await Promise.race([verificarSesion(), timeoutPromise])

        if (!usuario) {
          navigate("/iniciar-sesion")
        }
      } catch (error) {
        console.error("Error al verificar usuario:", error)
        navigate("/iniciar-sesion")
      }
    }

    checarUsuario()
  }, [navigate])

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
    // Como solo tenemos PayPal y Efectivo, no necesitamos validar campos de tarjeta
    return true
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

        <div className="suscripcion-pasos-sub">
          <div className="paso-sub completado">
            <div className="paso-numero-sub">1</div>
            <div className="paso-texto-sub">Elegir plan</div>
          </div>
          <div className="paso-linea-sub completada"></div>
          <div className="paso-sub completado">
            <div className="paso-numero-sub">2</div>
            <div className="paso-texto-sub">Datos personales</div>
          </div>
          <div className="paso-linea-sub completada"></div>
          <div className="paso-sub activo">
            <div className="paso-numero-sub">3</div>
            <div className="paso-texto-sub">Pago</div>
          </div>
          <div className="paso-linea-sub"></div>
          <div className="paso-sub">
            <div className="paso-numero-sub">4</div>
            <div className="paso-texto-sub">Confirmación</div>
          </div>
        </div>

        <div className="pago-container-sub">
          <div className="resumen-pago-sub">
            <h3>Resumen de tu Suscripción</h3>
            {planInfo && (
              <div className="plan-seleccionado-sub">
                <div className="plan-info-sub">
                  <h4>Plan {planInfo.tipo}</h4>
                  <p className="plan-precio-resumen-sub">
                    ${planInfo.precio}
                    <span>{planInfo.periodo}</span>
                  </p>
                </div>
                <div className="plan-detalles-sub">
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

          <div className="metodos-pago-sub">
            <h3>Selecciona un método de pago</h3>

            <div className="metodos-tabs-sub">
              <button
                className={`metodo-tab-sub ${metodoPago === "paypal" ? "activo" : ""}`}
                onClick={() => cambiarMetodoPago("paypal")}
              >
                <FaPaypal /> PayPal
              </button>
              <button
                className={`metodo-tab-sub ${metodoPago === "efectivo" ? "activo" : ""}`}
                onClick={() => cambiarMetodoPago("efectivo")}
              >
                <FaMoneyBillWave /> Efectivo
              </button>
            </div>

            <form className="pago-form-sub" onSubmit={handleSubmit}>
              {metodoPago === "paypal" && (
                <div className="metodo-alternativo-sub">
                  <FaPaypal className="metodo-icono-sub" />
                  <p>Serás redirigido a PayPal para completar el pago de forma segura.</p>
                </div>
              )}

              {metodoPago === "efectivo" && (
                <div className="metodo-alternativo-sub">
                  <FaMoneyBillWave className="metodo-icono-sub" />
                  <p>
                    Podrás pagar en efectivo en nuestras instalaciones. Se generará un código de referencia que deberás
                    presentar en recepción.
                  </p>
                </div>
              )}

              <div className="pago-seguro-sub">
                <FaLock className="seguro-icon-sub" />
                <p>Pago 100% seguro. Tus datos están protegidos.</p>
              </div>

              <div className="suscripcion-acciones-sub">
                <button
                  type="button"
                  className="btn-sub btn-volver-sub"
                  onClick={volverPasoAnterior}
                  disabled={enviando}
                >
                  <FaArrowLeft /> Volver
                </button>
                <button type="submit" className="btn-sub btn-continuar-sub" disabled={enviando}>
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
