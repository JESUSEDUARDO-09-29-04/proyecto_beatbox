"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import "./Suscripcion.css"
import {
  FaDownload,
  FaHome,
  FaCalendarAlt,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaPaypal,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa"

const ConfirmacionSuscripcion = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useContext(ThemeContext)
  const [planId, setPlanId] = useState(null)
  const [datosPersonales, setDatosPersonales] = useState(null)
  const [datosPago, setDatosPago] = useState(null)
  const [planInfo, setPlanInfo] = useState(null)
  const [numeroReferencia, setNumeroReferencia] = useState("")
  const [fechaSuscripcion, setFechaSuscripcion] = useState("")

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

  // Verificar si hay un plan seleccionado en la URL y datos en sessionStorage
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
    const datosPersonalesGuardados = sessionStorage.getItem("datosSuscripcion")
    const datosPagoGuardados = sessionStorage.getItem("datosPago")

    if (!datosPersonalesGuardados || !datosPagoGuardados) {
      navigate(`/suscripcion`)
      return
    }

    try {
      const datosPersonales = JSON.parse(datosPersonalesGuardados)
      const datosPago = JSON.parse(datosPagoGuardados)
      setDatosPersonales(datosPersonales)
      setDatosPago(datosPago)

      // Generar número de referencia aleatorio
      const referencia = generarNumeroReferencia()
      setNumeroReferencia(referencia)

      // Establecer fecha de suscripción (hoy)
      const hoy = new Date()
      setFechaSuscripcion(formatearFecha(hoy))
    } catch (error) {
      console.error("Error al parsear datos:", error)
      navigate(`/suscripcion`)
    }
  }, [location.search, navigate])

  // Función para generar un número de referencia aleatorio
  const generarNumeroReferencia = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let resultado = ""
    for (let i = 0; i < 10; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    return resultado
  }

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    const dia = fecha.getDate().toString().padStart(2, "0")
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0")
    const anio = fecha.getFullYear()
    return `${dia}/${mes}/${anio}`
  }

  // Función para volver al inicio
  const volverInicio = () => {
    // Limpiar datos de sessionStorage
    sessionStorage.removeItem("datosSuscripcion")
    sessionStorage.removeItem("datosPago")
    navigate("/")
  }

  // Función para simular la descarga del comprobante
  const descargarComprobante = () => {
    alert("Descargando comprobante de suscripción...")
  }

  // Función para obtener el último 4 dígitos de la tarjeta
  const obtenerUltimosDigitos = () => {
    if (datosPago?.metodoPago === "tarjeta" && datosPago?.numeroTarjeta) {
      const numeroSinEspacios = datosPago.numeroTarjeta.replace(/\s/g, "")
      return numeroSinEspacios.slice(-4)
    }
    return ""
  }

  // Función para obtener el nombre del método de pago
  const obtenerNombreMetodoPago = () => {
    switch (datosPago?.metodoPago) {
      case "tarjeta":
        return "Tarjeta de Crédito/Débito"
      case "paypal":
        return "PayPal"
      case "applepay":
        return "Apple Pay"
      case "googlepay":
        return "Google Pay"
      case "efectivo":
        return "Efectivo"
      default:
        return "Desconocido"
    }
  }

  return (
    <div className={`contenedor ${theme === "dark" ? "dark" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>
      <main className="suscripcion-contenedor">
        <div className="confirmacion-banner-sub">
          <h2>¡Suscripción Completada!</h2>
          <p>Tu suscripción ha sido procesada correctamente. A continuación encontrarás los detalles de tu plan.</p>
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
          <div className="paso-sub completado">
            <div className="paso-numero-sub">3</div>
            <div className="paso-texto-sub">Pago</div>
          </div>
          <div className="paso-linea-sub completada"></div>
          <div className="paso-sub completado">
            <div className="paso-numero-sub">4</div>
            <div className="paso-texto-sub">Confirmación</div>
          </div>
        </div>

        <div className="detalles-container-sub">
          <div className="detalles-card-sub">
            <div className="detalles-header-sub">
              <h2>Detalles de la Suscripción</h2>
              <div className="referencia-badge-sub">
                Referencia: <span>{numeroReferencia}</span>
              </div>
            </div>

            <div className="detalles-content-sub">
              <div className="detalles-section-sub">
                <h3>Plan Seleccionado</h3>
                <div className="detalles-grid-sub">
                  <div className="detalles-item-sub">
                    <span>Plan:</span>
                    <strong>{planInfo?.tipo}</strong>
                  </div>
                  <div className="detalles-item-sub">
                    <span>Precio:</span>
                    <strong>
                      ${planInfo?.precio}
                      {planInfo?.periodo}
                    </strong>
                  </div>
                  <div className="detalles-item-sub">
                    <span>Fecha:</span>
                    <strong>{fechaSuscripcion}</strong>
                  </div>
                </div>
              </div>

              <div className="detalles-section-sub">
                <h3>Datos Personales</h3>
                <div className="detalles-grid-sub">
                  <div className="detalles-item-sub">
                    <FaIdCard className="detalles-icon-sub" />
                    <span>Nombre:</span>
                    <strong className="nombre-completo-sub">
                      {datosPersonales?.nombre} {datosPersonales?.apellidos}
                    </strong>
                  </div>
                  <div className="detalles-item-sub">
                    <FaEnvelope className="detalles-icon-sub" />
                    <span>Email:</span>
                    <strong className="email-texto-sub">{datosPersonales?.email}</strong>
                  </div>
                  <div className="detalles-item-sub">
                    <FaPhone className="detalles-icon-sub" />
                    <span>Teléfono:</span>
                    <strong>{datosPersonales?.telefono}</strong>
                  </div>
                  <div className="detalles-item-sub">
                    <FaCalendarAlt className="detalles-icon-sub" />
                    <span>Nacimiento:</span>
                    <strong>{datosPersonales?.fechaNacimiento}</strong>
                  </div>

                  {/* Mostrar información del tutor si es menor de edad */}
                  {datosPersonales?.esMenorDeEdad && (
                    <>
                      <div className="detalles-item-sub tutor-info-sub">
                        <span colSpan="2">Información del Tutor:</span>
                      </div>
                      <div className="detalles-item-sub">
                        <FaUser className="detalles-icon-sub" />
                        <span>Tutor:</span>
                        <strong>{datosPersonales?.tutorNombre}</strong>
                      </div>
                      <div className="detalles-item-sub">
                        <FaPhone className="detalles-icon-sub" />
                        <span>Teléfono:</span>
                        <strong>{datosPersonales?.tutorTelefono}</strong>
                      </div>
                      <div className="detalles-item-sub">
                        <FaIdCard className="detalles-icon-sub" />
                        <span>Parentesco:</span>
                        <strong>{datosPersonales?.parentesco}</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="detalles-section-sub">
                <h3>Método de Pago</h3>
                <div className="detalles-grid-sub">
                  <div className="detalles-item-sub">
                    {datosPago?.metodoPago === "tarjeta" && <FaCreditCard className="detalles-icon-sub" />}
                    {datosPago?.metodoPago === "paypal" && <FaPaypal className="detalles-icon-sub" />}
                    {datosPago?.metodoPago === "efectivo" && <FaMoneyBillWave className="detalles-icon-sub" />}
                    <span>Método:</span>
                    <strong>{obtenerNombreMetodoPago()}</strong>
                  </div>

                  {datosPago?.metodoPago === "tarjeta" && (
                    <div className="detalles-item-sub">
                      <FaCreditCard className="detalles-icon-sub" />
                      <span>Tarjeta:</span>
                      <strong>**** **** **** {obtenerUltimosDigitos()}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="detalles-instrucciones-sub">
              <h3>Próximos Pasos</h3>
              <p>
                Hemos enviado un correo electrónico a{" "}
                <strong className="email-texto-sub">{datosPersonales?.email}</strong> con los detalles de tu
                suscripción.
                {datosPago?.metodoPago === "efectivo"
                  ? " Por favor, presenta el código de referencia en nuestras instalaciones para completar el pago."
                  : " Tu membresía ya está activa y puedes comenzar a disfrutar de nuestras instalaciones de inmediato."}
              </p>
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            </div>

            <div className="detalles-acciones-sub">
              <button className="btn-descargar-sub" onClick={descargarComprobante}>
                <FaDownload /> Descargar Comprobante
              </button>
              <button className="btn-inicio-sub" onClick={volverInicio}>
                <FaHome /> Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </main>

      <FooterH />
    </div>
  )
}

export default ConfirmacionSuscripcion
