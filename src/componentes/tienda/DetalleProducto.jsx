"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { FaStar, FaRegStar, FaShoppingCart, FaBolt, FaArrowLeft, FaCheck } from "react-icons/fa"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import { CartContext } from "../../context/CartContext"
import "./DetalleProducto.css"

const DetalleProducto = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [producto, setProducto] = useState(null)
  const [productosRelacionados, setProductosRelacionados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [imagenPrincipal, setImagenPrincipal] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [agregadoAlCarrito, setAgregadoAlCarrito] = useState(false)
  const [favorito, setFavorito] = useState(false)
  const [pestanaActiva, setPestanaActiva] = useState("descripcion")

  // Obtener el contexto del carrito
  const { addToCart } = useContext(CartContext)

  // Cargar producto desde la API
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setCargando(true)

        // Si el producto viene en el state de location, usarlo
        if (location.state && location.state.producto) {
          const productoFromState = location.state.producto
          setProducto(productoFromState)
          setImagenPrincipal(productoFromState.imagen)
          await cargarProductosRelacionados(productoFromState)
          setCargando(false)
          return
        }

        // Si no, cargar desde la API
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Producto no encontrado")
        }

        const data = await response.json()

        // Formatear el producto
        const productoFormateado = {
          ...data,
          precio: `$${Number.parseFloat(data.precio).toFixed(2)} MXN`,
          precioNumerico: Number.parseFloat(data.precio),
          imagen: data.imagen || "/placeholder.svg?height=400&width=400",
          calificacion: data.calificacion || 5,
          descuento: data.descuento > 0 ? `${data.descuento}%` : null,
          caracteristicas: data.caracteristicas ? data.caracteristicas.split("\n") : [],
          imagenes: data.imagenes ? data.imagenes.split(",") : [data.imagen || "/placeholder.svg?height=400&width=400"],
          // Asegurar que la categoría tenga el formato correcto
          categoria: data.categoria ? data.categoria.nombre || data.categoria : null,
          // Manejar subcategorías como array de objetos
          subcategorias: data.subcategorias || [],
        }

        setProducto(productoFormateado)
        setImagenPrincipal(productoFormateado.imagen)
        await cargarProductosRelacionados(productoFormateado)
      } catch (error) {
        console.error("Error al cargar producto:", error)
        setProducto(null)
      } finally {
        setCargando(false)
      }
    }

    cargarProducto()
  }, [id, location.state])

  // Cargar productos relacionados
  const cargarProductosRelacionados = async (productoActual) => {
    try {
      const response = await fetch("http://localhost:3000/productos", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const productos = await response.json()

        // Filtrar productos de la misma categoría/subcategoría
        const relacionados = productos
          .filter((p) => {
            if (p.id === productoActual.id || !p.vigente || p.eliminado) return false

            // Comparar por categoría
            const categoriaActual =
              productoActual.categoria || (productoActual.categoria && productoActual.categoria.nombre)
            const categoriaProducto = p.categoria ? p.categoria.nombre || p.categoria : null

            if (
              categoriaActual &&
              categoriaProducto &&
              categoriaActual.toLowerCase() === categoriaProducto.toLowerCase()
            ) {
              return true
            }

            // Comparar por subcategorías
            if (
              productoActual.subcategorias &&
              productoActual.subcategorias.length > 0 &&
              p.subcategorias &&
              p.subcategorias.length > 0
            ) {
              const subcategoriasActuales = productoActual.subcategorias.map((sub) => sub.nombre || sub)
              const subcategoriasProducto = p.subcategorias.map((sub) => sub.nombre || sub)

              return subcategoriasActuales.some((subActual) => subcategoriasProducto.includes(subActual))
            }

            return false
          })
          .slice(0, 4)
          .map((p) => ({
            ...p,
            precio: `$${Number.parseFloat(p.precio).toFixed(2)} MXN`,
            precioNumerico: Number.parseFloat(p.precio),
            imagen: p.imagen || "/placeholder.svg?height=180&width=180",
            descuento: p.descuento > 0 ? `${p.descuento}%` : null,
          }))

        setProductosRelacionados(relacionados)
      }
    } catch (error) {
      console.error("Error al cargar productos relacionados:", error)
    }
  }

  // Manejar cambio de cantidad
  const cambiarCantidad = (valor) => {
    const nuevaCantidad = cantidad + valor
    if (nuevaCantidad >= 1 && nuevaCantidad <= (producto?.existencia || 10)) {
      setCantidad(nuevaCantidad)
    }
  }

  // Manejar entrada directa de cantidad
  const manejarInputCantidad = (e) => {
    const valor = Number.parseInt(e.target.value)
    if (!isNaN(valor) && valor >= 1 && valor <= (producto?.existencia || 10)) {
      setCantidad(valor)
    }
  }

  // Agregar al carrito
  const agregarAlCarrito = () => {
    if (producto) {
      const productoParaCarrito = {
        ...producto,
        cantidad: cantidad,
      }

      addToCart(productoParaCarrito)

      // Mostrar confirmación visual
      setAgregadoAlCarrito(true)

      // Después de un tiempo, quitar la confirmación visual
      setTimeout(() => {
        setAgregadoAlCarrito(false)
      }, 2000)
    }
  }

  // Comprar ahora
  const comprarAhora = () => {
    if (producto) {
      agregarAlCarrito()
      navigate("/carrito")
    }
  }

  // Renderizar estrellas para calificación
  const renderizarEstrellas = (calificacion) => {
    const estrellas = []
    const calificacionRedondeada = Math.round(calificacion * 2) / 2

    for (let i = 1; i <= 5; i++) {
      if (i <= calificacionRedondeada) {
        estrellas.push(<FaStar key={i} className="estrella-llena" />)
      } else if (i - 0.5 === calificacionRedondeada) {
        estrellas.push(<FaStar key={i} className="estrella-media" />)
      } else {
        estrellas.push(<FaRegStar key={i} className="estrella-vacia" />)
      }
    }

    return estrellas
  }

  // Volver a la página anterior
  const volverAtras = () => {
    navigate(-1)
  }

  // Cambiar imagen principal
  const cambiarImagenPrincipal = (imagen) => {
    setImagenPrincipal(imagen)
  }

  // Alternar favorito
  const toggleFavorito = () => {
    setFavorito(!favorito)
  }

  // Ir a un producto relacionado
  const verProductoRelacionado = (producto) => {
    navigate(`/detalle-producto/${producto.id}`, { state: { producto } })
  }

  if (cargando) {
    return (
      <div className="contenedor-detalle-producto">
        <HeaderH />
        <div className="breadcrumb-container">
          <Breadcrumbs />
        </div>
        <div className="cargando-detalle">
          <div className="spinner"></div>
          <p>Cargando detalles del producto...</p>
        </div>
        <FooterH />
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="contenedor-detalle-producto">
        <HeaderH />
        <div className="breadcrumb-container">
          <Breadcrumbs />
        </div>
        <div className="error-producto">
          <h2>Producto no encontrado</h2>
          <p>Lo sentimos, el producto que buscas no está disponible.</p>
          <button className="btn-volver" onClick={volverAtras}>
            <FaArrowLeft /> Volver a la tienda
          </button>
        </div>
        <FooterH />
      </div>
    )
  }

  return (
    <div className="contenedor-detalle-producto">
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="contenido-detalle">
        <button className="btn-volver-tienda" onClick={volverAtras}>
          <FaArrowLeft /> Volver
        </button>

        <div className="detalle-producto-grid">
          {/* Contenedor que agrupa la imagen y la información del producto */}
          <div className="imagen-info-contenedor">
            {/* Columna izquierda - Galería de imágenes */}
            <div className="galeria-producto">
              <div className="miniaturas-producto">
                {producto.imagenes ? (
                  producto.imagenes.map((img, index) => (
                    <div
                      key={index}
                      className={`miniatura ${imagenPrincipal === img ? "activa" : ""}`}
                      onClick={() => cambiarImagenPrincipal(img)}
                    >
                      <img src={img || "/placeholder.svg"} alt={`${producto.nombre} - vista ${index + 1}`} />
                    </div>
                  ))
                ) : (
                  <div className="miniatura activa" onClick={() => cambiarImagenPrincipal(producto.imagen)}>
                    <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} />
                  </div>
                )}
              </div>

              <div className="imagen-principal-container">
                {producto.descuento && <span className="etiqueta-descuento">{producto.descuento}</span>}
                <img src={imagenPrincipal || producto.imagen} alt={producto.nombre} className="imagen-principal" />
              </div>
            </div>

            {/* Columna central - Información del producto */}
            <div className="info-producto-detalle">
              <h1 className="titulo-producto">{producto.nombre}</h1>

              <div className="calificacion-producto">
                <div className="estrellas">{renderizarEstrellas(producto.calificacion)}</div>
                <span className="valor-calificacion">{producto.calificacion}</span>
              </div>

              <div className="precio-producto-detalle">
                <span className="precio-actual">{producto.precio}</span>
                {producto.descuento && (
                  <div className="precio-descuento">
                    <span className="precio-anterior">
                      ${(producto.precioNumerico * (1 + Number.parseInt(producto.descuento) / 100)).toFixed(2)} MXN
                    </span>
                    <span className="porcentaje-descuento">{producto.descuento} OFF</span>
                  </div>
                )}
              </div>

              {producto.marca && (
                <div className="marca-producto">
                  <span className="etiqueta">Marca:</span> {producto.marca}
                </div>
              )}

              <div className="pestanas-info">
                <button
                  className={`pestana ${pestanaActiva === "descripcion" ? "activa" : ""}`}
                  onClick={() => setPestanaActiva("descripcion")}
                >
                  Descripción
                </button>
                <button
                  className={`pestana ${pestanaActiva === "caracteristicas" ? "activa" : ""}`}
                  onClick={() => setPestanaActiva("caracteristicas")}
                >
                  Características
                </button>
              </div>

              <div className="contenido-pestana">
                {pestanaActiva === "descripcion" ? (
                  <p className="descripcion-producto">{producto.descripcion}</p>
                ) : (
                  <ul className="caracteristicas-lista">
                    {producto.caracteristicas &&
                      producto.caracteristicas.map((caracteristica, index) => <li key={index}>{caracteristica}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Acciones de compra */}
          <div className="acciones-compra">
            <div className="card-compra">
              <div className="precio-card">
                <span className="precio-principal">{producto.precio}</span>
                {producto.descuento && <span className="descuento-card">{producto.descuento} OFF</span>}
              </div>

              <div className="disponibilidad">
                <span className={`estado ${producto.existencia > 0 ? "disponible" : "agotado"}`}>
                  {producto.existencia > 0 ? "Disponible" : "Agotado"}
                </span>
              </div>

              <div className="selector-cantidad">
                <span className="etiqueta-cantidad">Cantidad</span>
                <div className="control-cantidad">
                  <button className="btn-cantidad" onClick={() => cambiarCantidad(-1)} disabled={cantidad <= 1}>
                    -
                  </button>
                  <input type="text" value={cantidad} onChange={manejarInputCantidad} className="input-cantidad" />
                  <button
                    className="btn-cantidad"
                    onClick={() => cambiarCantidad(1)}
                    disabled={cantidad >= (producto.existencia || 10)}
                  >
                    +
                  </button>
                </div>
                {producto.existencia && <span className="stock-disponible">{producto.existencia} disponibles</span>}
              </div>

              <div className="botones-accion">
                <button
                  className={`btn-agregar-carrito ${agregadoAlCarrito ? "agregado" : ""}`}
                  onClick={agregarAlCarrito}
                  disabled={agregadoAlCarrito || producto.existencia === 0}
                >
                  {agregadoAlCarrito ? (
                    <>
                      <FaCheck /> Agregado al carrito
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Agregar al carrito
                    </>
                  )}
                </button>

                <button className="btn-comprar-ahora" onClick={comprarAhora} disabled={producto.existencia === 0}>
                  <FaBolt /> Comprar ahora
                </button>
              </div>

              <div className="medios-pago">
                <h4>Medios de pago</h4>
                <div className="tarjetas-credito">
                  <h5>Tarjetas de crédito</h5>
                  <div className="iconos-tarjetas">
                    <span className="icono-tarjeta visa">VISA</span>
                    <span className="icono-tarjeta mastercard">MC</span>
                    <span className="icono-tarjeta amex">AMEX</span>
                  </div>
                  <p className="info-cuotas">Pago hasta en 3 cuotas</p>
                </div>

                <div className="tarjetas-debito">
                  <h5>Tarjetas de débito</h5>
                  <div className="iconos-tarjetas">
                    <span className="icono-tarjeta visa">VISA</span>
                    <span className="icono-tarjeta mastercard">MC</span>
                  </div>
                </div>

                <div className="otros-medios">
                  <h5>Otros medios</h5>
                  <div className="iconos-otros">
                    <span className="icono-otro paypal">PayPal</span>
                    <span className="icono-otro oxxo">OXXO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {productosRelacionados.length > 0 && (
          <div className="productos-relacionados">
            <h2 className="titulo-relacionados">Productos relacionados</h2>

            <div className="grid-relacionados">
              {productosRelacionados.map((productoRel) => (
                <div
                  key={productoRel.id}
                  className="tarjeta-relacionado"
                  onClick={() => verProductoRelacionado(productoRel)}
                >
                  {productoRel.descuento && (
                    <div className="etiqueta-descuento-relacionado">{productoRel.descuento}</div>
                  )}
                  <img
                    src={productoRel.imagen || "/placeholder.svg"}
                    alt={productoRel.nombre}
                    className="imagen-relacionado"
                  />
                  <h3 className="nombre-relacionado">{productoRel.nombre}</h3>
                  <p className="precio-relacionado">{productoRel.precio}</p>
                  <button
                    className="btn-agregar-relacionado"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(productoRel)
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterH />
    </div>
  )
}

export default DetalleProducto
