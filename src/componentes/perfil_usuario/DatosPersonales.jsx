  "use client"

  import { useState, useEffect } from "react"
  import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaCalendarAlt,
    FaSave,
    FaExclamationTriangle,
    FaCheckCircle,
  } from "react-icons/fa"
  import "./DatosPersonales.css"

  // Obtener datos del usuario desde la cookie (JWT)
  const obtenerDatosUsuario = async () => {
    const res = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/validate-user", {
      credentials: "include",
    })
    if (!res.ok) return null
    return await res.json()
  }

  // Obtener perfil del usuario
  const obtenerPerfilUsuario = async (idusuario) => {
    const res = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/perfil-usuarios/usuario/${idusuario}`)
    if (!res.ok) return null
    return await res.json()
  }

  const DatosPersonales = () => {
    const [datosForm, setDatosForm] = useState({
      nombre: "",
      apellidos: "",
      telefono: "",
      fechaNacimiento: "",
      genero: "",
      emergenciaNombre: "",
      emergenciaTelefono: "",
    })

    const [errores, setErrores] = useState({})
    const [guardando, setGuardando] = useState(false)
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" })
    const [userData, setUserData] = useState(null)

    const getUserName = () => {
      if (!userData) return ""
      return `Bienvenido ${userData.username}`
    }

    const guardarDatos = async (datos, idusuario) => {
      const existePerfil = await obtenerPerfilUsuario(idusuario)

      const payload = {
        idusuario: userData.usuario,
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        telefono: datos.telefono,
        fecha_nacimiento: datos.fechaNacimiento,
        genero: datos.genero,
        nombre_contacto_emergencia: datos.emergenciaNombre,
        telefono_contacto_emergencia: datos.emergenciaTelefono,
      }

      const method = existePerfil ? "PATCH" : "POST"
      const url = existePerfil
        ? `https://backendbeat-serverbeat.586pa0.easypanel.host/perfil-usuarios/actualizarusuario/${idusuario}`
        : "https://backendbeat-serverbeat.586pa0.easypanel.host/perfil-usuarios/crear"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Error al guardar el perfil")
      return await res.json()
    }

    useEffect(() => {
      const cargarDatos = async () => {
        const user = await obtenerDatosUsuario()
        if (!user) return

        setUserData(user)
        const perfil = await obtenerPerfilUsuario(user.usuario)

        setDatosForm({
          nombre: perfil?.nombre || "",
          apellidos: perfil?.apellidos || "",
          email: user.correo || "",
          telefono: perfil?.telefono || "",
          fechaNacimiento: perfil?.fecha_nacimiento?.substring(0, 10) || "",
          genero: perfil?.genero || "",
          emergenciaNombre: perfil?.nombre_contacto_emergencia || "",
          emergenciaTelefono: perfil?.telefono_contacto_emergencia || "",
        })
      }

      cargarDatos()
    }, [])

    const handleChange = (e) => {
      const { name, value } = e.target
      setDatosForm((prev) => ({ ...prev, [name]: value }))
      if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }))
    }

    const validarFormulario = () => {
      const nuevosErrores = {}

      if (!datosForm.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio"
      if (!datosForm.apellidos.trim()) nuevosErrores.apellidos = "Los apellidos son obligatorios"

      if (!datosForm.email.trim()) {
        nuevosErrores.email = "El email es obligatorio"
      } else if (!/\S+@\S+\.\S+/.test(datosForm.email)) {
        nuevosErrores.email = "El email no es válido"
      }

      if (!datosForm.telefono.trim()) {
        nuevosErrores.telefono = "El teléfono es obligatorio"
      } else if (!/^\d{10}$/.test(datosForm.telefono.replace(/\D/g, ""))) {
        nuevosErrores.telefono = "El teléfono debe tener 10 dígitos"
      }

      if (!datosForm.fechaNacimiento) {
        nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria"
      }

      setErrores(nuevosErrores)
      return Object.keys(nuevosErrores).length === 0
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!validarFormulario()) return

      setGuardando(true)
      setMensaje({ texto: "", tipo: "" })

      try {
        const user = await obtenerDatosUsuario()
        if (!user) throw new Error("Sesión inválida")

        await guardarDatos(datosForm, user.sub)

        setMensaje({
          texto: "¡Datos personales actualizados correctamente!",
          tipo: "exito",
        })
      } catch (err) {
        setMensaje({ texto: "Error al guardar los datos", tipo: "error" })
      } finally {
        setGuardando(false)
        setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000)
      }
    }

    return (
      <div className="datos-personales-container">
        <div className="datos-header">
          <h1>Datos Personales</h1>
          <p>
            Mantén tu información personal actualizada para una mejor experiencia en Beatbox Gym. Estos datos son utilizados para contactarte y personalizar nuestros servicios.
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

        <div className="datos-content">
          <div className="datos-form-container">
            <h2>
              <FaUser /> Información de Contacto
            </h2>
            <form onSubmit={handleSubmit} className="datos-form">
              <div className="form-row-f">
                <div className="form-group">
                  <label htmlFor="nombre">
                    <FaUser /> Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={datosForm.nombre}
                    onChange={handleChange}
                    className={errores.nombre ? "error" : ""}
                  />
                  {errores.nombre && <div className="error-mensaje">{errores.nombre}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="apellidos">
                    <FaUser /> Apellidos
                  </label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={datosForm.apellidos}
                    onChange={handleChange}
                    className={errores.apellidos ? "error" : ""}
                  />
                  {errores.apellidos && <div className="error-mensaje">{errores.apellidos}</div>}
                </div>
              </div>

              <div className="form-row-f">
                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={datosForm.email}
                    onChange={handleChange}
                    className={errores.email ? "error" : ""}
                  />
                  {errores.email && <div className="error-mensaje">{errores.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">
                    <FaPhone /> Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={datosForm.telefono}
                    onChange={handleChange}
                    className={errores.telefono ? "error" : ""}
                  />
                  {errores.telefono && <div className="error-mensaje">{errores.telefono}</div>}
                </div>
              </div>

              <div className="form-row-f">
                <div className="form-group">
                  <label htmlFor="fechaNacimiento">
                    <FaCalendarAlt /> Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={datosForm.fechaNacimiento}
                    onChange={handleChange}
                    className={errores.fechaNacimiento ? "error" : ""}
                  />
                  {errores.fechaNacimiento && <div className="error-mensaje">{errores.fechaNacimiento}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="genero">
                    <FaUser /> Género
                  </label>
                  <select id="genero" name="genero" value={datosForm.genero} onChange={handleChange}>
                    <option value="">Selecciona una opción</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="No binario">No binario</option>
                    <option value="Prefiero no decir">Prefiero no decir</option>
                  </select>
                </div>
              </div>

              <h2>
                <FaIdCard /> Contacto de Emergencia
              </h2>

              <div className="form-row-f">
                <div className="form-group">
                  <label htmlFor="emergenciaNombre">
                    <FaUser /> Nombre de Contacto
                  </label>
                  <input
                    type="text"
                    id="emergenciaNombre"
                    name="emergenciaNombre"
                    value={datosForm.emergenciaNombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emergenciaTelefono">
                    <FaPhone /> Teléfono de Emergencia
                  </label>
                  <input
                    type="tel"
                    id="emergenciaTelefono"
                    name="emergenciaTelefono"
                    value={datosForm.emergenciaTelefono}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-guardar" disabled={guardando}>
                  {guardando ? "Guardando..." : (<><FaSave /> Guardar Cambios</>)}
                </button>
              </div>
            </form>
          </div>

          <div className="user-info-container">
            <div className="user-info-card">
              <div className="usuario-info-D">
                <FaUser className="usuario-icono-D" />
                <span className="usuario-D">{getUserName()}</span>
              </div>
              <div className="user-info-details">
                <div className="info-item"><FaEnvelope className="info-icon" /><span>{datosForm.email}</span></div>
                <div className="info-item"><FaPhone className="info-icon" /><span>{datosForm.telefono}</span></div>
                <div className="info-item"><FaCalendarAlt className="info-icon" /><span>{datosForm.fechaNacimiento}</span></div>
              </div>
            </div>

            <div className="datos-privacy-notice">
              <h3>Privacidad de Datos</h3>
              <p>Tus datos están protegidos por nuestra política de privacidad y se usan únicamente para mejorar tu experiencia en Beatbox Gym.</p>
              <p>Puedes solicitar su eliminación contactando a soporte.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default DatosPersonales
