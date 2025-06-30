"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaExclamationTriangle,
  FaSave,
  FaTimes,
  FaFolder,
  FaTag,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa"
import "./Categorias.css"

// Datos estáticos para simular la API
const DATOS_CATEGORIAS = [
  {
    id: "1",
    nombre: "Suplementos",
    activo: true,
    orden: 1,
  },
  {
    id: "2",
    nombre: "Ropa deportiva",
    activo: true,
    orden: 2,
  },
  {
    id: "3",
    nombre: "Equipamiento",
    activo: true,
    orden: 3,
  },
  {
    id: "4",
    nombre: "Accesorios",
    activo: false,
    orden: 4,
  },
]

const DATOS_SUBCATEGORIAS = {
  1: [
    {
      id: "101",
      categoriaId: "1",
      nombre: "Proteínas",
      activo: true,
      orden: 1,
    },
    {
      id: "102",
      categoriaId: "1",
      nombre: "Creatina",
      activo: true,
      orden: 2,
    },
    {
      id: "103",
      categoriaId: "1",
      nombre: "Pre-entreno",
      activo: false,
      orden: 3,
    },
  ],
  2: [
    {
      id: "201",
      categoriaId: "2",
      nombre: "Camisetas",
      activo: true,
      orden: 1,
    },
    {
      id: "202",
      categoriaId: "2",
      nombre: "Pantalones",
      activo: true,
      orden: 2,
    },
  ],
  3: [
    {
      id: "301",
      categoriaId: "3",
      nombre: "Pesas",
      activo: true,
      orden: 1,
    },
    {
      id: "302",
      categoriaId: "3",
      nombre: "Máquinas",
      activo: true,
      orden: 2,
    },
  ],
  4: [],
}

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

  // Validar orden
  if (isNaN(formulario.orden) || formulario.orden < 0 || formulario.orden > 999) {
    errores.push("El orden debe ser un número entre 0 y 999")
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

  // Estados para categorías
  const [categorias, setCategorias] = useState([])
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [subcategorias, setSubcategorias] = useState([])
  const [subcategoriasFiltradas, setSubcategoriasFiltradas] = useState([])
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null)

  // Estados para formularios
  const [formularioCategoria, setFormularioCategoria] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    imagen: "",
    activo: true,
    orden: 0,
  })

  const [formularioSubcategoria, setFormularioSubcategoria] = useState({
    id: "",
    categoriaId: "",
    nombre: "",
    descripcion: "",
    imagen: "",
    activo: true,
    orden: 0,
  })

  // Estados para UI
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [modoEdicionCategoria, setModoEdicionCategoria] = useState(false)
  const [modoEdicionSubcategoria, setModoEdicionSubcategoria] = useState(false)
  const [busquedaCategoria, setBusquedaCategoria] = useState("")
  const [busquedaSubcategoria, setBusquedaSubcategoria] = useState("")
  const [modalEliminarCategoria, setModalEliminarCategoria] = useState(false)
  const [modalEliminarSubcategoria, setModalEliminarSubcategoria] = useState(false)
  const [categoriaExpandida, setCategoriaExpandida] = useState({})
  const [vistaActual, setVistaActual] = useState("categorias") // categorias o subcategorias

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

  // Cargar subcategorías cuando se selecciona una categoría
  useEffect(() => {
    if (categoriaSeleccionada) {
      cargarSubcategorias(categoriaSeleccionada.id)
    } else {
      setSubcategorias([])
      setSubcategoriasFiltradas([])
    }
  }, [categoriaSeleccionada])

  // Filtrar categorías cuando cambia la búsqueda
  useEffect(() => {
    if (busquedaCategoria.trim() === "") {
      setCategoriasFiltradas(categorias)
    } else {
      const terminoBusqueda = busquedaCategoria.toLowerCase()
      const filtradas = categorias.filter(
        (cat) =>
          cat.nombre.toLowerCase().includes(terminoBusqueda) ||
          cat.descripcion?.toLowerCase().includes(terminoBusqueda),
      )
      setCategoriasFiltradas(filtradas)
    }
  }, [busquedaCategoria, categorias])

  // Filtrar subcategorías cuando cambia la búsqueda
  useEffect(() => {
    if (busquedaSubcategoria.trim() === "") {
      setSubcategoriasFiltradas(subcategorias)
    } else {
      const terminoBusqueda = busquedaSubcategoria.toLowerCase()
      const filtradas = subcategorias.filter(
        (subcat) =>
          subcat.nombre.toLowerCase().includes(terminoBusqueda) ||
          subcat.descripcion?.toLowerCase().includes(terminoBusqueda),
      )
      setSubcategoriasFiltradas(filtradas)
    }
  }, [busquedaSubcategoria, subcategorias])

  // Función para cargar categorías (simulada)
  const cargarCategorias = async () => {
    try {
      setCargando(true)
      setError(null)

      // Simulamos una carga de datos con un pequeño retraso
      setTimeout(() => {
        setCategorias(DATOS_CATEGORIAS)
        setCategoriasFiltradas(DATOS_CATEGORIAS)
        setCargando(false)
      }, 500)
    } catch (err) {
      console.error("Error al cargar categorías:", err)
      setError("Error al cargar las categorías. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  // Función para cargar subcategorías (simulada)
  const cargarSubcategorias = async (categoriaId) => {
    try {
      setCargando(true)
      setError(null)

      // Simulamos una carga de datos con un pequeño retraso
      setTimeout(() => {
        const subcats = DATOS_SUBCATEGORIAS[categoriaId] || []
        setSubcategorias(subcats)
        setSubcategoriasFiltradas(subcats)
        setCargando(false)
      }, 500)
    } catch (err) {
      console.error("Error al cargar subcategorías:", err)
      setError("Error al cargar las subcategorías. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  // Manejadores para formulario de categoría
  const handleChangeCategoria = (e) => {
    const { name, value, type, checked } = e.target
    setFormularioCategoria({
      ...formularioCategoria,
      [name]: type === "checkbox" ? checked : sanitizarTexto(value),
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

      // Simulamos una operación de guardado con un pequeño retraso
      setTimeout(() => {
        if (modoEdicionCategoria) {
          // Actualizar categoría existente
          const categoriasActualizadas = categorias.map((cat) =>
            cat.id === formularioCategoria.id ? formularioCategoria : cat,
          )
          setCategorias(categoriasActualizadas)
          setExito("Categoría actualizada correctamente")
        } else {
          // Crear nueva categoría
          const nuevaCategoria = {
            ...formularioCategoria,
            id: Date.now().toString(), // Generamos un ID único
          }
          setCategorias([...categorias, nuevaCategoria])
          // Inicializamos las subcategorías para esta nueva categoría
          DATOS_SUBCATEGORIAS[nuevaCategoria.id] = []
          setExito("Categoría creada correctamente")
        }

        // Limpiar formulario
        limpiarFormularioCategoria()
        setCargando(false)
      }, 800)
    } catch (err) {
      console.error("Error al guardar categoría:", err)
      setError("Error al guardar la categoría. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  const iniciarEdicionCategoria = (categoria) => {
    setFormularioCategoria({
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      imagen: categoria.imagen,
      activo: categoria.activo,
      orden: categoria.orden,
    })
    setModoEdicionCategoria(true)
    setVistaActual("categorias")
  }

  const confirmarEliminarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria)
    setModalEliminarCategoria(true)
  }

  const eliminarCategoriaSeleccionada = async () => {
    try {
      setCargando(true)
      setError(null)

      // Simulamos una operación de eliminación con un pequeño retraso
      setTimeout(() => {
        const categoriasActualizadas = categorias.filter((cat) => cat.id !== categoriaSeleccionada.id)
        setCategorias(categoriasActualizadas)
        setCategoriasFiltradas(categoriasActualizadas)

        // Eliminamos también las subcategorías asociadas
        delete DATOS_SUBCATEGORIAS[categoriaSeleccionada.id]

        setExito("Categoría eliminada correctamente")
        setCategoriaSeleccionada(null)
        setModalEliminarCategoria(false)
        setCargando(false)
      }, 800)
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
      descripcion: "",
      imagen: "",
      activo: true,
      orden: 0,
    })
    setModoEdicionCategoria(false)
  }

  // Manejadores para formulario de subcategoría
  const handleChangeSubcategoria = (e) => {
    const { name, value, type, checked } = e.target
    setFormularioSubcategoria({
      ...formularioSubcategoria,
      [name]: type === "checkbox" ? checked : sanitizarTexto(value),
    })
  }

  const handleSubmitSubcategoria = async (e) => {
    e.preventDefault()

    // Validar que haya una categoría seleccionada
    if (!categoriaSeleccionada && !formularioSubcategoria.categoriaId) {
      setError("Debe seleccionar una categoría para la subcategoría")
      return
    }

    // Asignar categoría si no está definida
    if (!formularioSubcategoria.categoriaId) {
      setFormularioSubcategoria({
        ...formularioSubcategoria,
        categoriaId: categoriaSeleccionada.id,
      })
    }

    // Validar formulario
    const erroresValidacion = validarFormularioCategoria(formularioSubcategoria) // Reutilizamos la misma validación
    if (erroresValidacion.length > 0) {
      setError(erroresValidacion.join(", "))
      return
    }

    try {
      setCargando(true)
      setError(null)

      // Simulamos una operación de guardado con un pequeño retraso
      setTimeout(() => {
        const catId = categoriaSeleccionada.id

        if (modoEdicionSubcategoria) {
          // Actualizar subcategoría existente
          const subcategoriasActualizadas = subcategorias.map((subcat) =>
            subcat.id === formularioSubcategoria.id ? formularioSubcategoria : subcat,
          )
          setSubcategorias(subcategoriasActualizadas)
          setSubcategoriasFiltradas(subcategoriasActualizadas)

          // Actualizar en los datos estáticos
          DATOS_SUBCATEGORIAS[catId] = subcategoriasActualizadas

          setExito("Subcategoría actualizada correctamente")
        } else {
          // Crear nueva subcategoría
          const nuevaSubcategoria = {
            ...formularioSubcategoria,
            id: Date.now().toString(), // Generamos un ID único
            categoriaId: catId,
          }

          const subcategoriasActualizadas = [...subcategorias, nuevaSubcategoria]
          setSubcategorias(subcategoriasActualizadas)
          setSubcategoriasFiltradas(subcategoriasActualizadas)

          // Actualizar en los datos estáticos
          DATOS_SUBCATEGORIAS[catId] = subcategoriasActualizadas

          setExito("Subcategoría creada correctamente")
        }

        // Limpiar formulario
        limpiarFormularioSubcategoria()
        setCargando(false)
      }, 800)
    } catch (err) {
      console.error("Error al guardar subcategoría:", err)
      setError("Error al guardar la subcategoría. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  const iniciarEdicionSubcategoria = (subcategoria) => {
    setFormularioSubcategoria({
      id: subcategoria.id,
      categoriaId: subcategoria.categoriaId,
      nombre: subcategoria.nombre,
      descripcion: subcategoria.descripcion,
      imagen: subcategoria.imagen,
      activo: subcategoria.activo,
      orden: subcategoria.orden,
    })
    setModoEdicionSubcategoria(true)
    setVistaActual("subcategorias")
  }

  const confirmarEliminarSubcategoria = (subcategoria) => {
    setSubcategoriaSeleccionada(subcategoria)
    setModalEliminarSubcategoria(true)
  }

  const eliminarSubcategoriaSeleccionada = async () => {
    try {
      setCargando(true)
      setError(null)

      // Simulamos una operación de eliminación con un pequeño retraso
      setTimeout(() => {
        const subcategoriasActualizadas = subcategorias.filter((subcat) => subcat.id !== subcategoriaSeleccionada.id)
        setSubcategorias(subcategoriasActualizadas)
        setSubcategoriasFiltradas(subcategoriasActualizadas)

        // Actualizar en los datos estáticos
        DATOS_SUBCATEGORIAS[categoriaSeleccionada.id] = subcategoriasActualizadas

        setExito("Subcategoría eliminada correctamente")
        setSubcategoriaSeleccionada(null)
        setModalEliminarSubcategoria(false)
        setCargando(false)
      }, 800)
    } catch (err) {
      console.error("Error al eliminar subcategoría:", err)
      setError("Error al eliminar la subcategoría. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  const limpiarFormularioSubcategoria = () => {
    setFormularioSubcategoria({
      id: "",
      categoriaId: categoriaSeleccionada ? categoriaSeleccionada.id : "",
      nombre: "",
      descripcion: "",
      imagen: "",
      activo: true,
      orden: 0,
    })
    setModoEdicionSubcategoria(false)
  }

  // Función para alternar la expansión de una categoría
  const toggleCategoriaExpandida = (categoriaId) => {
    setCategoriaExpandida({
      ...categoriaExpandida,
      [categoriaId]: !categoriaExpandida[categoriaId],
    })
  }

  // Función para seleccionar una categoría y cargar sus subcategorías
  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria)
    setVistaActual("subcategorias")
    // Inicializar formulario de subcategoría con la categoría seleccionada
    setFormularioSubcategoria({
      ...formularioSubcategoria,
      categoriaId: categoria.id,
    })
  }

  // Función para volver a la vista de categorías
  const volverACategorias = () => {
    setVistaActual("categorias")
    setSubcategoriaSeleccionada(null)
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
        <button className="boton-subcategorias" onClick={() => seleccionarCategoria(categoria)}>
          Ver subcategorías
        </button>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      cell: (categoria) => (
        <span className={`estado ${categoria.activo ? "activo" : "inactivo"}`}>
          {categoria.activo ? "Activo" : "Inactivo"}
        </span>
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

  const columnasSubcategorias = [
    {
      id: "nombre",
      header: "Nombre",
      cell: (subcategoria) => (
        <div className="celda-subcategoria">
          <FaTag className="icono-subcategoria" />
          <span>{subcategoria.nombre}</span>
        </div>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      cell: (subcategoria) => (
        <span className={`estado ${subcategoria.activo ? "activo" : "inactivo"}`}>
          {subcategoria.activo ? "Activo" : "Inactivo"}
        </span>
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
        {vistaActual === "categorias" ? "Gestión de Categorías" : `Subcategorías de ${categoriaSeleccionada?.nombre}`}
      </h1>

      {/* Mostrar alertas de error o éxito */}
      {error && <Alerta tipo="error" mensaje={error} onClose={() => setError(null)} />}
      {exito && <Alerta tipo="exito" mensaje={exito} onClose={() => setExito(null)} />}

      {/* Navegación entre categorías y subcategorías */}
      {vistaActual === "subcategorias" && categoriaSeleccionada && (
        <div className="navegacion-categorias">
          <button className="boton-volver" onClick={volverACategorias}>
            ← Volver a Categorías
          </button>
          <div className="info-categoria-seleccionada">
            <FaFolder className="icono-categoria" />
            <span>{categoriaSeleccionada.nombre}</span>
          </div>
        </div>
      )}

      {/* Sección de categorías */}
      {vistaActual === "categorias" && (
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

              <div className="grupo-formulario-inline">
                <div className="campo-checkbox">
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formularioCategoria.activo}
                    onChange={handleChangeCategoria}
                    className="checkbox"
                  />
                  <label htmlFor="activo" className="etiqueta-checkbox">
                    Categoría Activa
                  </label>
                </div>

                <div className="campo-numero">
                  <label htmlFor="orden" className="etiqueta-campo">
                    Orden:
                  </label>
                  <input
                    type="number"
                    id="orden"
                    name="orden"
                    value={formularioCategoria.orden}
                    onChange={handleChangeCategoria}
                    className="campo-texto"
                    min="0"
                    max="999"
                  />
                </div>
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
      )}

      {/* Sección de subcategorías */}
      {vistaActual === "subcategorias" && categoriaSeleccionada && (
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
              <button
                className="boton-nueva-subcategoria"
                onClick={() => {
                  limpiarFormularioSubcategoria()
                  setModoEdicionSubcategoria(false)
                }}
              >
                <FaPlus /> Nueva Subcategoría
              </button>
            </div>
          </div>

          {/* Formulario de subcategoría */}
          <div className="contenedor-formulario">
            <h3 className="titulo-formulario">
              {modoEdicionSubcategoria ? "Editar Subcategoría" : "Nueva Subcategoría"}
            </h3>
            <form onSubmit={handleSubmitSubcategoria} className="formulario-subcategoria">
              <div className="grupo-formulario">
                <label htmlFor="nombre-subcategoria" className="etiqueta-campo">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombre-subcategoria"
                  name="nombre"
                  value={formularioSubcategoria.nombre}
                  onChange={handleChangeSubcategoria}
                  className="campo-texto"
                  required
                  maxLength={50}
                  placeholder="Nombre de la subcategoría"
                />
              </div>

              <div className="grupo-formulario-inline">
                <div className="campo-checkbox">
                  <input
                    type="checkbox"
                    id="activo-subcategoria"
                    name="activo"
                    checked={formularioSubcategoria.activo}
                    onChange={handleChangeSubcategoria}
                    className="checkbox"
                  />
                  <label htmlFor="activo-subcategoria" className="etiqueta-checkbox">
                    Subcategoría Activa
                  </label>
                </div>

                <div className="campo-numero">
                  <label htmlFor="orden-subcategoria" className="etiqueta-campo">
                    Orden:
                  </label>
                  <input
                    type="number"
                    id="orden-subcategoria"
                    name="orden"
                    value={formularioSubcategoria.orden}
                    onChange={handleChangeSubcategoria}
                    className="campo-texto"
                    min="0"
                    max="999"
                  />
                </div>
              </div>

              <div className="botones-formulario">
                <button type="submit" className="boton-guardar">
                  <FaSave /> {modoEdicionSubcategoria ? "Actualizar" : "Guardar"}
                </button>
                {modoEdicionSubcategoria && (
                  <button type="button" className="boton-cancelar" onClick={limpiarFormularioSubcategoria}>
                    <FaTimes /> Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tabla de subcategorías */}
          <div className="contenedor-tabla">
            {cargando ? (
              <Cargando mensaje="Cargando subcategorías..." />
            ) : subcategoriasFiltradas.length === 0 ? (
              <div className="mensaje-sin-datos">
                <FaExclamationTriangle className="icono-advertencia" />
                <p>No se encontraron subcategorías para esta categoría. Crea una nueva subcategoría para comenzar.</p>
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
          mensaje={`¿Está seguro que desea eliminar la categoría "${categoriaSeleccionada?.nombre}"? Esta acción también eliminará todas las subcategorías asociadas y no se puede deshacer.`}
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
    </div>
  )
}

export default CategoriasAdmin

