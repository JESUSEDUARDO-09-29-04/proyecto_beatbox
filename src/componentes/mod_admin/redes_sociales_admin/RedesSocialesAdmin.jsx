"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext" // Import ThemeContext
import "./RedesSocialesAdmin.css"
import { FaFacebook, FaInstagram, FaPlus, FaPen, FaTrash, FaLink } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

// Sanitizar URL para mostrar de forma segura
const sanitizeUrl = (url) => {
  if (!url) return ""

  // Eliminar caracteres potencialmente peligrosos
  return url
    .replace(/[<>"'`]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/file:/gi, "")
    .replace(/about:/gi, "")
    .replace(/mailto:/gi, "")
}

const RedesSocialesAdmin = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext) // Get theme from context
  const [redesSociales, setRedesSociales] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ tipo: "", linkRed: "" })
  const [selectedRed, setSelectedRed] = useState(null)
  const [error, setError] = useState("")
  const linkInputRef = useRef(null)

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

  // Cargar redes sociales
  useEffect(() => {
    const cargarRedesSociales = async () => {
      try {
        const response = await fetch("http://localhost:3000/social/listar-todos", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        setRedesSociales(data)
      } catch (error) {
        console.error("Error al cargar redes sociales:", error)
      }
    }

    cargarRedesSociales()
  }, [])

  // Actualizar el atributo data-tooltip cuando cambia el valor del enlace
  useEffect(() => {
    if (linkInputRef.current && formData.linkRed) {
      linkInputRef.current.parentNode.setAttribute("data-tooltip", formData.linkRed)
    }
  }, [formData.linkRed])

  // Validar tipo de red social
  const isValidSocialType = (tipo) => {
    const validTypes = ["facebook", "instagram", "x"]
    return validTypes.includes(tipo.toLowerCase())
  }

  // Manejar cambio de input en formulario
  const handleChange = (e) => {
    const { name, value } = e.target

    // Validaciones de seguridad para prevenir XSS
    if (name === "linkRed") {
      // Validar que no contenga scripts o código malicioso
      if (
        /<script|javascript:|data:|vbscript:|on\w+\s*=|<iframe|<img|alert\s*\(|confirm\s*\(|eval\s*\(|document\.cookie|document\.write/i.test(
          value,
        )
      ) {
        setError("El enlace contiene código potencialmente malicioso.")
        return
      }

      // Validar que el enlace comience con http:// o https://
      if (value && !value.match(/^https?:\/\//i)) {
        setFormData({ ...formData, [name]: `https://${value}` })
        return
      }
    }

    setFormData({ ...formData, [name]: value })
    setError("")
  }

  // Validar URLs de redes sociales
  const isValidSocialURL = (url) => {
    // Primero sanitizamos la URL
    const sanitizedUrl = url.trim().replace(/[<>"']/g, "")

    // Validar formato de URL para redes sociales específicas
    const regex =
      /^(https?:\/\/)?(www\.)?(facebook\.com|instagram\.com|twitter\.com|x\.com)\/[\w\d._-]+(\/[\w\d._\-?=&%]*)?$/i

    // Verificar que la URL no contenga caracteres sospechosos
    const hasSuspiciousChars = /[<>"'`]|javascript:|data:|vbscript:|file:|about:|mailto:/i.test(sanitizedUrl)

    return regex.test(sanitizedUrl) && !hasSuspiciousChars
  }

  // Validar todos los datos del formulario
  const validateFormData = () => {
    // Validar tipo
    if (!formData.tipo) {
      setError("Debe seleccionar un tipo de red social.")
      return false
    }

    if (!isValidSocialType(formData.tipo)) {
      setError("El tipo de red social seleccionado no es válido.")
      return false
    }

    // Validar URL
    if (!formData.linkRed) {
      setError("Debe ingresar un enlace.")
      return false
    }

    if (!isValidSocialURL(formData.linkRed)) {
      setError("El enlace debe ser una URL válida de Facebook, Instagram o Twitter.")
      return false
    }

    return true
  }

  // Guardar red social
  const guardarRedSocial = async () => {
    // Validar todos los datos antes de enviar
    if (!validateFormData()) {
      return
    }

    // Sanitizar datos antes de enviar
    const sanitizedData = {
      tipo: formData.tipo.trim(),
      linkRed: sanitizeUrl(formData.linkRed.trim()),
    }

    console.log("Enviando datos a la API:", sanitizedData)

    try {
      const response = await fetch("http://localhost:3000/social/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Eliminamos el encabezado X-CSRF-Token que estaba causando problemas de CORS
        },
        credentials: "include",
        body: JSON.stringify(sanitizedData),
      })

      const responseData = await response.json()
      console.log("Respuesta del servidor:", responseData)

      if (!response.ok) {
        setError(responseData.message?.[0] || "Error al guardar la red social")
        return
      }

      // Sanitizar la respuesta antes de usarla
      const sanitizedResponse = {
        ...responseData,
        tipo: responseData.tipo,
        linkRed: sanitizeUrl(responseData.linkRed),
      }

      setRedesSociales((prev) =>
        isEditing
          ? prev.map((red) => (red.tipo === selectedRed.tipo ? sanitizedResponse : red))
          : [...prev, sanitizedResponse],
      )
      cerrarModal()
    } catch (error) {
      console.error("Error de red al guardar la red social:", error)
      setError("Error de conexión. Intente nuevamente más tarde.")
    }
  }

  // Eliminar red social
  const eliminarRedSocial = async (tipo) => {
    // Validar que el tipo sea válido para prevenir inyección
    if (!isValidSocialType(tipo)) {
      console.error("Tipo de red social inválido")
      return
    }

    const confirmacion = window.confirm(`¿Estás seguro de eliminar la red social ${tipo}?`)
    if (!confirmacion) return

    try {
      // Sanitizar el tipo antes de usarlo en la URL
      const sanitizedTipo = encodeURIComponent(tipo.trim())

      const response = await fetch(`http://localhost:3000/social/eliminar/${sanitizedTipo}`, {
        method: "DELETE",
        credentials: "include",
        // Eliminamos el encabezado X-CSRF-Token que estaba causando problemas de CORS
      })

      if (response.ok) {
        setRedesSociales((prev) => prev.filter((red) => red.tipo !== tipo))
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error al eliminar la red social:", errorData)
        setError(errorData.message || "Error al eliminar la red social")
      }
    } catch (error) {
      console.error("Error de red al eliminar la red social:", error)
      setError("Error de conexión. Intente nuevamente más tarde.")
    }
  }

  // Obtener el ícono según el tipo
  const obtenerIcono = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "facebook":
        return <FaFacebook className="social-icon facebook" />
      case "instagram":
        return <FaInstagram className="social-icon instagram" />
      case "x":
        return <FaXTwitter className="social-icon twitter" />
      default:
        return null
    }
  }

  // Abrir modal para agregar o modificar
  const abrirModal = (red = null) => {
    setModalVisible(true)
    setIsEditing(!!red)

    if (red) {
      // Sanitizar datos antes de mostrarlos
      const sanitizedRed = {
        tipo: red.tipo,
        linkRed: sanitizeUrl(red.linkRed),
      }
      setSelectedRed(red)
      setFormData(sanitizedRed)
    } else {
      setSelectedRed(null)
      setFormData({ tipo: "", linkRed: "" })
    }

    setError("")
  }

  const cerrarModal = () => {
    setModalVisible(false)
    setIsEditing(false)
    setFormData({ tipo: "", linkRed: "" })
    setSelectedRed(null)
    setError("")
  }

  // Prevenir clickjacking
  useEffect(() => {
    // Verificar si estamos en un iframe
    if (window.self !== window.top) {
      // Si estamos en un iframe, redirigir a la página principal
      window.top.location = window.self.location
    }
  }, [])

  return (
    <div className={`redes-sociales-container ${theme === "dark" ? "dark" : ""}`}>
      <div className="redes-header">
        <h1>Gestión de Redes Sociales</h1>
        <button className="btn-agregar" onClick={() => abrirModal()}>
          <FaPlus className="icon-btn" /> Agregar Red Social
        </button>
      </div>

      <div className="redes-content">
        {redesSociales.length === 0 ? (
          <div className="no-redes">
            <p>No hay redes sociales configuradas. Agrega una para comenzar.</p>
          </div>
        ) : (
          <div className="redes-cards">
            {redesSociales.map((red, index) => (
              <div key={red._id || index} className={`red-card ${red.tipo.toLowerCase()}`}>
                <div className="red-icon">{obtenerIcono(red.tipo.toLowerCase())}</div>
                <div className="red-info">
                  <h3>{red.tipo}</h3>
                  <a href={sanitizeUrl(red.linkRed)} target="_blank" rel="noopener noreferrer" className="red-link">
                    {red.linkRed}
                  </a>
                </div>
                <div className="red-actions">
                  <button
                    className="btn-action edit"
                    onClick={() => abrirModal(red)}
                    aria-label={`Modificar ${red.tipo}`}
                  >
                    <FaPen />
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => eliminarRedSocial(red.tipo)}
                    aria-label={`Eliminar ${red.tipo}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalVisible && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-simple" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-white">
              <h2>{isEditing ? "Modificar Red Social" : "Agregar Red Social"}</h2>
            </div>

            <div className="modal-body-simple">
              <div className="modal-field-simple">
                <label htmlFor="tipo">Tipo:</label>
                {isEditing ? (
                  <div className="input-container-scroll">
                    <input
                      type="text"
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      disabled
                      className="input-disabled-simple"
                    />
                  </div>
                ) : (
                  <div className="select-container">
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                      className="select-simple"
                    >
                      <option value="">Seleccione un tipo</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="x">X</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                )}
              </div>

              <div className="modal-field-simple">
                <label htmlFor="linkRed">Enlace:</label>
                <div className="input-container-scroll" data-tooltip={formData.linkRed}>
                  <FaLink className="input-icon" />
                  <input
                    ref={linkInputRef}
                    type="url"
                    id="linkRed"
                    name="linkRed"
                    value={formData.linkRed}
                    onChange={handleChange}
                    required
                    className="input-simple-scroll"
                    placeholder="https://www.ejemplo.com/perfil"
                  />
                </div>
              </div>

              {error && (
                <div className="error-container-simple">
                  <p className="error-message-simple">{error}</p>
                </div>
              )}
            </div>

            <div className="modal-footer-simple">
              <button type="button" className="btn-cancel-simple" onClick={cerrarModal}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn-confirm-simple"
                onClick={guardarRedSocial}
                disabled={!formData.tipo || !formData.linkRed}
              >
                {isEditing ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RedesSocialesAdmin
