"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import FiltrosProductos from "./FiltrosProductos"
import { CartContext } from "../../context/CartContext"
import { ThemeContext } from "../../context/ThemeContext"
import "./Tienda.css"

// Importación de iconos
import {
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaUser,
  FaAngleDown,
  FaDumbbell,
  FaTshirt,
  FaHeadphones,
  FaFlask,
  FaCheck,
} from "react-icons/fa"

// Función para sanitizar entrada del usuario
const sanitizeInput = (input) => {
  return input
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/['";$%&()=+]/g, "")
    .trim()
}

// Función para convertir kebab-case a formato normal
const formatearCategoria = (categoria) => {
  if (!categoria) return null
  const palabras = categoria.split("-").map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
  if (palabras.join(" ") === "Ropa Y Accesorios") {
    return "Ropa y accesorios"
  }
  return palabras.join(" ")
}

const Tienda = () => {
  const [menuCategoriasAbierto, setMenuCategoriasAbierto] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const navigate = useNavigate()
  const [indice, setIndice] = useState(0)
  const [productosAgregados, setProductosAgregados] = useState({})
  const [productosVisibles, setProductosVisibles] = useState(10)

  // Estados para datos de la API
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriasDestacadas, setCategoriasDestacadas] = useState([])
  const [cargandoProductos, setCargandoProductos] = useState(true)
  const [cargandoCategorias, setCargandoCategorias] = useState(true)
  const [error, setError] = useState("")

  // Obtener el contexto del carrito y del tema
  const { getCartItemsCount, addToCart } = useContext(CartContext)
  const { theme } = useContext(ThemeContext)

  // Obtener el parámetro de categoría de la URL
  const { categoria } = useParams()

  // Cargar categorías desde la API
// Cargar categorías
useEffect(() => {
  const cargarCategorias = async () => {
    try {
      setCargandoCategorias(true);
      setError("");

      const response = await fetch(`${backendUrl}/categorias`, { credentials: "include" });
      if (!response.ok) throw new Error("Error al cargar categorías");

      const data = await response.json();

      // Guardar en localStorage
      localStorage.setItem("categorias_cache", JSON.stringify(data));

      const categoriasConIconos = data.map((cat) => ({
        ...cat,
        icono: obtenerIconoCategoria(cat.nombre),
        ruta: "/",
      }));
      setCategorias(categoriasConIconos);
    } catch (error) {
      console.warn("Error al cargar categorías:", error.message);
      const cache = localStorage.getItem("categorias_cache");
      if (cache) {
        const data = JSON.parse(cache);
        const categoriasConIconos = data.map((cat) => ({
          ...cat,
          icono: obtenerIconoCategoria(cat.nombre),
          ruta: "/",
        }));
        setCategorias(categoriasConIconos);
        setError("Mostrando categorías guardadas.");
      } else {
        setError("Error al cargar las categorías");
      }
    } finally {
      setCargandoCategorias(false);
    }
  };

  cargarCategorias();
}, []);

useEffect(() => {
  const obtenerDatos = async () => {
    try {
      const productosRes = await fetch("/productos")
      if (!productosRes.ok) throw new Error("Error al cargar productos")
      const productos = await productosRes.json()

      // Guardar en caché local
      localStorage.setItem("productos_cache", JSON.stringify(productos))

      const categoriasConImagen = {}
      productos.forEach((producto) => {
        const nombreCat = producto.categoria?.nombre
        if (!nombreCat) return
        if (!categoriasConImagen[nombreCat]) {
          categoriasConImagen[nombreCat] = {
            id: producto.categoriaId || nombreCat,
            nombre: nombreCat,
            imagen: producto.imagen || "/placeholder.svg",
          }
        }
      })
      setCategoriasDestacadas(Object.values(categoriasConImagen))
    } catch (error) {
      console.warn("Error al cargar productos destacados:", error.message)
      const cache = localStorage.getItem("productos_cache")
      if (cache) {
        const productos = JSON.parse(cache)
        const categoriasConImagen = {}
        productos.forEach((producto) => {
          const nombreCat = producto.categoria?.nombre
          if (!nombreCat) return
          if (!categoriasConImagen[nombreCat]) {
            categoriasConImagen[nombreCat] = {
              id: producto.categoriaId || nombreCat,
              nombre: nombreCat,
              imagen: producto.imagen || "/placeholder.svg",
            }
          }
        })
        setCategoriasDestacadas(Object.values(categoriasConImagen))
      }
    }
  }

  obtenerDatos()
}, [])
  // Cargar productos desde la API
const backendUrl = "https://backendbeat-serverbeat.586pa0.easypanel.host";  // URL completa de tu backend

// Cargar productos
useEffect(() => {
  const cargarProductos = async () => {
    try {
      setCargandoProductos(true);
      setError("");

      const response = await fetch(`${backendUrl}/productos`, { credentials: "include" });
      if (!response.ok) throw new Error("Error al cargar productos");

      const data = await response.json();

      // Guardar en localStorage
      localStorage.setItem("productos_cache", JSON.stringify(data));

      const productosFormateados = data.map((producto) => ({
        ...producto,
        precio: `$${Number.parseFloat(producto.precio).toFixed(2)} MXN`,
        precioNumerico: Number.parseFloat(producto.precio),
        imagen: producto.imagen || "/placeholder.svg?height=180&width=180",
        calificacion: producto.calificacion || 5,
        descuento: producto.descuento > 0 ? `${producto.descuento}%` : null,
        caracteristicas: producto.caracteristicas ? producto.caracteristicas.split("\n") : [],
        categoria: producto.categoria ? producto.categoria.nombre || producto.categoria : null,
        subcategorias: producto.subcategorias || [],
      }));

      setProductos(productosFormateados);
    } catch (error) {
      console.warn("Error al cargar productos:", error.message);
      const cache = localStorage.getItem("productos_cache");
      if (cache) {
        const data = JSON.parse(cache);
        const productosFormateados = data.map((producto) => ({
          ...producto,
          precio: `$${Number.parseFloat(producto.precio).toFixed(2)} MXN`,
          precioNumerico: Number.parseFloat(producto.precio),
          imagen: producto.imagen || "/placeholder.svg?height=180&width=180",
          calificacion: producto.calificacion || 5,
          descuento: producto.descuento > 0 ? `${producto.descuento}%` : null,
          caracteristicas: producto.caracteristicas ? producto.caracteristicas.split("\n") : [],
          categoria: producto.categoria ? producto.categoria.nombre || producto.categoria : null,
          subcategorias: producto.subcategorias || [],
        }));
        setProductos(productosFormateados);
        setError("Mostrando productos guardados en caché.");
      } else {
        setError("No hay productos disponibles sin conexión.");
      }
    } finally {
      setCargandoProductos(false);
    }
  };

  cargarProductos();
}, []);

  // Función para obtener icono según la categoría
  const obtenerIconoCategoria = (nombreCategoria) => {
    const nombre = nombreCategoria.toLowerCase()
    if (nombre.includes("suplementos")) return <FaFlask />
    if (nombre.includes("ropa")) return <FaTshirt />
    if (nombre.includes("entrenamiento")) return <FaDumbbell />
    if (nombre.includes("tecnología")) return <FaHeadphones />
    return <FaFlask />
  }

  // Efecto para establecer la categoría seleccionada basada en la URL
  useEffect(() => {
    if (categoria) {
      const categoriaFormateada = formatearCategoria(categoria)
      const categoriaExiste = categorias.some((cat) => cat.nombre.toLowerCase() === categoriaFormateada.toLowerCase())

      if (categoriaExiste) {
        setCategoriaSeleccionada(categoriaFormateada)
      } else {
        navigate("/tienda")
      }
    } else {
      setCategoriaSeleccionada(null)
    }
  }, [categoria, navigate, categorias])

  const siguienteProductos = () => {
    setIndice((prev) => (prev + 1) % Math.max(1, productos.length - 4))
  }

  const anteriorProductos = () => {
    setIndice((prev) => (prev === 0 ? Math.max(0, productos.length - 5) : prev - 1))
  }

  // Alternar visibilidad del menú de categorías
  const toggleMenuCategorias = () => {
    setMenuCategoriasAbierto(!menuCategoriasAbierto)
  }

  // Función para resetear la tienda
  const resetearTienda = () => {
    setCategoriaSeleccionada(null)
    setBusqueda("")
    navigate("/tienda")
  }

  // Redirigir al hacer clic en una categoría
  const manejarClickCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria)
    setMenuCategoriasAbierto(false)
    navigate(`/tienda/${categoria.toLowerCase().replace(/\s+/g, "-")}`)
  }

  // Función para manejar el clic en el icono del carrito
  const irAlCarrito = () => {
    navigate("/carrito")
  }

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    addToCart(producto)

    setProductosAgregados((prev) => ({
      ...prev,
      [producto.id]: true,
    }))

    setTimeout(() => {
      setProductosAgregados((prev) => ({
        ...prev,
        [producto.id]: false,
      }))
    }, 2000)
  }

  // Mensaje de la promoción
  const mensajePromocion = "¡Descubre los mejores productos para tu entrenamiento! Calidad garantizada"

  // Función para duplicar el texto dinámicamente
  const generarTextoPromocional = () => {
    return (
      <>
        <span className="oferta-texto">{mensajePromocion}</span>
        <span className="oferta-texto">{mensajePromocion}</span>
        <span className="oferta-texto">{mensajePromocion}</span>
      </>
    )
  }

  // Obtener el número de productos en el carrito
  const cartItemsCount = getCartItemsCount()

  // Función para ver detalle de un producto
  const verDetalleProducto = (producto) => {
    navigate(`/detalle-producto/${producto.id}`, { state: { producto } })
  }

  // Auto-scroll del carrusel
  useEffect(() => {
    if (productos.length > 0) {
      const interval = setInterval(() => {
        siguienteProductos()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [productos])

  // Función para cargar más productos
  const cargarMasProductos = () => {
    setProductosVisibles((prev) => Math.min(prev + 10, productos.length))
  }

  // Crear banners de categorías
  const bannersCategorias = categorias.map((cat) => ({
    id: cat.id,
    titulo: cat.nombre.toUpperCase(),
    subtitulo: "Descubre nuestra selección",
    imagen: `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(cat.nombre)}`,
    categoria: cat.nombre,
  }))

  // Función para renderizar productos con banners intercalados
  const renderizarProductosConBanners = () => {
    const elementos = []
    const productosAMostrar = productos.slice(0, productosVisibles)

    for (let i = 0; i < productosAMostrar.length; i++) {
      const producto = productosAMostrar[i]

      elementos.push(
        <div key={producto.id} className="tarjeta-producto" onClick={() => verDetalleProducto(producto)}>
          {producto.descuento && <div className="etiqueta-descuento">{producto.descuento}</div>}
          <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} className="imagen-producto" />
          <h3 className="nombre-producto">{producto.nombre}</h3>
          <p className="precio-producto">{producto.precio}</p>
          <button
            className={`btn-agregar ${productosAgregados[producto.id] ? "agregado" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              agregarAlCarrito(producto)
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
        </div>,
      )

      // Agregar banners cada 10 productos
      if ((i + 1) % 10 === 0 && i < productosAMostrar.length - 1) {
        const grupoIndex = Math.floor(i / 10)
        const bannersDelGrupo = bannersCategorias.slice(grupoIndex * 2, (grupoIndex + 1) * 2)

        if (bannersDelGrupo.length > 0) {
          elementos.push(
            <div key={`banners-${grupoIndex}`} className="categoria-banner-container">
              {bannersDelGrupo.map((banner) => (
                <div
                  key={banner.id}
                  className="categoria-banner"
                  onClick={() => manejarClickCategoria(banner.categoria)}
                >
                  <div className="banner-content">
                    <h3>{banner.titulo}</h3>
                    <p>{banner.subtitulo}</p>
                    <button className="btn-categoria">Comprar Ahora →</button>
                  </div>
                  <img src={banner.imagen || "/placeholder.svg"} alt={banner.titulo} />
                </div>
              ))}
            </div>,
          )
        }
      }
    }

    return elementos
  }

  // Mostrar estado de carga
  if (cargandoProductos || cargandoCategorias) {
    return (
      <div className={`contenedor_Tienda ${theme === "dark" ? "dark" : ""}`}>
        <HeaderH />
        <div className="breadcrumb-container">
          <Breadcrumbs />
        </div>
        <div className="cargando-tienda">
          <div className="spinner"></div>
          <p>Cargando tienda...</p>
        </div>
        <FooterH />
      </div>
    )
  }

  // Mostrar error si hay problemas
  if (error) {
    return (
      <div className={`contenedor_Tienda ${theme === "dark" ? "dark" : ""}`}>
        <HeaderH />
        <div className="breadcrumb-container">
          <Breadcrumbs />
        </div>
        <div className="error-tienda">
          <h2>Error al cargar la tienda</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
        <FooterH />
      </div>
    )
  }

  return (
    <div className={`contenedor_Tienda ${theme === "dark" ? "dark" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs categoriaSeleccionada={categoriaSeleccionada} onResetearTienda={resetearTienda} />
      </div>

      {/* Menú de Categorías */}
      <div className="menu-tienda">
        <div className="categorias-container">
          <button className={`btn-categorias ${menuCategoriasAbierto ? "activo" : ""}`} onClick={toggleMenuCategorias}>
            Categorías <FaAngleDown className={menuCategoriasAbierto ? "rotate" : ""} />
          </button>

          <div className={`categorias-dropdown ${menuCategoriasAbierto ? "visible" : ""}`}>
            {categorias.map((cat) => (
              <button key={cat.id} className="categoria-opcion" onClick={() => manejarClickCategoria(cat.nombre)}>
                {cat.icono} {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="barra-busqueda">
          <input
            type="text"
            placeholder="Buscar Productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(sanitizeInput(e.target.value))}
          />
        </div>

        <div className="iconos-menu">
          <div className="carrito-container">
            <FaShoppingCart className="icono" onClick={irAlCarrito} style={{ cursor: "pointer" }} />
            {cartItemsCount > 0 && <span className="carrito-contador">{cartItemsCount}</span>}
          </div>
          <FaUser className="icono" />
        </div>
      </div>

      {/* Lógica para mostrar productos o filtros según la búsqueda y la categoría */}
      {categoriaSeleccionada ? (
        <FiltrosProductos
          categoria={categoriaSeleccionada}
          productos={productos}
          busqueda={busqueda}
          onAgregarAlCarrito={agregarAlCarrito}
          productosAgregados={productosAgregados}
        />
      ) : busqueda ? (
        <section className="contenedor-productos">
          {productos
            .filter((producto) => producto.nombre.toLowerCase().includes(busqueda.toLowerCase()))
            .map((producto) => (
              <div key={producto.id} className="tarjeta-producto" onClick={() => verDetalleProducto(producto)}>
                {producto.descuento && <div className="etiqueta-descuento">{producto.descuento}</div>}
                <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} className="imagen-producto" />
                <h3 className="nombre-producto">{producto.nombre}</h3>
                <p className="precio-producto">{producto.precio}</p>
                <button
                  className={`btn-agregar ${productosAgregados[producto.id] ? "agregado" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    agregarAlCarrito(producto)
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
            ))}
        </section>
      ) : (
        <>
          {/* Barra de Promoción */}
          <div className="barra-oferta">
            <div className="oferta-contenedor">{generarTextoPromocional()}</div>
          </div>

          {/* Sección de Destacados */}
          {categoriasDestacadas.length > 0 && (
            <section className="destacados">
              <h2 className="titulo-destacados">DESTACADOS</h2>
              <div className="destacados-contenedor">
                {categoriasDestacadas.slice(0, 4).map((destacado) => (
                  <div
                    key={destacado.id}
                    className="destacado-card"
                    onClick={() => manejarClickCategoria(destacado.nombre)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="destacado-imagen-container">
                      <img
                        src={destacado.imagen || "/placeholder.svg"}
                        alt={destacado.nombre}
                        onError={(e) => (e.target.src = "/placeholder.svg")}
                      />
                    </div>
                    <div className="destacado-info">
                      <h3 className="destacado-titulo">{destacado.nombre}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sección del Carrusel */}
          {productos.length > 0 && (
            <section className="carrusel">
              <div className="carrusel-descuento">
                <p className="oferta-titulo">¡Transforma tu cuerpo hoy!</p>
                <h2 className="oferta-subtitulo">Los mejores productos</h2>
                <h1 className="oferta-mensaje">para alcanzar tus metas</h1>
                <p className="oferta-texto-adicional">CALIDAD GARANTIZADA</p>
              </div>

              <div className="carrusel-productos">
                <button className="btn-carrusel izquierda" onClick={anteriorProductos}>
                  <FaChevronLeft />
                </button>

                <div className="productos-activos" style={{ transform: `translateX(-${indice * 25}%)` }}>
                  {productos.map((producto) => (
                    <div key={producto.id} className="producto-card">
                      <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} />
                      <div className="producto-info">
                        <h3>
                          {producto.nombre.length > 20 ? `${producto.nombre.substring(0, 20)}...` : producto.nombre}
                        </h3>
                        <p className="producto-precio">{producto.precio}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn-carrusel derecha" onClick={siguienteProductos}>
                  <FaChevronRight />
                </button>
              </div>
            </section>
          )}

          {/* Sección de Productos con Banners Intercalados */}
          {productos.length > 0 && (
            <section className="seccion-productos">
              <div className="contenedor-productos-con-banners">{renderizarProductosConBanners()}</div>

              {/* Botón Ver Más */}
              {productosVisibles < productos.length && (
                <div className="ver-mas-container">
                  <button className="btn-ver-mas-productos" onClick={cargarMasProductos}>
                    Ver más productos
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Mensaje si no hay productos */}
          {productos.length === 0 && (
            <div className="sin-productos">
              <h2>No hay productos disponibles</h2>
              <p>Los productos estarán disponibles próximamente.</p>
            </div>
          )}
        </>
      )}

      <FooterH />
    </div>
  )
}

export default Tienda
