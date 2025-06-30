"use client"

import { useState, useEffect } from "react"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSave,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa"
import "./DatosPersonales.css"

const DatosPersonales = ({ userData }) => {
  const [datosForm, setDatosForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    fechaNacimiento: "",
    genero: "",
    emergenciaNombre: "",
    emergenciaTelefono: "",
  })

  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" })

  // Cargar datos del usuario
  useEffect(() => {
    if (userData) {
      setDatosForm({
        nombre: userData.nombre || "",
        apellidos: userData.apellidos || "",
        email: userData.email || "",
        telefono: userData.telefono || "",
        direccion: userData.direccion || "",
        ciudad: userData.ciudad || "",
        codigoPostal: userData.codigoPostal || "",
        fechaNacimiento: userData.fechaNacimiento || "",
        genero: userData.genero || "",
        emergenciaNombre: userData.emergenciaNombre || "",
        emergenciaTelefono: userData.emergenciaTelefono || "",
      })
    }
  }, [userData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDatosForm((prev) => ({ ...prev, [name]: value }))

    // Limpiar error del campo
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    // Validar nombre
    if (!datosForm.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio"
    }

    // Validar apellidos
    if (!datosForm.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios"
    }

    // Validar email
    if (!datosForm.email.trim()) {
      nuevosErrores.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(datosForm.email)) {
      nuevosErrores.email = "El email no es válido"
    }

    // Validar teléfono
    if (!datosForm.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio"
    } else if (!/^\d{10}$/.test(datosForm.telefono.replace(/\D/g, ""))) {
      nuevosErrores.telefono = "El teléfono debe tener 10 dígitos"
    }

    // Validar fecha de nacimiento
    if (!datosForm.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validarFormulario()) {
      setGuardando(true)
      setMensaje({ texto: "", tipo: "" })

      // Simular envío de datos a la API
      setTimeout(() => {
        setGuardando(false)
        setMensaje({
          texto: "¡Datos personales actualizados correctamente!",
          tipo: "exito",
        })

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje({ texto: "", tipo: "" })
        }, 3000)
      }, 1000)
    }
  }

  return (
    <div className="datos-personales-container">
      <div className="datos-header">
        <h1>Datos Personales</h1>
        <p>
          Mantén tu información personal actualizada para una mejor experiencia en Beatbox Gym. Estos datos son
          utilizados para contactarte y personalizar nuestros servicios.
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
              <FaMapMarkerAlt /> Dirección
            </h2>

            <div className="form-row-f">
              <div className="form-group full-width">
                <label htmlFor="direccion">
                  <FaMapMarkerAlt /> Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={datosForm.direccion}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row-f">
              <div className="form-group">
                <label htmlFor="ciudad">
                  <FaMapMarkerAlt /> Ciudad
                </label>
                <input type="text" id="ciudad" name="ciudad" value={datosForm.ciudad} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="codigoPostal">
                  <FaMapMarkerAlt /> Código Postal
                </label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  value={datosForm.codigoPostal}
                  onChange={handleChange}
                />
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
                {guardando ? (
                  "Guardando..."
                ) : (
                  <>
                    <FaSave /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="user-info-container">
          <div className="user-info-card">
            <div className="user-avatar-large">
              {datosForm.nombre?.charAt(0) || "U"}
              {datosForm.apellidos?.charAt(0) || ""}
            </div>
            <h3>
              {datosForm.nombre} {datosForm.apellidos}
            </h3>
            <p className="user-id">ID: {userData?.id || "USR12345"}</p>

            <div className="user-info-details">
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <span>{datosForm.email}</span>
              </div>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <span>{datosForm.telefono}</span>
              </div>
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <span>{datosForm.fechaNacimiento}</span>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <span>
                  {datosForm.direccion ? `${datosForm.direccion}, ${datosForm.ciudad}` : "Dirección no registrada"}
                </span>
              </div>
            </div>
          </div>

          <div className="datos-privacy-notice">
            <h3>Privacidad de Datos</h3>
            <p>
              Tus datos personales están protegidos por nuestra política de privacidad. Solo utilizamos esta información
              para mejorar tu experiencia en el gimnasio y para contactarte en caso de emergencia.
            </p>
            <p>
              Puedes solicitar la eliminación de tus datos en cualquier momento contactando a nuestro equipo de soporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatosPersonales

