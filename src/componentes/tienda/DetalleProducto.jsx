"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { FaStar, FaRegStar, FaShoppingCart, FaBolt, FaArrowLeft, FaCheck } from "react-icons/fa"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import { CartContext } from "../../context/CartContext"
import "./DetalleProducto.css"

// Agregar esta definición de productos relacionados para asegurar que funcione correctamente
const productosRelacionados = [
  {
    id: 16,
    nombre: "Multivitamínico Deportivo",
    precio: "$750.00 MXN",
    precioNumerico: 750,
    imagen: "/placeholder.svg?height=180&width=180",
    categoria: "Suplementos",
    subcategoria: "Vitaminas",
    descripcion:
      "Multivitamínico completo diseñado específicamente para deportistas, con dosis optimizadas de vitaminas y minerales para mejorar el rendimiento y la recuperación.",
    caracteristicas: [
      "Complejo de vitaminas y minerales en dosis óptimas",
      "Antioxidantes para combatir el estrés oxidativo",
      "Extractos de hierbas para soporte hormonal",
      "Sin colorantes ni conservantes artificiales",
      "30 porciones por envase",
    ],
  },
  {
    id: 15,
    nombre: "Carbohidratos Rápida Absorción 1.5kg",
    precio: "$1,100.00 MXN",
    precioNumerico: 1100,
    imagen: "/placeholder.svg?height=180&width=180",
    categoria: "Suplementos",
    subcategoria: "Ganadores de Masa",
    descripcion:
      "Carbohidratos de Rápida Absorción diseñados para reponer rápidamente los niveles de glucógeno muscular después del entrenamiento. Ideal para atletas que buscan maximizar la recuperación y el crecimiento muscular.",
    caracteristicas: [
      "50g de carbohidratos por porción",
      "Mezcla de maltodextrina y dextrosa",
      "Rápida absorción para reposición de glucógeno",
      "Ideal para tomar post-entrenamiento",
      "30 porciones por envase",
    ],
  },
  {
    id: 14,
    nombre: "Omega 3 Ultra Concentrado",
    precio: "$500.00 MXN",
    precioNumerico: 500,
    imagen: "/placeholder.svg?height=180&width=180",
    categoria: "Suplementos",
    subcategoria: "Aceites Esenciales",
    descripcion:
      "Omega 3 Ultra Concentrado proporciona altas dosis de EPA y DHA, ácidos grasos esenciales que apoyan la salud cardiovascular, cerebral y articular. Extraído de pescados salvajes de aguas frías.",
    caracteristicas: [
      "1100mg de Omega 3 por porción",
      "650mg de EPA y 450mg de DHA",
      "Apoya la salud cardiovascular y cerebral",
      "Reduce la inflamación y mejora la recuperación",
      "Sabor a limón para evitar regurgitación",
    ],
  },
  {
    id: 13,
    nombre: "Caseína Micelar 2lb",
    precio: "$1,800.00 MXN",
    precioNumerico: 1800,
    imagen: "/placeholder.svg?height=180&width=180",
    categoria: "Suplementos",
    subcategoria: "Proteínas",
    descripcion:
      "La Caseína Micelar es una proteína de liberación lenta, ideal para tomar antes de dormir o entre comidas. Proporciona un flujo constante de aminoácidos durante varias horas, ayudando a prevenir el catabolismo muscular.",
    caracteristicas: [
      "24g de proteína por porción",
      "Liberación lenta de aminoácidos (hasta 8 horas)",
      "Ideal para tomar antes de dormir",
      "Ayuda a prevenir el catabolismo muscular",
      "Contiene enzimas digestivas para mejor absorción",
    ],
  },
]

const DetalleProducto = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [imagenPrincipal, setImagenPrincipal] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [agregadoAlCarrito, setAgregadoAlCarrito] = useState(false)
  const [favorito, setFavorito] = useState(false)
  const [pestanaActiva, setPestanaActiva] = useState("descripcion")

  // Obtener el contexto del carrito
  const { addToCart } = useContext(CartContext)

  // Modificar la función obtenerProductosRelacionados para usar la lista local
  const obtenerProductosRelacionados = (producto) => {
    if (!producto) return []

    // Filtrar productos de la misma subcategoría
    return productosRelacionados
      .filter((p) => p.id !== producto.id && p.subcategoria === producto.subcategoria)
      .slice(0, 4) // Limitar a 4 productos relacionados
  }

  // Simular la carga del producto desde una API
  useEffect(() => {
    // Verificar si el producto viene en el state de location (desde la navegación)
    if (location.state && location.state.producto) {
      setProducto(location.state.producto)
      setImagenPrincipal(location.state.producto.imagen)
      setCargando(false)
      return
    }

    // Si no viene en el state, buscar en la lista de productos
    const cargarProducto = async () => {
      setCargando(true)

      // Buscar el producto por ID en la lista de productos
      const productoEncontrado = productosRelacionados.find((p) => p.id === Number.parseInt(id))

      if (productoEncontrado) {
        setProducto(productoEncontrado)
        setImagenPrincipal(productoEncontrado.imagen)
      } else {
        // Si no se encuentra, usar un producto de ejemplo
        const productoEjemplo = {
          id: 2,
          nombre: "Proteína Dymatize ISO 100 Hidrolizada 5lbs",
          precio: "$1,750.00 MXN",
          precioNumerico: 1750,
          categoria: "Suplementos",
          subcategoria: "Proteínas",
          marca: "Dymatize",
          calificacion: 5,
          descuento: "10%",
          imagen: "/placeholder.svg?height=400&width=400",
          imagenes: [
            "/placeholder.svg?height=80&width=80&text=1",
            "/placeholder.svg?height=80&width=80&text=2",
            "/placeholder.svg?height=80&width=80&text=3",
            "/placeholder.svg?height=80&width=80&text=4",
            "/placeholder.svg?height=80&width=80&text=5",
          ],
          descripcion:
            "Dymatize ISO 100 es una proteína de suero hidrolizada de la más alta calidad y pureza. Cada porción proporciona 25g de proteína de rápida absorción y está virtualmente libre de grasas y azúcares, ideal para atletas que buscan maximizar la recuperación muscular.",
          caracteristicas: [
            "25g de proteína por porción",
            "Aislado de proteína de suero hidrolizado",
            "Menos de 1g de azúcar y grasa por porción",
            "5.5g de BCAAs por porción",
            "Certificado por Informed-Choice",
          ],
          stock: 0,
          vendidos: 50,
          envioGratis: true,
        }

        setProducto(productoEjemplo)
        setImagenPrincipal(productoEjemplo.imagen)
      }

      setCargando(false)
    }

    cargarProducto()
  }, [id, location.state])

  // Manejar cambio de cantidad
  const cambiarCantidad = (valor) => {
    const nuevaCantidad = cantidad + valor
    if (nuevaCantidad >= 1 && nuevaCantidad <= (producto?.stock || 10)) {
      setCantidad(nuevaCantidad)
    }
  }

  // Manejar entrada directa de cantidad
  const manejarInputCantidad = (e) => {
    const valor = Number.parseInt(e.target.value)
    if (!isNaN(valor) && valor >= 1 && valor <= (producto?.stock || 10)) {
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
      // Agregar al carrito y redirigir al checkout
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

              <div className="marca-producto">
                <span className="etiqueta">Marca:</span> {producto.marca}
              </div>

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
                <span className={`estado ${producto.stock > 0 ? "disponible" : "agotado"}`}>
                  {producto.stock > 0 ? "Disponible" : "Agotado"}
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
                    disabled={cantidad >= (producto.stock || 10)}
                  >
                    +
                  </button>
                </div>
                {producto.stock && <span className="stock-disponible">{producto.stock} disponibles</span>}
              </div>

              <div className="botones-accion">
                <button
                  className={`btn-agregar-carrito ${agregadoAlCarrito ? "agregado" : ""}`}
                  onClick={agregarAlCarrito}
                  disabled={agregadoAlCarrito || producto.stock === 0}
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

                <button className="btn-comprar-ahora" onClick={comprarAhora} disabled={producto.stock === 0}>
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
        <div className="productos-relacionados">
          <h2 className="titulo-relacionados">Productos relacionados</h2>

          <div className="grid-relacionados">
            {obtenerProductosRelacionados(producto).map((productoRel) => (
              <div
                key={productoRel.id}
                className="tarjeta-relacionado"
                onClick={() => verProductoRelacionado(productoRel)}
              >
                {productoRel.descuento && (
                  <div className="etiqueta-descuento-relacionado">{productoRel.descuento || "10%"}</div>
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
      </div>

      <FooterH />
    </div>
  )
}

export default DetalleProducto

