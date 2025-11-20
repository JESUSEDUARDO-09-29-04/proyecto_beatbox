"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import {
  FaCreditCard,
  FaShoppingBag,
  FaWeight,
  FaChartLine,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaAddressCard,
  FaHistory,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa"
import "./PerfilUsuario.css"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import logo from "../../assets/logo.png"

// Importar componentes del perfil
import DatosPersonales from "./DatosPersonales"
import DatosFisicos from "./DatosFisicos"
import HistorialCompras from "./HistorialCompras"
import Suscripciones from "./SuscripcionesPerfil"
import ProgresoFisico from "./ProgresoFisico"

const PerfilUsuario = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useContext(ThemeContext)
  const [menuAbierto, setMenuAbierto] = useState({
    tienda: false,
  })
  const [vistaActual, setVistaActual] = useState("bienvenida")
  const [menuColapsado, setMenuColapsado] = useState(false)
  const [menuMobileVisible, setMenuMobileVisible] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        setLoading(true)
        const res = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/validate-user", {
          method: "GET",
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setUserData(data)
          setLoading(false)
        } else {
          // Redirigir al login si no está autenticado
          navigate("/iniciar-sesion")
        }
      } catch (error) {
        console.error("Error al validar sesión:", error)
        navigate("/iniciar-sesion")
      }
    }

    verificarSesion()
  }, [navigate])

  // Efecto para establecer la vista actual basada en la URL
  useEffect(() => {
    const path = location.pathname.toLowerCase()
    if (path === "/perfil" || path === "/perfil/") {
      setVistaActual("bienvenida")
      return
    }

    if (path.includes("/perfil/datos-personales")) {
      setVistaActual("datos-personales")
    } else if (path.includes("/perfil/datos-fisicos")) {
      setVistaActual("datos-fisicos")
    } else if (path.includes("/perfil/suscripciones")) {
      setVistaActual("suscripciones")
    } else if (path.includes("/perfil/historial-compras")) {
      setVistaActual("historial-compras")
      setMenuAbierto((prev) => ({ ...prev, tienda: true }))
    } else if (path.includes("/perfil/progreso-fisico")) {
      setVistaActual("progreso-fisico")
    }
  }, [location.pathname])

  const getUserName = () => {
    if (!userData) return ""
    return userData.nombre || userData.username || userData.usuario || userData.name || ""
  }

  const handleNavigation = (view) => {
    setVistaActual(view)
    setMenuMobileVisible(false) // Cerrar menú móvil al navegar

    // Actualizar la URL según la vista seleccionada
    switch (view) {
      case "datos-personales":
        navigate("/perfil/datos-personales")
        break
      case "datos-fisicos":
        navigate("/perfil/datos-fisicos")
        break
      case "suscripciones":
        navigate("/perfil/suscripciones")
        break
      case "historial-compras":
        navigate("/perfil/historial-compras")
        break
      case "progreso-fisico":
        navigate("/perfil/progreso-fisico")
        break
      default:
        navigate("/perfil")
        break
    }
  }

  const toggleSubmenu = (menu) => {
    setMenuAbierto((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  if (loading) {
    return (
      <div className={`contenedor ${theme === "dark" ? "dark" : ""}`}>
        <HeaderH />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
        <FooterH />
      </div>
    )
  }

  return (
    <div className={`contenedor-perfil ${theme === "dark" ? "dark-mode" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      {/* Botón de menú móvil */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMenuMobileVisible(!menuMobileVisible)}
        aria-label={menuMobileVisible ? "Cerrar menú" : "Abrir menú"}
      >
        {menuMobileVisible ? <FaTimes /> : <FaBars />}
      </button>

      <div className="perfil-layout">
        {/* Menú lateral */}
        <section
          className={`seccion-menu ${menuColapsado ? "collapsed" : ""} ${menuMobileVisible ? "mobile-visible" : ""}`}
        >
          <div className="menu-header">
            {!menuColapsado && (
              <div className="menu-logo">
                <img src={logo || "/placeholder.svg"} alt="Beatbox Logo" />
              </div>
            )}
          </div>

          <div className="usuario-info">
            <div className="usuario-info">
              <FaUser className="usuario-icono-p" />
              <span className="usuario">{getUserName()}</span>
            </div>
          </div>

          <ul className="menu-perfil">
            <li className={vistaActual === "bienvenida" ? "active" : ""} onClick={() => handleNavigation("bienvenida")}>
              <FaTachometerAlt className="icono-menu" />
              {!menuColapsado && <span>Dashboard</span>}
            </li>

            <li
              className={vistaActual === "datos-personales" ? "active" : ""}
              onClick={() => handleNavigation("datos-personales")}
            >
              <FaAddressCard className="icono-menu" />
              {!menuColapsado && <span>Datos Personales</span>}
            </li>

            <li
              className={vistaActual === "datos-fisicos" ? "active" : ""}
              onClick={() => handleNavigation("datos-fisicos")}
            >
              <FaWeight className="icono-menu" />
              {!menuColapsado && <span>Datos Físicos</span>}
            </li>

            <li
              className={vistaActual === "progreso-fisico" ? "active" : ""}
              onClick={() => handleNavigation("progreso-fisico")}
            >
              <FaChartLine className="icono-menu" />
              {!menuColapsado && <span>Progreso Físico</span>}
            </li>

            <li
              className={vistaActual === "suscripciones" ? "active" : ""}
              onClick={() => handleNavigation("suscripciones")}
            >
              <FaCreditCard className="icono-menu" />
              {!menuColapsado && <span>Suscripciones</span>}
            </li>

            <li
              className={`menu-item ${menuAbierto.tienda ? "submenu-open" : ""} ${
                vistaActual.startsWith("tienda") || vistaActual === "historial-compras" ? "active" : ""
              }`}
              onClick={() => toggleSubmenu("tienda")}
            >
              <FaShoppingBag className="icono-menu" />
              {!menuColapsado && (
                <>
                  <span>Tienda</span>
                  <FaChevronDown className={`arrow ${menuAbierto.tienda ? "open" : ""}`} />
                </>
              )}
            </li>

            {menuAbierto.tienda && !menuColapsado && (
              <ul className="submenu-perfil">
                <li
                  className={vistaActual === "historial-compras" ? "active" : ""}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("historial-compras")
                  }}
                >
                  <FaHistory className="icono-submenu" />
                  <span>Historial de Compras</span>
                </li>
              </ul>
            )}
          </ul>
        </section>

        {/* Contenido principal */}
        <section className={`seccion-contenido ${menuColapsado ? "expanded" : ""}`}>
          {vistaActual === "bienvenida" ? (
            <div className="dashboard-perfil">
              <h1 className="dashboard-title">Mi Perfil</h1>

              <div className="dashboard-welcome">
                <div className="welcome-content">
                  <h2>Bienvenido, {userData?.nombre}</h2>
                  <p>
                    En esta sección podrás gestionar tu información personal, realizar seguimiento de tu progreso y
                    revisar tu historial de actividades en Beatbox.
                  </p>
                </div>
              </div>

              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon datos">
                    <FaAddressCard />
                  </div>
                  <div className="stat-info">
                    <h3>Datos Personales</h3>
                    <p className="stat-description">Actualiza tu información de contacto y personal</p>
                    <button className="stat-action" onClick={() => handleNavigation("datos-personales")}>
                      Ver Detalles
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon fisicos">
                    <FaWeight />
                  </div>
                  <div className="stat-info">
                    <h3>Datos Físicos</h3>
                    <p className="stat-description">Registra tus medidas y metas físicas</p>
                    <button className="stat-action" onClick={() => handleNavigation("datos-fisicos")}>
                      Ver Detalles
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon progreso">
                    <FaChartLine />
                  </div>
                  <div className="stat-info">
                    <h3>Progreso Físico</h3>
                    <p className="stat-description">Visualiza tu evolución y logros</p>
                    <button className="stat-action" onClick={() => handleNavigation("progreso-fisico")}>
                      Ver Detalles
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon suscripcion">
                    <FaCreditCard />
                  </div>
                  <div className="stat-info">
                    <h3>Suscripción</h3>
                    <p className="stat-description">Gestiona tu membresía actual y pagos</p>
                    <button className="stat-action" onClick={() => handleNavigation("suscripciones")}>
                      Ver Detalles
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon tienda">
                    <FaShoppingBag />
                  </div>
                  <div className="stat-info">
                    <h3>Historial de Compras</h3>
                    <p className="stat-description">Revisa tus compras y pedidos</p>
                    <button className="stat-action" onClick={() => handleNavigation("historial-compras")}>
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>

              {/* Sección de dashboard sections removida completamente */}
            </div>
          ) : (
            <>
              {vistaActual === "datos-personales" && <DatosPersonales userData={userData} />}
              {vistaActual === "datos-fisicos" && <DatosFisicos userData={userData} />}
              {vistaActual === "suscripciones" && <Suscripciones userData={userData} />}
              {vistaActual === "historial-compras" && <HistorialCompras userData={userData} />}
              {vistaActual === "progreso-fisico" && <ProgresoFisico userData={userData} />}
            </>
          )}
        </section>
      </div>

      <FooterH />
    </div>
  )
}

export default PerfilUsuario
