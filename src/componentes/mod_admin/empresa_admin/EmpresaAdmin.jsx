"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext"
import "./EmpresaAdmin.css"
import CloudinaryUploadWidget from "./CloudinaryUploadWidget"
import {
  FaBuilding,
  FaImage,
  FaEdit,
  FaSave,
  FaTimes,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa"

const EmpresaAdmin = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [perfilData, setPerfilData] = useState({
    id: "",
    eslogan: "",
    mision: "",
    vision: "",
    updatedat: "",
  })
  const [configuracionData, setConfiguracionData] = useState({
    id: "",
    maxFailedAttempts: 0,
    lockTimeMinutes: 0,
  })
  const [campoSeleccionado, setCampoSeleccionado] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [nuevoValor, setNuevoValor] = useState("")
  const [tituloModal, setTituloModal] = useState("")
  const [logoVigente, setLogoVigente] = useState(null)
  const [logos, setLogos] = useState([])
  const [logosModalVisible, setLogosModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const nombresCampos = {
    eslogan: "Eslogan",
    mision: "Misión",
    vision: "Visión",
    maxFailedAttempts: "Intentos Fallidos",
    lockTimeMinutes: "Tiempo de Bloqueo (min)",
  }

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
    const fetchLogoVigente = async () => {
      setCargando(true)
      try {
        const response = await fetch("http://localhost:3000/logos/vigente", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setLogoVigente(data.link)
        }
      } catch (error) {
        console.error("Error al cargar el logo vigente:", error)
      } finally {
        setCargando(false)
      }
    }

    const fetchPerfil = async () => {
      try {
        const response = await fetch("http://localhost:3000/perfil-empresa", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        setPerfilData(data)
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
      }
    }

    const fetchConfiguracion = async () => {
      try {
        const response = await fetch("http://localhost:3000/configuracion", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        setConfiguracionData(data)
      } catch (error) {
        console.error("Error al cargar configuración:", error)
      }
    }

    fetchLogoVigente()
    fetchPerfil()
    fetchConfiguracion()
  }, [])

  const abrirModal = (campo, valorActual, seccion) => {
    setCampoSeleccionado({ campo, seccion })
    setNuevoValor(valorActual)
    const nombreCampo = nombresCampos[campo] || campo
    setTituloModal(`Modificar ${nombreCampo}`)
    setModalVisible(true)
    setError("")
  }

  const cerrarModal = () => {
    setCampoSeleccionado(null)
    setNuevoValor("")
    setModalVisible(false)
    setError("")
  }

  const actualizarCampo = async () => {
    const { campo, seccion } = campoSeleccionado

    // Validar que no haya etiquetas <script> ni contenido malicioso
    const sanitizedValue = nuevoValor.replace(/<script.*?>.*?<\/script>/gi, "").trim()

    if (sanitizedValue !== nuevoValor) {
      setError("El campo contiene contenido no permitido (como etiquetas <script>). Por favor, corrige el texto.")
      return
    }

    // Validar campos específicos
    if ((campo === "maxFailedAttempts" || campo === "lockTimeMinutes") && Number(sanitizedValue) <= 0) {
      setError("El valor debe ser mayor que 0.")
      return
    }

    // Determinar la URL y el cuerpo de la solicitud según la sección
    let url, body

    if (seccion === "perfil") {
      url = `http://localhost:3000/perfil-empresa/${campo}`

      // Crear un objeto DTO completo según lo que espera el backend
      const perfilDto = {
        mision: campo === "mision" ? sanitizedValue : perfilData.mision,
        vision: campo === "vision" ? sanitizedValue : perfilData.vision,
      }

      // Para el caso especial de idlogo
      if (campo === "idlogo") {
        perfilDto.idlogo = Number(sanitizedValue)
      }

      body = JSON.stringify(perfilDto)
    } else {
      url = `http://localhost:3000/configuracion/${campo}`

      // Crear un objeto DTO completo para configuración
      const configDto = {
        maxFailedAttempts: campo === "maxFailedAttempts" ? Number(sanitizedValue) : configuracionData.maxFailedAttempts,
        lockTimeMinutes: campo === "lockTimeMinutes" ? Number(sanitizedValue) : configuracionData.lockTimeMinutes,
      }

      body = JSON.stringify(configDto)
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: body,
      })

      if (response.ok) {
        alert(`${nombresCampos[campo] || campo} actualizado exitosamente`)

        // Actualizar el estado local
        if (seccion === "perfil") {
          setPerfilData((prev) => ({ ...prev, [campo]: sanitizedValue }))
        } else {
          setConfiguracionData((prev) => ({ ...prev, [campo]: Number(sanitizedValue) }))
        }

        cerrarModal()
      } else {
        const errorData = await response.json().catch(() => null)
        alert(`Error al actualizar el campo: ${errorData?.message || "Error desconocido"}`)
      }
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error de red al actualizar el campo")
    }
  }

  const handleUpload = async (url) => {
    try {
      const response = await fetch("http://localhost:3000/logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ link: url }),
      })

      if (response.ok) {
        const newLogo = await response.json()
        setLogoVigente(newLogo.link)
        alert("Logo subido y configurado como vigente.")
      }
    } catch (error) {
      console.error("Error al subir el logo:", error)
    }
  }

  const fetchAllLogos = async () => {
    try {
      const response = await fetch("http://localhost:3000/logos", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setLogos(data)
      }
    } catch (error) {
      console.error("Error al cargar los logos:", error)
    }
  }

  const setLogoAsVigente = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/logos/${id}/vigente`, {
        method: "PATCH",
        credentials: "include",
      })

      if (response.ok) {
        const updatedLogo = await response.json()
        setLogoVigente(updatedLogo.link)
        alert("Logo configurado como vigente.")
        fetchAllLogos()
      }
    } catch (error) {
      console.error("Error al establecer el logo vigente:", error)
    }
  }

  const deleteLogo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/logos/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        alert("Logo eliminado correctamente.")
        fetchAllLogos()
      }
    } catch (error) {
      console.error("Error al eliminar el logo:", error)
    }
  }

  return (
    <div className={`empresa-container ${theme === "dark" ? "dark" : ""}`}>
      <div className="empresa-header">
        <h1>
          <FaBuilding className="header-icon" />
          Gestión de la Empresa
        </h1>
      </div>

      <div className="empresa-content">
        {/* Sección de Logo - Fila 1 */}
        <div className="empresa-section logo-section">
          <div className="section-header">
            <h2>
              <FaImage className="section-icon" />
              Logotipo de la Empresa
            </h2>
          </div>
          <div className="logo-content">
            <div className="logo-preview-container">
              {cargando ? (
                <div className="logo-loading">
                  <div className="loading-spinner"></div>
                  <p>Cargando...</p>
                </div>
              ) : logoVigente ? (
                <img src={logoVigente || "/placeholder.svg"} alt="Logotipo Vigente" className="logo-preview" />
              ) : (
                <div className="no-logo-placeholder">
                  <FaImage className="placeholder-icon" />
                  <p>No hay logotipo vigente</p>
                </div>
              )}
            </div>
            <div className="logo-actions">
              <CloudinaryUploadWidget onUpload={handleUpload} />
              <button
                className="btn-secondary"
                onClick={() => {
                  fetchAllLogos()
                  setLogosModalVisible(true)
                }}
              >
                <FaEye className="btn-icon" />
                Ver Todos los Logos
              </button>
            </div>
          </div>
        </div>

        {/* Perfil de la Empresa - Fila 2 */}
        <div className="empresa-section perfil-section">
          <div className="section-header">
            <h2>
              <FaBuilding className="section-icon" />
              Perfil de la Empresa
            </h2>
          </div>
          <div className="section-content">
            <div className="perfil-grid">
              <div className="field-group">
                <label className="field-label">
                  <FaEdit className="field-icon" />
                  Misión:
                </label>
                <div className="field-container">
                  <div className="field-value">{perfilData.mision || "No definida"}</div>
                  <button
                    className="btn-edit"
                    onClick={() => abrirModal("mision", perfilData.mision || "", "perfil")}
                    aria-label="Modificar misión"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">
                  <FaEdit className="field-icon" />
                  Visión:
                </label>
                <div className="field-container">
                  <div className="field-value">{perfilData.vision || "No definida"}</div>
                  <button
                    className="btn-edit"
                    onClick={() => abrirModal("vision", perfilData.vision || "", "perfil")}
                    aria-label="Modificar visión"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuración de Seguridad - Fila 3 */}
        <div className="empresa-section configuracion-section">
          <div className="section-header">
            <h2>
              <FaShieldAlt className="section-icon" />
              Configuración de Seguridad
            </h2>
          </div>
          <div className="section-content">
            <div className="configuracion-grid">
              <div className="field-group">
                <label className="field-label">
                  <FaExclamationTriangle className="field-icon" />
                  Intentos Fallidos Máximos:
                </label>
                <div className="field-container">
                  <div className="field-value config-value">{configuracionData.maxFailedAttempts || 0}</div>
                  <button
                    className="btn-edit"
                    onClick={() =>
                      abrirModal("maxFailedAttempts", configuracionData.maxFailedAttempts || "", "configuracion")
                    }
                    aria-label="Modificar intentos fallidos"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">
                  <FaClock className="field-icon" />
                  Tiempo de Bloqueo (minutos):
                </label>
                <div className="field-container">
                  <div className="field-value config-value">{configuracionData.lockTimeMinutes || 0}</div>
                  <button
                    className="btn-edit"
                    onClick={() =>
                      abrirModal("lockTimeMinutes", configuracionData.lockTimeMinutes || "", "configuracion")
                    }
                    aria-label="Modificar tiempo de bloqueo"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {modalVisible && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-empresa" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{tituloModal}</h3>
              <button className="modal-close" onClick={cerrarModal} aria-label="Cerrar modal">
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <textarea
                value={nuevoValor}
                onChange={(e) => setNuevoValor(e.target.value)}
                placeholder="Escribe aquí..."
                className="modal-textarea"
                rows={4}
              />
              {error && (
                <div className="error-message">
                  <FaExclamationTriangle className="error-icon" />
                  {error}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={cerrarModal}>
                <FaTimes className="btn-icon" />
                Cancelar
              </button>
              <button className="btn-save" onClick={actualizarCampo}>
                <FaSave className="btn-icon" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Logos */}
      {logosModalVisible && (
        <div className="modal-overlay" onClick={() => setLogosModalVisible(false)}>
          <div className="modal-logos" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gestión de Logos</h3>
              <button className="modal-close" onClick={() => setLogosModalVisible(false)} aria-label="Cerrar modal">
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              {logos.length === 0 ? (
                <div className="no-logos">
                  <FaImage className="no-logos-icon" />
                  <p>No hay logos disponibles</p>
                </div>
              ) : (
                <div className="logos-grid">
                  {logos.map((logo) => (
                    <div key={logo.id} className="logo-item">
                      <div className="logo-thumbnail-container">
                        <img src={logo.link || "/placeholder.svg"} alt="Logo" className="logo-thumbnail" />
                        {logo.vigente && (
                          <div className="logo-vigente-badge">
                            <FaCheckCircle className="vigente-icon" />
                            Vigente
                          </div>
                        )}
                      </div>
                      <div className="logo-actions-grid">
                        <button
                          className="btn-vigente"
                          onClick={() => setLogoAsVigente(logo.id)}
                          disabled={logo.vigente}
                        >
                          <FaCheckCircle className="btn-icon" />
                          {logo.vigente ? "Vigente" : "Hacer Vigente"}
                        </button>
                        <button className="btn-eliminar" onClick={() => deleteLogo(logo.id)}>
                          <FaTrash className="btn-icon" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmpresaAdmin
