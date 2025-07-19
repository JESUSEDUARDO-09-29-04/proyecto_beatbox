"use client"

import { useState, useEffect, useContext } from "react"
import "../../home/Home.css"
import "./DocumentosRegulatoriosAdmin.css"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext"
import { FaFileAlt, FaPlus, FaEdit, FaFilter, FaCheckCircle, FaTimesCircle, FaSearch, FaTrash } from "react-icons/fa"

const DocumentosRegulatoriosAdmin = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [documentos, setDocumentos] = useState([])
  const [filtro, setFiltro] = useState("vigentes") // Default: "vigentes"
  const [tiposDisponibles, setTiposDisponibles] = useState([]) // Tipos de documentos para filtrar
  const [tipoSeleccionado, setTipoSeleccionado] = useState("") // Tipo seleccionado
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [documentoId, setDocumentoId] = useState(null)
  const [formDataCrear, setFormDataCrear] = useState({ tipo: "", descripcion: "" })
  const [formDataEditar, setFormDataEditar] = useState({ descripcion: "" })
  const [disableDefaultOption, setDisableDefaultOption] = useState(false)

  useEffect(() => {
    const verificarRol = async () => {
      try {
        const userResponse = await fetch("http://localhost:3000/auth/validate-user", {
          method: "GET",
          credentials: "include", // Incluye las cookies en la solicitud
        })

        if (!userResponse.ok) {
          navigate("/iniciar-sesion")

          if (navigate("/iniciar-sesion") === "") {
            alert("Error al verificar usuario")
          }
        }

        if (userResponse.ok) {
          const userData = await userResponse.json()
          const userRole = userData.role

          if (userRole !== "admin") {
            navigate("/iniciar-sesion")
          }
        }
      } catch (error) {
        console.error("Error de red al iniciar sesión", error)
      }
    }

    verificarRol()
  }, [navigate])

  useEffect(() => {
    cargarDocumentos()
  }, [])

  const cargarDocumentos = async () => {
    setCargando(true)
    setError("")
    try {
      const response = await fetch("http://localhost:3000/documentos", {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()

      if (Array.isArray(data)) {
        setDocumentos(data)
        setTiposDisponibles([...new Set(data.map((doc) => doc.tipo))])
      } else {
        setDocumentos([])
        setTiposDisponibles([])
        setError("Los datos recibidos no tienen el formato esperado")
      }
    } catch (error) {
      console.error("Error al cargar documentos:", error)
      setDocumentos([])
      setTiposDisponibles([])
      setError("Error al cargar los documentos. Intente nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  const abrirModalCrear = () => {
    setFormDataCrear({ tipo: "", descripcion: "" })
    setIsEditing(false)
    setModalVisible(true)
  }

  const abrirModalEditar = (documento) => {
    setFormDataEditar({ descripcion: documento.descripcion })
    setDocumentoId(documento.id) // Usar 'id' en lugar de '_id'
    setIsEditing(true)
    setModalVisible(true)
  }

  const cerrarModal = () => {
    setModalVisible(false)
    setFormDataCrear({ tipo: "", descripcion: "" })
    setFormDataEditar({ descripcion: "" })
  }

  const handleChangeCrear = (e) => {
    setFormDataCrear({ ...formDataCrear, [e.target.name]: e.target.value })
  }

  const handleChangeEditar = (e) => {
    setFormDataEditar({ ...formDataEditar, [e.target.name]: e.target.value })
  }

  const handleFormSubmitCrear = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataCrear),
        credentials: "include",
      })
      const data = await response.json()

      if (response.ok) {
        setDocumentos([...documentos, data])
        setTiposDisponibles([...new Set([...tiposDisponibles, data.tipo])])
        cerrarModal()
      } else {
        console.error("Error en el servidor:", data)
        setError("Error al crear el documento")
      }
    } catch (error) {
      console.error("Error de red:", error)
      setError("Error de conexión al crear el documento")
    }
  }

  const handleFormSubmitEditar = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/documentos/${documentoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataEditar),
        credentials: "include",
      })
      const data = await response.json()

      if (response.ok) {
        setDocumentos(documentos.map((doc) => (doc.id === documentoId ? data : doc)))
        cerrarModal()
      } else {
        console.error("Error en el servidor:", data)
        setError("Error al actualizar el documento")
      }
    } catch (error) {
      console.error("Error de red:", error)
      setError("Error de conexión al actualizar el documento")
    }
  }

  const eliminarDocumento = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este documento?")
    if (!confirmar) return

    try {
      const response = await fetch(`http://localhost:3000/documentos/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setDocumentos((prevDocs) => prevDocs.map((doc) => (doc.id === id ? data : doc)))
      } else {
        console.error("Error al eliminar documento")
        setError("Error al eliminar el documento")
      }
    } catch (error) {
      console.error("Error de red al eliminar documento:", error)
      setError("Error de conexión al eliminar el documento")
    }
  }

  const documentosFiltrados = () => {
    if (!Array.isArray(documentos)) {
      return []
    }

    let filtrados = documentos

    // Filtro por estado
    if (filtro === "vigentes") {
      filtrados = filtrados.filter((doc) => doc.vigente && !doc.eliminado)
    } else if (filtro === "tipo" && tipoSeleccionado) {
      filtrados = filtrados.filter((doc) => doc.tipo === tipoSeleccionado)
    } else if (filtro === "historial") {
      // Mostrar todos los documentos
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const searchTerm = busqueda.toLowerCase()
      filtrados = filtrados.filter(
        (doc) =>
          doc.descripcion?.toLowerCase().includes(searchTerm) ||
          doc.tipo?.toLowerCase().includes(searchTerm) ||
          doc.version?.toLowerCase().includes(searchTerm),
      )
    }

    // Ordenar
    return filtrados.sort((a, b) => {
      if (a.tipo !== b.tipo) return a.tipo.localeCompare(b.tipo)
      if (a.vigente && !b.vigente) return -1
      if (!a.vigente && b.vigente) return 1
      if (a.eliminado && !b.eliminado) return 1
      return b.version.localeCompare(a.version) // Orden descendente por versión
    })
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible"
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const obtenerIconoTipo = (tipo) => {
    return <FaFileAlt className="documento-tipo-icon" />
  }

  const documentosFiltradosData = documentosFiltrados()

  return (
    <div className="contenedor">
      <main className="contenido-principal">
        <div className={`documentos-container ${theme === "dark" ? "dark" : ""}`}>
          <div className="documentos-header">
            <h1>Administración de Documentos Regulatorios</h1>
            <button className="btn-agregar-documento" onClick={abrirModalCrear} aria-label="Agregar nuevo documento">
              <FaPlus className="btn-icon" />
              Agregar Documento
            </button>
          </div>

          <div className="documentos-filtros">
            <div className="filtros-row">
              <div className="filtro-busqueda">
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar por descripción, tipo o versión..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filtros-selects">
                <div className="filtro-grupo">
                  <label htmlFor="filtro">
                    <FaFilter className="filtro-icon" />
                    Filtrar por:
                  </label>
                  <select
                    id="filtro"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="filtro-select"
                  >
                    <option value="vigentes">Vigentes</option>
                    <option value="tipo">Por tipo</option>
                    <option value="historial">Historial completo</option>
                  </select>
                </div>

                {filtro === "tipo" && (
                  <div className="filtro-grupo">
                    <label htmlFor="tipo">Tipo:</label>
                    <select
                      id="tipo"
                      value={tipoSeleccionado}
                      onChange={(e) => {
                        setTipoSeleccionado(e.target.value)
                        setDisableDefaultOption(true)
                      }}
                      className="filtro-select"
                    >
                      <option value="" disabled={disableDefaultOption}>
                        Seleccione un tipo
                      </option>
                      {tiposDisponibles.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={cargarDocumentos} className="btn-reintentar">
                Reintentar
              </button>
            </div>
          )}

          {cargando ? (
            <div className="documentos-loading">
              <div className="loading-spinner"></div>
              <p>Cargando documentos...</p>
            </div>
          ) : (
            <div className="documentos-content">
              {documentosFiltradosData.length === 0 ? (
                <div className="no-documentos">
                  <FaFileAlt className="no-documentos-icon" />
                  <h3>No se encontraron documentos</h3>
                  <p>
                    {busqueda.trim()
                      ? "No hay documentos que coincidan con tu búsqueda."
                      : "No hay documentos disponibles en este momento."}
                  </p>
                  {!busqueda.trim() && (
                    <button className="btn-agregar-primero" onClick={abrirModalCrear}>
                      <FaPlus className="btn-icon" />
                      Agregar Primer Documento
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="documentos-stats">
                    <div className="stat-item">
                      <span className="stat-number">{documentosFiltradosData.length}</span>
                      <span className="stat-label">
                        {documentosFiltradosData.length === 1 ? "Documento" : "Documentos"}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{documentosFiltradosData.filter((doc) => doc.vigente).length}</span>
                      <span className="stat-label">Vigentes</span>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="documentos-table">
                      <thead>
                        <tr>
                          <th>Documento</th>
                          <th>Tipo</th>
                          <th>Versión</th>
                          <th>Estado</th>
                          <th>Fecha Inicio</th>
                          <th>Fecha Fin</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documentosFiltradosData.map((documento) => (
                          <tr
                            key={documento.id}
                            style={{ backgroundColor: documento.eliminado ? "#fff3cd" : "transparent" }}
                          >
                            <td data-label="Documento">
                              <div className="documento-info">
                                {obtenerIconoTipo(documento.tipo)}
                                <div className="documento-detalles">
                                  <span className="documento-nombre">{documento.tipo}</span>
                                  {documento.descripcion && (
                                    <span className="documento-descripcion">{documento.descripcion}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td data-label="Tipo">
                              <span className="documento-tipo">{documento.tipo}</span>
                            </td>
                            <td data-label="Versión">
                              <span className="documento-version">v{documento.version}</span>
                            </td>
                            <td data-label="Estado">
                              <span className={`estado-badge ${documento.vigente ? "vigente" : "no-vigente"}`}>
                                {documento.vigente ? (
                                  <>
                                    <FaCheckCircle className="estado-icon" />
                                    Vigente
                                  </>
                                ) : (
                                  <>
                                    <FaTimesCircle className="estado-icon" />
                                    No Vigente
                                  </>
                                )}
                              </span>
                            </td>
                            <td data-label="Fecha Inicio">
                              <span className="documento-fecha">{formatearFecha(documento.fechainicio)}</span>
                            </td>
                            <td data-label="Fecha Fin">
                              <span className="documento-fecha">
                                {documento.fechafin ? formatearFecha(documento.fechafin) : "N/A"}
                              </span>
                            </td>
                            <td data-label="Acciones">
                              <div className="acciones-grupo">
                                {!documento.eliminado && documento.vigente && (
                                  <button
                                    className="btn-accion editar"
                                    onClick={() => abrirModalEditar(documento)}
                                    aria-label={`Editar ${documento.tipo}`}
                                    title="Editar documento"
                                  >
                                    <FaEdit />
                                  </button>
                                )}
                                {!documento.vigente && !documento.eliminado && (
                                  <button
                                    className="btn-accion ver"
                                    onClick={() => eliminarDocumento(documento.id)}
                                    aria-label={`Eliminar ${documento.tipo}`}
                                    title="Eliminar documento"
                                    style={{ backgroundColor: "#fff2f0", color: "#ff4d4f" }}
                                  >
                                    <FaTrash />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Modal para crear/editar documentos */}
          {modalVisible && (
            <div className="modal-overlay" onClick={cerrarModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{isEditing ? "Modificar Documento" : "Agregar Documento"}</h2>
                <form onSubmit={isEditing ? handleFormSubmitEditar : handleFormSubmitCrear}>
                  {!isEditing && (
                    <div className="form-group">
                      <label>
                        Tipo
                        <select name="tipo" value={formDataCrear.tipo} onChange={handleChangeCrear} required>
                          <option value="">Seleccione un tipo</option>
                          <option value="Políticas de privacidad">Políticas de privacidad</option>
                          <option value="Deslinde">Deslinde</option>
                          <option value="Términos y condiciones">Términos y condiciones</option>
                        </select>
                      </label>
                    </div>
                  )}
                  <div className="form-group">
                    <label>
                      Descripción
                      <textarea
                        name="descripcion"
                        value={isEditing ? formDataEditar.descripcion : formDataCrear.descripcion}
                        onChange={isEditing ? handleChangeEditar : handleChangeCrear}
                        required
                      />
                    </label>
                  </div>
                  <div className="button-group">
                    <button type="submit" className="btn-guardar">
                      {isEditing ? "Guardar Cambios" : "Agregar Documento"}
                    </button>
                    <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DocumentosRegulatoriosAdmin
