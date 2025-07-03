"use client"

import { useState, useEffect, useContext } from "react" // Import useContext
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext" // Import ThemeContext
import DOMPurify from "dompurify"
import "./UsuariosAdmin.css"
import { FaUserShield, FaUser } from "react-icons/fa"

const UsuariosAdmin = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext) // Get theme from context
  const [usuarios, setUsuarios] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [tokenCSRF, setTokenCSRF] = useState("")

  useEffect(() => {
    const obtenerCSRF = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/csrf-token", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        setTokenCSRF(data.csrfToken)
      } catch (error) {
        console.error("Error al obtener CSRF Token:", error)
      }
    }
    obtenerCSRF()
  }, [])

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:3000/usuarios", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        setUsuarios(data)
      } catch (error) {
        console.error("Error al cargar usuarios:", error)
      }
    }
    cargarUsuarios()
  }, [])

  const cerrarModal = () => {
    setModalVisible(false)
    setModalMessage("")
  }

  const sanitizarEntrada = (input) => {
    const regexPeligroso = /[<>`"';{}()[\]]/g
    return regexPeligroso.test(input) ? "" : DOMPurify.sanitize(input)
  }

  const eliminarUsuario = async (userId, userName) => {
    const confirmacion = prompt(`Escribe "ELIMINAR" para borrar a ${sanitizarEntrada(userName)}`)
    if (confirmacion !== "ELIMINAR") return

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": tokenCSRF,
        },
        credentials: "include",
      })

      if (response.ok) {
        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== userId))
        setModalMessage(`El usuario ${sanitizarEntrada(userName)} ha sido eliminado.`)
        setModalVisible(true)
      } else {
        setModalMessage("Error al eliminar usuario.")
        setModalVisible(true)
      }
    } catch (error) {
      console.error("Error de red al eliminar usuario:", error)
    }
  }

  const toggleBloqueoUsuario = async (userId, bloqueado) => {
    try {
      const response = await fetch(`http://localhost:3000/usuarios/bloquear/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": tokenCSRF,
        },
        credentials: "include",
        body: JSON.stringify({ bloquear: !bloqueado }),
      })

      if (response.ok) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.id === userId ? { ...usuario, bloqueado: !usuario.bloqueado } : usuario,
          ),
        )
        setModalMessage(`El usuario ha sido ${!bloqueado ? "bloqueado" : "desbloqueado"} exitosamente.`)
        setModalVisible(true)
      } else {
        setModalMessage("Error al cambiar estado de bloqueo.")
        setModalVisible(true)
      }
    } catch (error) {
      console.error("Error de red al cambiar estado de bloqueo:", error)
    }
  }

  return (
    <div className={`usuarios-admin-contenedor ${theme === "dark" ? "dark" : ""}`}>
      <header className="usuarios-admin-header">
        <h1>Gestión de Usuarios</h1>
      </header>

      <div className="table-responsive">
        <table className="usuarios-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td data-label="Nombre">{sanitizarEntrada(usuario.usuario)}</td>
                <td data-label="Correo electrónico">{sanitizarEntrada(usuario.correo_electronico)}</td>
                <td data-label="Rol">
                  <span className={`rol-badge ${usuario.role === "admin" ? "admin" : "usuario"}`}>
                    {usuario.role === "admin" ? (
                      <>
                        <FaUserShield className="rol-icon" />
                        Admin
                      </>
                    ) : (
                      <>
                        <FaUser className="rol-icon" />
                        Usuario
                      </>
                    )}
                  </span>
                </td>
                <td data-label="Acciones">
                  <div className="button-group">
                    <button
                      className={`btn-estado ${usuario.bloqueado ? "bloqueado" : "activo"}`}
                      onClick={() => toggleBloqueoUsuario(usuario.id, usuario.bloqueado)}
                    >
                      {usuario.bloqueado ? "Desbloquear" : "Bloquear"}
                    </button>
                    <button className="btn-eliminar" onClick={() => eliminarUsuario(usuario.id, usuario.usuario)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <button className="custom-modal-close" onClick={cerrarModal}>
              &times;
            </button>
            <h2>{modalMessage.includes("bloqueado") ? "Estado Actualizado" : "Acción Exitosa"}</h2>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsuariosAdmin
