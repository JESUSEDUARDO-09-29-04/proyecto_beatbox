"use client"

import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import "./AvisoPrivacidad.css"

const AvisoPrivacidad = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [documentos, setDocumentos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

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

      if (!response.ok) {
        throw new Error("Error al cargar documentos")
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        // Filtrar solo documentos vigentes y no eliminados
        const documentosVigentes = data.filter((doc) => doc.vigente && !doc.eliminado)
        setDocumentos(documentosVigentes)
      } else {
        setDocumentos([])
        setError("Los datos recibidos no tienen el formato esperado")
      }
    } catch (error) {
      console.error("Error al cargar documentos:", error)
      setDocumentos([])
      setError("Error al cargar los documentos. Intente nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible"
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const obtenerDocumentoPorTipo = (tipo) => {
    return documentos.find((doc) => doc.tipo.toLowerCase() === tipo.toLowerCase())
  }

  if (cargando) {
    return (
      <div className={`aviso-privacidad-container ${theme}`}>
        <HeaderH />
        <div className="breadcrumb-container">
          <Breadcrumbs />
        </div>
        <main className="privacidad-contenedor">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Cargando documentos legales...</h2>
            <p>Por favor espere mientras obtenemos la información más actualizada.</p>
          </div>
        </main>
        <FooterH />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`aviso-privacidad-container ${theme}`}>
        <HeaderH />
        <div className="breadcrumb-container">
          <Breadcrumbs />
        </div>
        <main className="privacidad-contenedor">
          <div className="error-container">
            <h2>Error al cargar documentos</h2>
            <p>{error}</p>
            <button className="retry-button" onClick={cargarDocumentos}>
              Reintentar
            </button>
          </div>
        </main>
        <FooterH />
      </div>
    )
  }

  const politicasPrivacidad = obtenerDocumentoPorTipo("Políticas de privacidad")
  const terminosCondiciones = obtenerDocumentoPorTipo("Términos y condiciones")
  const deslinde = obtenerDocumentoPorTipo("Deslinde")

  return (
    <div className={`aviso-privacidad-container ${theme}`}>
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <main className="privacidad-contenedor">
        <h1 className="main-title">Documentos Legales</h1>
        <p className="subtitle">Consulta nuestros documentos regulatorios y políticas actualizadas</p>

        <div className="documentos-section">
          {/* Políticas de Privacidad */}
          {politicasPrivacidad && (
            <div className="documento-item">
              <div className="documento-header">
                <h2>{politicasPrivacidad.tipo}</h2>
                <div className="documento-meta">
                  <span className="version">Versión {politicasPrivacidad.version}</span>
                  <span className="fecha">Última actualización: {formatearFecha(politicasPrivacidad.updatedAt)}</span>
                </div>
              </div>
              <div className="documento-content">
                <div className="content-text">{politicasPrivacidad.descripcion}</div>
              </div>
            </div>
          )}

          {/* Términos y Condiciones */}
          {terminosCondiciones && (
            <div className="documento-item">
              <div className="documento-header">
                <h2>{terminosCondiciones.tipo}</h2>
                <div className="documento-meta">
                  <span className="version">Versión {terminosCondiciones.version}</span>
                  <span className="fecha">Última actualización: {formatearFecha(terminosCondiciones.updatedAt)}</span>
                </div>
              </div>
              <div className="documento-content">
                <div className="content-text">{terminosCondiciones.descripcion}</div>
              </div>
            </div>
          )}

          {/* Deslinde Legal */}
          {deslinde && (
            <div className="documento-item">
              <div className="documento-header">
                <h2>{deslinde.tipo}</h2>
                <div className="documento-meta">
                  <span className="version">Versión {deslinde.version}</span>
                  <span className="fecha">Última actualización: {formatearFecha(deslinde.updatedAt)}</span>
                </div>
              </div>
              <div className="documento-content">
                <div className="content-text">{deslinde.descripcion}</div>
              </div>
            </div>
          )}
        </div>

        {/* Mensaje si no hay documentos */}
        {documentos.length === 0 && (
          <div className="no-documentos">
            <h3>No hay documentos disponibles</h3>
            <p>Los documentos legales estarán disponibles próximamente.</p>
          </div>
        )}

        <div className="contact-section">
          <p>¿Tienes preguntas sobre nuestros documentos legales?</p>
          <button className="contact-button" onClick={() => navigate("/contactanos")}>
            Contáctanos
          </button>
        </div>
      </main>

      <FooterH />
    </div>
  )
}

export default AvisoPrivacidad
