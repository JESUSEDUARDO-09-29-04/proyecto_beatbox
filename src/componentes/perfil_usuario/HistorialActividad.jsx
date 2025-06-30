"use client"

import { useState, useEffect } from "react"
import {
  FaCalendarAlt,
  FaChartLine,
  FaRunning,
  FaHeartbeat,
  FaClock,
  FaDumbbell,
  FaFilter,
  FaCheckCircle,
} from "react-icons/fa"
import "./HistorialActividad.css"

const HistorialActividad = ({ userData }) => {
  const [actividades, setActividades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtroActividad, setFiltroActividad] = useState("todas")
  const [filtroFecha, setFiltroFecha] = useState("ultimo-mes")
  const [estadisticas, setEstadisticas] = useState({
    totalSesiones: 0,
    tiempoTotal: 0,
    actividadFavorita: "",
    asistenciaPromedio: 0,
  })

  useEffect(() => {
    // Simular carga de datos desde una API
    setTimeout(() => {
      const actividadesSimuladas = [
        {
          id: 1,
          fecha: "2023-05-15",
          horaInicio: "10:00",
          horaFin: "11:30",
          tipo: "Entrenamiento con Pesas",
          calorias: 450,
          duracion: 90,
          entrenador: "Juan Pérez",
          notas: "Enfoque en espalda y bíceps",
        },
        {
          id: 2,
          fecha: "2023-05-13",
          horaInicio: "09:00",
          horaFin: "10:00",
          tipo: "Clase de Spinning",
          calorias: 600,
          duracion: 60,
          entrenador: "Ana López",
          notas: "",
        },
        {
          id: 3,
          fecha: "2023-05-11",
          horaInicio: "18:00",
          horaFin: "19:30",
          tipo: "CrossFit",
          calorias: 700,
          duracion: 90,
          entrenador: "Carlos Ruiz",
          notas: "Nuevo récord personal en sentadillas",
        },
        {
          id: 4,
          fecha: "2023-05-08",
          horaInicio: "10:00",
          horaFin: "11:30",
          tipo: "Entrenamiento con Pesas",
          calorias: 480,
          duracion: 90,
          entrenador: "Juan Pérez",
          notas: "Enfoque en pecho y tríceps",
        },
        {
          id: 5,
          fecha: "2023-05-06",
          horaInicio: "09:00",
          horaFin: "10:00",
          tipo: "Yoga",
          calorias: 250,
          duracion: 60,
          entrenador: "María Gómez",
          notas: "",
        },
      ]

      // Calcular estadísticas
      const totalSesiones = actividadesSimuladas.length
      const tiempoTotal = actividadesSimuladas.reduce((total, act) => total + act.duracion, 0)

      // Encontrar actividad favorita (la más frecuente)
      const actividadesPorTipo = actividadesSimuladas.reduce((acc, act) => {
        acc[act.tipo] = (acc[act.tipo] || 0) + 1
        return acc
      }, {})

      const actividadFavorita = Object.entries(actividadesPorTipo).sort((a, b) => b[1] - a[1])[0][0]

      // Días entre la primera y última actividad
      const fechas = actividadesSimuladas.map((act) => new Date(act.fecha))
      const diasTotales =
        Math.ceil(
          (Math.max(...fechas.map((d) => d.getTime())) - Math.min(...fechas.map((d) => d.getTime()))) /
            (1000 * 60 * 60 * 24),
        ) + 1

      const asistenciaPromedio = ((totalSesiones / diasTotales) * 7).toFixed(1)

      setActividades(actividadesSimuladas)
      setEstadisticas({
        totalSesiones,
        tiempoTotal,
        actividadFavorita,
        asistenciaPromedio,
      })
      setCargando(false)
    }, 800)
  }, [])

  const filtrarActividades = () => {
    if (!actividades) return []

    let actividadesFiltradas = [...actividades]

    // Filtrar por tipo de actividad
    if (filtroActividad !== "todas") {
      actividadesFiltradas = actividadesFiltradas.filter((act) => act.tipo === filtroActividad)
    }

    // Filtrar por fecha
    const hoy = new Date()
    const unaSemanaAtras = new Date()
    unaSemanaAtras.setDate(hoy.getDate() - 7)

    const unMesAtras = new Date()
    unMesAtras.setMonth(hoy.getMonth() - 1)

    const tresMesesAtras = new Date()
    tresMesesAtras.setMonth(hoy.getMonth() - 3)

    switch (filtroFecha) {
      case "ultima-semana":
        actividadesFiltradas = actividadesFiltradas.filter((act) => new Date(act.fecha) >= unaSemanaAtras)
        break
      case "ultimo-mes":
        actividadesFiltradas = actividadesFiltradas.filter((act) => new Date(act.fecha) >= unMesAtras)
        break
      case "ultimos-tres-meses":
        actividadesFiltradas = actividadesFiltradas.filter((act) => new Date(act.fecha) >= tresMesesAtras)
        break
      // Para "todo" no es necesario filtrar
    }

    return actividadesFiltradas
  }

  const tiposActividad = actividades ? [...new Set(actividades.map((act) => act.tipo))] : []

  if (cargando) {
    return (
      <div className="cargando-container">
        <div className="cargando-spinner"></div>
        <p>Cargando historial de actividades...</p>
      </div>
    )
  }

  const actividadesFiltradas = filtrarActividades()

  return (
    <div className="historial-actividad-container">
      <div className="datos-header">
        <h1>Historial de Actividad</h1>
        <p>
          Revisa tu historial de entrenamientos, clases y actividades realizadas en el gimnasio. Lleva un registro de tu
          progreso y rendimiento.
        </p>
      </div>

      <div className="stats-actividad-cards">
        <div className="stat-actividad-card">
          <div className="stat-actividad-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-actividad-info">
            <h3>Total de Sesiones</h3>
            <div className="stat-actividad-value">{estadisticas.totalSesiones}</div>
          </div>
        </div>

        <div className="stat-actividad-card">
          <div className="stat-actividad-icon">
            <FaClock />
          </div>
          <div className="stat-actividad-info">
            <h3>Tiempo Total</h3>
            <div className="stat-actividad-value">
              {Math.floor(estadisticas.tiempoTotal / 60)} h {estadisticas.tiempoTotal % 60} min
            </div>
          </div>
        </div>

        <div className="stat-actividad-card">
          <div className="stat-actividad-icon">
            <FaDumbbell />
          </div>
          <div className="stat-actividad-info">
            <h3>Actividad Favorita</h3>
            <div className="stat-actividad-value">{estadisticas.actividadFavorita}</div>
          </div>
        </div>

        <div className="stat-actividad-card">
          <div className="stat-actividad-icon">
            <FaChartLine />
          </div>
          <div className="stat-actividad-info">
            <h3>Asistencia Semanal</h3>
            <div className="stat-actividad-value">{estadisticas.asistenciaPromedio} días</div>
          </div>
        </div>
      </div>

      <div className="filtros-actividad">
        <div className="filtro-grupo">
          <label>
            <FaFilter /> Filtrar por actividad:
          </label>
          <select value={filtroActividad} onChange={(e) => setFiltroActividad(e.target.value)}>
            <option value="todas">Todas las actividades</option>
            {tiposActividad.map((tipo, index) => (
              <option key={index} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label>
            <FaCalendarAlt /> Período:
          </label>
          <select value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)}>
            <option value="ultima-semana">Última semana</option>
            <option value="ultimo-mes">Último mes</option>
            <option value="ultimos-tres-meses">Últimos 3 meses</option>
            <option value="todo">Todo el historial</option>
          </select>
        </div>
      </div>

      <div className="actividades-lista">
        {actividadesFiltradas.length === 0 ? (
          <div className="no-actividades">
            <FaRunning className="no-actividades-icon" />
            <p>No se encontraron actividades con los filtros seleccionados</p>
            <button
              className="btn-limpiar-filtros"
              onClick={() => {
                setFiltroActividad("todas")
                setFiltroFecha("ultimo-mes")
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="timeline-actividades">
            {actividadesFiltradas.map((actividad) => (
              <div className="actividad-card" key={actividad.id}>
                <div className="actividad-fecha">
                  <div className="fecha-circulo">
                    <div className="fecha-dia">{new Date(actividad.fecha).getDate()}</div>
                    <div className="fecha-mes">
                      {new Date(actividad.fecha).toLocaleDateString("es-ES", { month: "short" })}
                    </div>
                  </div>
                  <div className="actividad-hora">
                    {actividad.horaInicio} - {actividad.horaFin}
                  </div>
                </div>

                <div className="actividad-contenido">
                  <div className="actividad-header">
                    <h3>{actividad.tipo}</h3>
                    <span className="actividad-duracion">
                      <FaClock /> {actividad.duracion} min
                    </span>
                  </div>

                  <div className="actividad-detalles">
                    <div className="actividad-detalle">
                      <FaDumbbell />
                      <span>Entrenador: {actividad.entrenador}</span>
                    </div>
                    <div className="actividad-detalle">
                      <FaHeartbeat />
                      <span>Calorías: {actividad.calorias}</span>
                    </div>
                  </div>

                  {actividad.notas && (
                    <div className="actividad-notas">
                      <p>{actividad.notas}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistorialActividad

