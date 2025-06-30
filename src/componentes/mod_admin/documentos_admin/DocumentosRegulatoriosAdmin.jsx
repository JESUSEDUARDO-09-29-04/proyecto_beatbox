"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const DocumentosRegulatoriosAdmin = () => {
  const [documentos, setDocumentos] = useState([])
  const [tiposDisponibles, setTiposDisponibles] = useState([])
  const [filtro, setFiltro] = useState("todos")
  const [tipoSeleccionado, setTipoSeleccionado] = useState("")

  useEffect(() => {
    cargarDocumentos()
  }, [])

  const cargarDocumentos = async () => {
    try {
      const response = await fetch("http://localhost:3000/documentos", {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()
      // Asegurarse de que data sea un array
      setDocumentos(Array.isArray(data) ? data : [])
      // Solo extraer tipos si data es un array
      if (Array.isArray(data)) {
        setTiposDisponibles([...new Set(data.map((doc) => doc.tipo))])
      } else {
        setTiposDisponibles([])
        console.error("Los datos recibidos no son un array:", data)
      }
    } catch (error) {
      console.error("Error al cargar documentos:", error)
      setDocumentos([])
    }
  }

  const documentosFiltrados = () => {
    // Verificar que documentos sea un array
    if (!Array.isArray(documentos)) {
      console.error("documentos no es un array:", documentos)
      return []
    }

    return documentos
      .filter((doc) => {
        if (filtro === "vigentes") return doc.vigente && !doc.eliminado
        if (filtro === "tipo") return doc.tipo === tipoSeleccionado
        return true // Historial completo
      })
      .sort((a, b) => b.version.localeCompare(a.version))
  }

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value)
  }

  const handleTipoChange = (event) => {
    setTipoSeleccionado(event.target.value)
  }

  return (
    <div>
      <h2>Administración de Documentos Regulatorios</h2>

      <div>
        <label>Filtrar por:</label>
        <select value={filtro} onChange={handleFiltroChange}>
          <option value="todos">Todos</option>
          <option value="vigentes">Vigentes</option>
          <option value="tipo">Tipo</option>
        </select>

        {filtro === "tipo" && (
          <>
            <label>Seleccionar Tipo:</label>
            <select value={tipoSeleccionado} onChange={handleTipoChange}>
              <option value="">Todos los Tipos</option>
              {tiposDisponibles.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <ul>
        {documentosFiltrados().map((doc) => (
          <li key={doc.id}>
            {doc.nombre} - Versión: {doc.version} - Tipo: {doc.tipo} - Vigente: {doc.vigente ? "Sí" : "No"}
            <Link to={`/admin/documentos/${doc.id}`}> Editar</Link>
          </li>
        ))}
      </ul>

      <Link to="/admin/documentos/nuevo">Agregar Nuevo Documento</Link>
    </div>
  )
}

export default DocumentosRegulatoriosAdmin

