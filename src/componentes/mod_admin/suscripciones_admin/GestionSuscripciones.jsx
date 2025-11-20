"use client"

import { useState, useContext } from "react"
import { ThemeContext } from "../../../context/ThemeContext"
import "./GestionSuscripciones.css"
import { FaPlay, FaClock, FaUser, FaCalendarAlt, FaEnvelope, FaPhone } from "react-icons/fa"

const GestionSuscripciones = () => {
  const { theme } = useContext(ThemeContext)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalType, setModalType] = useState("info") // info, activacion
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState(null)
  const [tiempoActiva, setTiempoActiva] = useState("")

  // Datos simulados para la vista
  const [suscripciones, setSuscripciones] = useState([
    {
      id: 1,
      usuario: "Juan Pérez",
      correo_electronico: "juan@email.com",
      telefono: "1234567890",
      plan: "Mensual",
      precio: "$599",
      fecha_suscripcion: "2024-01-15",
      estado: "pendiente",
      tiempo_activa: null,
      fecha_nacimiento: "1990-05-15",
      emergencia_nombre: "María Pérez",
      emergencia_telefono: "0987654321",
    },
    {
      id: 2,
      usuario: "Ana García",
      correo_electronico: "ana@email.com",
      telefono: "2345678901",
      plan: "Semanal",
      precio: "$199",
      fecha_suscripcion: "2024-01-20",
      estado: "activa",
      tiempo_activa: "30 días",
      fecha_nacimiento: "1985-08-22",
      emergencia_nombre: "Carlos García",
      emergencia_telefono: "1987654321",
    },
    {
      id: 3,
      usuario: "Luis Rodríguez",
      correo_electronico: "luis@email.com",
      telefono: "3456789012",
      plan: "Mensual",
      precio: "$599",
      fecha_suscripcion: "2024-01-25",
      estado: "pendiente",
      tiempo_activa: null,
      fecha_nacimiento: "1992-12-10",
      emergencia_nombre: "Carmen Rodríguez",
      emergencia_telefono: "2987654321",
    },
    {
      id: 4,
      usuario: "María López",
      correo_electronico: "maria@email.com",
      telefono: "4567890123",
      plan: "Anual",
      precio: "$5999",
      fecha_suscripcion: "2024-01-10",
      estado: "activa",
      tiempo_activa: "1 año",
      fecha_nacimiento: "1988-03-18",
      emergencia_nombre: "Pedro López",
      emergencia_telefono: "3987654321",
    },
    {
      id: 5,
      usuario: "Carlos Martínez",
      correo_electronico: "carlos@email.com",
      telefono: "5678901234",
      plan: "Semanal",
      precio: "$199",
      fecha_suscripcion: "2024-01-28",
      estado: "pendiente",
      tiempo_activa: null,
      fecha_nacimiento: "1995-07-22",
      emergencia_nombre: "Ana Martínez",
      emergencia_telefono: "4987654321",
    },
  ])

  const cerrarModal = () => {
    setModalVisible(false)
    setModalMessage("")
    setModalType("info")
    setSuscripcionSeleccionada(null)
    setTiempoActiva("")
  }

  const abrirModalActivacion = (suscripcion) => {
    setSuscripcionSeleccionada(suscripcion)
    setTiempoActiva(suscripcion.tiempo_activa || "")
    setModalType("activacion")
    setModalVisible(true)
  }

  const activarSuscripcion = (e) => {
    e.preventDefault()

    if (!tiempoActiva.trim()) {
      setModalMessage("El tiempo activo es obligatorio.")
      setModalType("info")
      return
    }

    // Simular proceso de activación
    setModalMessage("Procesando activación...")
    setModalType("info")

    setTimeout(() => {
      // Actualizar el estado de la suscripción
      setSuscripciones((prev) =>
        prev.map((suscripcion) =>
          suscripcion.id === suscripcionSeleccionada.id
            ? {
                ...suscripcion,
                tiempo_activa: tiempoActiva,
                estado: "activa",
                fecha_activacion: new Date().toLocaleDateString("es-ES"),
              }
            : suscripcion,
        ),
      )

      setModalMessage(`✅ Suscripción de ${suscripcionSeleccionada.usuario} activada exitosamente por ${tiempoActiva}.`)
      setModalType("info")
      setSuscripcionSeleccionada(null)
      setTiempoActiva("")

      // Auto-cerrar modal después de 2 segundos
      setTimeout(() => {
        cerrarModal()
      }, 2000)
    }, 1500)
  }

  const renderModal = () => {
    if (modalType === "activacion" && suscripcionSeleccionada) {
      return (
        <div className="custom-modal form-modal">
          <button className="custom-modal-close" onClick={cerrarModal}>
            &times;
          </button>
          <h2>Activar Suscripción</h2>

          {/* Datos de la suscripción */}
          <div className="suscripcion-datos">
            <h3>Datos de la Suscripción</h3>
            <div className="datos-grid">
              <div className="dato-item">
                <FaUser className="dato-icon" />
                <span>Usuario:</span>
                <strong>{suscripcionSeleccionada.usuario}</strong>
              </div>
              <div className="dato-item">
                <FaEnvelope className="dato-icon" />
                <span>Email:</span>
                <strong>{suscripcionSeleccionada.correo_electronico}</strong>
              </div>
              <div className="dato-item">
                <FaPhone className="dato-icon" />
                <span>Teléfono:</span>
                <strong>{suscripcionSeleccionada.telefono}</strong>
              </div>
              <div className="dato-item">
                <FaCalendarAlt className="dato-icon" />
                <span>Plan:</span>
                <strong>
                  {suscripcionSeleccionada.plan} - {suscripcionSeleccionada.precio}
                </strong>
              </div>
              <div className="dato-item">
                <FaCalendarAlt className="dato-icon" />
                <span>Fecha Suscripción:</span>
                <strong>{suscripcionSeleccionada.fecha_suscripcion}</strong>
              </div>
              <div className="dato-item">
                <FaCalendarAlt className="dato-icon" />
                <span>Fecha Nacimiento:</span>
                <strong>{suscripcionSeleccionada.fecha_nacimiento}</strong>
              </div>
              <div className="dato-item">
                <FaUser className="dato-icon" />
                <span>Contacto Emergencia:</span>
                <strong>{suscripcionSeleccionada.emergencia_nombre}</strong>
              </div>
              <div className="dato-item">
                <FaPhone className="dato-icon" />
                <span>Teléfono Emergencia:</span>
                <strong>{suscripcionSeleccionada.emergencia_telefono}</strong>
              </div>
            </div>
          </div>

          <form onSubmit={activarSuscripcion}>
            <div className="form-group">
              <label htmlFor="tiempo_activa">
                <FaClock className="form-icon" />
                Tiempo Activo:
              </label>
              <input
                type="text"
                id="tiempo_activa"
                value={tiempoActiva}
                onChange={(e) => setTiempoActiva(e.target.value)}
                placeholder="Ej: 30 días, 1 mes, 1 año"
                required
              />
              <small className="form-help">
                Especifica la duración de la suscripción (ej: "30 días", "1 mes", "1 año")
              </small>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button type="submit" className="btn-activar">
                <FaPlay /> Activar Suscripción
              </button>
            </div>
          </form>
        </div>
      )
    }

    return (
      <div className="custom-modal">
        <button className="custom-modal-close" onClick={cerrarModal}>
          &times;
        </button>
        <h2>Información</h2>
        <p>{modalMessage}</p>
      </div>
    )
  }

  return (
    <div className={`suscripciones-admin-contenedor ${theme === "dark" ? "dark" : ""}`}>
      <header className="suscripciones-admin-header">
        <h1>Gestión de Suscripciones</h1>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{suscripciones.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{suscripciones.filter((s) => s.estado === "activa").length}</span>
            <span className="stat-label">Activas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{suscripciones.filter((s) => s.estado === "pendiente").length}</span>
            <span className="stat-label">Pendientes</span>
          </div>
        </div>
      </header>

      <div className="table-responsive">
        <table className="suscripciones-tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Tiempo Activo</th>
              <th>Fecha Suscripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suscripciones.map((suscripcion) => (
              <tr key={suscripcion.id}>
                <td data-label="Usuario">{suscripcion.usuario}</td>
                <td data-label="Email">{suscripcion.correo_electronico}</td>
                <td data-label="Plan">{suscripcion.plan}</td>
                <td data-label="Precio">{suscripcion.precio}</td>
                <td data-label="Estado">
                  <span className={`estado-badge ${suscripcion.estado}`}>
                    {suscripcion.estado === "activa" ? "Activa" : "Pendiente"}
                  </span>
                </td>
                <td data-label="Tiempo Activo">{suscripcion.tiempo_activa || "No definido"}</td>
                <td data-label="Fecha Suscripción">{suscripcion.fecha_suscripcion}</td>
                <td data-label="Acciones">
                  <div className="button-group">
                    <button
                      className="btn-activar-suscripcion"
                      onClick={() => abrirModalActivacion(suscripcion)}
                      disabled={suscripcion.estado === "activa"}
                    >
                      <FaPlay /> {suscripcion.estado === "activa" ? "Activada" : "Activar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalVisible && <div className="custom-modal-overlay">{renderModal()}</div>}
    </div>
  )
}

export default GestionSuscripciones
