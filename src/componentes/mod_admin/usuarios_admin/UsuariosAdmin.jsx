"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../../context/ThemeContext"
import DOMPurify from "dompurify"
import "./UsuariosAdmin.css"
import { FaUserShield, FaUser, FaPlus, FaEdit } from "react-icons/fa"

const UsuariosAdmin = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [usuarios, setUsuarios] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalType, setModalType] = useState("info") // info, form, roleChange
  const [tokenCSRF, setTokenCSRF] = useState("")

  // Estados para formularios
  const [formData, setFormData] = useState({
    usuario: "",
    correo_electronico: "",
    password: "",
    role: "user",
  })
  const [editingUser, setEditingUser] = useState(null)
  const [newRole, setNewRole] = useState("")

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
    setModalType("info")
    setEditingUser(null)
    setNewRole("")
    setFormData({
      usuario: "",
      correo_electronico: "",
      password: "",
      role: "user",
    })
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
        setModalType("info")
        setModalVisible(true)
      } else {
        setModalMessage("Error al eliminar usuario.")
        setModalType("info")
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
        setModalType("info")
        setModalVisible(true)
      } else {
        setModalMessage("Error al cambiar estado de bloqueo.")
        setModalType("info")
        setModalVisible(true)
      }
    } catch (error) {
      console.error("Error de red al cambiar estado de bloqueo:", error)
    }
  }

  const abrirModalAgregarUsuario = () => {
    setModalType("form")
    setModalVisible(true)
  }

  const abrirModalCambiarRol = (usuario) => {
    setEditingUser(usuario)
    setNewRole(usuario.role)
    setModalType("roleChange")
    setModalVisible(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizarEntrada(value),
    }))
  }

  const agregarUsuario = async (e) => {
    e.preventDefault()

    if (!formData.usuario || !formData.correo_electronico || !formData.password) {
      setModalMessage("Todos los campos son obligatorios.")
      setModalType("info")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": tokenCSRF,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const nuevoUsuario = await response.json()
        setUsuarios((prev) => [...prev, nuevoUsuario])
        setModalMessage("Usuario agregado exitosamente.")
        setModalType("info")
        setFormData({
          usuario: "",
          correo_electronico: "",
          password: "",
          role: "user",
        })
      } else {
        const errorData = await response.json()
        setModalMessage(errorData.message || "Error al agregar usuario.")
        setModalType("info")
      }
    } catch (error) {
      console.error("Error al agregar usuario:", error)
      setModalMessage("Error de conexión al agregar usuario.")
      setModalType("info")
    }
  }

  const cambiarRolUsuario = async (e) => {
    e.preventDefault()

    if (!editingUser || !newRole) return

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${editingUser.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenCSRF}`,
        },
        credentials: "include",
        body: JSON.stringify({ newRole }),
      })

      if (response.ok) {
        setUsuarios((prev) =>
          prev.map((usuario) => (usuario.id === editingUser.id ? { ...usuario, role: newRole } : usuario)),
        )
        setModalMessage(`Rol del usuario ${editingUser.usuario} cambiado a ${newRole} exitosamente.`)
        setModalType("info")
        cerrarModal()
      } else {
        const errorData = await response.json()
        setModalMessage(errorData.message || "Error al cambiar rol del usuario.")
        setModalType("info")
      }
    } catch (error) {
      console.error("Error al cambiar rol:", error)
      setModalMessage("Error de conexión al cambiar rol.")
      setModalType("info")
    }
  }

  const renderModal = () => {
    if (modalType === "form") {
      return (
        <div className="custom-modal form-modal">
          <button className="custom-modal-close" onClick={cerrarModal}>
            &times;
          </button>
          <h2>Agregar Nuevo Usuario</h2>
          <form onSubmit={agregarUsuario}>
            <div className="form-group">
              <label htmlFor="usuario">Nombre de Usuario:</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="correo_electronico">Correo Electrónico:</label>
              <input
                type="email"
                id="correo_electronico"
                name="correo_electronico"
                value={formData.correo_electronico}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Rol:</label>
              <select id="role" name="role" value={formData.role} onChange={handleInputChange}>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button type="submit" className="btn-guardar">
                Agregar Usuario
              </button>
            </div>
          </form>
        </div>
      )
    }

    if (modalType === "roleChange") {
      return (
        <div className="custom-modal form-modal">
          <button className="custom-modal-close" onClick={cerrarModal}>
            &times;
          </button>
          <h2>Cambiar Rol de Usuario</h2>
          <p>
            Usuario: <strong>{editingUser?.usuario}</strong>
          </p>
          <form onSubmit={cambiarRolUsuario}>
            <div className="form-group">
              <label htmlFor="newRole">Nuevo Rol:</label>
              <select id="newRole" value={newRole} onChange={(e) => setNewRole(e.target.value)} required>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button type="submit" className="btn-guardar">
                Cambiar Rol
              </button>
            </div>
          </form>
        </div>
      )
    }

    return (
      <div className="custom-modal">
        <button className="custom-modal-close" onClick={cerrarModal}>
          &times;
        </button>
        <h2>{modalMessage.includes("bloqueado") ? "Estado Actualizado" : "Acción Exitosa"}</h2>
        <p>{modalMessage}</p>
      </div>
    )
  }

  return (
    <div className={`usuarios-admin-contenedor ${theme === "dark" ? "dark" : ""}`}>
      <header className="usuarios-admin-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn-agregar-usuario" onClick={abrirModalAgregarUsuario}>
          <FaPlus />
          Agregar Usuario
        </button>
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
                  <span
                    className={`rol-badge ${usuario.role === "admin" ? "admin" : "usuario"}`}
                    onClick={() => abrirModalCambiarRol(usuario)}
                    title="Clic para cambiar rol"
                  >
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
                    <button className="btn-cambiar-rol" onClick={() => abrirModalCambiarRol(usuario)}>
                      <FaEdit /> Rol
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

      {modalVisible && <div className="custom-modal-overlay">{renderModal()}</div>}
    </div>
  )
}

export default UsuariosAdmin
