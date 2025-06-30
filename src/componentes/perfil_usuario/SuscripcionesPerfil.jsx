"use client"

import { useState, useEffect } from "react"
import {
  FaCreditCard,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaArrowRight,
  FaDownload,
  FaExchangeAlt,
} from "react-icons/fa"
import "./SuscripcionesPerfil.css"
import { useNavigate } from "react-router-dom"

const SuscripcionesPerfil = ({ userData }) => {
  const [suscripcionActual, setSuscripcionActual] = useState(null)
  const [historialPagos, setHistorialPagos] = useState([])
  const [planesMejora, setPlanesMejora] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()


  useEffect(() => {
    // Simular carga de datos desde una API
    setTimeout(() => {
      const suscripcionSimulada = {
        tipo: "Plan Mensual",
        estado: "Activo",
        fechaInicio: "2023-05-01",
        fechaRenovacion: "2023-06-01",
        precio: "599.00",
        metodoPago: "Tarjeta terminada en 4532",
        beneficios: [
          "Acceso ilimitado 24/7",
          "Todas las clases grupales",
          "1 sesión con entrenador personal",
          "Casillero premium",
          "Acceso a sauna y spa",
        ],
      }

      const historialSimulado = [
        {
          id: "PAY123456",
          fecha: "2023-05-01",
          concepto: "Renovación Plan Mensual",
          monto: "599.00",
          estado: "Pagado",
        },
        {
          id: "PAY123455",
          fecha: "2023-04-01",
          concepto: "Renovación Plan Mensual",
          monto: "599.00",
          estado: "Pagado",
        },
        {
          id: "PAY123454",
          fecha: "2023-03-01",
          concepto: "Renovación Plan Mensual",
          monto: "599.00",
          estado: "Pagado",
        },
      ]

      const planesMejoraSimulados = [
        {
          id: 1,
          tipo: "Plan Anual",
          precio: "5,999.00",
          ahorro: "1,189.00",
          beneficios: [
            "Todos los beneficios del plan mensual",
            "12 sesiones con entrenador personal",
            "2 meses gratis",
          ],
        },
        {
          id: 2,
          tipo: "Plan Premium",
          precio: "899.00",
          periodo: "mensual",
          beneficios: [
            "Todos los beneficios del plan mensual",
            "4 sesiones con entrenador personal",
            "Nutricionista personal",
            "Acceso VIP a todas las instalaciones",
          ],
        },
      ]

      setSuscripcionActual(suscripcionSimulada)
      setHistorialPagos(historialSimulado)
      setPlanesMejora(planesMejoraSimulados)
      setCargando(false)
    }, 800)
  }, [])

  const calcularDiasRestantes = () => {
    if (!suscripcionActual?.fechaRenovacion) return 0

    const fechaActual = new Date()
    const fechaRenovacion = new Date(suscripcionActual.fechaRenovacion)
    const diferencia = fechaRenovacion.getTime() - fechaActual.getTime()
    return Math.max(0, Math.ceil(diferencia / (1000 * 3600 * 24)))
  }

  const descargarFactura = (idPago) => {
    console.log(`Descargando factura para el pago ${idPago}`)
    alert(`Se está generando la factura para el pago ${idPago}. La descarga comenzará pronto.`)
  }

  const mejorarPlan = (planId) => {
    console.log(`Mejorando al plan ID: ${planId}`)
    navigate.push("/suscripcion?plan=" + planId)
  }

  if (cargando) {
    return (
      <div className="cargando-container">
        <div className="cargando-spinner"></div>
        <p>Cargando información de suscripción...</p>
      </div>
    )
  }

  return (
    <div className="suscripciones-container">
      <div className="datos-header">
        <h1>Mi Suscripción</h1>
        <p>Revisa los detalles de tu suscripción actual, historial de pagos y opciones para mejorar tu plan.</p>
      </div>

      <div className="suscripcion-content">
        <div className="suscripcion-actual">
          <div className="suscripcion-card">
            <div className="suscripcion-header">
              <h2>Plan Actual</h2>
              <div className={`suscripcion-estado ${suscripcionActual?.estado?.toLowerCase()}`}>
                <FaCheckCircle />
                <span>{suscripcionActual?.estado}</span>
              </div>
            </div>

            <div className="suscripcion-details">
              <h3>{suscripcionActual?.tipo}</h3>
              <p className="suscripcion-precio">
                ${suscripcionActual?.precio} <span className="periodo-precio">/ mes</span>
              </p>

              <div className="suscripcion-fechas">
                <div className="fecha-item">
                  <FaCalendarAlt />
                  <div>
                    <span>Inicio:</span>
                    <strong>{suscripcionActual?.fechaInicio}</strong>
                  </div>
                </div>
                <div className="fecha-item">
                  <FaCalendarAlt />
                  <div>
                    <span>Próxima renovación:</span>
                    <strong>{suscripcionActual?.fechaRenovacion}</strong>
                  </div>
                </div>
              </div>

              <div className="suscripcion-renovacion">
                <div className="renovacion-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((30 - calcularDiasRestantes()) / 30) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="dias-restantes">
                    <span>{calcularDiasRestantes()} días restantes</span>
                  </div>
                </div>
              </div>

              <div className="suscripcion-pago">
                <FaCreditCard />
                <span>Método de pago: {suscripcionActual?.metodoPago}</span>
              </div>

              <div className="suscripcion-beneficios">
                <h4>Beneficios Incluidos:</h4>
                <ul>
                  {suscripcionActual?.beneficios.map((beneficio, index) => (
                    <li key={index}>
                      <FaCheckCircle className="beneficio-icon" />
                      {beneficio}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="suscripcion-actions">
                <button className="btn-cambiar-pago">
                  <FaExchangeAlt /> Cambiar Método de Pago
                </button>
                <button className="btn-cancelar">Cancelar Suscripción</button>
              </div>
            </div>
          </div>
        </div>

        <div className="suscripcion-secondary">
          <div className="historial-pagos">
            <h2>
              <FaHistory /> Historial de Pagos
            </h2>
            <div className="pagos-tabla">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historialPagos.map((pago) => (
                    <tr key={pago.id}>
                      <td>{pago.fecha}</td>
                      <td>{pago.concepto}</td>
                      <td>${pago.monto}</td>
                      <td>
                        <span className={`estado-pago ${pago.estado.toLowerCase()}`}>
                          {pago.estado === "Pagado" && <FaCheckCircle />}
                          {pago.estado === "Pendiente" && <FaExclamationTriangle />}
                          {pago.estado}
                        </span>
                      </td>
                      <td>
                        <button className="btn-factura" onClick={() => descargarFactura(pago.id)}>
                          <FaDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {historialPagos.length === 0 && (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No hay pagos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mejora-planes">
            <h2>
              <FaArrowRight /> Mejora Tu Plan
            </h2>
            <div className="planes-grid">
              {planesMejora.map((plan) => (
                <div className="plan-mejora-card" key={plan.id}>
                  <h3>{plan.tipo}</h3>
                  <p className="plan-precio">
                    ${plan.precio}
                    {plan.periodo && <span className="periodo-precio">/{plan.periodo}</span>}
                  </p>
                  {plan.ahorro && <div className="plan-ahorro">Ahorra ${plan.ahorro}</div>}
                  <ul className="plan-beneficios">
                    {plan.beneficios.map((beneficio, index) => (
                      <li key={index}>
                        <FaCheckCircle className="beneficio-icon" />
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-mejorar" onClick={() => mejorarPlan(plan.id)}>
                    Mejorar Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuscripcionesPerfil

