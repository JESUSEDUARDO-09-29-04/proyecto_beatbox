"use client"

import { useState, useEffect } from "react"
import { FaWeight, FaRulerVertical, FaCalendarAlt, FaSave, FaChartLine } from "react-icons/fa"
import "./DatosFisicos.css"

const API_URL = "https://backendbeat-serverbeat.586pa0.easypanel.host"

const DatosFisicos = () => {
  const [userData, setUserData] = useState(null)
  const [perfilUsuario, setPerfilUsuario] = useState(null)
  const [historialMediciones, setHistorialMediciones] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" })

  const [datosForm, setDatosForm] = useState({
    peso: "",
    altura: "",
    edad: "",
    genero: "masculino",
    nivelActividad: "moderado",
    fechaRegistro: new Date().toISOString().split("T")[0],
  })

  const [resultados, setResultados] = useState({
    imc: null,
    categoriaIMC: "",
    pesoIdeal: null,
    tmb: null,
    calorias: null,
  })

  // === Calcula edad automáticamente ===
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return ""
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--
    return edad
  }

  // === Obtiene usuario autenticado ===
  const obtenerUsuario = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/validate-user`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("No se pudo validar usuario")
      const data = await res.json()
      console.log("✅ Usuario validado:", data)
      console.log("👤 Estructura del usuario recibido:", JSON.stringify(data, null, 2))
      return data
    } catch (err) {
      console.error("Error al obtener usuario:", err)
      return null
    }
  }

  // === Obtiene perfil del usuario ===
  const obtenerPerfilUsuario = async (idusuario) => {
    try {
      const res = await fetch(`${API_URL}/perfil-usuarios/usuario/${idusuario}`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("No se pudo obtener el perfil del usuario")
      const data = await res.json()
      console.log("✅ Perfil obtenido:", data)
      return data
    } catch (err) {
      console.error("Error al obtener perfil:", err)
      return null
    }
  }

  // === Obtiene historial de pesos ===
  const obtenerHistorial = async (idPerfil) => {
    try {
      const res = await fetch(`${API_URL}/pesos/perfil/${idPerfil}`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("No se pudo obtener historial de pesos")
      const data = await res.json()
      setHistorialMediciones(data)
    } catch (err) {
      console.error("Error al obtener historial:", err)
    }
  }

  // === Guarda nueva medición en la BD ===
  const guardarMedicion = async (idPerfil, nuevaMedicion) => {
    try {
      const res = await fetch(`${API_URL}/pesos`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          perfilUsuario: { id: idPerfil },
          peso: Number.parseFloat(nuevaMedicion.peso),
          fecha: new Date().toISOString().split("T")[0],
          imc: nuevaMedicion.imc,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error al guardar medición")
      console.log("📤 Medición guardada:", data)
      return data
    } catch (err) {
      console.error("Error al guardar medición:", err)
      throw err
    }
  }

  // === Carga datos iniciales ===
  useEffect(() => {
    const cargarDatos = async () => {
      const user = await obtenerUsuario()
      if (!user) return
      setUserData(user)

      const perfil = await obtenerPerfilUsuario(user.usuario)
      if (perfil && perfil.id) {
        setPerfilUsuario(perfil)

        const edadCalculada = calcularEdad(perfil.fecha_nacimiento)
        setDatosForm((prev) => ({
          ...prev,
          edad: edadCalculada,
          genero: perfil.genero || "masculino",
          altura: perfil.altura || "",
          peso: perfil.peso_inicial || "",
        }))

        await obtenerHistorial(perfil.id)
      } else {
        console.warn("⚠️ No se encontró perfil del usuario")
      }
    }

    cargarDatos()
  }, [])

  // === Calcula resultados ===
  useEffect(() => {
    if (datosForm.peso && datosForm.altura) calcularResultados(datosForm)
  }, [datosForm])

  const calcularResultados = (datos) => {
    const peso = Number.parseFloat(datos.peso)
    const altura = Number.parseFloat(datos.altura) / 100
    const edad = Number.parseInt(datos.edad)
    const genero = datos.genero
    const nivelActividad = datos.nivelActividad
    if (isNaN(peso) || isNaN(altura) || altura === 0) return

    const imc = peso / (altura * altura)
    const imcRedondeado = Math.round(imc * 10) / 10

    let categoriaIMC = ""
    if (imc < 18.5) categoriaIMC = "Bajo peso"
    else if (imc < 25) categoriaIMC = "Normal"
    else if (imc < 30) categoriaIMC = "Sobrepeso"
    else if (imc < 35) categoriaIMC = "Obesidad I"
    else if (imc < 40) categoriaIMC = "Obesidad II"
    else categoriaIMC = "Obesidad III"

    let pesoIdeal =
      genero === "masculino" ? 50 + 2.3 * (altura * 100 * 0.393701 - 60) : 45.5 + 2.3 * (altura * 100 * 0.393701 - 60)
    pesoIdeal = Math.round(pesoIdeal)

    let tmb =
      genero === "masculino"
        ? 10 * peso + 6.25 * (altura * 100) - 5 * edad + 5
        : 10 * peso + 6.25 * (altura * 100) - 5 * edad - 161
    tmb = Math.round(tmb)

    const factores = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      activo: 1.725,
      "muy activo": 1.9,
    }
    const calorias = Math.round(tmb * (factores[nivelActividad] || 1.55))

    setResultados({
      imc: imcRedondeado,
      categoriaIMC,
      pesoIdeal,
      tmb,
      calorias,
    })
  }

  // === Envía nueva medición al backend ===
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userData || !perfilUsuario) {
      setMensaje({
        texto: "No se pudo obtener la información del usuario",
        tipo: "error",
      })
      return
    }

    setGuardando(true)
    setMensaje({ texto: "", tipo: "" })

    if (!datosForm.peso || !datosForm.altura) {
      setMensaje({
        texto: "Por favor completa peso y altura",
        tipo: "error",
      })
      setGuardando(false)
      return
    }

    try {
      const bodyData = {
        idusuario: userData.usuario, // El backend requiere este campo en el body
        peso_inicial: Number.parseFloat(datosForm.peso),
        altura: Number.parseFloat(datosForm.altura),
        imc: resultados.imc,
        peso_objetivo: resultados.pesoIdeal,
      }

      console.log("[v0] 📤 Datos a enviar:", bodyData)
      console.log("[v0] 🔗 URL:", `${API_URL}/perfil-usuarios/actualizarusuario/${userData.usuario}`)
      console.log("[v0] 👤 Usuario ID:", userData.usuario)

      const response = await fetch(`${API_URL}/perfil-usuarios/actualizarusuario/${userData.usuario}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      })

      console.log("[v0] 📥 Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[v0] ❌ Error response:", errorData)
        throw new Error(errorData.message || "Error al actualizar el perfil")
      }

      const data = await response.json()
      console.log("[v0] ✅ Perfil actualizado correctamente:", data)

      setPerfilUsuario(data)

      setMensaje({
        texto: "¡Datos físicos guardados correctamente! ✅",
        tipo: "exito",
      })

      if (data.id) {
        await obtenerHistorial(data.id)
      }
    } catch (error) {
      console.error("[v0] ❌ Error al guardar datos físicos:", error)
      setMensaje({
        texto: `Error al guardar: ${error.message}`,
        tipo: "error",
      })
    } finally {
      setGuardando(false)
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 5000)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDatosForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="datos-fisicos-container">
      <div className="datos-header">
        <h1>Datos Físicos</h1>
        <p>Registra tus datos físicos para calcular tu IMC, peso ideal y requerimientos calóricos.</p>
      </div>

      {mensaje.texto && <div className={`mensaje-alerta ${mensaje.tipo}`}>{mensaje.texto}</div>}

      <div className="datos-content">
        <form onSubmit={handleSubmit} className="datos-form">
          <div className="form-row-f">
            <div className="form-group">
              <label>
                <FaWeight /> Peso (kg)
              </label>
              <input
                type="number"
                name="peso"
                value={datosForm.peso}
                onChange={handleChange}
                step="0.1"
                min="30"
                max="300"
              />
            </div>

            <div className="form-group">
              <label>
                <FaRulerVertical /> Altura (cm)
              </label>
              <input
                type="number"
                name="altura"
                value={datosForm.altura}
                onChange={handleChange}
                step="1"
                min="100"
                max="250"
              />
            </div>
          </div>

          <div className="form-row-f">
            <div className="form-group">
              <label>
                <FaCalendarAlt /> Edad
              </label>
              <input type="number" name="edad" value={datosForm.edad} readOnly disabled />
            </div>

            <div className="form-group">
              <label>Género</label>
              <select name="genero" value={datosForm.genero} onChange={handleChange}>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </select>
            </div>
          </div>

          <div className="form-row-f">
            <div className="form-group">
              <label>Nivel de Actividad</label>
              <select name="nivelActividad" value={datosForm.nivelActividad} onChange={handleChange}>
                <option value="sedentario">Sedentario</option>
                <option value="ligero">Ligero</option>
                <option value="moderado">Moderado</option>
                <option value="activo">Activo</option>
                <option value="muy activo">Muy activo</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaCalendarAlt /> Fecha de Registro
              </label>
              <input type="date" name="fechaRegistro" value={datosForm.fechaRegistro} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn-guardar" disabled={guardando}>
            {guardando ? (
              "Guardando..."
            ) : (
              <>
                <FaSave /> Guardar Datos
              </>
            )}
          </button>
        </form>

        <div className="resultados-container">
          <h2>
            <FaChartLine /> Resultados
          </h2>
          <div className="resultados-cards">
            <div className="resultado-card">
              <h3>IMC</h3>
              <div>{resultados.imc || "-"}</div>
              <div>{resultados.categoriaIMC}</div>
            </div>
            <div className="resultado-card">
              <h3>Peso Ideal</h3>
              <div>{resultados.pesoIdeal || "-"} kg</div>
            </div>
            <div className="resultado-card">
              <h3>TMB</h3>
              <div>{resultados.tmb || "-"}</div>
              <div>cal/día</div>
            </div>
            <div className="resultado-card highlight">
              <h3>Calorías Diarias</h3>
              <div>{resultados.calorias || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatosFisicos
