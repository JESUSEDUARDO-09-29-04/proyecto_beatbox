"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaExclamationTriangle,
  FaSave,
  FaTimes,
  FaFolder,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa"
import "./Categorias.css"

// Función para sanitizar texto (prevenir inyección de código)
const sanitizarTexto = (texto) => {
  if (!texto) return ""

  // Eliminar etiquetas HTML
  let textoSanitizado = texto.replace(/<[^>]*>?/gm, "")

  // Convertir caracteres especiales a entidades HTML
  textoSanitizado = textoSanitizado
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

  return textoSanitizado
}

// Función para validar formulario
const validarFormularioCategoria = (formulario) => {
  const errores = []

  // Validar nombre
  if (!formulario.nombre || formulario.nombre.trim() === "") {
    errores.push("El nombre es obligatorio")
  } else if (formulario.nombre.length > 50) {
    errores.push("El nombre no puede tener más de 50 caracteres")
  }

  return errores
}

// Componente de carga
const Cargando = ({ mensaje = "Cargando..." }) => {
  return (
    <div className="contenedor-cargando">
      <div className="spinner"></div>
      <p className="mensaje-cargando">{mensaje}</p>
    </div>
  )
}

// Componente de alerta
const Alerta = ({ tipo, mensaje, onClose, duracion = 5000 }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duracion > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onClose) onClose()
      }, duracion)

      return () => clearTimeout(timer)
    }
  }, [duracion, onClose])

  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
  }

  if (!visible) return null

  return (
    <div className={`alerta alerta-${tipo}`}>
      <div className="alerta-icono">{tipo === "exito" ? <FaCheckCircle /> : <FaExclamationCircle />}</div>
      <div className="alerta-mensaje">{mensaje}</div>
      <button className="alerta-cerrar" onClick={handleClose}>
        <FaTimes />
      </button>
    </div>
  )
}

// Componente de modal de confirmación
const ModalConfirmacion = ({ titulo, mensaje, onConfirmar, onCancelar }) => {
  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <div className="modal-cabecera">
          <FaExclamationTriangle className="icono-advertencia" />
          <h3 className="modal-titulo">{titulo}</h3>
        </div>
        <div className="modal-cuerpo">
          <p>{mensaje}</p>
        </div>
        <div className="modal-pie">
          <button className="boton-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="boton-confirmar" onClick={onConfirmar}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente de tabla responsiva
const TablaResponsiva = ({ columnas, datos, idTabla, claseTabla }) => {
  if (!datos || datos.length === 0) {
    return <div className="mensaje-sin-datos">No hay datos disponibles</div>
  }

  return (
    <div className="contenedor-tabla-responsiva">
      <table id={idTabla} className={`tabla-responsiva ${claseTabla || ""}`}>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.id}>{columna.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((item, index) => (
            <tr key={item.id || index}>
              {columnas.map((columna) => (
                <td key={`${item.id || index}-${columna.id}`} data-label={columna.header}>
                  {columna.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const CategoriasAdmin = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)

  // Estados para categorías
  const [categorias, setCategorias] = useState([])
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)

  // Estados para formularios
  const [formularioCategoria, setFormularioCategoria] = useState({
    id: "",
    nombre: "",
  })

  // Estados para UI
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [modoEdicionCategoria, setModoEdicionCategoria] = useState(false)
  const [busquedaCategoria, setBusquedaCategoria] = useState("")
  const [modalEliminarCategoria, setModalEliminarCategoria] = useState(false)

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

  // Cargar datos iniciales
  useEffect(() => {
    cargarCategorias()
  }, [])

  // Filtrar categorías cuando cambia la búsqueda
  useEffect(() => {
    if (busquedaCategoria.trim() === "") {
      setCategoriasFiltradas(categorias)
    } else {
      const terminoBusqueda = busquedaCategoria.toLowerCase()
      const filtradas = categorias.filter((cat) => cat.nombre.toLowerCase().includes(terminoBusqueda))
      setCategoriasFiltradas(filtradas)
    }
  }, [busquedaCategoria, categorias])

  // Función para cargar categorías desde la API
  const cargarCategorias = async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch("http://localhost:3000/categorias")

      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setCategorias(data)
      setCategoriasFiltradas(data)
      setCargando(false)
    } catch (err) {
      console.error("Error al cargar categorías:", err)
      setError("Error al cargar las categorías. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  // Función para obtener una categoría específica
  const obtenerCategoria = async (id) => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch(`http://localhost:3000/categorias/${id}`)

      if (!response.ok) {
        throw new Error(`Error al obtener categoría: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setCargando(false)
      return data
    } catch (err) {
      console.error("Error al obtener categoría:", err)
      setError("Error al obtener la categoría. Por favor, intente nuevamente.")
      setCargando(false)
      return null
    }
  }

  // Manejadores para formulario de categoría
  const handleChangeCategoria = (e) => {
    const { name, value } = e.target
    setFormularioCategoria({
      ...formularioCategoria,
      [name]: sanitizarTexto(value),
    })
  }

  const handleSubmitCategoria = async (e) => {
    e.preventDefault()

    // Validar formulario
    const erroresValidacion = validarFormularioCategoria(formularioCategoria)
    if (erroresValidacion.length > 0) {
      setError(erroresValidacion.join(", "))
      return
    }

    try {
      setCargando(true)
      setError(null)

      let url, method
      if (modoEdicionCategoria) {
        url = `http://localhost:3000/categorias/${formularioCategoria.id}`
        method = "PUT"
      } else {
        url = "http://localhost:3000/categorias"
        method = "POST"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formularioCategoria.nombre,
        }),
      })

      if (!response.ok) {
        throw new Error(
          `Error al ${modoEdicionCategoria ? "actualizar" : "crear"} categoría: ${response.status} ${response.statusText}`,
        )
      }

      // Recargar categorías para obtener los datos actualizados
      await cargarCategorias()

      setExito(`Categoría ${modoEdicionCategoria ? "actualizada" : "creada"} correctamente`)
      limpiarFormularioCategoria()
      setCargando(false)
    } catch (err) {
      console.error(`Error al ${modoEdicionCategoria ? "actualizar" : "crear"} categoría:`, err)
      setError(`Error al ${modoEdicionCategoria ? "actualizar" : "crear"} la categoría. Por favor, intente nuevamente.`)
      setCargando(false)
    }
  }

  const iniciarEdicionCategoria = async (categoria) => {
    // Obtener los datos completos de la categoría desde la API
    const categoriaCompleta = await obtenerCategoria(categoria.id)

    if (categoriaCompleta) {
      setFormularioCategoria({
        id: categoriaCompleta.id,
        nombre: categoriaCompleta.nombre,
      })
      setModoEdicionCategoria(true)
    }
  }

  const confirmarEliminarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria)
    setModalEliminarCategoria(true)
  }

  const eliminarCategoriaSeleccionada = async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch(`http://localhost:3000/categorias/${categoriaSeleccionada.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar categoría: ${response.status} ${response.statusText}`)
      }

      // Recargar categorías para obtener los datos actualizados
      await cargarCategorias()

      setExito("Categoría eliminada correctamente")
      setCategoriaSeleccionada(null)
      setModalEliminarCategoria(false)
      setCargando(false)
    } catch (err) {
      console.error("Error al eliminar categoría:", err)
      setError("Error al eliminar la categoría. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  const limpiarFormularioCategoria = () => {
    setFormularioCategoria({
      id: "",
      nombre: "",
    })
    setModoEdicionCategoria(false)
  }

  // Columnas para la tabla de categorías
  const columnasCategorias = [
    {
      id: "nombre",
      header: "Nombre",
      cell: (categoria) => (
        <div className="celda-categoria">
          <FaFolder className="icono-categoria" />
          <span>{categoria.nombre}</span>
        </div>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: (categoria) => (
        <div className="acciones-categoria">
          <button
            className="boton-accion editar"
            onClick={() => iniciarEdicionCategoria(categoria)}
            title="Editar categoría"
          >
            <FaEdit />
          </button>
          <button
            className="boton-accion eliminar"
            onClick={() => confirmarEliminarCategoria(categoria)}
            title="Eliminar categoría"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className={`contenedor-categorias-admin ${theme === "dark" ? "dark" : ""}`}>
      <div className="categorias-header">
        <h1 className="titulo-seccion">Gestión de Categorías</h1>
      </div>

      <div className="categorias-content">
        {/* Mostrar alertas de error o éxito */}
        {error && <Alerta tipo="error" mensaje={error} onClose={() => setError(null)} />}
        {exito && <Alerta tipo="exito" mensaje={exito} onClose={() => setExito(null)} />}

        {/* Sección de categorías */}
        <div className="seccion-categorias">
          <div className="cabecera-seccion">
            <h2 className="subtitulo-seccion">Categorías</h2>
            <div className="controles-cabecera">
              <div className="campo-busqueda">
                <FaSearch className="icono-busqueda" />
                <input
                  type="text"
                  placeholder="Buscar categorías..."
                  value={busquedaCategoria}
                  onChange={(e) => setBusquedaCategoria(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <button
                className="boton-nueva-categoria"
                onClick={() => {
                  limpiarFormularioCategoria()
                  setModoEdicionCategoria(false)
                }}
              >
                <FaPlus /> Nueva Categoría
              </button>
            </div>
          </div>

          {/* Formulario de categoría */}
          <div className="contenedor-formulario">
            <h3 className="titulo-formulario">{modoEdicionCategoria ? "Editar Categoría" : "Nueva Categoría"}</h3>
            <form onSubmit={handleSubmitCategoria} className="formulario-categoria">
              <div className="grupo-formulario">
                <label htmlFor="nombre" className="etiqueta-campo">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formularioCategoria.nombre}
                  onChange={handleChangeCategoria}
                  className="campo-texto"
                  required
                  maxLength={50}
                  placeholder="Nombre de la categoría"
                />
              </div>

              <div className="botones-formulario">
                <button type="submit" className="boton-guardar">
                  <FaSave /> {modoEdicionCategoria ? "Actualizar" : "Guardar"}
                </button>
                {modoEdicionCategoria && (
                  <button type="button" className="boton-cancelar" onClick={limpiarFormularioCategoria}>
                    <FaTimes /> Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tabla de categorías */}
          <div className="contenedor-tabla">
            {cargando ? (
              <Cargando mensaje="Cargando categorías..." />
            ) : categoriasFiltradas.length === 0 ? (
              <div className="mensaje-sin-datos">
                <FaExclamationTriangle className="icono-advertencia" />
                <p>No se encontraron categorías. Crea una nueva categoría para comenzar.</p>
              </div>
            ) : (
              <TablaResponsiva
                columnas={columnasCategorias}
                datos={categoriasFiltradas}
                idTabla="tabla-categorias"
                claseTabla="tabla-categorias"
              />
            )}
          </div>
        </div>
      </div>

      {/* Modales de confirmación */}
      {modalEliminarCategoria && (
        <ModalConfirmacion
          titulo="Eliminar Categoría"
          mensaje={`¿Está seguro que desea eliminar la categoría "${categoriaSeleccionada?.nombre}"? Esta acción no se puede deshacer.`}
          onConfirmar={eliminarCategoriaSeleccionada}
          onCancelar={() => setModalEliminarCategoria(false)}
        />
      )}
    </div>
  )
}

export default CategoriasAdmin
