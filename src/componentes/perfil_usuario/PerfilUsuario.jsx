"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import {
  FaCreditCard,
  FaShoppingBag,
  FaWeight,
  FaChartLine,
  FaCalendarAlt,
  FaChevronDown,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaAddressCard,
  FaHistory,
  FaTachometerAlt,
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
import HistorialActividad from "./HistorialActividad"
import Configuracion from "./Configuracion"
// Añadir la importación del componente ProgresoFisico
import ProgresoFisico from "./ProgresoFisico"

const PerfilUsuario = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useContext(ThemeContext)
  const [menuAbierto, setMenuAbierto] = useState({
    tienda: false,
    actividad: false,
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
        const res = await fetch("http://localhost:3000/auth/validate-user", {
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
    } else if (path.includes("/perfil/historial-actividad")) {
      setVistaActual("historial-actividad")
      setMenuAbierto((prev) => ({ ...prev, actividad: true }))
    } else if (path.includes("/perfil/configuracion")) {
      setVistaActual("configuracion")
    } else if (path.includes("/perfil/progreso-fisico")) {
      setVistaActual("progreso-fisico")
    }
  }, [location.pathname])

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
      case "historial-actividad":
        navigate("/perfil/historial-actividad")
        break
      case "configuracion":
        navigate("/perfil/configuracion")
        break
      // En el switch statement dentro de handleNavigation, añadir:
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

  const cerrarSesion = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      navigate("/iniciar-sesion")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
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
            <div className="avatar">
              {userData?.nombre?.charAt(0) || "U"}
              {userData?.apellidos?.charAt(0) || ""}
            </div>
            {!menuColapsado && (
              <div className="usuario-datos">
                <h3>
                  {userData?.nombre} {userData?.apellidos}
                </h3>
                <p className="usuario-plan">{userData?.suscripcion || "Usuario Básico"}</p>
              </div>
            )}
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
            {/* Añadir una nueva opción en el menú lateral, después de "Datos Físicos" */}
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

            <li
              className={`menu-item ${menuAbierto.actividad ? "submenu-open" : ""} ${
                vistaActual.startsWith("actividad") || vistaActual === "historial-actividad" ? "active" : ""
              }`}
              onClick={() => toggleSubmenu("actividad")}
            >
              <FaChartLine className="icono-menu" />
              {!menuColapsado && (
                <>
                  <span>Actividad</span>
                  <FaChevronDown className={`arrow ${menuAbierto.actividad ? "open" : ""}`} />
                </>
              )}
            </li>

            {menuAbierto.actividad && !menuColapsado && (
              <ul className="submenu-perfil">
                <li
                  className={vistaActual === "historial-actividad" ? "active" : ""}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigation("historial-actividad")
                  }}
                >
                  <FaCalendarAlt className="icono-submenu" />
                  <span>Historial de Actividad</span>
                </li>
              </ul>
            )}

            <li
              className={vistaActual === "configuracion" ? "active" : ""}
              onClick={() => handleNavigation("configuracion")}
            >
              <FaCog className="icono-menu" />
              {!menuColapsado && <span>Configuración</span>}
            </li>

            <li className="menu-footer" onClick={cerrarSesion}>
              <FaSignOutAlt className="icono-menu" />
              {!menuColapsado && <span>Cerrar Sesión</span>}
            </li>
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
                <div className="welcome-avatar">
                  <div className="avatar-large">
                    {userData?.nombre?.charAt(0) || "U"}
                    {userData?.apellidos?.charAt(0) || ""}
                  </div>
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
                  <div className="stat-icon actividad">
                    <FaChartLine />
                  </div>
                  <div className="stat-info">
                    <h3>Actividad</h3>
                    <p className="stat-description">Revisa tu historial de entrenamientos</p>
                    <button className="stat-action" onClick={() => handleNavigation("historial-actividad")}>
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>

              <div className="dashboard-sections">
                <div className="dashboard-section progress-summary">
                  <h2>Resumen de Progreso</h2>
                  <div className="progress-container">
                    <div className="progress-item">
                      <div className="progress-title">
                        <span>Asistencia este mes</span>
                        <span>12/30 días</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "40%" }}></div>
                      </div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-title">
                        <span>Progreso a meta de peso</span>
                        <span>65%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-section upcoming-classes">
                  <h2>Próximas Clases</h2>
                  <div className="classes-list">
                    <div className="class-item">
                      <div className="class-time">10:00 - 11:00</div>
                      <div className="class-details">
                        <h4>CrossFit</h4>
                        <p>Coach: Juan Pérez</p>
                      </div>
                    </div>
                    <div className="class-item">
                      <div className="class-time">18:00 - 19:00</div>
                      <div className="class-details">
                        <h4>Spinning</h4>
                        <p>Coach: Ana López</p>
                      </div>
                    </div>
                  </div>
                  <button className="see-all-button">Ver Todas las Clases</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {vistaActual === "datos-personales" && <DatosPersonales userData={userData} />}
              {vistaActual === "datos-fisicos" && <DatosFisicos userData={userData} />}
              {vistaActual === "suscripciones" && <Suscripciones userData={userData} />}
              {vistaActual === "historial-compras" && <HistorialCompras userData={userData} />}
              {vistaActual === "historial-actividad" && <HistorialActividad userData={userData} />}
              {vistaActual === "configuracion" && <Configuracion userData={userData} />}
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

