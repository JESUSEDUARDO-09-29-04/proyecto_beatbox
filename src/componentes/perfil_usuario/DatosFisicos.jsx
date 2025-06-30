"use client"

import { useState, useEffect } from "react"
import { FaWeight, FaRulerVertical, FaCalendarAlt, FaSave, FaChartLine } from "react-icons/fa"
import "./DatosFisicos.css"

const DatosFisicos = ({ userData }) => {
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

  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" })
  const [historialMediciones, setHistorialMediciones] = useState([])

  // Cargar datos existentes
  useEffect(() => {
    if (userData) {
      // Simulación de carga de datos desde una API
      setTimeout(() => {
        const datosGuardados = {
          peso: "100",
          altura: "175",
          edad: "30",
          genero: "masculino",
          nivelActividad: "moderado",
          fechaRegistro: new Date().toISOString().split("T")[0],
        }

        // Cargar historial de mediciones previas si existe
        const historialSimulado = [
          {
            id: 1,
            fecha: "2023-01-12",
            peso: "100",
            imc: "32.7",
          },
        ]

        setDatosForm(datosGuardados)
        setHistorialMediciones(historialSimulado)
        calcularResultados(datosGuardados)
      }, 500)
    }
  }, [userData])

  // Calcular IMC cuando cambia peso o altura
  useEffect(() => {
    if (datosForm.peso && datosForm.altura) {
      calcularResultados(datosForm)
    }
  }, [datosForm])

  const calcularResultados = (datos) => {
    const peso = Number.parseFloat(datos.peso)
    const altura = Number.parseFloat(datos.altura) / 100 // convertir a metros
    const edad = Number.parseInt(datos.edad)
    const genero = datos.genero
    const nivelActividad = datos.nivelActividad

    if (isNaN(peso) || isNaN(altura) || altura === 0) return

    // Calcular IMC
    const imc = peso / (altura * altura)
    const imcRedondeado = Math.round(imc * 10) / 10

    // Determinar categoría de IMC
    let categoriaIMC = ""
    if (imc < 18.5) categoriaIMC = "Bajo peso"
    else if (imc < 25) categoriaIMC = "Normal"
    else if (imc < 30) categoriaIMC = "Sobrepeso"
    else if (imc < 35) categoriaIMC = "Obesidad I"
    else if (imc < 40) categoriaIMC = "Obesidad II"
    else categoriaIMC = "Obesidad III"

    // Calcular peso ideal (fórmula de Devine)
    let pesoIdeal
    if (genero === "masculino") {
      pesoIdeal = 50 + 2.3 * (altura * 100 * 0.393701 - 60)
    } else {
      pesoIdeal = 45.5 + 2.3 * (altura * 100 * 0.393701 - 60)
    }
    pesoIdeal = Math.round(pesoIdeal)

    // Calcular TMB (Tasa Metabólica Basal) usando la fórmula de Mifflin-St Jeor
    let tmb
    if (genero === "masculino") {
      tmb = 10 * peso + 6.25 * (altura * 100) - 5 * edad + 5
    } else {
      tmb = 10 * peso + 6.25 * (altura * 100) - 5 * edad - 161
    }
    tmb = Math.round(tmb)

    // Calcular calorías diarias según nivel de actividad
    let factorActividad
    switch (nivelActividad) {
      case "sedentario":
        factorActividad = 1.2
        break
      case "ligero":
        factorActividad = 1.375
        break
      case "moderado":
        factorActividad = 1.55
        break
      case "activo":
        factorActividad = 1.725
        break
      case "muy activo":
        factorActividad = 1.9
        break
      default:
        factorActividad = 1.55
    }
    const calorias = Math.round(tmb * factorActividad)

    // Guardar los resultados en el estado
    setResultados({
      imc: imcRedondeado,
      categoriaIMC,
      pesoIdeal,
      tmb,
      calorias,
    })

    // Guardar los datos en localStorage para que ProgresoFisico pueda acceder a ellos
    const datosParaProgresoFisico = {
      pesoInicial: peso,
      pesoObjetivo: pesoIdeal,
      altura: altura * 100,
      edad: edad,
      genero: genero,
      historialMediciones: historialMediciones,
    }

    localStorage.setItem("datosFisicos", JSON.stringify(datosParaProgresoFisico))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDatosForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje({ texto: "", tipo: "" })

    // Validar datos
    if (!datosForm.peso || !datosForm.altura || !datosForm.edad) {
      setMensaje({
        texto: "Por favor complete todos los campos requeridos",
        tipo: "error",
      })
      setGuardando(false)
      return
    }

    // Simular envío de datos a la API
    setTimeout(() => {
      // Crear nueva medición
      const nuevaMedicion = {
        id: Date.now(),
        fecha: datosForm.fechaRegistro,
        peso: datosForm.peso,
        imc: resultados.imc,
      }

      // Actualizar historial de mediciones
      const nuevoHistorial = [...historialMediciones, nuevaMedicion]
      setHistorialMediciones(nuevoHistorial)

      // Actualizar los datos para ProgresoFisico
      const datosParaProgresoFisico = {
        pesoInicial: Number.parseFloat(datosForm.peso),
        pesoObjetivo: resultados.pesoIdeal,
        altura: Number.parseFloat(datosForm.altura),
        edad: Number.parseInt(datosForm.edad),
        genero: datosForm.genero,
        historialMediciones: nuevoHistorial,
      }

      localStorage.setItem("datosFisicos", JSON.stringify(datosParaProgresoFisico))

      setGuardando(false)
      setMensaje({
        texto: "Datos guardados correctamente",
        tipo: "exito",
      })

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje({ texto: "", tipo: "" })
      }, 3000)
    }, 1000)
  }

  return (
    <div className="datos-fisicos-container">
      <div className="datos-header">
        <h1>Datos Físicos</h1>
        <p>Registra tus datos físicos para calcular tu IMC, peso ideal y requerimientos calóricos.</p>
      </div>

      {mensaje.texto && (
        <div className={`mensaje-alerta ${mensaje.tipo}`}>
          <p>{mensaje.texto}</p>
        </div>
      )}

      <div className="datos-content">
          <form onSubmit={handleSubmit} className="datos-form">
            <div className="form-row-f">
              <div className="form-group">
                <label htmlFor="peso">
                  <FaWeight /> Peso (kg)
                </label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  value={datosForm.peso}
                  onChange={handleChange}
                  step="0.1"
                  min="30"
                  max="300"
                  placeholder="Ej. 70.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="altura">
                  <FaRulerVertical /> Altura (cm)
                </label>
                <input
                  type="number"
                  id="altura"
                  name="altura"
                  value={datosForm.altura}
                  onChange={handleChange}
                  step="1"
                  min="100"
                  max="250"
                  placeholder="Ej. 175"
                />
              </div>
            </div>

            <div className="form-row-f">
              <div className="form-group">
                <label htmlFor="edad">
                  <FaCalendarAlt /> Edad
                </label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={datosForm.edad}
                  onChange={handleChange}
                  step="1"
                  min="15"
                  max="100"
                  placeholder="Ej. 30"
                />
              </div>

              <div className="form-group">
                <label htmlFor="genero">Género</label>
                <select id="genero" name="genero" value={datosForm.genero} onChange={handleChange}>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
            </div>

            <div className="form-row-f">
              <div className="form-group">
                <label htmlFor="nivelActividad">Nivel de Actividad</label>
                <select
                  id="nivelActividad"
                  name="nivelActividad"
                  value={datosForm.nivelActividad}
                  onChange={handleChange}
                >
                  <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
                  <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
                  <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
                  <option value="activo">Activo (ejercicio 6-7 días/semana)</option>
                  <option value="muy activo">Muy activo (ejercicio intenso diario)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fechaRegistro">
                  <FaCalendarAlt /> Fecha de Registro
                </label>
                <input
                  type="date"
                  id="fechaRegistro"
                  name="fechaRegistro"
                  value={datosForm.fechaRegistro}
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
                    <FaSave /> Guardar Datos
                  </>
                )}
              </button>
            </div>
          </form>

        <div className="resultados-container">
          <h2>
            <FaChartLine /> Resultados
          </h2>

          <div className="resultados-cards">
            <div className="resultado-card">
              <h3>IMC</h3>
              <div className="resultado-valor">{resultados.imc || "-"}</div>
              <div className="resultado-subtexto">{resultados.categoriaIMC}</div>
            </div>

            <div className="resultado-card">
              <h3>Peso Ideal</h3>
              <div className="resultado-valor">{resultados.pesoIdeal || "-"} kg</div>
            </div>

            <div className="resultado-card">
              <h3>Tasa Metabólica Basal</h3>
              <div className="resultado-valor">{resultados.tmb || "-"}</div>
              <div className="resultado-subtexto">calorías/día</div>
            </div>

            <div className="resultado-card highlight">
              <h3>Calorías Diarias</h3>
              <div className="resultado-valor">{resultados.calorias || "-"}</div>
              <div className="resultado-subtexto">para mantener tu peso actual</div>
            </div>
          </div>

          <div className="recomendaciones">
            <h3>Recomendaciones</h3>
            {resultados.imc && (
              <div className="recomendacion-texto">
                <p>
                  {resultados.imc < 18.5
                    ? "Tu IMC indica que estás por debajo del peso recomendado. Es importante aumentar tu ingesta calórica de manera saludable y considerar un programa de entrenamiento para ganar masa muscular."
                    : resultados.imc < 25
                      ? "¡Felicidades! Tu IMC está dentro del rango normal. Mantén tus hábitos saludables de alimentación y ejercicio regular."
                      : resultados.imc < 30
                        ? "Tu IMC indica sobrepeso. Recomendamos un déficit calórico moderado combinado con ejercicio regular para alcanzar un peso saludable."
                        : "Tu IMC indica obesidad. Te recomendamos consultar con un profesional de la salud para establecer un plan personalizado de pérdida de peso."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatosFisicos

