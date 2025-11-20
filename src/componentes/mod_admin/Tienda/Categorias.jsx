"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaExclamationTriangle,
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

// Función para validar formulario de subcategoría
const validarFormularioSubcategoria = (formulario) => {
  const errores = []

  // Validar nombre
  if (!formulario.nombre || formulario.nombre.trim() === "") {
    errores.push("El nombre es obligatorio")
  } else if (formulario.nombre.length > 50) {
    errores.push("El nombre no puede tener más de 50 caracteres")
  }

  // Validar categoría
  if (!formulario.id_categoria) {
    errores.push("Debe seleccionar una categoría")
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
          <h3 className="modal-titulo">{titulo}</h3>
          <button className="modal-cerrar" onClick={onCancelar}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-cuerpo">
          <div className="modal-icono">
            <FaExclamationTriangle className="icono-advertencia" />
          </div>
          <p className="modal-mensaje">{mensaje}</p>
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

// Componente de modal para mensajes de éxito
const ModalExito = ({ titulo, mensaje, onCerrar }) => {
  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <div className="modal-cabecera">
          <h3 className="modal-titulo">{titulo}</h3>
          <button className="modal-cerrar" onClick={onCerrar}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-cuerpo">
          <div className="modal-icono modal-icono-exito">
            <FaCheckCircle className="icono-exito" />
          </div>
          <p className="modal-mensaje">{mensaje}</p>
        </div>
        <div className="modal-pie">
          <button className="boton-confirmar" onClick={onCerrar}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente de modal para formulario de categoría
const ModalFormularioCategoria = ({ titulo, formulario, modoEdicion, onChange, onSubmit, onCancelar }) => {
  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <div className="modal-cabecera">
          <h3 className="modal-titulo">{titulo}</h3>
          <button className="modal-cerrar" onClick={onCancelar}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-cuerpo-formulario">
          <form id="formularioCategoria">
            <div className="grupo-formulario">
              <label htmlFor="nombre" className="etiqueta-campo">
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={onChange}
                className="campo-texto"
                required
                maxLength={50}
                placeholder="Nombre de la categoría"
              />
            </div>
          </form>
        </div>
        <div className="modal-pie">
          <button className="boton-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="boton-confirmar" onClick={onSubmit}>
            {modoEdicion ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente de modal para formulario de subcategoría
const ModalFormularioSubcategoria = ({ titulo, formulario, modoEdicion, onChange, onSubmit, onCancelar }) => {
  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <div className="modal-cabecera">
          <h3 className="modal-titulo">{titulo}</h3>
          <button className="modal-cerrar" onClick={onCancelar}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-cuerpo-formulario">
          <form id="formularioSubcategoria">
            <div className="grupo-formulario">
              <label htmlFor="nombre-subcategoria" className="etiqueta-campo">
                Nombre:
              </label>
              <input
                type="text"
                id="nombre-subcategoria"
                name="nombre"
                value={formulario.nombre}
                onChange={onChange}
                className="campo-texto"
                required
                maxLength={50}
                placeholder="Nombre de la subcategoría"
              />
            </div>
          </form>
        </div>
        <div className="modal-pie">
          <button className="boton-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="boton-confirmar" onClick={onSubmit}>
            {modoEdicion ? "Actualizar" : "Guardar"}
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

  // Estados para categorías
  const [categorias, setCategorias] = useState([])
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false)

  // Agregar nuevos estados para subcategorías
  const [subcategorias, setSubcategorias] = useState([])
  const [subcategoriasFiltradas, setSubcategoriasFiltradas] = useState([])
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null)
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [mostrandoSubcategorias, setMostrandoSubcategorias] = useState(false)
  const [formularioSubcategoria, setFormularioSubcategoria] = useState({
    id: "",
    nombre: "",
    id_categoria: "",
  })
  const [modoEdicionSubcategoria, setModoEdicionSubcategoria] = useState(false)
  const [modalEliminarSubcategoria, setModalEliminarSubcategoria] = useState(false)
  const [mostrarModalSubcategoria, setMostrarModalSubcategoria] = useState(false)
  const [busquedaSubcategoria, setBusquedaSubcategoria] = useState("")

  // Estados para formularios
  const [formularioCategoria, setFormularioCategoria] = useState({
    id: "",
    nombre: "",
  })

  // Estados para UI
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [mensajeExito, setMensajeExito] = useState("")
  const [mostrarModalExito, setMostrarModalExito] = useState(false)
  const [modoEdicionCategoria, setModoEdicionCategoria] = useState(false)
  const [busquedaCategoria, setBusquedaCategoria] = useState("")
  const [modalEliminarCategoria, setModalEliminarCategoria] = useState(false)

  useEffect(() => {
    const verificarRol = async () => {
      try {
        const userResponse = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/validate-user", {
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

  // Agregar efecto para filtrar subcategorías cuando cambia la búsqueda
  useEffect(() => {
    if (busquedaSubcategoria.trim() === "") {
      setSubcategoriasFiltradas(subcategorias)
    } else {
      const terminoBusqueda = busquedaSubcategoria.toLowerCase()
      const filtradas = subcategorias.filter((subcat) => subcat.nombre.toLowerCase().includes(terminoBusqueda))
      setSubcategoriasFiltradas(filtradas)
    }
  }, [busquedaSubcategoria, subcategorias])

  // Función para mostrar mensaje de éxito en modal
  const mostrarMensajeExito = (mensaje) => {
    setMensajeExito(mensaje)
    setMostrarModalExito(true)
  }

  // Función para cargar categorías desde la API
  const cargarCategorias = async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/categorias")

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

  // Función para cargar subcategorías por categoría
  const cargarSubcategoriasPorCategoria = async (categoriaId) => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/subcategorias/by-categoria/${categoriaId}`)

      if (!response.ok) {
        throw new Error(`Error al cargar subcategorías: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setSubcategorias(data)
      setSubcategoriasFiltradas(data)
      setCargando(false)
      return data
    } catch (err) {
      console.error("Error al cargar subcategor��as:", err)
      setError("Error al cargar las subcategorías. Por favor, intente nuevamente.")
      setCargando(false)
      return []
    }
  }

  // Función para obtener una categoría específica
  const obtenerCategoria = async (id) => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/categorias/${id}`)

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
    if (e) e.preventDefault()

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
        url = `https://backendbeat-serverbeat.586pa0.easypanel.host/categorias/${formularioCategoria.id}`
        method = "PUT"
      } else {
        url = "https://backendbeat-serverbeat.586pa0.easypanel.host/categorias"
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

      // Mostrar mensaje de éxito en modal
      mostrarMensajeExito(`Categoría ${modoEdicionCategoria ? "actualizada" : "creada"} correctamente`)
      setMostrarModalCategoria(false)
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
      setMostrarModalCategoria(true)
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

      const response = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/categorias/${categoriaSeleccionada.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar categoría: ${response.status} ${response.statusText}`)
      }

      // Recargar categorías para obtener los datos actualizados
      await cargarCategorias()

      // Mostrar mensaje de éxito en modal
      mostrarMensajeExito("Categoría eliminada correctamente")
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

  const abrirModalNuevaCategoria = () => {
    limpiarFormularioCategoria()
    setModoEdicionCategoria(false)
    setMostrarModalCategoria(true)
  }

  // Agregar funciones para manejar el formulario de subcategoría
  const handleChangeSubcategoria = (e) => {
    const { name, value } = e.target
    setFormularioSubcategoria({
      ...formularioSubcategoria,
      [name]: sanitizarTexto(value),
    })
  }

  const handleSubmitSubcategoria = async (e) => {
    if (e) e.preventDefault()

    // Validar formulario
    const erroresValidacion = validarFormularioSubcategoria(formularioSubcategoria)
    if (erroresValidacion.length > 0) {
      setError(erroresValidacion.join(", "))
      return
    }

    try {
      setCargando(true)
      setError(null)

      let url, method
      if (modoEdicionSubcategoria) {
        url = `https://backendbeat-serverbeat.586pa0.easypanel.host/subcategorias/${formularioSubcategoria.id}`
        method = "PUT"
      } else {
        url = "https://backendbeat-serverbeat.586pa0.easypanel.host/subcategorias"
        method = "POST"
      }

      const body = modoEdicionSubcategoria
        ? { nombre: formularioSubcategoria.nombre }
        : {
            nombre: formularioSubcategoria.nombre,
            id_categoria: formularioSubcategoria.id_categoria,
          }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(
          `Error al ${modoEdicionSubcategoria ? "actualizar" : "crear"} subcategoría: ${response.status} ${response.statusText}`,
        )
      }

      // Recargar subcategorías para obtener los datos actualizados
      await cargarSubcategoriasPorCategoria(categoriaActiva.id)

      // Mostrar mensaje de éxito en modal
      mostrarMensajeExito(`Subcategoría ${modoEdicionSubcategoria ? "actualizada" : "creada"} correctamente`)
      setMostrarModalSubcategoria(false)
      limpiarFormularioSubcategoria()
      setCargando(false)
    } catch (err) {
      console.error(`Error al ${modoEdicionSubcategoria ? "actualizar" : "crear"} subcategoría:`, err)
      setError(
        `Error al ${modoEdicionSubcategoria ? "actualizar" : "crear"} la subcategoría. Por favor, intente nuevamente.`,
      )
      setCargando(false)
    }
  }

  const iniciarEdicionSubcategoria = (subcategoria) => {
    setFormularioSubcategoria({
      id: subcategoria.id,
      nombre: subcategoria.nombre,
      id_categoria: categoriaActiva.id,
    })
    setModoEdicionSubcategoria(true)
    setMostrarModalSubcategoria(true)
  }

  const confirmarEliminarSubcategoria = (subcategoria) => {
    setSubcategoriaSeleccionada(subcategoria)
    setModalEliminarSubcategoria(true)
  }

  const eliminarSubcategoriaSeleccionada = async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/subcategorias/${subcategoriaSeleccionada.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar subcategoría: ${response.status} ${response.statusText}`)
      }

      // Recargar subcategorías para obtener los datos actualizados
      await cargarSubcategoriasPorCategoria(categoriaActiva.id)

      // Mostrar mensaje de éxito en modal
      mostrarMensajeExito("Subcategoría eliminada correctamente")
      setSubcategoriaSeleccionada(null)
      setModalEliminarSubcategoria(false)
      setCargando(false)
    } catch (err) {
      console.error("Error al eliminar subcategoría:", err)
      setError("Error al eliminar la subcategoría. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  const limpiarFormularioSubcategoria = () => {
    setFormularioSubcategoria({
      id: "",
      nombre: "",
      id_categoria: categoriaActiva ? categoriaActiva.id : "",
    })
    setModoEdicionSubcategoria(false)
  }

  const abrirModalNuevaSubcategoria = () => {
    limpiarFormularioSubcategoria()
    setModoEdicionSubcategoria(false)
    setMostrarModalSubcategoria(true)
  }

  const mostrarSubcategorias = async (categoria) => {
    setCategoriaActiva(categoria)
    const subcats = await cargarSubcategoriasPorCategoria(categoria.id)
    setMostrandoSubcategorias(true)

    // Inicializar formulario de subcategoría con la categoría seleccionada
    setFormularioSubcategoria({
      id: "",
      nombre: "",
      id_categoria: categoria.id,
    })
  }

  const volverACategorias = () => {
    setMostrandoSubcategorias(false)
    setCategoriaActiva(null)
    setSubcategorias([])
    setSubcategoriasFiltradas([])
    limpiarFormularioSubcategoria()
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
      id: "subcategorias",
      header: "Subcategorías",
      cell: (categoria) => (
        <button
          className="boton-subcategorias"
          onClick={() => mostrarSubcategorias(categoria)}
          title="Ver subcategorías"
        >
          Ver subcategorías
        </button>
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

  // Columnas para la tabla de subcategorías
  const columnasSubcategorias = [
    {
      id: "nombre",
      header: "Nombre",
      cell: (subcategoria) => (
        <div className="celda-subcategoria">
          <span>{subcategoria.nombre}</span>
        </div>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: (subcategoria) => (
        <div className="acciones-subcategoria">
          <button
            className="boton-accion editar"
            onClick={() => iniciarEdicionSubcategoria(subcategoria)}
            title="Editar subcategoría"
          >
            <FaEdit />
          </button>
          <button
            className="boton-accion eliminar"
            onClick={() => confirmarEliminarSubcategoria(subcategoria)}
            title="Eliminar subcategoría"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="contenedor-categorias-admin">
      <h1 className="titulo-seccion">
        {mostrandoSubcategorias ? `Subcategorías de ${categoriaActiva?.nombre}` : "Gestión de Categorías"}
      </h1>

      {/* Mostrar alertas de error */}
      {error && <Alerta tipo="error" mensaje={error} onClose={() => setError(null)} />}

      {/* Botón para volver a categorías cuando se están mostrando subcategorías */}
      {mostrandoSubcategorias && (
        <button className="boton-volver" onClick={volverACategorias}>
          ← Volver a Categorías
        </button>
      )}

      {/* Sección de categorías */}
      {!mostrandoSubcategorias ? (
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
              <button className="boton-nueva-categoria" onClick={abrirModalNuevaCategoria}>
                <FaPlus /> Nueva Categoría
              </button>
            </div>
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
      ) : (
        /* Sección de subcategorías */
        <div className="seccion-subcategorias">
          <div className="cabecera-seccion">
            <h2 className="subtitulo-seccion">Subcategorías</h2>
            <div className="controles-cabecera">
              <div className="campo-busqueda">
                <FaSearch className="icono-busqueda" />
                <input
                  type="text"
                  placeholder="Buscar subcategorías..."
                  value={busquedaSubcategoria}
                  onChange={(e) => setBusquedaSubcategoria(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <button className="boton-nueva-subcategoria" onClick={abrirModalNuevaSubcategoria}>
                <FaPlus /> Nueva Subcategoría
              </button>
            </div>
          </div>

          {/* Tabla de subcategorías */}
          <div className="contenedor-tabla">
            {cargando ? (
              <Cargando mensaje="Cargando subcategorías..." />
            ) : subcategoriasFiltradas.length === 0 ? (
              <div className="mensaje-sin-datos">
                <FaExclamationTriangle className="icono-advertencia" />
                <p>Esta categoría no tiene subcategorías. Crea una nueva subcategoría para comenzar.</p>
              </div>
            ) : (
              <TablaResponsiva
                columnas={columnasSubcategorias}
                datos={subcategoriasFiltradas}
                idTabla="tabla-subcategorias"
                claseTabla="tabla-subcategorias"
              />
            )}
          </div>
        </div>
      )}

      {/* Modales de confirmación */}
      {modalEliminarCategoria && (
        <ModalConfirmacion
          titulo="Eliminar Categoría"
          mensaje={`¿Está seguro que desea eliminar la categoría "${categoriaSeleccionada?.nombre}"? Esta acción no se puede deshacer.`}
          onConfirmar={eliminarCategoriaSeleccionada}
          onCancelar={() => setModalEliminarCategoria(false)}
        />
      )}

      {modalEliminarSubcategoria && (
        <ModalConfirmacion
          titulo="Eliminar Subcategoría"
          mensaje={`¿Está seguro que desea eliminar la subcategoría "${subcategoriaSeleccionada?.nombre}"? Esta acción no se puede deshacer.`}
          onConfirmar={eliminarSubcategoriaSeleccionada}
          onCancelar={() => setModalEliminarSubcategoria(false)}
        />
      )}

      {/* Modal para formulario de categoría */}
      {mostrarModalCategoria && (
        <ModalFormularioCategoria
          titulo={modoEdicionCategoria ? "Editar Categoría" : "Nueva Categoría"}
          formulario={formularioCategoria}
          modoEdicion={modoEdicionCategoria}
          onChange={handleChangeCategoria}
          onSubmit={handleSubmitCategoria}
          onCancelar={() => setMostrarModalCategoria(false)}
        />
      )}

      {/* Modal para formulario de subcategoría */}
      {mostrarModalSubcategoria && (
        <ModalFormularioSubcategoria
          titulo={modoEdicionSubcategoria ? "Editar Subcategoría" : "Nueva Subcategoría"}
          formulario={formularioSubcategoria}
          modoEdicion={modoEdicionSubcategoria}
          onChange={handleChangeSubcategoria}
          onSubmit={handleSubmitSubcategoria}
          onCancelar={() => setMostrarModalSubcategoria(false)}
        />
      )}

      {/* Modal para mensajes de éxito */}
      {mostrarModalExito && (
        <ModalExito titulo="Operación Exitosa" mensaje={mensajeExito} onCerrar={() => setMostrarModalExito(false)} />
      )}
    </div>
  )
}

export default CategoriasAdmin

