"use client"

import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FaAngleDown, FaAngleUp, FaStar, FaRegStar, FaCheck } from "react-icons/fa"
import { CartContext } from "../../context/CartContext"
import "./FiltrosProductos.css"

// Función para sanitizar búsqueda
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
  const [rangoPrecio, setRangoPrecio] = useState([0, 5000])
  const [subcategorias, setSubcategorias] = useState([])
  const [cargandoSubcategorias, setCargandoSubcategorias] = useState(false)
  const navigate = useNavigate()

  // Obtener el contexto del carrito
  const { addToCart } = useContext(CartContext)

  // Cargar subcategorías desde la API cuando cambia la categoría
  useEffect(() => {
    const cargarSubcategorias = async () => {
      if (!categoria) return

      try {
        setCargandoSubcategorias(true)
        console.log("Cargando subcategorías para categoría:", categoria)

        // Buscar la categoría por nombre para obtener su ID
        const categoriasResponse = await fetch("http://localhost:3000/categorias", {
          method: "GET",
          credentials: "include",
        })

        if (categoriasResponse.ok) {
          const categoriasData = await categoriasResponse.json()
          console.log("Categorías obtenidas:", categoriasData)

          const categoriaEncontrada = categoriasData.find((cat) => cat.nombre.toLowerCase() === categoria.toLowerCase())
          console.log("Categoría encontrada:", categoriaEncontrada)

          if (categoriaEncontrada) {
            // Cargar subcategorías de esta categoría - usar el endpoint correcto
            const subcategoriasResponse = await fetch(
              `http://localhost:3000/subcategorias/by-categoria/${categoriaEncontrada.id}`,
              {
                method: "GET",
                credentials: "include",
              },
            )

            console.log("Respuesta subcategorías:", subcategoriasResponse.status)

            if (subcategoriasResponse.ok) {
              const subcategoriasData = await subcategoriasResponse.json()
              console.log("Subcategorías obtenidas:", subcategoriasData)
              setSubcategorias(subcategoriasData)
            } else {
              console.error("Error al cargar subcategorías:", subcategoriasResponse.status)
              setSubcategorias([])
            }
          } else {
            console.log("No se encontró la categoría")
            setSubcategorias([])
          }
        }
      } catch (error) {
        console.error("Error al cargar subcategorías:", error)
        setSubcategorias([])
      } finally {
        setCargandoSubcategorias(false)
      }
    }

    cargarSubcategorias()
  }, [categoria])

  // Resetear filtros cuando cambia la categoría
  useEffect(() => {
    setFiltrosAplicados({})
    setRangoPrecio([0, 5000])
  }, [categoria])

  // Filtrar productos según los criterios seleccionados
  useEffect(() => {
    console.log("Filtrando productos para categoría:", categoria)
    console.log("Productos disponibles:", productos.length)

    let filtrados = productos.filter((p) => {
      // Verificar si el producto pertenece a la categoría seleccionada
      const categoriaProducto = p.categoria || (p.categoria && p.categoria.nombre)
      const perteneceCategoria = categoriaProducto && categoriaProducto.toLowerCase() === categoria.toLowerCase()

      console.log(`Producto ${p.nombre}: categoría=${categoriaProducto}, pertenece=${perteneceCategoria}`)
      return perteneceCategoria
    })

    console.log("Productos filtrados por categoría:", filtrados.length)

    // Aplicar filtros de subcategorías
    if (filtrosAplicados.subcategoria && filtrosAplicados.subcategoria.length > 0) {
      filtrados = filtrados.filter((p) => {
        const subcategoriasProducto = p.subcategorias || []
        return subcategoriasProducto.some((sub) => filtrosAplicados.subcategoria.includes(sub.nombre))
      })
    }

    // Aplicar otros filtros seleccionados
    Object.entries(filtrosAplicados).forEach(([tipo, valores]) => {
      if (valores.length > 0 && tipo !== "subcategoria") {
        filtrados = filtrados.filter((p) => {
          const valorProducto = p[tipo]
          return valorProducto && valores.includes(valorProducto)
        })
      }
    })

    // Filtrar por rango de precio
    filtrados = filtrados.filter((p) => {
      const precioNumerico = p.precioNumerico || Number.parseFloat(p.precio.replace(/[^0-9.-]+/g, ""))
      return precioNumerico >= rangoPrecio[0] && precioNumerico <= rangoPrecio[1]
    })

    // Filtrar por búsqueda
    if (busqueda && busqueda.trim() !== "") {
      const sanitizedSearch = sanitizeInput(busqueda)
      filtrados = filtrados.filter(
        (p) =>
          p.nombre.toLowerCase().includes(sanitizedSearch.toLowerCase()) ||
          p.descripcion?.toLowerCase().includes(sanitizedSearch.toLowerCase()),
      )
    }

    console.log("Productos finales filtrados:", filtrados.length)
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
    return [
      ...new Set(
        productos
          .filter((p) => {
            const categoriaProducto = p.categoria || (p.categoria && p.categoria.nombre)
            return categoriaProducto && categoriaProducto.toLowerCase() === categoria.toLowerCase()
          })
          .map((p) => p[tipo])
          .filter(Boolean),
      ),
    ]
  }

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltrosAplicados({})
    setRangoPrecio([0, 5000])
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
    if (onAgregarAlCarrito) {
      onAgregarAlCarrito(producto)
    } else {
      addToCart(producto)
    }
  }

  // Función para ver detalle de un producto
  const verDetalleProducto = (producto) => {
    navigate(`/detalle-producto/${producto.id}`, { state: { producto } })
  }

  return (
    <div className="contenedor-filtros-productos">
      {/* Sidebar de Filtros */}
      <aside className="sidebar-filtros">
        <section className="filtros">
          <div className="titulo-filtros">
            <h3>Filtros para {categoria}</h3>
            <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
              Limpiar Filtros
            </button>
          </div>

          {/* Subcategorías desde la API */}
          {cargandoSubcategorias ? (
            <div className="filtro">
              <h4>Subcategorías</h4>
              <p>Cargando subcategorías...</p>
            </div>
          ) : subcategorias.length > 0 ? (
            <div className="filtro">
              <h4>Subcategorías</h4>
              {subcategorias.slice(0, expandirFiltro["subcategoria"] ? undefined : 5).map((subcat) => (
                <div key={subcat.id} className="opcion">
                  <input
                    type="checkbox"
                    id={`subcategoria-${subcat.id}`}
                    onChange={() => aplicarFiltro("subcategoria", subcat.nombre)}
                    checked={filtrosAplicados.subcategoria?.includes(subcat.nombre)}
                  />
                  <label htmlFor={`subcategoria-${subcat.id}`}>{subcat.nombre}</label>
                </div>
              ))}
              {subcategorias.length > 5 && (
                <button className="ver-mas" onClick={() => toggleExpandirFiltro("subcategoria")}>
                  {expandirFiltro["subcategoria"] ? "Ver menos" : "Ver más"}{" "}
                  {expandirFiltro["subcategoria"] ? <FaAngleUp /> : <FaAngleDown />}
                </button>
              )}
            </div>
          ) : null}

          {/* Marcas */}
          {obtenerOpcionesFiltro("marca").length > 0 && (
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
          )}

          {/* Precio */}
          <div className="filtro">
            <h4>Precios</h4>
            <input
              type="range"
              min="0"
              max="5000"
              value={rangoPrecio[1]}
              onChange={(e) => setRangoPrecio([rangoPrecio[0], Number.parseInt(e.target.value)])}
            />
            <p>$0 - ${rangoPrecio[1]} MXN</p>
          </div>

          {/* Descuentos */}
          {obtenerOpcionesFiltro("descuento").length > 0 && (
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
          )}
        </section>
      </aside>

      {/* Contenedor de Productos */}
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
                  e.stopPropagation()
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
