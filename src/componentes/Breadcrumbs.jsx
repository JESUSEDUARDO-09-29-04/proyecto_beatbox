import React from "react"
import { Link, useLocation } from "react-router-dom"
import "./Breadcrumbs.css"
import { FaHome, FaShoppingCart, FaInfoCircle } from "react-icons/fa"

const Breadcrumbs = () => {
  const location = useLocation()
  const pathname = location.pathname

  // Verificar si estamos en la página de detalle de producto
  const isDetalleProducto = pathname.includes("/detalle-producto")

  // Si estamos en detalle de producto, mostrar breadcrumb fijo: Inicio / Tienda / Detalle producto
  if (isDetalleProducto) {
    return (
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-item">
          <FaHome /> Inicio
        </Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/tienda" className="breadcrumb-item">
          <FaShoppingCart /> Tienda
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item">
          <FaInfoCircle /> Detalle producto
        </span>
      </nav>
    )
  }

  // Para otras páginas, mantener el comportamiento normal
  const pathSegments = pathname.split("/").filter((segment) => segment !== "")

  // Generar breadcrumbs basados en la ruta actual
  const generateBreadcrumbs = () => {
    const breadcrumbs = []

    // Siempre agregar el inicio
    breadcrumbs.push({
      path: "/",
      name: "Inicio",
      icon: <FaHome />,
    })

    // Construir la ruta acumulativa para cada segmento
    let currentPath = ""

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i]
      currentPath += `/${segment}`

      // Buscar en el diccionario o crear un nombre legible
      let name, icon

      if (segment === "tienda") {
        name = "Tienda"
        icon = <FaShoppingCart />
      } else {
        // Convertir kebab-case a formato legible
        name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
        icon = <FaInfoCircle />
      }

      breadcrumbs.push({
        path: currentPath,
        name,
        icon,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="breadcrumbs">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="breadcrumb-item">
              {crumb.icon} {crumb.name}
            </span>
          ) : (
            <Link to={crumb.path} className="breadcrumb-item">
              {crumb.icon} {crumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs

