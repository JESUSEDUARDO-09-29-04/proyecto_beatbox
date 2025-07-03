"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext"
import "./productos.css"
import { FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from "react-icons/fa"

const ProductosAdmin = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)

  // Estados para el formulario
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precio: "",
    descuento: "0",
    categoria: "",
    subcategoria: "",
    imagen: null,
    stock: "0",
    // Campos dinámicos que aparecerán según la categoría
    talla: "",
    color: "",
    genero: "",
    marca: "",
    peso: "",
    sabor: "",
    duracion: "",
    nivel: "",
    especificaciones: "",
  })

  const [modoEdicion, setModoEdicion] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [errores, setErrores] = useState({})
  const [filtro, setFiltro] = useState("")

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

  // Simulación de datos - Esto se reemplazaría con llamadas a la API
  useEffect(() => {
    // Simular carga de categorías
    setCategorias([
      { id: 1, nombre: "Ropa" },
      { id: 2, nombre: "Suplementos" },
      { id: 3, nombre: "Entrenamiento" },
      { id: 4, nombre: "Tecnología" },
    ])

    // Simular carga de productos
    setProductos([
      {
        id: 1,
        nombre: "Playera Deportiva",
        descripcion: "Playera para entrenamiento",
        precio: "299.99",
        descuento: "10",
        categoria: "Ropa",
        subcategoria: "Playera",
        stock: "50",
        talla: "M",
        color: "Negro",
        genero: "Hombre",
        imagen: "playera.jpg",
      },
      {
        id: 2,
        nombre: "Proteína Whey",
        descripcion: "Proteína de suero de leche",
        precio: "899.99",
        descuento: "0",
        categoria: "Suplementos",
        subcategoria: "Proteínas",
        stock: "30",
        peso: "1kg",
        sabor: "Chocolate",
        imagen: "proteina.jpg",
      },
    ])
  }, [])

  // Cargar subcategorías cuando cambia la categoría
  useEffect(() => {
    if (formData.categoria) {
      // Esto se reemplazaría con una llamada a la API
      const subcategoriasMap = {
        Ropa: [
          { id: 1, nombre: "Playera" },
          { id: 2, nombre: "Pantalón" },
          { id: 3, nombre: "Sudadera" },
        ],
        Suplementos: [
          { id: 1, nombre: "Proteínas" },
          { id: 2, nombre: "Creatina" },
          { id: 3, nombre: "Pre-entreno" },
        ],
        Entrenamiento: [
          { id: 1, nombre: "Pesas" },
          { id: 2, nombre: "Bandas" },
          { id: 3, nombre: "Accesorios" },
        ],
        Tecnología: [
          { id: 1, nombre: "Smartwatch" },
          { id: 2, nombre: "Audífonos" },
          { id: 3, nombre: "Accesorios" },
        ],
      }

      setSubcategorias(subcategoriasMap[formData.categoria] || [])
    } else {
      setSubcategorias([])
    }
  }, [formData.categoria])

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    // Validar números
    if (type === "number" && value !== "") {
      if (name === "precio" || name === "descuento") {
        if (Number.parseFloat(value) < 0) return
      } else if (name === "stock") {
        if (Number.parseInt(value) < 0) return
      }
    }

    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    })

    // Limpiar error del campo
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: null,
      })
    }
  }

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {}

    // Validaciones básicas
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio"
    if (!formData.descripcion.trim()) nuevosErrores.descripcion = "La descripción es obligatoria"
    if (!formData.precio.trim()) nuevosErrores.precio = "El precio es obligatorio"
    if (!formData.categoria) nuevosErrores.categoria = "Seleccione una categoría"
    if (!formData.subcategoria) nuevosErrores.subcategoria = "Seleccione una subcategoría"
    if (!formData.stock.trim()) nuevosErrores.stock = "El stock es obligatorio"

    // Validaciones específicas por categoría
    if (formData.categoria === "Ropa") {
      if (!formData.talla) nuevosErrores.talla = "La talla es obligatoria"
      if (!formData.color) nuevosErrores.color = "El color es obligatorio"
      if (!formData.genero) nuevosErrores.genero = "El género es obligatorio"
    } else if (formData.categoria === "Suplementos") {
      if (!formData.peso) nuevosErrores.peso = "El peso es obligatorio"
      if (!formData.sabor) nuevosErrores.sabor = "El sabor es obligatorio"
    } else if (formData.categoria === "Entrenamiento") {
      if (!formData.marca) nuevosErrores.marca = "La marca es obligatoria"
      if (!formData.nivel) nuevosErrores.nivel = "El nivel es obligatorio"
    } else if (formData.categoria === "Tecnología") {
      if (!formData.marca) nuevosErrores.marca = "La marca es obligatoria"
      if (!formData.especificaciones) nuevosErrores.especificaciones = "Las especificaciones son obligatorias"
    }

    // Validar formato de precio
    if (formData.precio && !/^\d+(\.\d{1,2})?$/.test(formData.precio)) {
      nuevosErrores.precio = "Formato de precio inválido"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Sanitizar datos
  const sanitizarDatos = (datos) => {
    const datosSanitizados = {}

    // Recorrer cada propiedad y sanitizarla
    Object.keys(datos).forEach((key) => {
      if (typeof datos[key] === "string") {
        // Eliminar scripts y caracteres especiales
        datosSanitizados[key] = datos[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/[<>]/g, "")
      } else {
        datosSanitizados[key] = datos[key]
      }
    })

    return datosSanitizados
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    const datosSanitizados = sanitizarDatos(formData)

    if (modoEdicion) {
      // Actualizar producto existente
      const productosActualizados = productos.map((producto) =>
        producto.id === productoSeleccionado.id ? { ...datosSanitizados, id: producto.id } : producto,
      )
      setProductos(productosActualizados)
      setModoEdicion(false)
    } else {
      // Crear nuevo producto
      const nuevoProducto = {
        ...datosSanitizados,
        id: Date.now(), // Generar ID temporal
      }
      setProductos([...productos, nuevoProducto])
    }

    // Limpiar formulario
    resetFormulario()
  }

  // Resetear formulario
  const resetFormulario = () => {
    setFormData({
      id: "",
      nombre: "",
      descripcion: "",
      precio: "",
      descuento: "0",
      categoria: "",
      subcategoria: "",
      imagen: null,
      stock: "0",
      talla: "",
      color: "",
      genero: "",
      marca: "",
      peso: "",
      sabor: "",
      duracion: "",
      nivel: "",
      especificaciones: "",
    })
    setProductoSeleccionado(null)
    setModoEdicion(false)
    setErrores({})
  }

  // Editar producto
  const editarProducto = (producto) => {
    setFormData({
      ...formData,
      ...producto,
    })
    setProductoSeleccionado(producto)
    setModoEdicion(true)

    // Desplazar hacia el formulario
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Eliminar producto
  const eliminarProducto = (id) => {
    if (window.confirm("¿Está seguro de eliminar este producto?")) {
      const productosActualizados = productos.filter((producto) => producto.id !== id)
      setProductos(productosActualizados)
    }
  }

  // Filtrar productos
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
      producto.subcategoria.toLowerCase().includes(filtro.toLowerCase()),
  )

  // Renderizar campos dinámicos según la categoría
  const renderizarCamposDinamicos = () => {
    if (!formData.categoria) return null

    switch (formData.categoria) {
      case "Ropa":
        return (
          <>
            <div className="form-group">
              <label htmlFor="talla">Talla:</label>
              <select
                id="talla"
                name="talla"
                value={formData.talla}
                onChange={handleChange}
                className={errores.talla ? "error" : ""}
              >
                <option value="">Seleccionar talla</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
              {errores.talla && <span className="error-message">{errores.talla}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="color">Color:</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className={errores.color ? "error" : ""}
              />
              {errores.color && <span className="error-message">{errores.color}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="genero">Género:</label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className={errores.genero ? "error" : ""}
              >
                <option value="">Seleccionar género</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Unisex">Unisex</option>
              </select>
              {errores.genero && <span className="error-message">{errores.genero}</span>}
            </div>
          </>
        )

      case "Suplementos":
        return (
          <>
            <div className="form-group">
              <label htmlFor="peso">Peso/Cantidad:</label>
              <input
                type="text"
                id="peso"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className={errores.peso ? "error" : ""}
                placeholder="Ej: 1kg, 500g, 90 cápsulas"
              />
              {errores.peso && <span className="error-message">{errores.peso}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sabor">Sabor:</label>
              <input
                type="text"
                id="sabor"
                name="sabor"
                value={formData.sabor}
                onChange={handleChange}
                className={errores.sabor ? "error" : ""}
              />
              {errores.sabor && <span className="error-message">{errores.sabor}</span>}
            </div>
          </>
        )

      case "Entrenamiento":
        return (
          <>
            <div className="form-group">
              <label htmlFor="marca">Marca:</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className={errores.marca ? "error" : ""}
              />
              {errores.marca && <span className="error-message">{errores.marca}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="nivel">Nivel:</label>
              <select
                id="nivel"
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                className={errores.nivel ? "error" : ""}
              >
                <option value="">Seleccionar nivel</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Profesional">Profesional</option>
              </select>
              {errores.nivel && <span className="error-message">{errores.nivel}</span>}
            </div>
          </>
        )

      case "Tecnología":
        return (
          <>
            <div className="form-group">
              <label htmlFor="marca">Marca:</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className={errores.marca ? "error" : ""}
              />
              {errores.marca && <span className="error-message">{errores.marca}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="especificaciones">Especificaciones:</label>
              <textarea
                id="especificaciones"
                name="especificaciones"
                value={formData.especificaciones}
                onChange={handleChange}
                className={errores.especificaciones ? "error" : ""}
                rows="4"
              ></textarea>
              {errores.especificaciones && <span className="error-message">{errores.especificaciones}</span>}
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className={`productos-admin-container ${theme === "dark" ? "dark" : ""}`}>
      <div className="productos-header">
        <h1 className="titulo-seccion">{modoEdicion ? "Editar Producto" : "Gestión de Productos"}</h1>
      </div>

      <div className="productos-content">
        <div className="formulario-section">
          <h2 className="section-title">{modoEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>

          <form onSubmit={handleSubmit} className="formulario-producto">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={errores.nombre ? "error" : ""}
                />
                {errores.nombre && <span className="error-message">{errores.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="precio">Precio (MXN):</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errores.precio ? "error" : ""}
                />
                {errores.precio && <span className="error-message">{errores.precio}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="descuento">Descuento (%):</label>
                <input
                  type="number"
                  id="descuento"
                  name="descuento"
                  value={formData.descuento}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock:</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={errores.stock ? "error" : ""}
                />
                {errores.stock && <span className="error-message">{errores.stock}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoria">Categoría:</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={errores.categoria ? "error" : ""}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {errores.categoria && <span className="error-message">{errores.categoria}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="subcategoria">Subcategoría:</label>
                <select
                  id="subcategoria"
                  name="subcategoria"
                  value={formData.subcategoria}
                  onChange={handleChange}
                  disabled={!formData.categoria}
                  className={errores.subcategoria ? "error" : ""}
                >
                  <option value="">Seleccionar subcategoría</option>
                  {subcategorias.map((subcategoria) => (
                    <option key={subcategoria.id} value={subcategoria.nombre}>
                      {subcategoria.nombre}
                    </option>
                  ))}
                </select>
                {errores.subcategoria && <span className="error-message">{errores.subcategoria}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                className={errores.descripcion ? "error" : ""}
              ></textarea>
              {errores.descripcion && <span className="error-message">{errores.descripcion}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="imagen">Imagen:</label>
              <input type="file" id="imagen" name="imagen" onChange={handleChange} accept="image/*" />
            </div>

            {/* Campos dinámicos según la categoría */}
            {renderizarCamposDinamicos()}

            <div className="form-actions">
              <button type="submit" className="btn-guardar">
                <FaSave className="btn-icon" />
                {modoEdicion ? "Actualizar Producto" : "Guardar Producto"}
              </button>
              {modoEdicion && (
                <button type="button" className="btn-cancelar" onClick={resetFormulario}>
                  <FaTimes className="btn-icon" />
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lista-productos-section">
          <div className="section-header">
            <h2 className="section-title">Lista de Productos</h2>
            <div className="filtro-container">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="input-filtro"
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="tabla-productos">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Subcategoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((producto) => (
                    <tr key={producto.id}>
                      <td data-label="Nombre">{producto.nombre}</td>
                      <td data-label="Categoría">{producto.categoria}</td>
                      <td data-label="Subcategoría">{producto.subcategoria}</td>
                      <td data-label="Precio">${producto.precio}</td>
                      <td data-label="Stock">{producto.stock}</td>
                      <td data-label="Acciones">
                        <div className="acciones">
                          <button className="btn-editar" onClick={() => editarProducto(producto)}>
                            <FaEdit />
                          </button>
                          <button className="btn-eliminar" onClick={() => eliminarProducto(producto.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-productos">
                      No hay productos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductosAdmin
