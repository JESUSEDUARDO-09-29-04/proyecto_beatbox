"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext"
import "./DocumentosRegulatoriosAdmin.css"
import {
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaEye,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaDownload,
} from "react-icons/fa"

const DocumentosRegulatoriosAdmin = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [documentos, setDocumentos] = useState([])
  const [tiposDisponibles, setTiposDisponibles] = useState([])
  const [filtro, setFiltro] = useState("todos")
  const [tipoSeleccionado, setTipoSeleccionado] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

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

  const documentosFiltrados = () => {
    if (!Array.isArray(documentos)) {
      return []
    }

    return documentos
      .filter((doc) => {
        // Filtro por estado
        if (filtro === "vigentes") return doc.vigente && !doc.eliminado
        if (filtro === "no-vigentes") return !doc.vigente || doc.eliminado
        if (filtro === "tipo") return doc.tipo === tipoSeleccionado

        return true // Todos
      })
      .filter((doc) => {
        // Filtro por búsqueda
        if (!busqueda.trim()) return true
        const searchTerm = busqueda.toLowerCase()
        return (
          doc.nombre?.toLowerCase().includes(searchTerm) ||
          doc.tipo?.toLowerCase().includes(searchTerm) ||
          doc.version?.toLowerCase().includes(searchTerm)
        )
      })
      .sort((a, b) => {
        // Ordenar por vigencia primero, luego por versión
        if (a.vigente && !b.vigente) return -1
        if (!a.vigente && b.vigente) return 1
        return b.version.localeCompare(a.version)
      })
  }

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value)
    if (event.target.value !== "tipo") {
      setTipoSeleccionado("")
    }
  }

  const handleTipoChange = (event) => {
    setTipoSeleccionado(event.target.value)
  }

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value)
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
    // Puedes personalizar los iconos según el tipo de documento
    return <FaFileAlt className="documento-tipo-icon" />
  }

  const documentosFiltradosData = documentosFiltrados()

  return (
    <div className={`documentos-container ${theme === "dark" ? "dark" : ""}`}>
      <div className="documentos-header">
        <h1>Administración de Documentos Regulatorios</h1>
        <button
          className="btn-agregar-documento"
          onClick={() => navigate("/admin/documentos/nuevo")}
          aria-label="Agregar nuevo documento"
        >
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
                placeholder="Buscar por nombre, tipo o versión..."
                value={busqueda}
                onChange={handleBusquedaChange}
                className="search-input"
              />
            </div>
          </div>

          <div className="filtros-selects">
            <div className="filtro-grupo">
              <label htmlFor="filtro-estado">
                <FaFilter className="filtro-icon" />
                Estado:
              </label>
              <select id="filtro-estado" value={filtro} onChange={handleFiltroChange} className="filtro-select">
                <option value="todos">Todos</option>
                <option value="vigentes">Vigentes</option>
                <option value="no-vigentes">No Vigentes</option>
                <option value="tipo">Por Tipo</option>
              </select>
            </div>

            {filtro === "tipo" && (
              <div className="filtro-grupo">
                <label htmlFor="filtro-tipo">Tipo:</label>
                <select id="filtro-tipo" value={tipoSeleccionado} onChange={handleTipoChange} className="filtro-select">
                  <option value="">Todos los Tipos</option>
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
                <button className="btn-agregar-primero" onClick={() => navigate("/admin/documentos/nuevo")}>
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
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentosFiltradosData.map((doc) => (
                      <tr key={doc.id} className={doc.vigente ? "documento-vigente" : "documento-no-vigente"}>
                        <td data-label="Documento">
                          <div className="documento-info">
                            {obtenerIconoTipo(doc.tipo)}
                            <div className="documento-detalles">
                              <span className="documento-nombre">{doc.nombre}</span>
                              {doc.descripcion && <span className="documento-descripcion">{doc.descripcion}</span>}
                            </div>
                          </div>
                        </td>
                        <td data-label="Tipo">
                          <span className="documento-tipo">{doc.tipo}</span>
                        </td>
                        <td data-label="Versión">
                          <span className="documento-version">v{doc.version}</span>
                        </td>
                        <td data-label="Estado">
                          <span className={`estado-badge ${doc.vigente ? "vigente" : "no-vigente"}`}>
                            {doc.vigente ? (
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
                        <td data-label="Fecha">
                          <span className="documento-fecha">{formatearFecha(doc.fechaCreacion)}</span>
                        </td>
                        <td data-label="Acciones">
                          <div className="acciones-grupo">
                            <button
                              className="btn-accion ver"
                              onClick={() => navigate(`/admin/documentos/${doc.id}/ver`)}
                              aria-label={`Ver ${doc.nombre}`}
                              title="Ver documento"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="btn-accion editar"
                              onClick={() => navigate(`/admin/documentos/${doc.id}`)}
                              aria-label={`Editar ${doc.nombre}`}
                              title="Editar documento"
                            >
                              <FaEdit />
                            </button>
                            {doc.archivo && (
                              <button
                                className="btn-accion descargar"
                                onClick={() => window.open(doc.archivo, "_blank")}
                                aria-label={`Descargar ${doc.nombre}`}
                                title="Descargar documento"
                              >
                                <FaDownload />
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
    </div>
  )
}

export default DocumentosRegulatoriosAdmin
