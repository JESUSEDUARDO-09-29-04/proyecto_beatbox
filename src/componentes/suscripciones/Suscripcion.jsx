"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import DOMPurify from "dompurify"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import "./Suscripcion.css"
import { FaCheck, FaArrowRight } from "react-icons/fa"
import { verificarSesion } from "../../utils/verificarSesion" // ajusta el path si cambia



const Suscripcion = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useContext(ThemeContext)
  const [planSeleccionado, setPlanSeleccionado] = useState(null)

  // Planes de suscripción
  const planes = [
    {
      id: 1,
      tipo: "Semanal",
      precio: "199",
      periodo: "/semana",
      destacado: false,
      caracteristicas: [
        "Acceso a sala de pesas",
        "Horario limitado (8am - 5pm)",
        "2 clases grupales",
        "Casillero estándar",
        "Asesoría básica",
      ],
    },
    {
      id: 2,
      tipo: "Mensual",
      precio: "599",
      periodo: "/mes",
      destacado: true,
      caracteristicas: [
        "Acceso ilimitado 24/7",
        "Todas las clases grupales",
        "1 sesión con entrenador personal",
        "Casillero premium",
        "Acceso a sauna y spa",
      ],
    },
  ]

  // Verificar si hay un plan seleccionado en la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const planId = params.get("plan")
    if (planId) {
      const plan = planes.find((p) => p.id === Number.parseInt(planId))
      if (plan) {
        setPlanSeleccionado(plan.id)
      }
    }
  }, [location.search])

  // Función para sanitizar entradas
  const sanitizarEntrada = (input) => {
    if (!input) return ""
    return DOMPurify.sanitize(input)
  }

  // Función para seleccionar un plan
  const seleccionarPlan = (id) => {
    setPlanSeleccionado(id)
  }

  // Función para continuar al siguiente paso
const continuarProceso = async () => {
  const usuario = await verificarSesion()
  if (!usuario) {
    navigate("/iniciar-sesion", {
      state: { aviso: "Primero debes iniciar sesión para poder suscribirte." }
    })
    return
  }

  if (planSeleccionado) {
    navigate(`/suscripcion/datos?plan=${planSeleccionado}`)
  }
}


  return (
    <div className={`contenedor ${theme === "dark" ? "dark" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>
      <main className="suscripcion-contenedor">
        <div className="suscripcion-header">
          <h1>Elige tu Plan de Suscripción</h1>
          <p>Selecciona el plan que mejor se adapte a tus necesidades y objetivos de entrenamiento.</p>
        </div>

        <div className="suscripcion-pasos">
          <div className="paso activo">
            <div className="paso-numero">1</div>
            <div className="paso-texto">Elegir plan</div>
          </div>
          <div className="paso-linea"></div>
          <div className="paso">
            <div className="paso-numero">2</div>
            <div className="paso-texto">Datos personales</div>
          </div>
          <div className="paso-linea"></div>
          <div className="paso">
            <div className="paso-numero">3</div>
            <div className="paso-texto">Pago</div>
          </div>
          <div className="paso-linea"></div>
          <div className="paso">
            <div className="paso-numero">4</div>
            <div className="paso-texto">Confirmación</div>
          </div>
        </div>

        <div className="planes-container">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.destacado ? "destacado" : ""} ${planSeleccionado === plan.id ? "seleccionado" : ""}`}
              onClick={() => seleccionarPlan(plan.id)}
            >
              {plan.destacado && <div className="plan-badge">Popular</div>}
              <div className="plan-header">
                <h3>{plan.tipo}</h3>
                <div className="plan-precio">
                  <span className="precio">${plan.precio}</span>
                  <span className="periodo">{plan.periodo}</span>
                </div>
              </div>
              <div className="plan-body">
                <ul className="plan-features">
                  {plan.caracteristicas.map((caracteristica, index) => (
                    <li key={index}>
                      <FaCheck className="check-icon" /> {caracteristica}
                    </li>
                  ))}
                </ul>
                <div className={`plan-seleccion ${planSeleccionado === plan.id ? "seleccionado" : ""}`}>
                  {planSeleccionado === plan.id ? "Seleccionado" : "Seleccionar"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="suscripcion-acciones">
          <button className="btn btn-volver" onClick={() => navigate("/")}>
            Volver
          </button>
          <button className="btn btn-continuar" onClick={continuarProceso} disabled={!planSeleccionado}>
            Continuar <FaArrowRight />
          </button>
        </div>
      </main>

      <FooterH />
    </div>
  )
}

export default Suscripcion

