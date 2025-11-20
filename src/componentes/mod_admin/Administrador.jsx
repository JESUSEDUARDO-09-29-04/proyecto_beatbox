"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import { useEmpresa } from "../../context/EmpresaContext"
import {
  FaUsers,
  FaDollarSign,
  FaStore,
  FaBuilding,
  FaFileAlt,
  FaExclamationTriangle,
  FaChartBar,
  FaGlobe,
  FaChevronDown,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaMusic,
} from "react-icons/fa"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import "./Administrador.css"
import logo from "../../assets/logo.png"

// Importamos los módulos de administración
import DocumentosRegulatoriosAdmin from "../mod_admin/documentos_admin/DocumentosRegulatoriosAdmin"
import EmpresaAdmin from "../mod_admin/empresa_admin/EmpresaAdmin"
import IncidentesAdmin from "../mod_admin/incidentes_admin/incidentesAdmin"
import RedesSocialesAdmin from "../mod_admin/redes_sociales_admin/RedesSocialesAdmin"
import UsuariosAdmin from "../mod_admin/usuarios_admin/UsuariosAdmin"
import CategoriasAdmin from "../mod_admin/Tienda/Categorias"
import Productos from "../mod_admin/Tienda/productos"
import PlaylistAdmin from "../mod_admin/playlist_admin/PlaylistAdmin"
import Reportes from "../mod_admin/reportes/reportes-ventas"
import GestionSuscripciones from "../mod_admin/suscripciones_admin/GestionSuscripciones"

const Administrador = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { logoVigente, cargando } = useEmpresa()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState({
    tienda: false,
    reportes: false,
  })
  const [vistaActual, setVistaActual] = useState("bienvenida")
  const [menuColapsado, setMenuColapsado] = useState(false)
  const [menuMobileVisible, setMenuMobileVisible] = useState(false)
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, mensaje: "Nueva suscripción registrada", tiempo: "Hace 5 minutos", leida: false },
    { id: 2, mensaje: "Incidencia reportada por usuario", tiempo: "Hace 30 minutos", leida: false },
    { id: 3, mensaje: "Actualización de sistema disponible", tiempo: "Hace 2 horas", leida: true },
  ])
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [estadisticas, setEstadisticas] = useState({
    usuarios: 120,
    suscripciones: 85,
    tienda: 50,
  })

  // Simulación de carga de estadísticas
  useEffect(() => {
    const interval = setInterval(() => {
      setEstadisticas((prev) => ({
        ...prev,
        usuarios: prev.usuarios + Math.floor(Math.random() * 3),
        suscripciones: prev.suscripciones + Math.floor(Math.random() * 2),
        tienda: prev.tienda + Math.floor(Math.random() * 1),
      }))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setMenuColapsado(false)
  }, [])

  // Efecto para establecer la vista actual basada en la URL
  useEffect(() => {
    const path = location.pathname.toLowerCase()
    if (path === "/administrador" || path === "/administrador/") {
      setVistaActual("bienvenida")
      return
    }
    if (path.includes("/administrador/dashboard")) {
      setVistaActual("dashboard")
    } else if (path.includes("/administrador/usuarios")) {
      setVistaActual("usuarios")
    } else if (path.includes("/administrador/suscripciones")) {
      setVistaActual("suscripciones")
    } else if (path.includes("/administrador/tienda-categorias")) {
      setVistaActual("tienda-categorias")
      setMenuAbierto((prev) => ({ ...prev, tienda: true }))
    } else if (path.includes("/administrador/tienda-productos")) {
      setVistaActual("tienda-productos")
      setMenuAbierto((prev) => ({ ...prev, tienda: true }))
    } else if (path.includes("/administrador/tienda-pedidos")) {
      setVistaActual("tienda-pedidos")
      setMenuAbierto((prev) => ({ ...prev, tienda: true }))
    } else if (path.includes("/administrador/empresa")) {
      setVistaActual("empresa")
    } else if (path.includes("/administrador/documentos")) {
      setVistaActual("documentos")
    } else if (path.includes("/administrador/incidencias")) {
      setVistaActual("incidencias")
    } else if (path.includes("/administrador/redes-sociales")) {
      setVistaActual("redesSociales")
    } else if (path.includes("/administrador/reportes-ventas")) {
      setVistaActual("reportes-ventas")
      setMenuAbierto((prev) => ({ ...prev, reportes: true }))
    } else if (path.includes("/administrador/reportes-usuarios")) {
      setVistaActual("reportes-usuarios")
      setMenuAbierto((prev) => ({ ...prev, reportes: true }))
    } else if (path.includes("/administrador/playlistadmin")) {
      setVistaActual("playlist")
    } else if (path.includes("/administrador/suscripcion_admin")) {
      setVistaActual("suscripcion")
    }
  }, [location.pathname])

  const handleNavigation = (view) => {
    setVistaActual(view)
    setMenuMobileVisible(false)
    switch (view) {
      case "dashboard":
        navigate("/administrador/dashboard")
        break
      case "usuarios":
        navigate("/administrador/usuarios")
        break
      case "suscripciones":
        navigate("/administrador/suscripciones")
        break
      case "tienda-categorias":
        navigate("/administrador/tienda-categorias")
        break
      case "tienda-productos":
        navigate("/administrador/tienda-productos")
        break
      case "tienda-pedidos":
        navigate("/administrador/tienda-pedidos")
        break
      case "empresa":
        navigate("/administrador/empresa")
        break
      case "documentos":
        navigate("/administrador/documentos")
        break
      case "incidencias":
        navigate("/administrador/incidencias")
        break
      case "redesSociales":
        navigate("/administrador/redes-sociales")
        break
      case "reportes-ventas":
        navigate("/administrador/reportes-ventas")
        break
      case "reportes-usuarios":
        navigate("/administrador/reportes-usuarios")
        break
      case "playlist":
        navigate("/administrador/playlistadmin")
        break
      case "suscripcion":
        navigate("/administrador/suscripcion_admin")
        break
      default:
        navigate("/administrador")
        break
    }
  }

  const toggleSubmenu = (menu) => {
    setMenuAbierto((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const toggleNotificaciones = () => {
    setNotificacionesAbiertas(!notificacionesAbiertas)
  }

  const marcarNotificacionesLeidas = () => {
    setNotificaciones((prev) => prev.map((notif) => ({ ...notif, leida: true })))
  }

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value)
  }

  const cerrarSesion = () => {
    navigate("/iniciar-sesion")
  }

  const getLogoSrc = () => {
    if (cargando) return logo
    return logoVigente || logo
  }

  const menuFiltrado =
    busqueda.trim() === ""
      ? null
      : [
          { id: "usuarios", nombre: "Gestión de Usuarios", icono: <FaUsers /> },
          { id: "suscripciones", nombre: "Gestión de Suscripciones", icono: <FaDollarSign /> },
          { id: "tienda", nombre: "Tienda", icono: <FaStore /> },
          { id: "empresa", nombre: "Gestión de la Empresa", icono: <FaBuilding /> },
          { id: "documentos", nombre: "Documentos Regulatorios", icono: <FaFileAlt /> },
          { id: "incidencias", nombre: "Incidencias", icono: <FaExclamationTriangle /> },
          { id: "redesSociales", nombre: "Redes Sociales", icono: <FaGlobe /> },
          { id: "playlist", nombre: "Playlist", icono: <FaGlobe /> },
          { id: "suscripcion", nombre: "Suscripcion", icono: <FaDollarSign /> },
          { id: "reportes", nombre: "Reportes y Estadísticas", icono: <FaChartBar /> },
        ].filter((item) => item.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  const notificacionesSinLeer = notificaciones.filter((n) => !n.leida).length

  return (
    <div className={`contenedor-admin ${theme === "dark" ? "dark" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>
      <button
        className="mobile-menu-toggle"
        onClick={() => setMenuMobileVisible(!menuMobileVisible)}
        aria-label={menuMobileVisible ? "Cerrar menú" : "Abrir menú"}
      >
        {menuMobileVisible ? <FaTimes /> : <FaBars />}
      </button>
      <div className="admin-layout">
        <section
          className={`seccion-menu ${menuColapsado ? "collapsed" : ""} ${menuMobileVisible ? "mobile-visible" : ""}`}
        >
          <div className="menu-header">
            {!menuColapsado && (
              <div className="menu-logo">
                {cargando ? (
                  <div className="logo-loading">
                    <div className="loading-spinner-small"></div>
                  </div>
                ) : (
                  <img src={getLogoSrc() || "/placeholder.svg"} alt="Beatbox Logo" />
                )}
              </div>
            )}
          </div>
          <ul className="menu-admin">
            <li className={vistaActual === "dashboard" ? "active" : ""} onClick={() => handleNavigation("dashboard")}>
              <FaTachometerAlt className="icono-menu" />
              {!menuColapsado && <span>Dashboard</span>}
            </li>
            <li className={vistaActual === "usuarios" ? "active" : ""} onClick={() => handleNavigation("usuarios")}>
              <FaUsers className="icono-menu" />
              {!menuColapsado && <span>Gestión de Usuarios</span>}
            </li>
            <li
              className={vistaActual === "suscripciones" ? "active" : ""}
              onClick={() => handleNavigation("suscripciones")}
            >
              <FaDollarSign className="icono-menu" />
              {!menuColapsado && <span>Gestión de Suscripciones</span>}
            </li>
            <li
              className={vistaActual === "suscripcion" ? "active" : ""}
              onClick={() => handleNavigation("suscripcion")}
            >
              <FaDollarSign className="icono-menu" />
              {!menuColapsado && <span>Activar Suscripciones</span>}
            </li>
            <li className={vistaActual === "playlist" ? "active" : ""} onClick={() => handleNavigation("playlist")}>
              <FaMusic className="icono-menu" />
              {!menuColapsado && <span>Playlists de Spotify</span>}
            </li>
            <li
              className={`menu-item ${menuAbierto.tienda ? "submenu-open" : ""} ${vistaActual.startsWith("tienda") ? "active" : ""}`}
              onClick={() => toggleSubmenu("tienda")}
            >
              <FaStore className="icono-menu" />
              {!menuColapsado && (
                <>
                  <span>Tienda</span>
                  <FaChevronDown className={`arrow ${menuAbierto.tienda ? "open" : ""}`} />
                </>
              )}
            </li>
            {menuAbierto.tienda && !menuColapsado && (
              <ul className="submenu-admin">
                <li
                  className={vistaActual === "tienda-categorias" ? "active" : ""}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("tienda-categorias")
                  }}
                >
                  Categorías
                </li>
                <li
                  className={vistaActual === "tienda-productos" ? "active" : ""}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("tienda-productos")
                  }}
                >
                  Productos
                </li>
                <li
                  className={vistaActual === "tienda-pedidos" ? "active" : ""}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("tienda-pedidos")
                  }}
                >
                  Pedidos
                </li>
              </ul>
            )}
            <li className={vistaActual === "empresa" ? "active" : ""} onClick={() => handleNavigation("empresa")}>
              <FaBuilding className="icono-menu" />
              {!menuColapsado && <span>Gestión de la Empresa</span>}
            </li>
            <li className={vistaActual === "documentos" ? "active" : ""} onClick={() => handleNavigation("documentos")}>
              <FaFileAlt className="icono-menu" />
              {!menuColapsado && <span>Documentos Regulatorios</span>}
            </li>
            <li
              className={vistaActual === "incidencias" ? "active" : ""}
              onClick={() => handleNavigation("incidencias")}
            >
              <FaExclamationTriangle className="icono-menu" />
              {!menuColapsado && <span>Incidencias</span>}
            </li>
            <li
              className={vistaActual === "redesSociales" ? "active" : ""}
              onClick={() => handleNavigation("redesSociales")}
            >
              <FaGlobe className="icono-menu" />
              {!menuColapsado && <span>Redes Sociales</span>}
            </li>
            <li
              className={`menu-item ${menuAbierto.reportes ? "submenu-open" : ""} ${vistaActual.startsWith("reportes") ? "active" : ""}`}
              onClick={() => toggleSubmenu("reportes")}
            >
              <FaChartBar className="icono-menu" />
              {!menuColapsado && (
                <>
                  <span>Reportes y Estadísticas</span>
                  <FaChevronDown className={`arrow ${menuAbierto.reportes ? "open" : ""}`} />
                </>
              )}
            </li>
            {menuAbierto.reportes && !menuColapsado && (
              <ul className="submenu-admin">
                <li
                  className={vistaActual === "reportes-ventas" ? "active" : ""}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("reportes-ventas")
                  }}
                >
                  Ventas
                </li>
                <li
                  className={vistaActual === "reportes-usuarios" ? "active" : ""}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("reportes-usuarios")
                  }}
                >
                  Usuarios
                </li>
              </ul>
            )}
          </ul>
        </section>
        <section className={`seccion-contenido ${menuColapsado ? "expanded" : ""}`}>
          {vistaActual === "bienvenida" || vistaActual === "dashboard" ? (
            <div className="dashboard-container">
              <h1 className="dashboard-title">Dashboard</h1>
              <div className="dashboard-welcome">
                <div className="welcome-content">
                  <h2>Bienvenido al Panel de Administración de Beatbox</h2>
                  <p>"El éxito es la suma de pequeños esfuerzos repetidos día tras día."</p>
                </div>
                <div className="welcome-logo">
                  {cargando ? (
                    <div className="logo-loading">
                      <div className="loading-spinner-small"></div>
                    </div>
                  ) : (
                    <img src={getLogoSrc() || "/placeholder.svg"} alt="Beatbox Logo" />
                  )}
                </div>
              </div>
              <div className="stats-cards">
                <div className="stat-card" onClick={() => handleNavigation("usuarios")}>
                  <div className="stat-icon users">
                    <FaUsers />
                  </div>
                  <div className="stat-info">
                    <h3>Usuarios</h3>
                    <p className="stat-value">{estadisticas.usuarios}</p>
                    <p className="stat-change positive">+5% esta semana</p>
                  </div>
                </div>
                <div className="stat-card" onClick={() => handleNavigation("suscripciones")}>
                  <div className="stat-icon subscriptions">
                    <FaDollarSign />
                  </div>
                  <div className="stat-info">
                    <h3>Suscripciones</h3>
                    <p className="stat-value">{estadisticas.suscripciones}</p>
                    <p className="stat-change positive">+3% esta semana</p>
                  </div>
                </div>
                <div className="stat-card" onClick={() => handleNavigation("tienda-productos")}>
                  <div className="stat-icon store">
                    <FaStore />
                  </div>
                  <div className="stat-info">
                    <h3>Tienda</h3>
                    <p className="stat-value">{estadisticas.tienda}</p>
                    <p className="stat-change positive">+10 nuevos productos</p>
                  </div>
                </div>
              </div>
              <div className="dashboard-sections">
                <div className="dashboard-section recent-activity">
                  <h2>Actividad Reciente</h2>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <FaUsers />
                      </div>
                      <div className="activity-details">
                        <p>Nuevo usuario registrado</p>
                        <span className="activity-time">Hace 10 minutos</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <FaStore />
                      </div>
                      <div className="activity-details">
                        <p>Nuevo pedido realizado</p>
                        <span className="activity-time">Hace 1 hora</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboard-section quick-actions">
                  <h2>Acciones Rápidas</h2>
                  <div className="quick-actions-grid">
                    <button className="quick-action-btn" onClick={() => handleNavigation("tienda-productos")}>
                      <FaStore />
                      <span>Nuevo Producto</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => handleNavigation("reportes-ventas")}>
                      <FaChartBar />
                      <span>Ver Reportes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {vistaActual === "documentos" && <DocumentosRegulatoriosAdmin />}
              {vistaActual === "empresa" && <EmpresaAdmin />}
              {vistaActual === "incidencias" && <IncidentesAdmin />}
              {vistaActual === "redesSociales" && <RedesSocialesAdmin />}
              {vistaActual === "usuarios" && <UsuariosAdmin />}
              {vistaActual === "suscripciones" && <GestionSuscripciones />}
              {vistaActual === "playlist" && <PlaylistAdmin />}
              {vistaActual === "tienda-categorias" && <CategoriasAdmin />}
              {vistaActual === "tienda-productos" && <Productos />}
              {vistaActual === "reportes-ventas" && <Reportes />}
              {vistaActual === "suscripcion" && <GestionSuscripciones />}
            </>
          )}
        </section>
      </div>
      <FooterH />
    </div>
  )
}

export default Administrador
