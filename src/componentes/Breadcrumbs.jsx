import React from "react"
import { Link, useLocation } from "react-router-dom"
import "./Breadcrumbs.css"
import { FaHome, FaShoppingCart, FaInfoCircle, FaCreditCard } from "react-icons/fa"

const Breadcrumbs = () => {
  const { pathname } = useLocation()

  // Si estamos en rutas normales (no tienda), usar breadcrumbs dinámicos
  const isTienda = pathname.startsWith("/tienda")
  const isDetalle = pathname.startsWith("/detalle-producto")
  const isCarrito = pathname.startsWith("/carrito")
  const isCheckout = pathname.startsWith("/checkout")

  // 🔥 CASO 1: DETALLE PRODUCTO
  if (isDetalle) {
    return (
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-item"><FaHome /> Inicio</Link>
        <span className="breadcrumb-separator">/</span>

        <Link to="/tienda" className="breadcrumb-item">
          <FaShoppingCart /> Tienda
        </Link>
        <span className="breadcrumb-separator">/</span>

        <span className="breadcrumb-item"><FaInfoCircle /> Detalle del Producto</span>
      </nav>
    )
  }

  // 🔥 CASO 2: CARRITO
  if (isCarrito) {
    return (
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-item"><FaHome /> Inicio</Link>
        <span className="breadcrumb-separator">/</span>

        <Link to="/tienda" className="breadcrumb-item">
          <FaShoppingCart /> Tienda
        </Link>
        <span className="breadcrumb-separator">/</span>

        <span className="breadcrumb-item"><FaShoppingCart /> Carrito</span>
      </nav>
    )
  }

  // 🔥 CASO 3: CHECKOUT
  if (isCheckout) {
    return (
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-item"><FaHome /> Inicio</Link>
        <span className="breadcrumb-separator">/</span>

        <Link to="/tienda" className="breadcrumb-item">
          <FaShoppingCart /> Tienda
        </Link>
        <span className="breadcrumb-separator">/</span>

        <Link to="/carrito" className="breadcrumb-item">
          <FaShoppingCart /> Carrito
        </Link>
        <span className="breadcrumb-separator">/</span>

        <span className="breadcrumb-item"><FaCreditCard /> Checkout</span>
      </nav>
    )
  }

  // 🔥 CASO 4: TIENDA GENERAL
  if (isTienda) {
    return (
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-item"><FaHome /> Inicio</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item"><FaShoppingCart /> Tienda</span>
      </nav>
    )
  }

  // 🔥 CASO 5: RUTAS NORMALES → usar tus breadcrumbs dinámicos originales
  const segments = pathname.split("/").filter(Boolean)

  const crumbs = [
    { path: "/", name: "Inicio", icon: <FaHome /> }
  ]

  let current = ""
  segments.forEach((seg) => {
    current += "/" + seg
    crumbs.push({
      path: current,
      name: seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
      icon: <FaInfoCircle />
    })
  })

  return (
    <nav className="breadcrumbs">
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          {index === crumbs.length - 1 ? (
            <span className="breadcrumb-item">{crumb.icon} {crumb.name}</span>
          ) : (
            <Link to={crumb.path} className="breadcrumb-item">{crumb.icon} {crumb.name}</Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs
