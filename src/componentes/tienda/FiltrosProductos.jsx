"use client"

import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FaAngleDown, FaAngleUp, FaStar, FaRegStar, FaCheck } from "react-icons/fa"
import { CartContext } from "../../context/CartContext" // Importar el contexto del carrito
import "./FiltrosProductos.css"

// 🔥 Función para sanitizar búsqueda
const sanitizeInput = (input) => {
  return input
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/['";$%&()=+]/g, "")
    .trim()
}

const FiltrosProductos = ({ categoria, productos = [], busqueda, onAgregarAlCarrito, productosAgregados = {} }) => {
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [filtrosAplicados, setFiltrosAplicados] = useState({})
  const [expandirFiltro, setExpandirFiltro] = useState({})
  const [rangoPrecio, setRangoPrecio] = useState([0, 2000])
  const navigate = useNavigate()

  // Obtener el contexto del carrito
  const { addToCart } = useContext(CartContext)

  // Resetear filtros cuando cambia la categoría
  useEffect(() => {
    setFiltrosAplicados({})
    setRangoPrecio([0, 2000])
  }, [categoria])

  const esRopa = categoria.trim().toLowerCase() === "ropa y accesorios"
  const esEntrenamiento = categoria.trim().toLowerCase() === "entrenamiento"
  const esTecnologia = categoria.trim().toLowerCase() === "tecnología"

  // Filtrar productos según los criterios seleccionados
  useEffect(() => {
    let filtrados = productos.filter((p) => p.categoria.trim().toLowerCase() === categoria.trim().toLowerCase())

    // Aplicar filtros seleccionados
    Object.entries(filtrosAplicados).forEach(([tipo, valores]) => {
      if (valores.length > 0) {
        filtrados = filtrados.filter((p) => valores.includes(p[tipo]))
      }
    })

    // Filtrar por rango de precio
    filtrados = filtrados.filter((p) => {
      const precioNumerico = Number.parseFloat(p.precio.replace(/[^0-9.-]+/g, ""))
      return precioNumerico >= rangoPrecio[0] && precioNumerico <= rangoPrecio[1]
    })

    // Filtrar por búsqueda
    if (busqueda && busqueda.trim() !== "") {
      const sanitizedSearch = sanitizeInput(busqueda)
      filtrados = filtrados.filter((p) => p.nombre.toLowerCase().includes(sanitizedSearch.toLowerCase()))
    }

    setProductosFiltrados(filtrados)
  }, [categoria, filtrosAplicados, productos, rangoPrecio, busqueda])

  // Aplicar o quitar un filtro
  const aplicarFiltro = (tipo, valor) => {
    setFiltrosAplicados((prev) => {
      const valoresPrevios = prev[tipo] || []
      const nuevoEstado = valoresPrevios.includes(valor)
        ? valoresPrevios.filter((v) => v !== valor)
        : [...valoresPrevios, valor]

      return { ...prev, [tipo]: nuevoEstado }
    })
  }

  // Obtener opciones únicas para un tipo de filtro
  const obtenerOpcionesFiltro = (tipo) => {
    return [...new Set(productos.filter((p) => p.categoria === categoria).map((p) => p[tipo]))].filter(Boolean)
  }

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltrosAplicados({})
    setRangoPrecio([0, 2000])
  }

  // Expandir o contraer secciones de filtros
  const toggleExpandirFiltro = (tipo) => {
    setExpandirFiltro((prev) => ({ ...prev, [tipo]: !prev[tipo] }))
  }

  // Renderizar estrellas para calificación
  const renderEstrellas = (cantidad) => {
    return (
      <div className="estrellas">
        {[...Array(5)].map((_, i) =>
          i < cantidad ? <FaStar key={i} className="star-filled" /> : <FaRegStar key={i} className="star-empty" />,
        )}
      </div>
    )
  }

  // Función para manejar la adición de productos al carrito
  const manejarAgregarAlCarrito = (producto) => {
    // Si se proporcionó una función onAgregarAlCarrito, usarla
    if (onAgregarAlCarrito) {
      onAgregarAlCarrito(producto)
    } else {
      // De lo contrario, usar directamente el contexto
      addToCart(producto)
    }
  }

  // Función para ver detalle de un producto
  const verDetalleProducto = (producto) => {
    navigate(`/detalle-producto/${producto.id}`, { state: { producto } })
  }

  return (
    <div className="contenedor-filtros-productos">
      {/* 🔥 Sidebar de Filtros */}
      <aside className="sidebar-filtros">
        <section className="filtros">
          <div className="titulo-filtros">
            <h3>Filtros para {categoria}</h3>
            <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
              Limpiar Filtros
            </button>
          </div>

          {/* 🔥 Subcategorías */}
          <div className="filtro">
            <h4>Subcategorías</h4>
            {obtenerOpcionesFiltro("subcategoria")
              .slice(0, expandirFiltro["subcategoria"] ? undefined : 3)
              .map((valor) => (
                <div key={valor} className="opcion">
                  <input
                    type="radio"
                    id={`subcategoria-${valor}`}
                    name="subcategoria"
                    onChange={() => aplicarFiltro("subcategoria", valor)}
                    checked={filtrosAplicados.subcategoria?.includes(valor)}
                  />
                  <label htmlFor={`subcategoria-${valor}`}>{valor}</label>
                </div>
              ))}
            {obtenerOpcionesFiltro("subcategoria").length > 3 && (
              <button className="ver-mas" onClick={() => toggleExpandirFiltro("subcategoria")}>
                {expandirFiltro["subcategoria"] ? "Ver menos" : "Ver más"}{" "}
                {expandirFiltro["subcategoria"] ? <FaAngleUp /> : <FaAngleDown />}
              </button>
            )}
          </div>

          {/* 🔥 Marcas */}
          <div className="filtro">
            <h4>Marcas</h4>
            {obtenerOpcionesFiltro("marca")
              .slice(0, expandirFiltro["marca"] ? undefined : 3)
              .map((valor) => (
                <div key={valor} className="opcion">
                  <input
                    type="checkbox"
                    id={`marca-${valor}`}
                    onChange={() => aplicarFiltro("marca", valor)}
                    checked={filtrosAplicados.marca?.includes(valor)}
                  />
                  <label htmlFor={`marca-${valor}`}>{valor}</label>
                </div>
              ))}
            {obtenerOpcionesFiltro("marca").length > 3 && (
              <button className="ver-mas" onClick={() => toggleExpandirFiltro("marca")}>
                {expandirFiltro["marca"] ? "Ver menos" : "Ver más"}{" "}
                {expandirFiltro["marca"] ? <FaAngleUp /> : <FaAngleDown />}
              </button>
            )}
          </div>

          {/* 🔥 Precio */}
          <div className="filtro">
            <h4>Precios</h4>
            <input
              type="range"
              min="0"
              max="2000"
              value={rangoPrecio[1]}
              onChange={(e) => setRangoPrecio([rangoPrecio[0], Number.parseInt(e.target.value)])}
            />
            <p>0 - {rangoPrecio[1]} MXN</p>
          </div>

          {/* 🔥 Calificación */}
          <div className="filtro">
            <h4>Calificación</h4>
            {[5, 4, 3].map((valor) => (
              <div key={valor} className="opcion">
                <input
                  type="radio"
                  id={`calificacion-${valor}`}
                  name="calificacion"
                  onChange={() => aplicarFiltro("calificacion", valor)}
                  checked={filtrosAplicados.calificacion?.includes(valor)}
                />
                <label htmlFor={`calificacion-${valor}`}>{renderEstrellas(valor)} o más</label>
              </div>
            ))}
          </div>

          {/* 🔥 Descuentos */}
          <div className="filtro">
            <h4>Descuentos</h4>
            {obtenerOpcionesFiltro("descuento").map((valor) => (
              <div key={valor} className="opcion">
                <input
                  type="checkbox"
                  id={`descuento-${valor}`}
                  onChange={() => aplicarFiltro("descuento", valor)}
                  checked={filtrosAplicados.descuento?.includes(valor)}
                />
                <label htmlFor={`descuento-${valor}`}>{valor}</label>
              </div>
            ))}
          </div>

          {/* 🔥 Género (solo si es ropa) */}
          {esRopa && (
            <div className="filtro">
              <h4>Género</h4>
              {["Hombre", "Mujer"].map((valor) => (
                <div key={valor} className="opcion">
                  <input
                    type="checkbox"
                    id={`genero-${valor}`}
                    onChange={() => aplicarFiltro("genero", valor)}
                    checked={filtrosAplicados.genero?.includes(valor)}
                  />
                  <label htmlFor={`genero-${valor}`}>{valor}</label>
                </div>
              ))}
            </div>
          )}

          {/* 🔥 Tallas (solo si es ropa) */}
          {esRopa && (
            <div className="filtro">
              <h4>Tallas</h4>
              {["S", "M", "L", "XL"].map((valor) => (
                <div key={valor} className="opcion">
                  <input
                    type="checkbox"
                    id={`talla-${valor}`}
                    onChange={() => aplicarFiltro("talla", valor)}
                    checked={filtrosAplicados.talla?.includes(valor)}
                  />
                  <label htmlFor={`talla-${valor}`}>{valor}</label>
                </div>
              ))}
            </div>
          )}

          {/* 🔥 Colores (solo si es ropa) */}
          {esRopa && (
            <div className="filtro">
              <h4>Color</h4>
              <div className="colores">
                {["blue", "black", "red", "white", "gray", "green"].map((color) => (
                  <div
                    key={color}
                    className={`color ${filtrosAplicados.color?.includes(color) ? "seleccionado" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => aplicarFiltro("color", color)}
                    title={color.charAt(0).toUpperCase() + color.slice(1)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 🔥 Tipo (solo si es entrenamiento o tecnología) */}
          {(esEntrenamiento || esTecnologia) && (
            <div className="filtro">
              <h4>Tipo</h4>
              {obtenerOpcionesFiltro("tipo").map((valor) => (
                <div key={valor} className="opcion">
                  <input
                    type="checkbox"
                    id={`tipo-${valor}`}
                    onChange={() => aplicarFiltro("tipo", valor)}
                    checked={filtrosAplicados.tipo?.includes(valor)}
                  />
                  <label htmlFor={`tipo-${valor}`}>{valor}</label>
                </div>
              ))}
            </div>
          )}
        </section>
      </aside>

      {/* 🔥 Contenedor de Productos */}
      <section className="contenedor-productos-filtros">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <div key={producto.id} className="tarjeta-producto" onClick={() => verDetalleProducto(producto)}>
              {producto.descuento && <div className="etiqueta-descuento">{producto.descuento}</div>}
              <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} className="imagen-producto" />
              <h3 className="nombre-producto">{producto.nombre}</h3>
              <p className="precio-producto">{producto.precio}</p>
              <button
                className={`btn-agregar ${productosAgregados[producto.id] ? "agregado" : ""}`}
                onClick={(e) => {
                  e.stopPropagation() // Evitar que el clic se propague a la tarjeta
                  manejarAgregarAlCarrito(producto)
                }}
                disabled={productosAgregados[producto.id]}
              >
                {productosAgregados[producto.id] ? (
                  <>
                    <FaCheck /> Agregado
                  </>
                ) : (
                  "Agregar al carrito"
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="no-productos">
            <p>No hay productos disponibles con los filtros seleccionados.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default FiltrosProductos

