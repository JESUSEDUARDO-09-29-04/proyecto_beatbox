"use client"

import { useState } from "react"
import {
  FaBell,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaToggleOff,
  FaToggleOn,
  FaSave,
  FaTrash,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa"
import "./Configuracion.css"

const Configuracion = ({ userData }) => {
  const [contrasenaForm, setContrasenaForm] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  })

  const [mostrarContrasenaActual, setMostrarContrasenaActual] = useState(false)
  const [mostrarNuevaContrasena, setMostrarNuevaContrasena] = useState(false)
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false)

  const [configuraciones, setConfiguraciones] = useState({
    notificacionesEmail: true,
    notificacionesPush: true,
    recordatoriosClases: true,
    boletinInformativo: false,
    ofertas: true,
    modoOscuro: false,
  })

  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" })
  const [guardando, setGuardando] = useState(false)
  const [confirmEliminar, setConfirmEliminar] = useState(false)

  const handleChangeContrasena = (e) => {
    const { name, value } = e.target
    setContrasenaForm((prev) => ({ ...prev, [name]: value }))

    // Limpiar error del campo
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleToggleConfig = (config) => {
    setConfiguraciones((prev) => ({ ...prev, [config]: !prev[config] }))
  }

  const validarFormularioContrasena = () => {
    const nuevosErrores = {}

    // Validar contraseña actual
    if (!contrasenaForm.contrasenaActual) {
      nuevosErrores.contrasenaActual = "La contraseña actual es obligatoria"
    }

    // Validar nueva contraseña
    if (!contrasenaForm.nuevaContrasena) {
      nuevosErrores.nuevaContrasena = "La nueva contraseña es obligatoria"
    } else if (contrasenaForm.nuevaContrasena.length < 8) {
      nuevosErrores.nuevaContrasena = "La contraseña debe tener al menos 8 caracteres"
    }

    // Validar confirmación de contraseña
    if (!contrasenaForm.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = "La confirmación de contraseña es obligatoria"
    } else if (contrasenaForm.nuevaContrasena !== contrasenaForm.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleCambiarContrasena = (e) => {
    e.preventDefault()

    if (validarFormularioContrasena()) {
      setGuardando(true)
      setMensaje({ texto: "", tipo: "" })

      // Simular envío de datos a la API
      setTimeout(() => {
        setGuardando(false)
        setMensaje({
          texto: "Contraseña actualizada correctamente",
          tipo: "exito",
        })

        // Limpiar formulario
        setContrasenaForm({
          contrasenaActual: "",
          nuevaContrasena: "",
          confirmarContrasena: "",
        })

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje({ texto: "", tipo: "" })
        }, 3000)
      }, 1000)
    }
  }

  const handleGuardarConfiguraciones = () => {
    setGuardando(true)
    setMensaje({ texto: "", tipo: "" })

    // Simular envío de datos a la API
    setTimeout(() => {
      setGuardando(false)
      setMensaje({
        texto: "Configuraciones guardadas correctamente",
        tipo: "exito",
      })

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje({ texto: "", tipo: "" })
      }, 3000)
    }, 1000)
  }

  const handleEliminarCuenta = () => {
    if (confirmEliminar) {
      // Aquí iría la lógica para eliminar la cuenta
      alert("Esta acción eliminaría tu cuenta. Esta operación no se puede deshacer.")
    } else {
      setConfirmEliminar(true)

      // Ocultar confirmación después de 10 segundos
      setTimeout(() => {
        setConfirmEliminar(false)
      }, 10000)
    }
  }

  return (
    <div className="configuracion-container">
      <div className="datos-header">
        <h1>Configuración</h1>
        <p>
          Personaliza la configuración de tu cuenta, actualiza tu contraseña y gestiona tus preferencias de
          notificación.
        </p>
      </div>

      {mensaje.texto && (
        <div className={`mensaje-alerta ${mensaje.tipo}`}>
          {mensaje.tipo === "exito" ? (
            <FaCheckCircle className="mensaje-icono" />
          ) : (
            <FaExclamationTriangle className="mensaje-icono" />
          )}
          <p>{mensaje.texto}</p>
        </div>
      )}

      <div className="configuracion-content">
        <div className="config-section">
          <h2>
            <FaLock /> Cambiar Contraseña
          </h2>
          <form onSubmit={handleCambiarContrasena} className="config-form">
            <div className="form-group">
              <label htmlFor="contrasenaActual">Contraseña Actual</label>
              <div className="password-field">
                <input
                  type={mostrarContrasenaActual ? "text" : "password"}
                  id="contrasenaActual"
                  name="contrasenaActual"
                  value={contrasenaForm.contrasenaActual}
                  onChange={handleChangeContrasena}
                  className={errores.contrasenaActual ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setMostrarContrasenaActual(!mostrarContrasenaActual)}
                >
                  {mostrarContrasenaActual ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errores.contrasenaActual && <div className="error-mensaje">{errores.contrasenaActual}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="nuevaContrasena">Nueva Contraseña</label>
              <div className="password-field">
                <input
                  type={mostrarNuevaContrasena ? "text" : "password"}
                  id="nuevaContrasena"
                  name="nuevaContrasena"
                  value={contrasenaForm.nuevaContrasena}
                  onChange={handleChangeContrasena}
                  className={errores.nuevaContrasena ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setMostrarNuevaContrasena(!mostrarNuevaContrasena)}
                >
                  {mostrarNuevaContrasena ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errores.nuevaContrasena && <div className="error-mensaje">{errores.nuevaContrasena}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Nueva Contraseña</label>
              <div className="password-field">
                <input
                  type={mostrarConfirmarContrasena ? "text" : "password"}
                  id="confirmarContrasena"
                  name="confirmarContrasena"
                  value={contrasenaForm.confirmarContrasena}
                  onChange={handleChangeContrasena}
                  className={errores.confirmarContrasena ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                >
                  {mostrarConfirmarContrasena ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errores.confirmarContrasena && <div className="error-mensaje">{errores.confirmarContrasena}</div>}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-guardar" disabled={guardando}>
                {guardando ? (
                  "Cambiando..."
                ) : (
                  <>
                    <FaSave /> Cambiar Contraseña
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="config-section">
          <h2>
            <FaBell /> Notificaciones y Comunicaciones
          </h2>
          <div className="config-toggles">
            <div className="config-toggle-item">
              <div className="toggle-label">
                <span>Notificaciones por Email</span>
                <p className="toggle-description">Recibe notificaciones importantes por correo electrónico</p>
              </div>
              <button className="toggle-button" onClick={() => handleToggleConfig("notificacionesEmail")}>
                {configuraciones.notificacionesEmail ? (
                  <FaToggleOn className="toggle-on" />
                ) : (
                  <FaToggleOff className="toggle-off" />
                )}
              </button>
            </div>

            <div className="config-toggle-item">
              <div className="toggle-label">
                <span>Notificaciones Push</span>
                <p className="toggle-description">Recibe notificaciones en tu dispositivo</p>
              </div>
              <button className="toggle-button" onClick={() => handleToggleConfig("notificacionesPush")}>
                {configuraciones.notificacionesPush ? (
                  <FaToggleOn className="toggle-on" />
                ) : (
                  <FaToggleOff className="toggle-off" />
                )}
              </button>
            </div>

            <div className="config-toggle-item">
              <div className="toggle-label">
                <span>Recordatorios de Clases</span>
                <p className="toggle-description">Recibe recordatorios antes de tus clases programadas</p>
              </div>
              <button className="toggle-button" onClick={() => handleToggleConfig("recordatoriosClases")}>
                {configuraciones.recordatoriosClases ? (
                  <FaToggleOn className="toggle-on" />
                ) : (
                  <FaToggleOff className="toggle-off" />
                )}
              </button>
            </div>

            <div className="config-toggle-item">
              <div className="toggle-label">
                <span>Boletín Informativo</span>
                <p className="toggle-description">Recibe noticias y actualizaciones del gimnasio</p>
              </div>
              <button className="toggle-button" onClick={() => handleToggleConfig("boletinInformativo")}>
                {configuraciones.boletinInformativo ? (
                  <FaToggleOn className="toggle-on" />
                ) : (
                  <FaToggleOff className="toggle-off" />
                )}
              </button>
            </div>

            <div className="config-toggle-item">
              <div className="toggle-label">
                <span>Ofertas y Promociones</span>
                <p className="toggle-description">Recibe información sobre ofertas especiales y promociones</p>
              </div>
              <button className="toggle-button" onClick={() => handleToggleConfig("ofertas")}>
                {configuraciones.ofertas ? (
                  <FaToggleOn className="toggle-on" />
                ) : (
                  <FaToggleOff className="toggle-off" />
                )}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-guardar" onClick={handleGuardarConfiguraciones} disabled={guardando}>
              {guardando ? (
                "Guardando..."
              ) : (
                <>
                  <FaSave /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>

        <div className="config-section danger-zone">
          <h2>
            <FaExclamationTriangle /> Zona de Peligro
          </h2>
          <div className="eliminar-cuenta">
            <div className="eliminar-info">
              <h3>Eliminar Cuenta</h3>
              <p>
                Esta acción eliminará permanentemente tu cuenta y todos tus datos. Esta operación no se puede deshacer.
              </p>
            </div>
            <button className={`btn-eliminar ${confirmEliminar ? "confirmar" : ""}`} onClick={handleEliminarCuenta}>
              {confirmEliminar ? (
                <>
                  <FaExclamationTriangle /> Confirmar Eliminación
                </>
              ) : (
                <>
                  <FaTrash /> Eliminar Cuenta
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Configuracion

