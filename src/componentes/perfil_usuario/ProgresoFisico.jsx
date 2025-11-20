"use client"

import { useState, useEffect, useRef } from "react"
import {
  FaWeight,
  FaRulerVertical,
  FaCalendarAlt,
  FaChartLine,
  FaSave,
  FaCalculator,
  FaWater,
  FaRunning,
} from "react-icons/fa"
import { Line } from "react-chartjs-2"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import "./ProgresoFisico.css"

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const API_URL = "https://backendbeat-serverbeat.586pa0.easypanel.host"

const ProgresoFisico = () => {
  const [userData, setUserData] = useState(null)
  const [perfilUsuario, setPerfilUsuario] = useState(null)

  // Referencias para los gráficos
  const imcGaugeRef = useRef(null)
  const modeloMatRef = useRef(null)

  // Estado para el formulario
  const [datosForm, setDatosForm] = useState({
    peso: "",
    pesoInicial: "",
    pesoObjetivo: "",
    altura: "",
    edad: "",
    genero: "masculino",
    nivelActividad: "moderado",
    fechaRegistro: new Date().toISOString().split("T")[0],
  })

  // Estados para los resultados calculados
  const [resultados, setResultados] = useState({
    imc: null,
    categoriaIMC: "",
    pesoIdeal: null,
    tiempoEstimado: null,
    constanteK: null,
    composicionCorporal: {
      grasa: null,
      musculo: null,
      agua: null,
    },
  })

  // Estado para el historial de mediciones
  const [historialMediciones, setHistorialMediciones] = useState([])

  // Estado para la proyección de pérdida de peso
  const [proyeccion, setProyeccion] = useState([])

  // Estado para mensajes
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" })

  // Estado para indicar si estamos guardando
  const [guardando, setGuardando] = useState(false)

  const [cargando, setCargando] = useState(true)

  // Estado para controlar si se muestra la proyección
  const [mostrarProyeccion, setMostrarProyeccion] = useState(false)

  // Estado para mostrar la explicación del modelo matemático
  const [mostrarModelo, setMostrarModelo] = useState(false)

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
      return data
    } catch (err) {
      console.error("❌ Error al obtener usuario:", err)
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
      console.error("❌ Error al obtener perfil:", err)
      return null
    }
  }

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)

        // Obtener usuario autenticado
        const user = await obtenerUsuario()
        if (!user) {
          setMensaje({
            texto: "No se pudo obtener la información del usuario",
            tipo: "error",
          })
          setCargando(false)
          return
        }
        setUserData(user)

        // Obtener perfil del usuario
        const perfil = await obtenerPerfilUsuario(user.usuario)
        if (!perfil || !perfil.id) {
          console.warn("⚠️ No se encontró perfil del usuario")
          setMensaje({
            texto: "No se encontró el perfil del usuario",
            tipo: "error",
          })
          setCargando(false)
          return
        }
        setPerfilUsuario(perfil)

        console.log("✅ Datos del perfil:", perfil)

        const edadCalculada = calcularEdad(perfil.fecha_nacimiento)

        // Actualizar el formulario con los datos del perfil
        setDatosForm((prev) => ({
          ...prev,
          pesoInicial: perfil.peso_inicial?.toString() || "",
          pesoObjetivo: perfil.peso_objetivo?.toString() || "",
          altura: perfil.altura?.toString() || "",
          edad: edadCalculada.toString(), // Usar edad calculada
          genero: perfil.genero || "masculino",
        }))

        // Obtener historial de pesos
        const pesosResponse = await fetch(`${API_URL}/pesos/perfil/${perfil.id}`, {
          credentials: "include",
        })
        if (!pesosResponse.ok) throw new Error("Error al cargar el historial")
        const pesosData = await pesosResponse.json()

        console.log("✅ Historial de pesos cargado:", pesosData)

        // Ordenar por fecha descendente y mapear los datos
        const historialOrdenado = pesosData
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .map((peso, index) => ({
            id: peso.idpeso,
            fecha: new Date(peso.fecha).toISOString().split("T")[0],
            peso: peso.peso.toString(),
            imc: peso.imc.toString(),
            grasaCorporal: calcularGrasaCorporal(peso.peso, perfil.altura / 100, perfil.edad, perfil.genero).toString(),
            musculo: calcularMusculo(
              calcularGrasaCorporal(peso.peso, perfil.altura / 100, perfil.edad, perfil.genero),
              perfil.genero,
            ).toString(),
            agua: calcularAgua(
              calcularGrasaCorporal(peso.peso, perfil.altura / 100, perfil.edad, perfil.genero),
              perfil.genero,
            ).toString(),
            mes: pesosData.length - index,
          }))

        setHistorialMediciones(historialOrdenado)

        // Si hay mediciones, calcular resultados con la más reciente
        if (historialOrdenado.length > 0) {
          const pesoActual = Number.parseFloat(historialOrdenado[0].peso)
          calcularResultados({
            ...datosForm,
            peso: pesoActual.toString(),
            pesoInicial: perfil.peso_inicial?.toString() || "",
            pesoObjetivo: perfil.peso_objetivo?.toString() || "",
            altura: perfil.altura?.toString() || "",
            edad: perfil.edad?.toString() || "",
            genero: perfil.genero || "masculino",
          })
          setMostrarProyeccion(true)
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error)
        setMensaje({
          texto: "Error al cargar los datos del perfil",
          tipo: "error",
        })
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  // Calcular IMC cuando cambia peso o altura
  useEffect(() => {
    if (datosForm.peso && datosForm.altura) {
      calcularResultados(datosForm)
    }
  }, [datosForm])

  // Dibujar el medidor de IMC
  useEffect(() => {
    if (resultados.imc !== null && imcGaugeRef.current) {
      dibujarMedidorIMC(resultados.imc)
    }
  }, [resultados.imc])

  // Dibujar el modelo matemático
  useEffect(() => {
    if (mostrarModelo && modeloMatRef.current && historialMediciones.length >= 1) {
      dibujarModeloMatematico()
    }
  }, [mostrarModelo, historialMediciones, resultados.constanteK])

  // Función para calcular grasa corporal
  const calcularGrasaCorporal = (peso, altura, edad, genero) => {
    // Calcular IMC
    const imc = peso / (altura * altura)

    // Fórmula de Deurenberg para % de grasa corporal
    let grasaCorporal
    if (genero === "masculino") {
      grasaCorporal = 1.2 * imc + 0.23 * edad - 10.8 * 1 - 5.4
    } else {
      grasaCorporal = 1.2 * imc + 0.23 * edad - 10.8 * 0 - 5.4
    }
    return Math.round(grasaCorporal * 10) / 10
  }

  // Función para calcular músculo
  const calcularMusculo = (grasaCorporal, genero) => {
    // Estimaciones aproximadas para músculo
    const musculo = genero === "masculino" ? 40 - grasaCorporal * 0.4 : 35 - grasaCorporal * 0.4
    return Math.round(musculo * 10) / 10
  }

  // Función para calcular agua
  const calcularAgua = (grasaCorporal, genero) => {
    // Estimaciones aproximadas para agua
    const agua = genero === "masculino" ? 60 - grasaCorporal * 0.3 : 55 - grasaCorporal * 0.3
    return Math.round(agua * 10) / 10
  }

  // Función para calcular todos los resultados
  const calcularResultados = (datos) => {
    const peso = Number.parseFloat(datos.peso)
    const altura = Number.parseFloat(datos.altura) / 100 // convertir a metros
    const pesoObjetivo = Number.parseFloat(datos.pesoObjetivo)
    const pesoInicial = Number.parseFloat(datos.pesoInicial)
    const edad = Number.parseInt(datos.edad)
    const genero = datos.genero

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

    // Calcular composición corporal
    const grasaCorporal = calcularGrasaCorporal(peso, altura, edad, genero)
    const musculo = calcularMusculo(grasaCorporal, genero)
    const agua = calcularAgua(grasaCorporal, genero)

    // Calcular constante K y tiempo estimado solo si tenemos peso objetivo y peso inicial
    let constanteK = null
    let tiempoEstimado = null

    if (!isNaN(pesoObjetivo) && !isNaN(pesoInicial) && !isNaN(peso)) {
      // Calcular constante K usando la fórmula de decrecimiento exponencial
      // P(t) = P₀ * e^(Kt)
      // Para t=1 (1 mes después): P(1) = P₀ * e^K
      // K = ln(P(1)/P₀)
      constanteK = Math.log(peso / pesoInicial)

      // Verificar que K no sea cero o muy cercano a cero
      if (Math.abs(constanteK) > 0.0001) {
        // Calcular tiempo estimado para alcanzar el peso objetivo
        // P(t) = P₀ * e^(Kt)
        // t = ln(P(t)/P₀) / K
        tiempoEstimado = Math.log(pesoObjetivo / pesoInicial) / constanteK
        tiempoEstimado = Math.abs(Math.round(tiempoEstimado))

        // Si el tiempo es demasiado grande, limitarlo
        if (tiempoEstimado > 1000 || !isFinite(tiempoEstimado)) {
          tiempoEstimado = "más de 100"
        }
      } else {
        // Si K es muy cercano a cero, el tiempo sería muy largo
        tiempoEstimado = "más de 100"
      }

      // Generar proyección de pérdida de peso
      generarProyeccion(pesoInicial, pesoObjetivo, constanteK)
    }

    setResultados({
      imc: imcRedondeado,
      categoriaIMC,
      pesoIdeal,
      tiempoEstimado,
      constanteK,
      composicionCorporal: {
        grasa: grasaCorporal,
        musculo: musculo,
        agua: agua,
      },
    })
  }

  // Función para generar la proyección de pérdida de peso
  const generarProyeccion = (pesoInicial, pesoObjetivo, constanteK) => {
    const proyeccion = []
    let pesoProyectado = pesoInicial
    let mes = 0

    // Si K es muy cercano a cero, no es un número válido, o es positivo (aumento de peso),
    // usar un valor predeterminado para una pérdida de peso saludable
    let kEfectivo = constanteK

    if (Math.abs(constanteK) < 0.0001 || !isFinite(constanteK) || constanteK >= 0) {
      // Calcular una constante K predeterminada basada en una pérdida de peso saludable
      // Asumimos una pérdida de 0.5-1kg por semana (2-4kg por mes) como saludable
      const perdidaEsperada = Math.min(pesoInicial * 0.05, 4) // 5% del peso o máximo 4kg por mes
      const pesoProyectado = pesoInicial - perdidaEsperada
      kEfectivo = Math.log(pesoProyectado / pesoInicial)
    }

    // Generar proyección mensual hasta alcanzar el peso objetivo o hasta 24 meses (2 años)
    while (pesoProyectado > pesoObjetivo && mes <= 24) {
      proyeccion.push({
        mes,
        fecha: obtenerFechaProyectada(mes),
        peso: Math.round(pesoProyectado * 10) / 10,
        pesoObjetivo,
        pesoInicial: pesoInicial,
        pesoRestante: Math.round((pesoProyectado - pesoObjetivo) * 10) / 10,
      })

      // Calcular peso para el siguiente mes usando la fórmula P(t) = P₀ * e^(Kt)
      mes++
      pesoProyectado = pesoInicial * Math.exp(kEfectivo * mes)
    }

    // Añadir el mes final si no se ha alcanzado el límite
    if (mes <= 24) {
      proyeccion.push({
        mes,
        fecha: obtenerFechaProyectada(mes),
        peso: Math.round(pesoObjetivo * 10) / 10,
        pesoObjetivo,
        pesoInicial: pesoInicial,
        pesoRestante: 0,
      })
    }

    setProyeccion(proyeccion)
  }

  // Función para obtener la fecha proyectada
  const obtenerFechaProyectada = (meses) => {
    const fecha = new Date()
    fecha.setMonth(fecha.getMonth() + meses)
    return fecha.toISOString().split("T")[0]
  }

  // Función para dibujar el medidor de IMC
  const dibujarMedidorIMC = (imc) => {
    const canvas = imcGaugeRef.current
    const ctx = canvas.getContext("2d")

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configuración del medidor
    const centerX = canvas.width / 2
    const centerY = canvas.height - 30
    const radius = (Math.min(canvas.width, canvas.height) * 0.8) / 2

    // Dibujar el arco del medidor
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false)

    // Crear gradiente
    const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
    gradient.addColorStop(0, "#3498db") // Azul (bajo peso)
    gradient.addColorStop(0.3, "#2ecc71") // Verde (normal)
    gradient.addColorStop(0.5, "#f1c40f") // Amarillo (sobrepeso)
    gradient.addColorStop(0.7, "#e67e22") // Naranja (obesidad I)
    gradient.addColorStop(0.85, "#e74c3c") // Rojo (obesidad II)
    gradient.addColorStop(1, "#c0392b") // Rojo oscuro (obesidad III)

    ctx.lineWidth = 20
    ctx.strokeStyle = gradient
    ctx.stroke()

    // Dibujar las marcas y etiquetas
    const marcas = [
      { valor: 16, texto: "Delgadez severa" },
      { valor: 18.5, texto: "Bajo peso" },
      { valor: 25, texto: "Normal" },
      { valor: 30, texto: "Sobrepeso" },
      { valor: 35, texto: "Obesidad I" },
      { valor: 40, texto: "Obesidad II" },
      { valor: 45, texto: "Obesidad III" },
    ]

    ctx.fillStyle = "#333"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"

    marcas.forEach((marca) => {
      // Convertir el valor de IMC a un ángulo (de PI a 0)
      const angulo = Math.PI - ((marca.valor - 15) / 30) * Math.PI

      // Calcular la posición de la marca
      const x = centerX + Math.cos(angulo) * radius
      const y = centerY - Math.sin(angulo) * radius

      // Dibujar la marca
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(centerX + Math.cos(angulo) * (radius - 15), centerY - Math.sin(angulo) * (radius - 15))
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 2
      ctx.stroke()

      // Dibujar el texto
      const textX = centerX + Math.cos(angulo) * (radius - 30)
      const textY = centerY - Math.sin(angulo) * (radius - 30)
      ctx.fillText(marca.valor, textX, textY)
    })

    // Dibujar el valor actual
    ctx.font = "bold 16px Arial"
    ctx.fillText(`IMC: ${imc}`, centerX, centerY - 20)
    ctx.font = "14px Arial"
    ctx.fillText(resultados.categoriaIMC, centerX, centerY)

    // Dibujar la aguja
    const anguloAguja = Math.PI - ((imc - 15) / 30) * Math.PI
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Math.cos(anguloAguja) * (radius - 10), centerY - Math.sin(anguloAguja) * (radius - 10))
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 3
    ctx.stroke()

    // Dibujar el círculo central
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
    ctx.fillStyle = "#333"
    ctx.fill()
  }

  // Función para dibujar el modelo matemático
  const dibujarModeloMatematico = () => {
    const canvas = modeloMatRef.current
    const ctx = canvas.getContext("2d")

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Configuración
    const padding = 40
    const width = canvas.width - padding * 2
    const height = canvas.height - padding * 2
    const originX = padding
    const originY = canvas.height - padding

    // Dibujar ejes
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX + width, originY)
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX, originY - height)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.stroke()

    // Etiquetas de ejes
    ctx.fillStyle = "#333"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Tiempo (meses)", originX + width / 2, originY + 30)

    ctx.save()
    ctx.translate(originX - 30, originY - height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Peso (kg)", 0, 0)
    ctx.restore()

    // Obtener datos para la curva
    if (historialMediciones.length < 1) return

    const pesoInicial = Number.parseFloat(datosForm.pesoInicial)
    const pesoActual = Number.parseFloat(historialMediciones[0].peso)
    const pesoObjetivo = Number.parseFloat(datosForm.pesoObjetivo)
    const constanteK = resultados.constanteK

    // Escala para el eje X (tiempo)
    const maxMeses = resultados.tiempoEstimado !== "más de 100" ? Number(resultados.tiempoEstimado) + 2 : 24
    const escalaX = width / maxMeses

    // Escala para el eje Y (peso)
    const maxPeso = pesoInicial * 1.1
    const minPeso = pesoObjetivo * 0.9
    const rangoPeso = maxPeso - minPeso
    const escalaY = height / rangoPeso

    // Dibujar marcas en los ejes
    // Eje X (tiempo)
    for (let i = 0; i <= maxMeses; i += 2) {
      const x = originX + i * escalaX
      ctx.beginPath()
      ctx.moveTo(x, originY)
      ctx.lineTo(x, originY + 5)
      ctx.stroke()
      ctx.fillText(i.toString(), x, originY + 15)
    }

    // Eje Y (peso)
    for (let i = Math.floor(minPeso / 10) * 10; i <= maxPeso; i += 10) {
      const y = originY - (i - minPeso) * escalaY
      ctx.beginPath()
      ctx.moveTo(originX, y)
      ctx.lineTo(originX - 5, y)
      ctx.stroke()
      ctx.textAlign = "right"
      ctx.fillText(i.toString(), originX - 10, y + 4)
    }

    // Dibujar la curva exponencial
    ctx.beginPath()
    for (let t = 0; t <= maxMeses; t += 0.1) {
      const peso = pesoInicial * Math.exp(constanteK * t)
      const x = originX + t * escalaX
      const y = originY - (peso - minPeso) * escalaY

      if (t === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = "#ff6600"
    ctx.lineWidth = 2
    ctx.stroke()

    // Dibujar puntos de datos conocidos
    // Punto inicial (mes 0)
    const x0 = originX
    const y0 = originY - (pesoInicial - minPeso) * escalaY
    ctx.beginPath()
    ctx.arc(x0, y0, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#3498db"
    ctx.fill()
    ctx.fillText("Peso inicial (Mes 0): " + pesoInicial + " kg", x0 + 10, y0 - 10)

    // Dibujar todos los puntos de medición
    historialMediciones.forEach((medicion, index) => {
      const xMed = originX + (medicion.mes || index + 1) * escalaX
      const yMed = originY - (Number.parseFloat(medicion.peso) - minPeso) * escalaY

      ctx.beginPath()
      ctx.arc(xMed, yMed, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#ff6600"
      ctx.fill()
      ctx.fillText("Mes " + (medicion.mes || index + 1) + ": " + medicion.peso + " kg", xMed + 10, yMed - 10)
    })

    // Punto objetivo
    const xObj =
      originX + (resultados.tiempoEstimado !== "más de 100" ? Number(resultados.tiempoEstimado) * escalaX : width)
    const yObj = originY - (pesoObjetivo - minPeso) * escalaY
    ctx.beginPath()
    ctx.arc(xObj, yObj, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#4caf50"
    ctx.fill()
    ctx.fillText("Peso objetivo: " + pesoObjetivo + " kg", xObj - 10, yObj - 10)

    // Línea de peso objetivo
    ctx.beginPath()
    ctx.moveTo(originX, yObj)
    ctx.lineTo(xObj, yObj)
    ctx.strokeStyle = "#4caf50"
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])

    // Línea de tiempo estimado
    ctx.beginPath()
    ctx.moveTo(xObj, originY)
    ctx.lineTo(xObj, yObj)
    ctx.strokeStyle = "#e74c3c"
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])

    // Título y fórmula
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillStyle = "#333"
    ctx.fillText("Modelo de Decrecimiento Exponencial", originX + width / 2, padding - 20)

    ctx.font = "12px Arial"
    ctx.fillText(`P(t) = ${pesoInicial.toFixed(1)} × e^(${constanteK.toFixed(4)} × t)`, originX + width / 2, padding)

    ctx.fillText(`Tiempo estimado: ${resultados.tiempoEstimado} meses`, originX + width / 2, padding + 20)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDatosForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje({ texto: "", tipo: "" })

    if (!userData || !perfilUsuario) {
      setMensaje({
        texto: "No se pudo obtener la información del usuario",
        tipo: "error",
      })
      setGuardando(false)
      return
    }

    // Validar datos
    if (!datosForm.peso || !datosForm.altura || !datosForm.edad || !datosForm.pesoObjetivo || !datosForm.pesoInicial) {
      setMensaje({
        texto: "Por favor complete todos los campos requeridos",
        tipo: "error",
      })
      setGuardando(false)
      return
    }

    try {
      // Calcular IMC y composición corporal
      const peso = Number.parseFloat(datosForm.peso)
      const altura = Number.parseFloat(datosForm.altura) / 100
      const edad = Number.parseInt(datosForm.edad)
      const genero = datosForm.genero
      const pesoInicial = Number.parseFloat(datosForm.pesoInicial)
      const pesoObjetivo = Number.parseFloat(datosForm.pesoObjetivo)

      const imc = peso / (altura * altura)
      const imcRedondeado = Math.round(imc * 10) / 10

      const grasaCorporal = calcularGrasaCorporal(peso, altura, edad, genero)
      const musculo = calcularMusculo(grasaCorporal, genero)
      const agua = calcularAgua(grasaCorporal, genero)

      // Calcular constante K basada en la tendencia actual
      let constanteK

      if (historialMediciones.length >= 1) {
        // Si tenemos al menos una medición, calculamos K entre el peso inicial y la nueva medición
        const tiempoTranscurrido = historialMediciones.length + 1
        constanteK = Math.log(peso / pesoInicial) / tiempoTranscurrido
      } else {
        // Primera medición
        constanteK = Math.log(peso / pesoInicial)
      }

      // Calcular tiempo estimado (proyección)
      let tiempoEstimado = Math.log(pesoObjetivo / pesoInicial) / constanteK
      tiempoEstimado = Math.abs(Math.round(tiempoEstimado))

      if (tiempoEstimado > 1000 || !isFinite(tiempoEstimado)) {
        tiempoEstimado = 100
      }

      // Calcular peso perdido
      const pesoPerdido = Math.round((pesoInicial - peso) * 10) / 10

      console.log("[v0] 📤 Datos a enviar:", {
        perfilUsuario: { id: perfilUsuario.id },
        peso: peso,
        fecha: datosForm.fechaRegistro,
        proyeccion: tiempoEstimado,
        imc: imcRedondeado,
        peso_perdido: pesoPerdido,
      })

      const response = await fetch(`${API_URL}/pesos`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idperfil: perfilUsuario.id,  // Asegúrate de usar 'idperfil' directamente
          peso: peso,
          fecha: datosForm.fechaRegistro,
          proyeccion: tiempoEstimado,
          imc: imcRedondeado,
          peso_perdido: pesoPerdido,
        }),
      });


      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] ❌ Error response:", errorData)
        throw new Error(errorData.message || "Error al guardar el registro de peso")
      }

      const nuevoPeso = await response.json()

      console.log("[v0] ✅ Peso guardado:", nuevoPeso)

      // Crear nueva medición para el estado local
      const nuevaMedicion = {
        id: nuevoPeso.idpeso,
        fecha: datosForm.fechaRegistro,
        peso: datosForm.peso,
        imc: imcRedondeado.toString(),
        grasaCorporal: grasaCorporal.toString(),
        musculo: musculo.toString(),
        agua: agua.toString(),
        mes: historialMediciones.length + 1,
      }

      // Actualizar historial de mediciones
      const nuevoHistorial = [nuevaMedicion, ...historialMediciones]
      setHistorialMediciones(nuevoHistorial)

      // Generar proyección desde el peso inicial
      generarProyeccion(pesoInicial, pesoObjetivo, constanteK)

      // Actualizar resultados
      setResultados((prev) => ({
        ...prev,
        constanteK,
        tiempoEstimado: tiempoEstimado === 100 ? "más de 100" : tiempoEstimado.toString(),
        imc: imcRedondeado,
        categoriaIMC: prev.categoriaIMC,
        composicionCorporal: {
          grasa: grasaCorporal,
          musculo: musculo,
          agua: agua,
        },
      }))

      setMostrarProyeccion(true)

      setMensaje({
        texto: "¡Datos guardados correctamente! ✅",
        tipo: "exito",
      })

      // Limpiar el campo de peso para la próxima medición
      setDatosForm((prev) => ({
        ...prev,
        peso: "",
        fechaRegistro: new Date().toISOString().split("T")[0],
      }))

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setMensaje({ texto: "", tipo: "" })
      }, 5000)
    } catch (error) {
      console.error("[v0] ❌ Error al guardar:", error)
      setMensaje({
        texto: `Error al guardar: ${error.message}`,
        tipo: "error",
      })
    } finally {
      setGuardando(false)
    }
  }

  // Modificar el gráfico de proyección para incluir el peso inicial como referencia
  // Datos para el gráfico de proyección
  const datosGraficoProyeccion = {
    labels: proyeccion.map((p) => `Mes ${p.mes}`),
    datasets: [
      {
        label: "Peso Proyectado",
        data: proyeccion.map((p) => p.peso),
        borderColor: "#ff6600",
        backgroundColor: "rgba(255, 102, 0, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Peso Objetivo",
        data: proyeccion.map((p) => p.pesoObjetivo),
        borderColor: "#4caf50",
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: "Peso Inicial",
        data: proyeccion.map(() => datosForm.pesoInicial),
        borderColor: "#3498db",
        borderDash: [5, 5],
        fill: false,
      },
    ],
  }

  // Opciones para el gráfico de proyección
  const opcionesGraficoProyeccion = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} kg`,
        },
      },
    },
    scales: {
      y: {
        min: Math.floor(Number.parseFloat(datosForm.pesoObjetivo) * 0.9) || 0,
        max: Math.ceil(Number.parseFloat(datosForm.pesoInicial) * 1.05) || 100,
        title: {
          display: true,
          text: "Peso (kg)",
        },
      },
    },
  }

  // Datos para el gráfico de composición corporal
  const datosComposicionCorporal = {
    labels: ["Inicial", "Actual", "Objetivo"],
    datasets: [
      {
        label: "Grasa",
        data: [
          historialMediciones.length > 0
            ? Number.parseFloat(historialMediciones[historialMediciones.length - 1].grasaCorporal)
            : 0,
          resultados.composicionCorporal.grasa,
          resultados.composicionCorporal.grasa * 0.7, // Estimación objetivo
        ],
        backgroundColor: "#e74c3c",
      },
      {
        label: "Músculo",
        data: [
          historialMediciones.length > 0
            ? Number.parseFloat(historialMediciones[historialMediciones.length - 1].musculo)
            : 0,
          resultados.composicionCorporal.musculo,
          resultados.composicionCorporal.musculo * 1.1, // Estimación objetivo
        ],
        backgroundColor: "#3498db",
      },
      {
        label: "Agua",
        data: [
          historialMediciones.length > 0
            ? Number.parseFloat(historialMediciones[historialMediciones.length - 1].agua)
            : 0,
          resultados.composicionCorporal.agua,
          resultados.composicionCorporal.agua * 1.05, // Estimación objetivo
        ],
        backgroundColor: "#2ecc71",
      },
    ],
  }

  // Opciones para el gráfico de composición corporal
  const opcionesComposicionCorporal = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}%`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 70,
        title: {
          display: true,
          text: "Porcentaje (%)",
        },
      },
    },
  }

  if (cargando) {
    return (
      <div className="progreso-fisico-container">
        <div className="datos-header">
          <h1>Proyección de Cambio Físico</h1>
          <p>Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="progreso-fisico-container">
      <div className="datos-header">
        <h1>Proyección de Cambio Físico</h1>
        <p>
          Registra tus mediciones periódicas para calcular tu IMC, composición corporal estimada y proyectar tu
          evolución física hacia tu peso objetivo utilizando un modelo matemático de decrecimiento exponencial.
        </p>
      </div>

      {mensaje.texto && (
        <div className={`mensaje-alerta ${mensaje.tipo}`}>
          <p>{mensaje.texto}</p>
        </div>
      )}

      <div className="progreso-content">
        <div className="progreso-form-container">
          <h2>
            <FaCalculator /> Registrar Nueva Medición
          </h2>
          <form onSubmit={handleSubmit} className="progreso-form">
            <div className="form-row-f">
              <div className="form-group">
                <label htmlFor="fechaRegistro">
                  <FaCalendarAlt /> Fecha de Medición
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

            <div className="form-row-f">
              <div className="form-group">
                <label htmlFor="pesoInicial">
                  <FaWeight /> Peso Inicial (kg) - Mes 0
                </label>
                <input
                  type="number"
                  id="pesoInicial"
                  name="pesoInicial"
                  value={datosForm.pesoInicial}
                  onChange={handleChange}
                  step="0.1"
                  min="30"
                  max="300"
                  placeholder="Ej. 100"
                  readOnly={historialMediciones.length > 0}
                />
              </div>

              <div className="form-group">
                <label htmlFor="peso">
                  <FaWeight /> Peso Actual (kg) - Mes {historialMediciones.length + 1}
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
                  placeholder={`Ej. ${historialMediciones.length === 0 ? "98" : ""}`}
                />
              </div>
            </div>

            <div className="form-row-f">
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
                  readOnly={historialMediciones.length > 0}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edad">
                  <FaCalendarAlt /> Edad
                </label>
                <input type="number" id="edad" name="edad" value={datosForm.edad} readOnly disabled />
              </div>
            </div>

            <div className="form-row-f">
              <div className="form-group">
                <label htmlFor="pesoObjetivo">
                  <FaWeight /> Peso Objetivo (kg)
                </label>
                <input
                  type="number"
                  id="pesoObjetivo"
                  name="pesoObjetivo"
                  value={datosForm.pesoObjetivo}
                  onChange={handleChange}
                  step="0.1"
                  min="30"
                  max="200"
                  placeholder="Ej. 70"
                  readOnly={historialMediciones.length > 0}
                />
              </div>

              <div className="form-group">
                <label htmlFor="genero">Género</label>
                <select
                  id="genero"
                  name="genero"
                  value={datosForm.genero}
                  onChange={handleChange}
                  disabled={historialMediciones.length > 0}
                >
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
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-guardar" disabled={guardando}>
                {guardando ? (
                  "Guardando..."
                ) : (
                  <>
                    <FaSave /> Guardar Medición
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="resultados-imc-container">
          <h2>
            <FaChartLine /> Resultados
          </h2>

          <div className="resultados-cards">
            <div className="resultado-card">
              <h3>Peso Inicial</h3>
              <div className="resultado-valor">{datosForm.pesoInicial || "-"} kg</div>
            </div>

            <div className="resultado-card">
              <h3>Peso Actual</h3>
              <div className="resultado-valor">
                {historialMediciones.length > 0 ? historialMediciones[0].peso : "Sin registros"} kg
              </div>
            </div>

            <div className="resultado-card">
              <h3>IMC</h3>
              <div className="resultado-valor">{resultados.imc || "-"}</div>
              <div className="resultado-subtexto">{resultados.categoriaIMC}</div>
            </div>

            {resultados.tiempoEstimado && (
              <div className="resultado-card highlight">
                <h3>Tiempo Estimado</h3>
                <div className="resultado-valor">{resultados.tiempoEstimado} meses</div>
                <div className="resultado-subtexto">para alcanzar {datosForm.pesoObjetivo} kg</div>
              </div>
            )}
          </div>

          <div className="imc-gauge-container">
            <h3>Medidor de IMC</h3>
            <canvas ref={imcGaugeRef} width="300" height="200"></canvas>
          </div>

          <div className="composicion-corporal">
            <h3>
              <FaWater /> Composición Corporal Estimada
            </h3>
            <div className="composicion-valores">
              <div className="composicion-item">
                <span className="composicion-label">Grasa:</span>
                <span className="composicion-valor">{resultados.composicionCorporal.grasa || "-"}%</span>
              </div>
              <div className="composicion-item">
                <span className="composicion-label">Músculo:</span>
                <span className="composicion-valor">{resultados.composicionCorporal.musculo || "-"}%</span>
              </div>
              <div className="composicion-item">
                <span className="composicion-label">Agua:</span>
                <span className="composicion-valor">{resultados.composicionCorporal.agua || "-"}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modelo-matematico-container">
        <h2>
          <FaCalculator /> Modelo Matemático de Decrecimiento Exponencial
          <button className="btn-toggle-modelo" onClick={() => setMostrarModelo(!mostrarModelo)}>
            {mostrarModelo ? "Ocultar Modelo" : "Mostrar Modelo"}
          </button>
        </h2>

        {mostrarModelo && (
          <div className="modelo-content">
            <div className="modelo-explicacion">
              <h3>Explicación del Modelo</h3>
              <p>
                La pérdida de peso sigue un modelo de <strong>decrecimiento exponencial</strong>, que se describe con la
                ecuación diferencial:
              </p>
              <div className="formula">
                <span>dP/dt = KP</span>
              </div>
              <p>Donde:</p>
              <ul>
                <li>P es el peso del usuario en función del tiempo t</li>
                <li>K es la constante de decrecimiento (valor negativo)</li>
                <li>t es el tiempo (en meses)</li>
              </ul>

              <p>La solución de esta ecuación es:</p>
              <div className="formula">
                <span>P(t) = P₀ × e^(Kt)</span>
              </div>
              <p>Donde P₀ es el peso inicial.</p>

              <p>
                Con los datos registrados, calculamos K ={" "}
                {resultados.constanteK ? resultados.constanteK.toFixed(6) : "?"} y estimamos que alcanzarás tu peso
                objetivo en aproximadamente {resultados.tiempoEstimado || "?"} meses.
              </p>
            </div>

            <div className="modelo-grafico">
              <canvas ref={modeloMatRef} width="600" height="400"></canvas>
            </div>
          </div>
        )}
      </div>

      {mostrarProyeccion && proyeccion.length > 0 && (
        <div className="proyeccion-container">
          <h2>
            <FaChartLine /> Proyección de Cambio Físico
          </h2>

          <div className="proyeccion-info">
            <div className="proyeccion-card">
              <h3>Peso Inicial</h3>
              <div className="proyeccion-valor">{datosForm.pesoInicial} kg</div>
            </div>

            <div className="proyeccion-card">
              <h3>Peso Actual</h3>
              <div className="proyeccion-valor">
                {historialMediciones.length > 0 ? historialMediciones[0].peso : "Sin registros"} kg
              </div>
            </div>

            <div className="proyeccion-card">
              <h3>Peso Objetivo</h3>
              <div className="proyeccion-valor">{datosForm.pesoObjetivo} kg</div>
            </div>

            <div className="proyeccion-card highlight">
              <h3>Tiempo Estimado</h3>
              <div className="proyeccion-valor">{resultados.tiempoEstimado} meses</div>
            </div>
          </div>

          <div className="grafico-proyeccion">
            <h3>Gráfico de Proyección de Pérdida de Peso</h3>
            <div className="grafico-container">
              <Line data={datosGraficoProyeccion} options={opcionesGraficoProyeccion} height={300} />
            </div>
          </div>

          <div className="tabla-proyeccion">
            <h3>Tabla de Progreso Proyectado</h3>
            <div className="tabla-container">
              <table>
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Fecha</th>
                    <th>Peso Proyectado</th>
                    <th>Peso Perdido (Total)</th>
                    <th>Peso por Perder</th>
                    <th>% Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {proyeccion.slice(0, 10).map((p) => {
                    // Obtener el peso inicial
                    const pesoInicial = Number.parseFloat(datosForm.pesoInicial)

                    return (
                      <tr key={p.mes}>
                        <td>Mes {p.mes}</td>
                        <td>{p.fecha}</td>
                        <td>{p.peso} kg</td>
                        <td>{Math.round((pesoInicial - p.peso) * 10) / 10} kg</td>
                        <td>{p.pesoRestante} kg</td>
                        <td>
                          {Math.round(
                            ((pesoInicial - p.peso) / (pesoInicial - Number.parseFloat(datosForm.pesoObjetivo))) * 100,
                          )}
                          %
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {proyeccion.length > 10 && (
              <div className="ver-mas">
                <button className="btn-ver-mas">Ver Proyección Completa</button>
              </div>
            )}
          </div>

          <div className="composicion-proyeccion">
            <h3>Evolución de Composición Corporal</h3>
            <div className="grafico-container">
              <Bar data={datosComposicionCorporal} options={opcionesComposicionCorporal} height={300} />
            </div>
            <div className="composicion-leyenda">
              <div className="leyenda-item">
                <span className="color-box grasa"></span>
                <span>Grasa Corporal</span>
              </div>
              <div className="leyenda-item">
                <span className="color-box musculo"></span>
                <span>Masa Muscular</span>
              </div>
              <div className="leyenda-item">
                <span className="color-box agua"></span>
                <span>Agua Corporal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="historial-container">
        <h2>
          <FaCalendarAlt /> Historial de Mediciones
        </h2>
        <div className="historial-table">
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Fecha</th>
                <th>Peso (kg)</th>
                <th>IMC</th>
                <th>Grasa (%)</th>
                <th>Músculo (%)</th>
                <th>Agua (%)</th>
              </tr>
            </thead>
            <tbody>
              {historialMediciones.map((medicion) => (
                <tr key={medicion.id}>
                  <td>Mes {medicion.mes || "?"}</td>
                  <td>{medicion.fecha}</td>
                  <td>{medicion.peso}</td>
                  <td>{medicion.imc}</td>
                  <td>{medicion.grasaCorporal}</td>
                  <td>{medicion.musculo}</td>
                  <td>{medicion.agua}</td>
                </tr>
              ))}
              {historialMediciones.length === 0 && (
                <tr>
                  <td colSpan="7" className="no-data">
                    No hay mediciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="recomendaciones-container">
        <h2>
          <FaRunning /> Recomendaciones Personalizadas
        </h2>
        <div className="recomendaciones-content">
          {resultados.imc && (
            <>
              <div className="recomendacion-item">
                <h3>
                  Basado en tu IMC ({resultados.imc} - {resultados.categoriaIMC})
                </h3>
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

              {resultados.tiempoEstimado && (
                <div className="recomendacion-item">
                  <h3>Plan de Pérdida de Peso</h3>
                  <p>
                    {historialMediciones.length > 0 ? (
                      <>
                        Basado en tu progreso actual, estimamos que alcanzarás tu peso objetivo de{" "}
                        {datosForm.pesoObjetivo} kg en aproximadamente {resultados.tiempoEstimado} meses.
                      </>
                    ) : (
                      <>Aún no tienes suficientes mediciones para calcular tu progreso.</>
                    )}{" "}
                    Para optimizar tus resultados, recomendamos:
                  </p>
                  <ul>
                    <li>Mantener un déficit calórico de 500-750 calorías diarias</li>
                    <li>Realizar al menos 150 minutos de ejercicio cardiovascular a la semana</li>
                    <li>Incluir 2-3 sesiones de entrenamiento de fuerza para preservar masa muscular</li>
                    <li>Consumir suficiente proteína (1.6-2.2g por kg de peso corporal)</li>
                    <li>Mantenerse hidratado (al menos 2-3 litros de agua al día)</li>
                  </ul>
                </div>
              )}

              <div className="recomendacion-item">
                <h3>Composición Corporal</h3>
                <p>
                  Tu porcentaje de grasa corporal estimado es {resultados.composicionCorporal.grasa}%,
                  {resultados.composicionCorporal.grasa > 25 && datosForm.genero === "masculino"
                    ? " lo cual está por encima del rango recomendado para hombres (10-20%)."
                    : resultados.composicionCorporal.grasa > 32 && datosForm.genero === "femenino"
                      ? " lo cual está por encima del rango recomendado para mujeres (18-28%)."
                      : " lo cual está dentro del rango saludable."}
                </p>
                <p>
                  Recuerda que estas son estimaciones y pueden variar. Para mediciones más precisas, considera utilizar
                  métodos como la bioimpedancia o consultar con un profesional.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgresoFisico
