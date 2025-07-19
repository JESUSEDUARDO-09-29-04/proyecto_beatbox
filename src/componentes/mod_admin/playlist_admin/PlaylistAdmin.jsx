"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext"
import DOMPurify from "dompurify"
import "./PlaylistAdmin.css"
import { FaMusic, FaPlus, FaEdit, FaPlay, FaPause, FaExternalLinkAlt, FaExclamationTriangle } from "react-icons/fa"

const PlaylistAdmin = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalType, setModalType] = useState("info") // info, form, edit
  const [tokenCSRF, setTokenCSRF] = useState("")

  // Estados para formularios
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    vigente: false,
    url: "",
  })
  const [editingPlaylist, setEditingPlaylist] = useState(null)

  // Tipos de playlist disponibles
  const tiposPlaylist = [
    "Pilates",
    "Estiramiento",
    "Cardio",
    "Yoga",
    "Relajación",
    "Calentamiento",
    "Enfriamiento",
    "Fuerza",
    "Resistencia",
    "Meditación",
  ]

  useEffect(() => {
    const obtenerCSRF = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/csrf-token", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setTokenCSRF(data.csrfToken || "")
        } else {
          console.warn("No se pudo obtener el token CSRF, continuando sin él")
          setTokenCSRF("")
        }
      } catch (error) {
        console.warn("Error al obtener CSRF Token, continuando sin él:", error)
        setTokenCSRF("")
      }
    }
    obtenerCSRF()
  }, [])

  useEffect(() => {
    const cargarPlaylists = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cambié la ruta a /playlists/all según la nueva convención
        const response = await fetch("http://localhost:3000/playlists/all", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setPlaylists(Array.isArray(data) ? data : [])
        } else if (response.status === 404) {
          console.warn("API no encontrada, usando datos de ejemplo")
          setPlaylists([])
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error("Error al cargar playlists:", error)
        setError("No se pudieron cargar las playlists. Verifica que el servidor esté funcionando.")
        setPlaylists([])
      } finally {
        setLoading(false)
      }
    }
    cargarPlaylists()
  }, [])

  const cerrarModal = () => {
    setModalVisible(false)
    setModalMessage("")
    setModalType("info")
    setEditingPlaylist(null)
    setFormData({
      nombre: "",
      tipo: "",
      vigente: false,
      url: "",
    })
  }

  const sanitizarEntrada = (input) => {
    if (!input) return ""
    const regexPeligroso = /[<>`"';{}()[\]]/g
    return regexPeligroso.test(input) ? "" : DOMPurify.sanitize(input)
  }

  const validarUrlSpotify = (url) => {
    if (!url) return false
    const spotifyRegex = /^https:\/\/(open\.spotify\.com\/playlist\/|spotify:playlist:)/
    return spotifyRegex.test(url)
  }

  const eliminarPlaylist = async (playlistId, playlistName) => {
    const confirmacion = prompt(`Escribe "ELIMINAR" para borrar la playlist "${sanitizarEntrada(playlistName)}"`)
    if (confirmacion !== "ELIMINAR") return

    try {
      // Ruta actualizada para eliminar: /playlists/delete/:id
      const response = await fetch(`http://localhost:3000/playlists/delete/${playlistId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(tokenCSRF && { "X-CSRF-Token": tokenCSRF }),
        },
        credentials: "include",
      })

      if (response.ok) {
        setPlaylists((prevPlaylists) => prevPlaylists.filter((playlist) => playlist.id !== playlistId))
        setModalMessage(`La playlist "${sanitizarEntrada(playlistName)}" ha sido eliminada.`)
        setModalType("info")
        setModalVisible(true)
      } else {
        setModalMessage("Error al eliminar playlist.")
        setModalType("info")
        setModalVisible(true)
      }
    } catch (error) {
      console.error("Error de red al eliminar playlist:", error)
      setModalMessage("Error de conexión al eliminar playlist.")
      setModalType("info")
      setModalVisible(true)
    }
  }

  const toggleVigente = async (playlistId, vigente, tipo) => {
    try {
      // Si se está activando una playlist, desactivar todas las demás del mismo tipo
      if (!vigente) {
        // Ruta actualizada: PATCH /playlists/deactivate/type/:tipo
        const response = await fetch(`http://localhost:3000/playlists/deactivate/type/${tipo}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(tokenCSRF && { "X-CSRF-Token": tokenCSRF }),
          },
          credentials: "include",
        })

        if (!response.ok) {
          setModalMessage("Error al desactivar otras playlists del mismo tipo.")
          setModalType("info")
          setModalVisible(true)
          return
        }
      }

      // Ruta actualizada: PATCH /playlists/toggle-active/id/:id
      const response = await fetch(`http://localhost:3000/playlists/toggle-active/id/${playlistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(tokenCSRF && { "X-CSRF-Token": tokenCSRF }),
        },
        credentials: "include",
        body: JSON.stringify({ vigente: !vigente }),
      })

      if (response.ok) {
        setPlaylists((prevPlaylists) =>
          prevPlaylists.map((playlist) => {
            if (playlist.tipo === tipo && playlist.id !== playlistId) {
              return { ...playlist, vigente: false }
            }
            if (playlist.id === playlistId) {
              return { ...playlist, vigente: !playlist.vigente }
            }
            return playlist
          }),
        )
        setModalMessage(`La playlist ha sido ${!vigente ? "activada" : "desactivada"} exitosamente.`)
        setModalType("info")
        setModalVisible(true)
      } else {
        setModalMessage("Error al cambiar estado de la playlist.")
        setModalType("info")
        setModalVisible(true)
      }
    } catch (error) {
      console.error("Error de red al cambiar estado:", error)
      setModalMessage("Error de conexión al cambiar estado.")
      setModalType("info")
      setModalVisible(true)
    }
  }

  const abrirModalAgregarPlaylist = () => {
    setModalType("form")
    setModalVisible(true)
  }

  const abrirModalEditarPlaylist = (playlist) => {
    setEditingPlaylist(playlist)
    setFormData({
      nombre: playlist.nombre || "",
      tipo: playlist.tipo || "",
      vigente: playlist.vigente || false,
      url: playlist.url || "",
    })
    setModalType("edit")
    setModalVisible(true)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : sanitizarEntrada(value),
    }))
  }

  const agregarPlaylist = async (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.tipo || !formData.url) {
      setModalMessage("Todos los campos son obligatorios.")
      setModalType("info")
      return
    }

    if (!validarUrlSpotify(formData.url)) {
      setModalMessage("Por favor, ingresa una URL válida de Spotify.")
      setModalType("info")
      return
    }

    try {
      // Ruta POST actualizada a /playlists/create
      const response = await fetch("http://localhost:3000/playlists/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(tokenCSRF && { "X-CSRF-Token": tokenCSRF }),
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const nuevaPlaylist = await response.json()
        setPlaylists((prev) => [...prev, nuevaPlaylist])
        setModalMessage("Playlist agregada exitosamente.")
        setModalType("info")
        setFormData({
          nombre: "",
          tipo: "",
          vigente: false,
          url: "",
        })
      } else {
        const errorData = await response.json().catch(() => ({ message: "Error desconocido" }))
        setModalMessage(errorData.message || "Error al agregar playlist.")
        setModalType("info")
      }
    } catch (error) {
      console.error("Error al agregar playlist:", error)
      setModalMessage("Error de conexión al agregar playlist.")
      setModalType("info")
    }
  }

  const editarPlaylist = async (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.tipo || !formData.url) {
      setModalMessage("Todos los campos son obligatorios.")
      setModalType("info")
      return
    }

    if (!validarUrlSpotify(formData.url)) {
      setModalMessage("Por favor, ingresa una URL válida de Spotify.")
      setModalType("info")
      return
    }

    try {
      // Ruta PUT actualizada a /playlists/update/:id
      const response = await fetch(`http://localhost:3000/playlists/update/${editingPlaylist.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(tokenCSRF && { "X-CSRF-Token": tokenCSRF }),
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const playlistActualizada = await response.json()
        setPlaylists((prev) =>
          prev.map((playlist) => (playlist.id === editingPlaylist.id ? playlistActualizada : playlist)),
        )
        setModalMessage("Playlist actualizada exitosamente.")
        setModalType("info")
        cerrarModal()
      } else {
        const errorData = await response.json().catch(() => ({ message: "Error desconocido" }))
        setModalMessage(errorData.message || "Error al actualizar playlist.")
        setModalType("info")
      }
    } catch (error) {
      console.error("Error al actualizar playlist:", error)
      setModalMessage("Error de conexión al actualizar playlist.")
      setModalType("info")
    }
  }

  const abrirSpotify = (url) => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  // Render del modal
  const renderModal = () => {
    if (modalType === "form" || modalType === "edit") {
      return (
        <div className="custom-modal form-modal">
          <button className="custom-modal-close" onClick={cerrarModal}>
            &times;
          </button>
          <h2>{modalType === "form" ? "Agregar Nueva Playlist" : "Editar Playlist"}</h2>
          <form onSubmit={modalType === "form" ? agregarPlaylist : editarPlaylist}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre de la Playlist:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Pilates Relajante"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tipo">Tipo de Ejercicio:</label>
              <select id="tipo" name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                <option value="">Selecciona un tipo</option>
                {tiposPlaylist.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="url">URL de Spotify:</label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://open.spotify.com/playlist/..."
                required
              />
              <small className="form-help">Copia el enlace de la playlist desde Spotify</small>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="vigente" checked={formData.vigente} onChange={handleInputChange} />
                <span className="checkmark"></span>
                Playlist vigente (activa)
              </label>
              <small className="form-help">Solo puede haber una playlist vigente por tipo de ejercicio</small>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button type="submit" className="btn-guardar">
                {modalType === "form" ? "Agregar Playlist" : "Actualizar Playlist"}
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

  if (loading) {
    return (
      <div className={`playlist-admin-contenedor ${theme === "dark" ? "dark" : ""}`}>
        <div className="loading-container">
          <FaMusic className="loading-icon" />
          <p>Cargando playlists...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`playlist-admin-contenedor ${theme === "dark" ? "dark" : ""}`}>
        <div className="error-container">
          <FaExclamationTriangle className="error-icon" />
          <h3>Error al cargar playlists</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const playlistsAgrupadas = Array.isArray(playlists)
    ? playlists.reduce((acc, playlist) => {
        if (playlist && playlist.tipo) {
          if (!acc[playlist.tipo]) {
            acc[playlist.tipo] = []
          }
          acc[playlist.tipo].push(playlist)
        }
        return acc
      }, {})
    : {}

  return (
    <div className={`playlist-admin-contenedor ${theme === "dark" ? "dark" : ""}`}>
      <header className="playlist-admin-header">
        <h1>Gestión de Playlists de Spotify</h1>
        <button className="btn-agregar-playlist" onClick={abrirModalAgregarPlaylist}>
          <FaPlus />
          Agregar Playlist
        </button>
      </header>

      <div className="playlists-container">
        {Object.keys(playlistsAgrupadas).length === 0 ? (
          <div className="empty-state">
            <FaMusic className="empty-icon" />
            <h3>No hay playlists registradas</h3>
            <p>Comienza agregando tu primera playlist de Spotify</p>
            <button className="btn-agregar-playlist" onClick={abrirModalAgregarPlaylist}>
              <FaPlus />
              Agregar Primera Playlist
            </button>
          </div>
        ) : (
          Object.entries(playlistsAgrupadas).map(([tipo, playlistsTipo]) => (
            <div key={tipo} className="tipo-section">
              <h2 className="tipo-title">
                <FaMusic className="tipo-icon" />
                {tipo}
                <span className="playlist-count">({playlistsTipo.length})</span>
              </h2>
              <div className="playlists-grid">
                {playlistsTipo.map((playlist) => (
                  <div key={playlist.id} className={`playlist-card ${playlist.vigente ? "vigente" : ""}`}>
                    <div className="playlist-header">
                      <h3 className="playlist-name">{sanitizarEntrada(playlist.nombre)}</h3>
                      <div className="playlist-status">
                        {playlist.vigente && (
                          <span className="status-badge vigente">
                            <FaPlay className="status-icon" />
                            Vigente
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="playlist-actions">
                      <button
                        className={`btn-vigente ${playlist.vigente ? "activo" : "inactivo"}`}
                        onClick={() => toggleVigente(playlist.id, playlist.vigente, playlist.tipo)}
                        title={playlist.vigente ? "Desactivar playlist" : "Activar playlist"}
                      >
                        {playlist.vigente ? <FaPause /> : <FaPlay />}
                        {playlist.vigente ? "Desactivar" : "Activar"}
                      </button>

                      <button
                        className="btn-spotify"
                        onClick={() => abrirSpotify(playlist.url)}
                        title="Abrir en Spotify"
                      >
                        <FaExternalLinkAlt />
                        Spotify
                      </button>

                      <button
                        className="btn-editar"
                        onClick={() => abrirModalEditarPlaylist(playlist)}
                        title="Editar playlist"
                      >
                        <FaEdit />
                        Editar
                      </button>

                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarPlaylist(playlist.id, playlist.nombre)}
                        title="Eliminar playlist"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {modalVisible && <div className="custom-modal-overlay">{renderModal()}</div>}
    </div>
  )
}

export default PlaylistAdmin
