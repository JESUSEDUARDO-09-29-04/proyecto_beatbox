"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./IncidentesAdmin.css"
import { FaEye, FaExclamationTriangle, FaLock, FaUnlock, FaCalendarAlt, FaHistory } from "react-icons/fa"

const IncidentesAdmin = () => {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])
  const [incidencia, setIncidencia] = useState(null)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [mensajeError, setMensajeError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [filtro, setFiltro] = useState("")

  useEffect(() => {
    const verificarRol = async () => {
      try {
        const userResponse = await fetch("http://localhost:3000/auth/validate-user", {
          method: "GET",
          credentials: "include",
        })

        if (!userResponse.ok) {
          navigate("/iniciar-sesion")
        } else {
          const userData = await userResponse.json()
          if (userData.role !== "admin") {
            navigate("/iniciar-sesion")
          }
        }
      } catch (error) {
        console.error("Error de red al verificar usuario:", error)
      }
    }

    verificarRol()
  }, [navigate])

  useEffect(() => {
    const cargarUsuarios = async () => {
      setCargando(true)
      try {
        const response = await fetch("http://localhost:3000/usuarios", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        setUsuarios(data)
      } catch (error) {
        console.error("Error al cargar usuarios:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarUsuarios()
  }, [])

  const verIncidencias = async (usuario) => {
    if (!usuario || !usuario.id) {
      console.error("ID de usuario no definido:", usuario)
      return
    }

    setUsuarioSeleccionado(usuario.usuario)
    setCargando(true)
    setMensajeError("")

    try {
      const response = await fetch(`http://localhost:3000/incident/${usuario.id}`, {
        method: "GET",
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        setMensajeError(data.message || "Error al obtener las incidencias.")
        setIncidencia(null)
      } else {
        setIncidencia(data)
      }

      setModalVisible(true)
    } catch (error) {
      console.error("Error al cargar incidencia:", error)
      setMensajeError("Error de red al cargar las incidencias.")
      setIncidencia(null)
      setModalVisible(true)
    } finally {
      setCargando(false)
    }
  }

  const cerrarModal = () => {
    setModalVisible(false)
    setUsuarioSeleccionado("")
    setIncidencia(null)
    setMensajeError("")
  }

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value.toLowerCase())
  }

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.usuario?.toLowerCase().includes(filtro) ||
      usuario.correo_Electronico?.toLowerCase().includes(filtro) ||
      usuario.role?.toLowerCase().includes(filtro),
  )

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible"

    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  return (
    <div className="incidentes-container">
      <div className="incidentes-header">
        <h1>Gestión de Incidencias</h1>
        <div className="incidentes-search">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o rol..."
            value={filtro}
            onChange={handleFiltroChange}
            className="incidentes-search-input"
          />
        </div>
      </div>

      {cargando && !modalVisible ? (
        <div className="incidentes-loading">
          <div className="incidentes-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <div className="incidentes-table-container">
          <table className="incidentes-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario._id || usuario.id}>
                    <td data-label="Usuario">{usuario.usuario}</td>
                    <td data-label="Email">{usuario.correo_Electronico}</td>
                    <td data-label="Rol" className={`rol ${usuario.role}`}>
                      {usuario.role}
                    </td>
                    <td data-label="Acciones">
                      <button
                        className="btn-ver-incidencias"
                        onClick={() => verIncidencias(usuario)}
                        aria-label={`Ver incidencias de ${usuario.usuario}`}
                      >
                        <FaEye className="btn-icon" /> Ver Incidencias
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    No se encontraron usuarios que coincidan con la búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalVisible && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-incidentes" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal} aria-label="Cerrar modal">
              &times;
            </button>

            <div className="modal-header">
              <h2>
                <FaExclamationTriangle className="modal-icon" />
                Incidencias de {usuarioSeleccionado}
              </h2>
            </div>

            <div className="modal-content">
              {cargando ? (
                <div className="modal-loading">
                  <div className="incidentes-spinner"></div>
                  <p>Cargando incidencias...</p>
                </div>
              ) : mensajeError ? (
                <div className="modal-error">
                  <p>{mensajeError}</p>
                </div>
              ) : incidencia ? (
                <div className="incidencia-details">
                  <div className="incidencia-item">
                    <FaHistory className="incidencia-icon" />
                    <div className="incidencia-info">
                      <span className="incidencia-label">Intentos fallidos:</span>
                      <span className="incidencia-value">{incidencia.totalfailedattempts || 0}</span>
                    </div>
                  </div>

                  <div className="incidencia-item">
                    {incidencia.isblocked ? (
                      <FaLock className="incidencia-icon blocked" />
                    ) : (
                      <FaUnlock className="incidencia-icon unblocked" />
                    )}
                    <div className="incidencia-info">
                      <span className="incidencia-label">Estado:</span>
                      <span className={`incidencia-value ${incidencia.isblocked ? "blocked" : "unblocked"}`}>
                        {incidencia.isblocked ? "Bloqueado" : "No Bloqueado"}
                      </span>
                    </div>
                  </div>

                  {incidencia.lastattempts && (
                    <div className="incidencia-item">
                      <FaCalendarAlt className="incidencia-icon" />
                      <div className="incidencia-info">
                        <span className="incidencia-label">Último intento:</span>
                        <span className="incidencia-value">{formatearFecha(incidencia.lastattempts)}</span>
                      </div>
                    </div>
                  )}

                  {incidencia.isblocked && incidencia.blockexpiresat && (
                    <div className="incidencia-item">
                      <FaCalendarAlt className="incidencia-icon expiry" />
                      <div className="incidencia-info">
                        <span className="incidencia-label">Desbloqueo programado:</span>
                        <span className="incidencia-value expiry">{formatearFecha(incidencia.blockexpiresat)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-incidencias">
                  <p>No existen incidencias registradas para este usuario.</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="modal-btn" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IncidentesAdmin

