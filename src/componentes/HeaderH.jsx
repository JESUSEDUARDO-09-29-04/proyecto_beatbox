"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaHome,
  FaShoppingCart,
  FaEnvelope,
  FaBars,
  FaExclamationTriangle,
  FaUsersCog,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa"
import { ThemeContext } from "../context/ThemeContext"
import { useEmpresa } from "../context/EmpresaContext"
import logo from "../assets/logo.png"
import "./HeaderH.css"
import SuccessModal from "./SuccessModal"

const HeaderH = () => {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [adminMenuAbierto, setAdminMenuAbierto] = useState(false)
  const [user, setUser] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { theme } = useContext(ThemeContext)
  const { logoVigente, cargando } = useEmpresa()
  const navigate = useNavigate()

  const toggleAdminMenu = () => setAdminMenuAbierto(!adminMenuAbierto)

  // Verificar sesión al cargar el componente
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/validate-user", {
          method: "GET",
          credentials: "include",
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else if (res.status === 401) {
          setUser(null) // No está logueado
        } else {
          console.error("Error inesperado:", res.status)
          setUser(null)
        }
      } catch (error) {
        console.error("Error al validar sesión:", error)
        setUser(null)
      }
    }

    verificarSesion()
  }, [])

  const manejarCerrarSesion = async () => {
    try {
      await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      setUser(null)
      setShowLogoutModal(true)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false)
    navigate("/")
  }

  // Obtener el nombre de usuario para mostrar
  const getUserName = () => {
    if (!user) return ""
    // Intentar obtener el nombre de diferentes propiedades posibles
    return user.nombre || user.username || user.usuario || user.name || ""
  }

  // Manejadores de eventos para el menú hover
  const handleMenuMouseEnter = () => {
    setMenuAbierto(true)
  }

  const handleMenuMouseLeave = () => {
    setMenuAbierto(false)
  }

  // Determinar qué logo usar: vigente del backend o logo por defecto
  const getLogoSrc = () => {
    if (cargando) return logo // Usar logo por defecto mientras carga
    return logoVigente || logo // Usar logo vigente si existe, sino el por defecto
  }

  return (
    <header className={`navbar ${theme === "dark" ? "dark-mode" : ""}`}>
      <img src={getLogoSrc() || "/placeholder.svg"} alt="Logo" className="logo" onClick={() => navigate("/")} />

      <nav className="nav-enlaces">
        {!user ? (
          <>
            <button className="btn btn-inicio" onClick={() => navigate("/iniciar-sesion")}>
              Iniciar sesión
            </button>
            <button className="btn btn-inicio" onClick={() => navigate("/registro")}>
              Registrarse
            </button>
          </>
        ) : (
          <>
            <div className="usuario-info">
              <FaUser className="usuario-icono" />
              <span className="usuario-saludo">Hola, bienvenido {getUserName()}</span>
            </div>
            <button className="btn btn-cerrar-sesion" onClick={manejarCerrarSesion}>
              Cerrar sesión
            </button>
          </>
        )}

        <div className="menu-hover-container" onMouseEnter={handleMenuMouseEnter} onMouseLeave={handleMenuMouseLeave}>
          <button className="menu-icono">
            <FaBars />
          </button>

          {/* Menú desplegable */}
          <div className={`menu-desplegable ${menuAbierto ? "activo" : ""} ${theme === "dark" ? "dark-mode" : ""}`}>
            <div className="menu-header">
              <img src={getLogoSrc() || "/placeholder.svg"} alt="Logo" className="menu-logo" />
              <button className="btn-suscribirse" onClick={() => navigate("/suscripcion")}>
                ¡Suscríbete!
              </button>
              {user && (
                <div className="menu-user-greeting-text">
                  <FaUser className="greeting-icon" />
                  <span>Hola, {getUserName()}</span>
                </div>
              )}
            </div>

            <ul className="menu-secciones">
              <li
                onClick={() => {
                  navigate("/")
                  setMenuAbierto(false)
                }}
              >
                <FaHome /> Inicio
              </li>
              <li
                onClick={() => {
                  navigate("/Tienda")
                  setMenuAbierto(false)
                }}
              >
                <FaShoppingCart /> Tienda
              </li>
              <li
                onClick={() => {
                  navigate("/Preguntas_Frecuentes")
                  setMenuAbierto(false)
                }}
              >
                <FaExclamationTriangle /> Preguntas Frecuentes
              </li>
              <li
                onClick={() => {
                  navigate("/contactanos")
                  setMenuAbierto(false)
                }}
              >
                <FaEnvelope /> Contáctanos
              </li>
            </ul>

            {!user && (
              <ul className="menu-secciones menu-auth-mobile">
                <li
                  onClick={() => {
                    navigate("/iniciar-sesion")
                    setMenuAbierto(false)
                  }}
                >
                  <FaSignInAlt /> Iniciar sesión
                </li>
                <li
                  onClick={() => {
                    navigate("/registro")
                    setMenuAbierto(false)
                  }}
                >
                  <FaUserPlus /> Registrarse
                </li>
              </ul>
            )}

            {user && (
              <ul className="menu-secciones menu-user-mobile">
                <li
                  onClick={() => {
                    navigate("/perfil")
                    setMenuAbierto(false)
                  }}
                >
                  <FaUser /> Perfil de Usuario
                </li>
                <li onClick={manejarCerrarSesion}>
                  <FaSignInAlt /> Cerrar sesión
                </li>
              </ul>
            )}

            {/* Sección solo para admin */}
            {user?.role === "admin" && (
              <ul className="menu-secciones admin-section">
                <li
                  onClick={() => {
                    navigate("/Administrador")
                    setMenuAbierto(false)
                  }}
                >
                  <FaUsersCog /> Administrador
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Modal de éxito al cerrar sesión */}
      {showLogoutModal && (
        <SuccessModal
          message="¡Sesión cerrada exitosamente!"
          onClose={handleCloseLogoutModal}
          duration={1000}
          loadingDuration={500}
        />
      )}
    </header>
  )
}

export default HeaderH
