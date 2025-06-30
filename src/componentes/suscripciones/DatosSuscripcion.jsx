"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import DOMPurify from "dompurify"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import "./Suscripcion.css"
import {
  FaArrowLeft,
  FaArrowRight,
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaExclamationCircle,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa"

const DatosSuscripcion = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useContext(ThemeContext)
  const [planId, setPlanId] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    emergenciaNombre: "",
    emergenciaTelefono: "",
    condicionesMedicas: "",
    aceptaTerminos: false,
    // Campos para menores de edad
    esMenorDeEdad: false,
    consentimientoParental: false,
    tutorNombre: "",
    tutorTelefono: "",
    parentesco: "",
  })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  // Verificar si el usuario está autenticado
 

  // Efecto para detectar si el usuario es menor de edad cuando cambia la fecha de nacimiento
  useEffect(() => {
    if (formData.fechaNacimiento) {
      const hoy = new Date()
      const fechaNac = new Date(formData.fechaNacimiento)
      let edad = hoy.getFullYear() - fechaNac.getFullYear()

      // Ajustar la edad considerando el mes y día
      if (
        hoy.getMonth() < fechaNac.getMonth() ||
        (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())
      ) {
        edad--
      }

      const esMenor = edad < 18 && edad >= 15

      setFormData((prev) => ({
        ...prev,
        esMenorDeEdad: esMenor,
      }))
    }
  }, [formData.fechaNacimiento])

  // Verificar si hay un plan seleccionado en la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const plan = params.get("plan")
    if (!plan) {
      navigate("/suscripcion")
    } else {
      setPlanId(plan)
    }
  }, [location.search, navigate])

  // Función para sanitizar entradas
  const sanitizarEntrada = (input) => {
    if (!input) return ""
    return DOMPurify.sanitize(input)
  }

  // Función para manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Limpiar error del campo cuando el usuario escribe
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: "",
      })
    }
  }

  // Función para validar el formulario
  const validarFormulario = () => {
    const nuevosErrores = {}

    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio"
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre)) {
      nuevosErrores.nombre = "El nombre solo debe contener letras"
    }

    // Validar apellidos
    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios"
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellidos)) {
      nuevosErrores.apellidos = "Los apellidos solo deben contener letras"
    }

    // Validar email
    if (!formData.email.trim()) {
      nuevosErrores.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = "El email no es válido"
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio"
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener 10 dígitos"
    }

    // Validar fecha de nacimiento
    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria"
    } else {
      const hoy = new Date()
      const fechaNac = new Date(formData.fechaNacimiento)
      let edad = hoy.getFullYear() - fechaNac.getFullYear()

      // Ajustar la edad considerando el mes y día
      if (
        hoy.getMonth() < fechaNac.getMonth() ||
        (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())
      ) {
        edad--
      }

      if (edad < 15) {
        nuevosErrores.fechaNacimiento = "Debes tener al menos 15 años para suscribirte"
      } else if (edad > 100) {
        nuevosErrores.fechaNacimiento = "Fecha de nacimiento no válida"
      }

      // Si es menor de edad, validar consentimiento parental
      if (edad < 18 && !formData.consentimientoParental) {
        nuevosErrores.consentimientoParental = "Se requiere el consentimiento parental para menores de edad"
      }

      // Si es menor de edad, validar datos del tutor
      if (edad < 18) {
        if (!formData.tutorNombre.trim()) {
          nuevosErrores.tutorNombre = "El nombre del tutor es obligatorio"
        }

        if (!formData.tutorTelefono.trim()) {
          nuevosErrores.tutorTelefono = "El teléfono del tutor es obligatorio"
        } else if (!/^\d{10}$/.test(formData.tutorTelefono)) {
          nuevosErrores.tutorTelefono = "El teléfono debe tener 10 dígitos"
        }

        if (!formData.parentesco.trim()) {
          nuevosErrores.parentesco = "El parentesco es obligatorio"
        }
      }
    }

    // Validar contacto de emergencia
    if (!formData.emergenciaNombre.trim()) {
      nuevosErrores.emergenciaNombre = "El nombre de contacto de emergencia es obligatorio"
    }

    if (!formData.emergenciaTelefono.trim()) {
      nuevosErrores.emergenciaTelefono = "El teléfono de emergencia es obligatorio"
    } else if (!/^\d{10}$/.test(formData.emergenciaTelefono)) {
      nuevosErrores.emergenciaTelefono = "El teléfono debe tener 10 dígitos"
    }

    // Validar términos y condiciones
    if (!formData.aceptaTerminos) {
      nuevosErrores.aceptaTerminos = "Debes aceptar los términos y condiciones"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    if (validarFormulario()) {
      setEnviando(true)

      // Sanitizar todos los datos antes de enviar
      const datosSanitizados = {
        nombre: sanitizarEntrada(formData.nombre),
        apellidos: sanitizarEntrada(formData.apellidos),
        email: sanitizarEntrada(formData.email),
        telefono: sanitizarEntrada(formData.telefono),
        fechaNacimiento: formData.fechaNacimiento,
        emergenciaNombre: sanitizarEntrada(formData.emergenciaNombre),
        emergenciaTelefono: sanitizarEntrada(formData.emergenciaTelefono),
        condicionesMedicas: sanitizarEntrada(formData.condicionesMedicas),
        aceptaTerminos: formData.aceptaTerminos,
        esMenorDeEdad: formData.esMenorDeEdad,
      }

      // Añadir datos del tutor si es menor de edad
      if (formData.esMenorDeEdad) {
        datosSanitizados.tutorNombre = sanitizarEntrada(formData.tutorNombre)
        datosSanitizados.tutorTelefono = sanitizarEntrada(formData.tutorTelefono)
        datosSanitizados.parentesco = sanitizarEntrada(formData.parentesco)
        datosSanitizados.consentimientoParental = formData.consentimientoParental
      }

      // Simular envío al backend
      setTimeout(() => {
        setEnviando(false)
        // Guardar datos en sessionStorage para el siguiente paso
        sessionStorage.setItem("datosSuscripcion", JSON.stringify(datosSanitizados))
        navigate(`/suscripcion/pago?plan=${planId}`)
      }, 1000)
    }
  }

  // Función para volver al paso anterior
  const volverPasoAnterior = () => {
    navigate(`/suscripcion?plan=${planId}`)
  }

  // Función para redirigir a inicio de sesión
  const irAInicioSesion = () => {
    navigate("/iniciar-sesion", { state: { returnUrl: "/suscripcion" } })
  }

  // Función para redirigir a registro
  const irARegistro = () => {
    navigate("/registro", { state: { returnUrl: "/suscripcion" } })
  }

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className={`contenedor ${theme === "dark" ? "dark" : ""}`}>
        <HeaderH />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
        <FooterH />
      </div>
    )
  }

  return (
    <div className={`contenedor ${theme === "dark" ? "dark" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>
      <main className="suscripcion-contenedor">
        {!isAuthenticated ? (
          <div className="auth-required-container">
            <div className="auth-required-card">
              <FaExclamationCircle className="auth-icon" />
              <h2>Inicia sesión para continuar</h2>
              <p>
                Para poder suscribirte a nuestros planes, es necesario que inicies sesión o te registres primero. Esto
                nos permite ofrecerte una experiencia personalizada y gestionar tu membresía de manera eficiente.
              </p>
              <div className="auth-buttons">
                <button className="btn-auth btn-login" onClick={irAInicioSesion}>
                  <FaSignInAlt /> Iniciar Sesión
                </button>
                <button className="btn-auth btn-register" onClick={irARegistro}>
                  <FaUserPlus /> Registrarse
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="suscripcion-header">
              <h1>Datos Personales</h1>
              <p>Completa tus datos para continuar con el proceso de suscripción.</p>
            </div>

            <div className="suscripcion-pasos">
              <div className="paso completado">
                <div className="paso-numero">1</div>
                <div className="paso-texto">Elegir plan</div>
              </div>
              <div className="paso-linea completado"></div>
              <div className="paso activo">
                <div className="paso-numero">2</div>
                <div className="paso-texto">Datos personales</div>
              </div>
              <div className="paso-linea"></div>
              <div className="paso">
                <div className="paso-numero">3</div>
                <div className="paso-texto">Pago</div>
              </div>
              <div className="paso-linea"></div>
              <div className="paso">
                <div className="paso-numero">4</div>
                <div className="paso-texto">Confirmación</div>
              </div>
            </div>

            <div className="datos-container">
              <form onSubmit={handleSubmit} className="datos-form">
                {/* Primero la Información Personal */}
                <div className="seccion-formulario">
                  <h3>Información Personal</h3>
                  <div className="campos-grid tres-columnas">
                    <div className="campo-formulario-sus">
                      <label htmlFor="nombre">
                        <FaUser className="campo-icono" /> Nombre
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={errores.nombre ? "error" : ""}
                        placeholder="Ingresa tu nombre"
                      />
                      {errores.nombre && (
                        <div className="mensaje-error">
                          <FaExclamationTriangle /> {errores.nombre}
                        </div>
                      )}
                    </div>

                    <div className="campo-formulario-sus">
                      <label htmlFor="apellidos">
                        <FaUser className="campo-icono" /> Apellidos
                      </label>
                      <input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        className={errores.apellidos ? "error" : ""}
                        placeholder="Ingresa tus apellidos"
                      />
                      {errores.apellidos && (
                        <div className="mensaje-error">
                          <FaExclamationTriangle /> {errores.apellidos}
                        </div>
                      )}
                    </div>

                    <div className="campo-formulario-sus">
                      <label htmlFor="fechaNacimiento">
                        <FaCalendarAlt className="campo-icono" /> Fecha de Nacimiento
                      </label>
                      <input
                        type="text"
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        className={errores.fechaNacimiento ? "error" : ""}
                        placeholder="dd/mm/aaaa"
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                      />
                      {errores.fechaNacimiento && (
                        <div className="mensaje-error">
                          <FaExclamationTriangle /> {errores.fechaNacimiento}
                        </div>
                      )}
                    </div>

                    <div className="campo-formulario-sus">
                      <label htmlFor="email">
                        <FaEnvelope className="campo-icono" /> Correo Electrónico
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errores.email ? "error" : ""}
                        placeholder="ejemplo@correo.com"
                      />
                      {errores.email && (
                        <div className="mensaje-error">
                          <FaExclamationTriangle /> {errores.email}
                        </div>
                      )}
                    </div>

                    <div className="campo-formulario-sus">
                      <label htmlFor="telefono">
                        <FaPhone className="campo-icono" /> Teléfono
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={errores.telefono ? "error" : ""}
                        placeholder="10 dígitos"
                      />
                      {errores.telefono && (
                        <div className="mensaje-error">
                          <FaExclamationTriangle /> {errores.telefono}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Luego la Información de Emergencia */}
                <div className="seccion-formulario">
                  <h3>Información de Emergencia</h3>
                  <div className="campos-grid dos-columnas">
                    <div className="campo-formulario-sus">
                      <label htmlFor="emergenciaNombre">
                        <FaUser className="campo-icono" /> Nombre de Contacto
                      </label>
                      <input
                        type="text"
                        id="emergenciaNombre"
                        name="emergenciaNombre"
                        value={formData.emergenciaNombre}
                        onChange={handleChange}
                        className={errores.emergenciaNombre ? "error" : ""}
                        placeholder="Nombre de contacto de emergencia"
                      />
                      {errores.emergenciaNombre && (
                        <div className="mensaje-error">
                          <FaExclamationTriangle /> {errores.emergenciaNombre}
                        </div>
                      )}
                    </div>

                    <div className="campo-formulario-sus">
                      <label htmlFor="emergenciaTelefono">
                        <FaPhone className="campo-icono" /> Teléfono de Contacto
                      </label>
                      <input
                        type="tel"
                        id="emergenciaTelefono"
                        name="emergenciaTelefono"
                        value={formData.emergenciaTelefono}
                        onChange={handleChange}
                        className={errores.emergenciaTelefono ? "error" : ""}
                        placeholder="10 dígitos"
                      />
                      {errores.emergenciaTelefono && (
                        <div className="mensaje-error">
                          <FaExclamationTriangle /> {errores.emergenciaTelefono}
                        </div>
                      )}
                    </div>

                    <div className="campo-formulario-sus">
                      <label htmlFor="condicionesMedicas">Condiciones Médicas (opcional)</label>
                      <input
                        type="text"
                        id="condicionesMedicas"
                        name="condicionesMedicas"
                        value={formData.condicionesMedicas}
                        onChange={handleChange}
                        placeholder="Menciona cualquier condición médica relevante"
                      />
                    </div>
                  </div>
                </div>

                {/* Información del tutor (si es menor de edad) */}
                {formData.fechaNacimiento &&
                  new Date().getFullYear() - new Date(formData.fechaNacimiento).getFullYear() < 18 && (
                    <div className="seccion-formulario">
                      <h3>Información del Tutor</h3>
                      <div className="campos-grid tres-columnas">
                        <div className="campo-formulario-sus">
                          <label htmlFor="tutorNombre">
                            <FaUser className="campo-icono" /> Nombre del Tutor
                          </label>
                          <input
                            type="text"
                            id="tutorNombre"
                            name="tutorNombre"
                            value={formData.tutorNombre}
                            onChange={handleChange}
                            className={errores.tutorNombre ? "error" : ""}
                            placeholder="Nombre del tutor"
                          />
                          {errores.tutorNombre && (
                            <div className="mensaje-error">
                              <FaExclamationTriangle /> {errores.tutorNombre}
                            </div>
                          )}
                        </div>

                        <div className="campo-formulario-sus">
                          <label htmlFor="tutorTelefono">
                            <FaPhone className="campo-icono" /> Teléfono del Tutor
                          </label>
                          <input
                            type="tel"
                            id="tutorTelefono"
                            name="tutorTelefono"
                            value={formData.tutorTelefono}
                            onChange={handleChange}
                            className={errores.tutorTelefono ? "error" : ""}
                            placeholder="Teléfono del tutor (10 dígitos)"
                          />
                          {errores.tutorTelefono && (
                            <div className="mensaje-error">
                              <FaExclamationTriangle /> {errores.tutorTelefono}
                            </div>
                          )}
                        </div>

                        <div className="campo-formulario-sus">
                          <label htmlFor="parentesco">Parentesco</label>
                          <input
                            type="text"
                            id="parentesco"
                            name="parentesco"
                            value={formData.parentesco}
                            onChange={handleChange}
                            className={errores.parentesco ? "error" : ""}
                            placeholder="Parentesco con el menor"
                          />
                          {errores.parentesco && (
                            <div className="mensaje-error">
                              <FaExclamationTriangle /> {errores.parentesco}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Sección de Consentimiento Parental (solo visible si es menor de edad) */}
                {formData.esMenorDeEdad && (
                  <div className="seccion-formulario consentimiento-parental">
                    <h3>Consentimiento Parental</h3>
                    <div className="alerta-menor">
                      <FaExclamationTriangle className="alerta-icono" />
                      <p>
                        Hemos detectado que eres menor de edad. Para continuar con la suscripción, necesitamos el
                        consentimiento y los datos de contacto de tu padre, madre o tutor legal.
                      </p>
                    </div>

                    <div className="campos-grid dos-columnas">
                      <div className="campo-formulario-sus">
                        <label htmlFor="tutorNombre">
                          <FaUser className="campo-icono" /> Nombre del Padre/Madre/Tutor
                        </label>
                        <input
                          type="text"
                          id="tutorNombre"
                          name="tutorNombre"
                          value={formData.tutorNombre}
                          onChange={handleChange}
                          className={errores.tutorNombre ? "error" : ""}
                          placeholder="Nombre completo del tutor"
                        />
                        {errores.tutorNombre && (
                          <div className="mensaje-error">
                            <FaExclamationTriangle /> {errores.tutorNombre}
                          </div>
                        )}
                      </div>

                      <div className="campo-formulario-sus">
                        <label htmlFor="tutorTelefono">
                          <FaPhone className="campo-icono" /> Teléfono del Tutor
                        </label>
                        <input
                          type="tel"
                          id="tutorTelefono"
                          name="tutorTelefono"
                          value={formData.tutorTelefono}
                          onChange={handleChange}
                          className={errores.tutorTelefono ? "error" : ""}
                          placeholder="10 dígitos"
                        />
                        {errores.tutorTelefono && (
                          <div className="mensaje-error">
                            <FaExclamationTriangle /> {errores.tutorTelefono}
                          </div>
                        )}
                      </div>

                      <div className="campo-formulario-sus">
                        <label htmlFor="parentesco">
                          <FaUser className="campo-icono" /> Parentesco
                        </label>
                        <select
                          id="parentesco"
                          name="parentesco"
                          value={formData.parentesco}
                          onChange={handleChange}
                          className={errores.parentesco ? "error" : ""}
                        >
                          <option value="">Selecciona una opción</option>
                          <option value="Padre">Padre</option>
                          <option value="Madre">Madre</option>
                          <option value="Tutor Legal">Tutor Legal</option>
                          <option value="Otro">Otro</option>
                        </select>
                        {errores.parentesco && (
                          <div className="mensaje-error">
                            <FaExclamationTriangle /> {errores.parentesco}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="consentimiento-checkbox">
                      <input
                        type="checkbox"
                        id="consentimientoParental"
                        name="consentimientoParental"
                        checked={formData.consentimientoParental}
                        onChange={handleChange}
                      />
                      <label htmlFor="consentimientoParental">
                        Como padre/madre/tutor legal, doy mi consentimiento para que el menor se suscriba a los
                        servicios del gimnasio y acepto la responsabilidad de supervisar su actividad.
                      </label>
                    </div>
                    {errores.consentimientoParental && (
                      <div className="mensaje-error">
                        <FaExclamationTriangle /> {errores.consentimientoParental}
                      </div>
                    )}
                  </div>
                )}

                <div className="terminos-seccion">
                  <div className="terminos-checkbox">
                    <input
                      type="checkbox"
                      id="aceptaTerminos"
                      name="aceptaTerminos"
                      checked={formData.aceptaTerminos}
                      onChange={handleChange}
                    />
                    <label htmlFor="aceptaTerminos">
                      Acepto los{" "}
                      <a href="/aviso_privacidad" target="_blank" rel="noopener noreferrer">
                        términos y condiciones
                      </a>{" "}
                      y la{" "}
                      <a href="/aviso_privacidad" target="_blank" rel="noopener noreferrer">
                        política de privacidad
                      </a>
                    </label>
                  </div>
                  {errores.aceptaTerminos && (
                    <div className="mensaje-error">
                      <FaExclamationTriangle /> {errores.aceptaTerminos}
                    </div>
                  )}
                </div>

                <div className="suscripcion-acciones">
                  <button type="button" className="btn btn-volver" onClick={volverPasoAnterior} disabled={enviando}>
                    <FaArrowLeft /> Volver
                  </button>
                  <button type="submit" className="btn btn-continuar" disabled={enviando}>
                    {enviando ? "Procesando..." : "Continuar"} {!enviando && <FaArrowRight />}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </main>

      <FooterH />
    </div>
  )
}

export default DatosSuscripcion

