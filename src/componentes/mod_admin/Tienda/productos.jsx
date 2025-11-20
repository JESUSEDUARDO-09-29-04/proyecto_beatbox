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
  FaImage,
  FaDollarSign,
  FaFilter,
} from "react-icons/fa"
import CloudinaryUploadWidget from "./CloudinaryUploadWidget"
import "./productos.css"

// Componente de carga
const Cargando = ({ mensaje = "Cargando..." }) => {
  return (
    <div className="contenedor-cargando">
      <div className="spinner"></div>
      <p className="mensaje-cargando">{mensaje}</p>
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

// Componente de modal para formulario de producto
const ModalFormularioProducto = ({
  titulo,
  formulario,
  modoEdicion,
  onChange,
  onSubmit,
  onCancelar,
  categorias,
  subcategoriasPorCategoria,
  onImagenSubida,
  errores,
}) => {
  const [subcategoriasSeleccionadas, setSubcategoriasSeleccionadas] = useState([])
  const [activeTab, setActiveTab] = useState("general")

  // Efecto para inicializar subcategorías seleccionadas cuando se edita un producto
  useEffect(() => {
    if (formulario.subcategoriasIds && formulario.subcategoriasIds.length > 0) {
      setSubcategoriasSeleccionadas(formulario.subcategoriasIds)
    } else if (formulario.subcategorias && formulario.subcategorias.length > 0) {
      const ids = formulario.subcategorias.map((sub) => sub.id)
      setSubcategoriasSeleccionadas(ids)

      // Actualizar también el formulario para asegurar que subcategoriasIds esté sincronizado
      onChange({
        target: {
          name: "subcategoriasIds",
          value: ids,
        },
      })
    } else {
      setSubcategoriasSeleccionadas([])
    }
  }, [formulario.subcategorias, formulario.subcategoriasIds, onChange])

  // Efecto para mantener seleccionadas las subcategorías cuando cambia la categoría
  useEffect(() => {
    if (subcategoriasPorCategoria.length > 0 && subcategoriasSeleccionadas.length > 0) {
      // Filtrar solo las subcategorías que pertenecen a la categoría actual
      const subcategoriasValidas = subcategoriasSeleccionadas.filter((id) =>
        subcategoriasPorCategoria.some((sub) => sub.id === id),
      )

      if (subcategoriasValidas.length !== subcategoriasSeleccionadas.length) {
        setSubcategoriasSeleccionadas(subcategoriasValidas)

        // Actualizar el formulario con las subcategorías válidas
        onChange({
          target: {
            name: "subcategoriasIds",
            value: subcategoriasValidas,
          },
        })
      }
    }
  }, [subcategoriasPorCategoria, subcategoriasSeleccionadas, onChange])

  const handleSubcategoriaChange = (subcategoriaId) => {
    const nuevasSubcategorias = subcategoriasSeleccionadas.includes(subcategoriaId)
      ? subcategoriasSeleccionadas.filter((id) => id !== subcategoriaId)
      : [...subcategoriasSeleccionadas, subcategoriaId]

    setSubcategoriasSeleccionadas(nuevasSubcategorias)

    // Actualizar el formulario con las subcategorías seleccionadas
    onChange({
      target: {
        name: "subcategoriasIds",
        value: nuevasSubcategorias,
      },
    })
  }

  return (
    <div className="modal-fondo">
      <div className="modal-contenido modal-contenido-grande">
        <div className="modal-cabecera">
          <h3 className="modal-titulo">{titulo}</h3>
          <button className="modal-cerrar" onClick={onCancelar}>
            <FaTimes />
          </button>
        </div>

        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              Información General
            </button>
            <button
              className={`tab-button ${activeTab === "detalles" ? "active" : ""}`}
              onClick={() => setActiveTab("detalles")}
            >
              Detalles y Categorías
            </button>
            <button
              className={`tab-button ${activeTab === "imagen" ? "active" : ""}`}
              onClick={() => setActiveTab("imagen")}
            >
              Imagen
            </button>
          </div>

          <div className="modal-cuerpo-formulario">
            <form id="formularioProducto" onSubmit={(e) => e.preventDefault()}>
              {/* Tab: Información General */}
              <div className={`tab-content ${activeTab === "general" ? "active" : ""}`}>
                <div className="form-group">
                  <label htmlFor="nombre" className="etiqueta-campo">
                    Nombre: <span className="campo-requerido">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={onChange}
                    className={`campo-texto ${errores.nombre ? "campo-error" : ""}`}
                    maxLength={255}
                    placeholder="Nombre del producto"
                  />
                  {errores.nombre && <span className="mensaje-error">{errores.nombre}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="precio" className="etiqueta-campo">
                      Precio: <span className="campo-requerido">*</span>
                    </label>
                    <div className={`precio-input-container ${errores.precio ? "error" : ""}`}>
                      <div className="precio-simbolo">
                        <FaDollarSign />
                      </div>
                      <input
                        type="number"
                        id="precio"
                        name="precio"
                        value={formulario.precio}
                        onChange={onChange}
                        className="precio-input"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                      />
                    </div>
                    {errores.precio && <span className="mensaje-error">{errores.precio}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="existencia" className="etiqueta-campo">
                      Existencia: <span className="campo-requerido">*</span>
                    </label>
                    <input
                      type="number"
                      id="existencia"
                      name="existencia"
                      value={formulario.existencia}
                      onChange={onChange}
                      className={`campo-texto ${errores.existencia ? "campo-error" : ""}`}
                      min="0"
                      placeholder="0"
                    />
                    {errores.existencia && <span className="mensaje-error">{errores.existencia}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion" className="etiqueta-campo">
                    Descripción:
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formulario.descripcion || ""}
                    onChange={onChange}
                    className={`campo-texto area-texto ${errores.descripcion ? "campo-error" : ""}`}
                    rows={4}
                    placeholder="Descripción del producto"
                  ></textarea>
                  {errores.descripcion && <span className="mensaje-error">{errores.descripcion}</span>}
                </div>
              </div>

              {/* Tab: Detalles y Categorías */}
              <div className={`tab-content ${activeTab === "detalles" ? "active" : ""}`}>
                <div className="form-group">
                  <label htmlFor="categoriaNombre" className="etiqueta-campo">
                    Categoría: <span className="campo-requerido">*</span>
                  </label>
                  <select
                    id="categoriaNombre"
                    name="categoriaNombre"
                    value={formulario.categoriaNombre || ""}
                    onChange={onChange}
                    className={`campo-texto ${errores.categoriaNombre ? "campo-error" : ""}`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.nombre}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                  {errores.categoriaNombre && <span className="mensaje-error">{errores.categoriaNombre}</span>}
                </div>

                {formulario.categoriaNombre && subcategoriasPorCategoria.length > 0 && (
                  <div className="form-group">
                    <label className="etiqueta-campo">Subcategorías:</label>
                    <div className="contenedor-subcategorias-mejorado">
                      {subcategoriasPorCategoria.map((subcategoria) => (
                        <div
                          key={subcategoria.id}
                          className={`opcion-subcategoria-card ${subcategoriasSeleccionadas.includes(subcategoria.id) ? "selected" : ""}`}
                          onClick={() => handleSubcategoriaChange(subcategoria.id)}
                        >
                          <div className="subcategoria-checkbox">
                            <input
                              type="checkbox"
                              id={`subcategoria-${subcategoria.id}`}
                              checked={subcategoriasSeleccionadas.includes(subcategoria.id)}
                              onChange={() => {}}
                              className="checkbox-subcategoria"
                            />
                            <label htmlFor={`subcategoria-${subcategoria.id}`} className="etiqueta-subcategoria">
                              {subcategoria.nombre}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errores.subcategoriasIds && <span className="mensaje-error">{errores.subcategoriasIds}</span>}
                  </div>
                )}

                {!formulario.categoriaNombre && (
                  <div className="mensaje-seleccion-categoria">
                    <FaExclamationTriangle className="icono-mensaje" />
                    <p>Seleccione una categoría para ver las subcategorías disponibles</p>
                  </div>
                )}

                {formulario.categoriaNombre && subcategoriasPorCategoria.length === 0 && (
                  <div className="mensaje-sin-subcategorias">
                    <FaExclamationTriangle className="icono-mensaje" />
                    <p>No hay subcategorías disponibles para esta categoría</p>
                  </div>
                )}
              </div>

              {/* Tab: Imagen */}
              <div className={`tab-content ${activeTab === "imagen" ? "active" : ""}`}>
                <div className="form-group">
                  <label className="etiqueta-campo">Imagen del producto:</label>
                  <div className="contenedor-imagen-producto-mejorado">
                    {formulario.imagen ? (
                      <div className="preview-imagen-mejorado">
                        <img
                          src={formulario.imagen || "/placeholder.svg"}
                          alt="Vista previa"
                          className="imagen-preview-grande"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=300&width=300"
                          }}
                        />
                        <div className="controles-imagen">
                          <button
                            type="button"
                            className="boton-eliminar-imagen-mejorado"
                            onClick={() => onChange({ target: { name: "imagen", value: "" } })}
                          >
                            <FaTrash /> Eliminar imagen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="sin-imagen-grande">
                        <FaImage className="icono-sin-imagen-grande" />
                        <span>Sin imagen</span>
                        <p className="texto-ayuda-imagen">Sube una imagen para mostrar tu producto</p>
                        <CloudinaryUploadWidget onUpload={(url) => onImagenSubida(url)} />
                      </div>
                    )}

                    {formulario.imagen && (
                      <div className="seccion-subir-imagen">
                        <p className="texto-cambiar-imagen">¿Quieres cambiar la imagen?</p>
                        <CloudinaryUploadWidget onUpload={(url) => onImagenSubida(url)} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="modal-pie">
          <div className="indicador-pasos">
            <span
              className={`paso ${activeTab === "general" ? "activo" : activeTab === "detalles" || activeTab === "imagen" ? "completado" : ""}`}
            ></span>
            <span
              className={`paso ${activeTab === "detalles" ? "activo" : activeTab === "imagen" ? "completado" : ""}`}
            ></span>
            <span className={`paso ${activeTab === "imagen" ? "activo" : ""}`}></span>
          </div>
          <div className="botones-navegacion">
            {activeTab !== "general" && (
              <button
                type="button"
                className="boton-anterior"
                onClick={() => setActiveTab(activeTab === "detalles" ? "general" : "detalles")}
              >
                Anterior
              </button>
            )}

            {activeTab !== "imagen" ? (
              <button
                type="button"
                className="boton-siguiente"
                onClick={() => setActiveTab(activeTab === "general" ? "detalles" : "imagen")}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                className="boton-confirmar"
                onClick={(e) => {
                  e.preventDefault()
                  onSubmit()
                }}
              >
                {modoEdicion ? "Actualizar" : "Guardar"}
              </button>
            )}
          </div>
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

const ProductosAdmin = () => {
  const navigate = useNavigate()

  // Estados para productos
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false)
  const [modalEliminarProducto, setModalEliminarProducto] = useState(false)

  // Estados para categorías y subcategorías
  const [categorias, setCategorias] = useState([])
  const [subcategoriasPorCategoria, setSubcategoriasPorCategoria] = useState([])
  const [todasLasSubcategorias, setTodasLasSubcategorias] = useState([])

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    busqueda: "",
    categoria: "",
    subcategoria: "",
  })

  // Estados para formulario
  const [formularioProducto, setFormularioProducto] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    existencia: 0,
    categoriaNombre: "",
    imagen: "",
    subcategoriasIds: [],
    subcategorias: [],
  })

  // Estados para UI
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [modoEdicionProducto, setModoEdicionProducto] = useState(false)
  const [errores, setErrores] = useState({})

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
    cargarProductos()
    cargarCategorias()
    cargarTodasLasSubcategorias()
  }, [])

  // Filtrar productos cuando cambian los filtros
  useEffect(() => {
    let productosFiltradosTemp = [...productos]

    // Filtro por búsqueda de texto
    if (filtros.busqueda.trim() !== "") {
      const terminoBusqueda = filtros.busqueda.toLowerCase()
      productosFiltradosTemp = productosFiltradosTemp.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(terminoBusqueda) ||
          (producto.descripcion && producto.descripcion.toLowerCase().includes(terminoBusqueda)) ||
          (producto.categoria && producto.categoria.nombre.toLowerCase().includes(terminoBusqueda)),
      )
    }

    // Filtro por categoría
    if (filtros.categoria !== "") {
      productosFiltradosTemp = productosFiltradosTemp.filter(
        (producto) => producto.categoria && producto.categoria.nombre === filtros.categoria,
      )
    }

    // Filtro por subcategoría
    if (filtros.subcategoria !== "") {
      productosFiltradosTemp = productosFiltradosTemp.filter((producto) =>
        producto.subcategorias?.some((sub) => sub.nombre === filtros.subcategoria),
      )
    }

    setProductosFiltrados(productosFiltradosTemp)
  }, [filtros, productos])

  // Cargar subcategorías cuando cambia la categoría seleccionada en el formulario
  useEffect(() => {
    if (formularioProducto.categoriaNombre) {
      const categoriaSeleccionada = categorias.find((cat) => cat.nombre === formularioProducto.categoriaNombre)
      if (categoriaSeleccionada) {
        cargarSubcategoriasPorCategoria(categoriaSeleccionada.id)
      }
    } else {
      setSubcategoriasPorCategoria([])
    }
  }, [formularioProducto.categoriaNombre, categorias])

  // Función para cargar productos desde la API
  const cargarProductos = async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/productos", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setProductos(data)
      setProductosFiltrados(data)
      setCargando(false)
    } catch (err) {
      console.error("Error al cargar productos:", err)
      setError("Error al cargar los productos. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  // Función para cargar categorías desde la API
  const cargarCategorias = async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/categorias", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setCategorias(data)
      setCargando(false)
    } catch (err) {
      console.error("Error al cargar categorías:", err)
      setError("Error al cargar las categorías. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  // Función para cargar todas las subcategorías
  const cargarTodasLasSubcategorias = async () => {
    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/subcategorias", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Error al cargar subcategorías: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setTodasLasSubcategorias(data)
    } catch (err) {
      console.error("Error al cargar subcategorías:", err)
    }
  }

  // Función para cargar subcategorías por categoría
  const cargarSubcategoriasPorCategoria = async (categoriaId) => {
    try {
      const response = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/subcategorias/by-categoria/${categoriaId}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Error al cargar subcategorías: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setSubcategoriasPorCategoria(data)
      return data
    } catch (err) {
      console.error("Error al cargar subcategorías:", err)
      return []
    }
  }

  // Manejadores para filtros
  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = { ...filtros, [campo]: valor }

    // Si cambia la categoría, resetear la subcategoría
    if (campo === "categoria") {
      nuevosFiltros.subcategoria = ""
    }

    setFiltros(nuevosFiltros)
  }

  // Obtener subcategorías disponibles para el filtro basado en la categoría seleccionada
  const getSubcategoriasParaFiltro = () => {
    if (!filtros.categoria) {
      return todasLasSubcategorias
    }

    // Filtrar subcategorías basado en los productos actuales que pertenecen a la categoría seleccionada
    const productosDeCategoria = productos.filter(
      (producto) => producto.categoria && producto.categoria.nombre === filtros.categoria,
    )

    // Extraer todas las subcategorías únicas de estos productos
    const subcategoriasUnicas = []
    const subcategoriasVistas = new Set()

    productosDeCategoria.forEach((producto) => {
      if (producto.subcategorias && producto.subcategorias.length > 0) {
        producto.subcategorias.forEach((sub) => {
          if (!subcategoriasVistas.has(sub.id)) {
            subcategoriasVistas.add(sub.id)
            subcategoriasUnicas.push(sub)
          }
        })
      }
    })

    return subcategoriasUnicas
  }

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltros({
      busqueda: "",
      categoria: "",
      subcategoria: "",
    })
  }

  // Manejadores para formulario de producto
  const handleChangeProducto = (e) => {
    const { name, value } = e.target

    // Validar campos numéricos
    if (name === "precio" || name === "existencia") {
      if (value !== "" && Number(value) < 0) return
    }

    setFormularioProducto({
      ...formularioProducto,
      [name]: value,
    })

    // Limpiar error del campo
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: null,
      })
    }
  }

  // Manejar subida de imagen
  const handleImagenSubida = (url) => {
    setFormularioProducto({
      ...formularioProducto,
      imagen: url,
    })
  }

  // Validar formulario
  const validarFormularioProducto = () => {
    const nuevosErrores = {}

    // Validar campos requeridos
    if (!formularioProducto.nombre || formularioProducto.nombre.trim() === "") {
      nuevosErrores.nombre = "El nombre es obligatorio"
    } else if (formularioProducto.nombre.length > 255) {
      nuevosErrores.nombre = "El nombre no puede tener más de 255 caracteres"
    }

    if (!formularioProducto.precio || formularioProducto.precio <= 0) {
      nuevosErrores.precio = "El precio es obligatorio y debe ser mayor a 0"
    }

    if (!formularioProducto.existencia || formularioProducto.existencia < 0) {
      nuevosErrores.existencia = "La existencia es obligatoria y no puede ser negativa"
    }

    if (!formularioProducto.categoriaNombre) {
      nuevosErrores.categoriaNombre = "Debe seleccionar una categoría"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Modificar la función iniciarEdicionProducto para asegurar que las subcategorías se carguen correctamente
  const iniciarEdicionProducto = async (producto) => {
    try {
      // Primero, cargar la categoría para asegurar que las subcategorías estén disponibles
      if (producto.categoria) {
        const categoriaSeleccionada = categorias.find((cat) => cat.nombre === producto.categoria.nombre)
        if (categoriaSeleccionada) {
          await cargarSubcategoriasPorCategoria(categoriaSeleccionada.id)
        }
      }

      // Preparar subcategorías IDs para el formulario
      const subcategoriasIds = producto.subcategorias ? producto.subcategorias.map((sub) => sub.id) : []

      setFormularioProducto({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion || "",
        precio: producto.precio,
        existencia: producto.existencia,
        categoriaNombre: producto.categoria ? producto.categoria.nombre : "",
        imagen: producto.imagen || "",
        subcategoriasIds: subcategoriasIds,
        subcategorias: producto.subcategorias || [],
      })

      setProductoSeleccionado(producto)
      setModoEdicionProducto(true)
      setMostrarModalProducto(true)
    } catch (error) {
      console.error("Error al iniciar edición de producto:", error)
      setError("Error al cargar los datos del producto para editar.")
    }
  }

  // Modificar la función handleSubmitProducto para asegurar que las subcategorías se envíen correctamente
  const handleSubmitProducto = async (e) => {
    // Evitar que se envíe el formulario automáticamente
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    // Validar formulario
    if (!validarFormularioProducto()) {
      return
    }

    try {
      setCargando(true)
      setError(null)

      let url, method
      if (modoEdicionProducto) {
        url = `https://backendbeat-serverbeat.586pa0.easypanel.host/productos/${formularioProducto.id}`
        method = "PUT"
      } else {
        url = "https://backendbeat-serverbeat.586pa0.easypanel.host/productos"
        method = "POST"
      }

      // Preparar datos para enviar - Asegurarse de que subcategorias sea un array de IDs numéricos
      const datosProducto = {
        nombre: formularioProducto.nombre,
        descripcion: formularioProducto.descripcion || "",
        precio: Number(formularioProducto.precio),
        existencia: Number(formularioProducto.existencia),
        categoriaNombre: formularioProducto.categoriaNombre,
        imagen: formularioProducto.imagen || "",
        subcategorias: Array.isArray(formularioProducto.subcategoriasIds) ? formularioProducto.subcategoriasIds : [],
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(datosProducto),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Error al ${modoEdicionProducto ? "actualizar" : "crear"} producto: ${response.status} ${response.statusText}. ${errorData.message || ""}`,
        )
      }

      // Añadir este log para ver la respuesta del servidor
      const responseData = await response.json()

      // Recargar productos para obtener los datos actualizados
      await cargarProductos()

      setExito(`Producto ${modoEdicionProducto ? "actualizado" : "creado"} correctamente`)
      setMostrarModalProducto(false)
      limpiarFormularioProducto()
      setCargando(false)
    } catch (err) {
      console.error(`Error al ${modoEdicionProducto ? "actualizar" : "crear"} producto:`, err)
      setError(`Error al ${modoEdicionProducto ? "actualizar" : "crear"} el producto. ${err.message}`)
      setCargando(false)
    }
  }

  const confirmarEliminarProducto = (producto) => {
    setProductoSeleccionado(producto)
    setModalEliminarProducto(true)
  }

  const eliminarProductoSeleccionado = async () => {
    try {
      setCargando(true)
      setError(null)

      const response = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/productos/${productoSeleccionado.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar producto: ${response.status} ${response.statusText}`)
      }

      // Recargar productos para obtener los datos actualizados
      await cargarProductos()

      setExito("Producto eliminado correctamente")
      setProductoSeleccionado(null)
      setModalEliminarProducto(false)
      setCargando(false)
    } catch (err) {
      console.error("Error al eliminar producto:", err)
      setError("Error al eliminar el producto. Por favor, intente nuevamente.")
      setCargando(false)
    }
  }

  const limpiarFormularioProducto = () => {
    setFormularioProducto({
      id: "",
      nombre: "",
      descripcion: "",
      precio: 0,
      existencia: 0,
      categoriaNombre: "",
      imagen: "",
      subcategoriasIds: [],
      subcategorias: [],
    })
    setProductoSeleccionado(null)
    setModoEdicionProducto(false)
    setErrores({})
  }

  const abrirModalNuevoProducto = () => {
    limpiarFormularioProducto()
    setModoEdicionProducto(false)
    setMostrarModalProducto(true)
  }

  // Columnas para la tabla de productos
  const columnasProductos = [
    {
      id: "imagen",
      header: "Imagen",
      cell: (producto) => (
        <div className="celda-imagen">
          {producto.imagen ? (
            <img
              src={producto.imagen || "/placeholder.svg"}
              alt={producto.nombre}
              className="imagen-producto-tabla"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.svg?height=60&width=60"
              }}
            />
          ) : (
            <div className="sin-imagen-tabla">
              <FaImage />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "nombre",
      header: "Nombre",
      cell: (producto) => <div className="celda-nombre">{producto.nombre}</div>,
    },
    {
      id: "descripcion",
      header: "Descripción",
      cell: (producto) => (
        <div className="celda-descripcion" title={producto.descripcion}>
          {producto.descripcion || "Sin descripción"}
        </div>
      ),
    },
    {
      id: "precio",
      header: "Precio",
      cell: (producto) => <div className="celda-precio">${Number(producto.precio).toFixed(2)}</div>,
    },
    {
      id: "existencia",
      header: "Existencia",
      cell: (producto) => <div className="celda-existencia">{producto.existencia}</div>,
    },
    {
      id: "categoria",
      header: "Categoría",
      cell: (producto) => (
        <div className="celda-categoria">{producto.categoria ? producto.categoria.nombre : "Sin categoría"}</div>
      ),
    },
    {
      id: "subcategorias",
      header: "Subcategorías",
      cell: (producto) => (
        <div className="celda-subcategorias">
          {producto.subcategorias && producto.subcategorias.length > 0
            ? producto.subcategorias.map((sub) => sub.nombre).join(", ")
            : "Sin subcategorías"}
        </div>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: (producto) => (
        <div className="acciones-producto">
          <button
            className="boton-accion editar"
            onClick={() => iniciarEdicionProducto(producto)}
            title="Editar producto"
          >
            <FaEdit />
          </button>
          <button
            className="boton-accion eliminar"
            onClick={() => confirmarEliminarProducto(producto)}
            title="Eliminar producto"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ]

  // Agregar este useEffect después de los otros useEffect existentes:
  useEffect(() => {
    if (filtros.categoria) {
      const categoriaSeleccionada = categorias.find((cat) => cat.nombre === filtros.categoria)
      if (categoriaSeleccionada) {
        // Cargar subcategorías específicas para esta categoría
        cargarSubcategoriasPorCategoria(categoriaSeleccionada.id).then(() => {
          // Actualizar todasLasSubcategorias con las nuevas subcategorías cargadas
          setTodasLasSubcategorias((prev) => {
            const nuevasSubcategorias = [...prev]
            subcategoriasPorCategoria.forEach((sub) => {
              if (!nuevasSubcategorias.find((existing) => existing.id === sub.id)) {
                nuevasSubcategorias.push(sub)
              }
            })
            return nuevasSubcategorias
          })
        })
      }
    }
  }, [filtros.categoria, categorias])

  return (
    <div className="contenedor-productos-admin">
      <h1 className="titulo-seccion">Gestión de Productos</h1>

      {/* Mostrar alertas de error o éxito */}
      {error && (
        <div className="alerta alerta-error">
          <div className="alerta-icono">
            <FaExclamationTriangle />
          </div>
          <div className="alerta-mensaje">{error}</div>
          <button className="alerta-cerrar" onClick={() => setError(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      {exito && (
        <div className="alerta alerta-exito">
          <div className="alerta-icono">
            <FaExclamationTriangle />
          </div>
          <div className="alerta-mensaje">{exito}</div>
          <button className="alerta-cerrar" onClick={() => setExito(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* Cabecera de sección con filtros mejorados */}
      <div className="cabecera-seccion">
        <h2 className="subtitulo-seccion">Productos</h2>
        <div className="controles-cabecera">
          <div className="campo-busquedap">
            <FaSearch className="icono-busqueda" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filtros.busqueda}
              onChange={(e) => handleFiltroChange("busqueda", e.target.value)}
              className="input-busquedap"
            />
          </div>
          <button className="boton-nuevo-producto" onClick={abrirModalNuevoProducto}>
            <FaPlus /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Sección de filtros */}
      <div className="seccion-filtros">
        <div className="filtros-contenedor">
          <div className="filtro-grupo">
            <FaFilter className="icono-filtro" />
            <span className="etiqueta-filtro">Filtros:</span>
          </div>

          <div className="filtro-grupo">
            <label htmlFor="filtro-categoria" className="etiqueta-filtro">
              Categoría:
            </label>
            <select
              id="filtro-categoria"
              value={filtros.categoria}
              onChange={(e) => handleFiltroChange("categoria", e.target.value)}
              className="select-filtro"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-grupo">
            <label htmlFor="filtro-subcategoria" className="etiqueta-filtro">
              Subcategoría:
            </label>
            <select
              id="filtro-subcategoria"
              value={filtros.subcategoria}
              onChange={(e) => handleFiltroChange("subcategoria", e.target.value)}
              className="select-filtro"
              disabled={!filtros.categoria && todasLasSubcategorias.length === 0}
            >
              <option value="">Todas las subcategorías</option>
              {getSubcategoriasParaFiltro().map((subcategoria) => (
                <option key={subcategoria.id} value={subcategoria.nombre}>
                  {subcategoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {(filtros.busqueda || filtros.categoria || filtros.subcategoria) && (
            <button className="boton-limpiar-filtros" onClick={limpiarFiltros}>
              <FaTimes /> Limpiar filtros
            </button>
          )}
        </div>

        {/* Indicador de resultados */}
        <div className="indicador-resultados">
          <span>
            Mostrando {productosFiltrados.length} de {productos.length} productos
          </span>
          {(filtros.busqueda || filtros.categoria || filtros.subcategoria) && (
            <span className="texto-filtros-activos"> (filtros aplicados)</span>
          )}
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="contenedor-tabla">
        {cargando ? (
          <Cargando mensaje="Cargando productos..." />
        ) : productosFiltrados.length === 0 ? (
          <div className="mensaje-sin-datos">
            <FaExclamationTriangle className="icono-advertencia" />
            {productos.length === 0 ? (
              <p>No se encontraron productos. Crea un nuevo producto para comenzar.</p>
            ) : (
              <p>No se encontraron productos que coincidan con los filtros aplicados.</p>
            )}
          </div>
        ) : (
          <TablaResponsiva
            columnas={columnasProductos}
            datos={productosFiltrados}
            idTabla="tabla-productos"
            claseTabla="tabla-productos"
          />
        )}
      </div>

      {/* Modal para eliminar producto */}
      {modalEliminarProducto && (
        <ModalConfirmacion
          titulo="Eliminar Producto"
          mensaje={`¿Está seguro que desea eliminar el producto "${productoSeleccionado?.nombre}"? Esta acción no se puede deshacer.`}
          onConfirmar={eliminarProductoSeleccionado}
          onCancelar={() => setModalEliminarProducto(false)}
        />
      )}

      {/* Modal para formulario de producto */}
      {mostrarModalProducto && (
        <ModalFormularioProducto
          titulo={modoEdicionProducto ? "Editar Producto" : "Nuevo Producto"}
          formulario={formularioProducto}
          modoEdicion={modoEdicionProducto}
          onChange={handleChangeProducto}
          onSubmit={handleSubmitProducto}
          onCancelar={() => setMostrarModalProducto(false)}
          categorias={categorias}
          subcategoriasPorCategoria={subcategoriasPorCategoria}
          onImagenSubida={handleImagenSubida}
          errores={errores}
        />
      )}
    </div>
  )
}

export default ProductosAdmin
