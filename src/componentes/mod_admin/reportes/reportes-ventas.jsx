"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaChartLine, FaDollarSign, FaShoppingCart, FaUsers, FaCalendarAlt, FaDownload } from "react-icons/fa"
import "./reportes-ventas.css"

const ReportesVentas = () => {
  const navigate = useNavigate()
  const [reporteData, setReporteData] = useState({
    ventasHoy: 0,
    ventasMes: 0,
    totalVentas: 0,
    clientesActivos: 0,
    productosMasVendidos: [],
    ventasRecientes: [],
    ventasPorMes: [],
  })
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    metodoPago: "",
    estado: "",
  })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const verificarRol = async () => {
      try {
        const userResponse = await fetch("http://localhost:3000/auth/validate-user", {
          method: "GET",
          credentials: "include",
        })

        if (!userResponse.ok) {
          navigate("/iniciar-sesion")
        } else {
          const userData = await userResponse.json()
          if (userData.role !== "admin") {
            navigate("/iniciar-sesion")
          }
        }
      } catch (error) {
        console.error("Error de red al verificar usuario:", error)
      }
    }

    verificarRol()
  }, [navigate])

  useEffect(() => {
    cargarReporteVentas()
  }, [filtros])

  const cargarReporteVentas = async () => {
    try {
      setCargando(true)
      setError("")

      const queryParams = new URLSearchParams()
      if (filtros.fechaInicio) queryParams.append("fechaInicio", filtros.fechaInicio)
      if (filtros.fechaFin) queryParams.append("fechaFin", filtros.fechaFin)
      if (filtros.metodoPago) queryParams.append("metodoPago", filtros.metodoPago)
      if (filtros.estado) queryParams.append("estado", filtros.estado)

      const response = await fetch(`http://localhost:3000/admin/reportes-ventas?${queryParams}`, {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Error al cargar el reporte de ventas")
      }

      const data = await response.json()
      setReporteData(data)
    } catch (error) {
      console.error("Error al cargar reporte:", error)
      setError("Error al cargar el reporte de ventas")
    } finally {
      setCargando(false)
    }
  }

  const exportarReporte = async (formato) => {
    try {
      const queryParams = new URLSearchParams()
      if (filtros.fechaInicio) queryParams.append("fechaInicio", filtros.fechaInicio)
      if (filtros.fechaFin) queryParams.append("fechaFin", filtros.fechaFin)
      if (filtros.metodoPago) queryParams.append("metodoPago", filtros.metodoPago)
      if (filtros.estado) queryParams.append("estado", filtros.estado)
      queryParams.append("formato", formato)

      const response = await fetch(`http://localhost:3000/admin/exportar-ventas?${queryParams}`, {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Error al exportar el reporte")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `reporte-ventas-${new Date().toISOString().split("T")[0]}.${formato}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al exportar:", error)
      setError("Error al exportar el reporte")
    }
  }

  const formatearPrecio = (precio) => {
    return `$${Number(precio).toFixed(2)}`
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString()
  }

  if (cargando) {
    return (
      <div className="reportes-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h1>
          <FaChartLine /> Reportes de Ventas
        </h1>
        <p>Análisis detallado de las ventas y rendimiento de la tienda</p>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="filtros-reporte">
        <div className="filtros-row">
          <div className="filtro-grupo">
            <label>Fecha Inicio:</label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
            />
          </div>

          <div className="filtro-grupo">
            <label>Fecha Fin:</label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
            />
          </div>

          <div className="filtro-grupo">
            <label>Método de Pago:</label>
            <select value={filtros.metodoPago} onChange={(e) => setFiltros({ ...filtros, metodoPago: e.target.value })}>
              <option value="">Todos</option>
              <option value="PayPal">PayPal</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>

          <div className="filtro-grupo">
            <label>Estado:</label>
            <select value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
              <option value="">Todos</option>
              <option value="Pagado">Pagado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="acciones-reporte">
          <button onClick={() => exportarReporte("csv")} className="btn-exportar">
            <FaDownload /> Exportar CSV
          </button>
          <button onClick={() => exportarReporte("pdf")} className="btn-exportar">
            <FaDownload /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="metricas-grid">
        <div className="metrica-card">
          <div className="metrica-icon ventas">
            <FaDollarSign />
          </div>
          <div className="metrica-info">
            <h3>Ventas Hoy</h3>
            <p className="metrica-valor">{formatearPrecio(reporteData.ventasHoy)}</p>
          </div>
        </div>

        <div className="metrica-card">
          <div className="metrica-icon mes">
            <FaCalendarAlt />
          </div>
          <div className="metrica-info">
            <h3>Ventas Este Mes</h3>
            <p className="metrica-valor">{formatearPrecio(reporteData.ventasMes)}</p>
          </div>
        </div>

        <div className="metrica-card">
          <div className="metrica-icon total">
            <FaShoppingCart />
          </div>
          <div className="metrica-info">
            <h3>Total de Ventas</h3>
            <p className="metrica-valor">{formatearPrecio(reporteData.totalVentas)}</p>
          </div>
        </div>

        <div className="metrica-card">
          <div className="metrica-icon clientes">
            <FaUsers />
          </div>
          <div className="metrica-info">
            <h3>Clientes Activos</h3>
            <p className="metrica-valor">{reporteData.clientesActivos}</p>
          </div>
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <div className="seccion-reporte">
        <h2>Productos Más Vendidos</h2>
        <div className="productos-vendidos">
          {reporteData.productosMasVendidos.map((producto, index) => (
            <div key={producto.id} className="producto-vendido">
              <span className="ranking">#{index + 1}</span>
              <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} className="producto-imagen" />
              <div className="producto-info">
                <h4>{producto.nombre}</h4>
                <p>Vendidos: {producto.cantidad_vendida}</p>
                <p>Ingresos: {formatearPrecio(producto.ingresos_totales)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ventas Recientes */}
      <div className="seccion-reporte">
        <h2>Ventas Recientes</h2>
        <div className="tabla-ventas">
          <table>
            <thead>
              <tr>
                <th>ID Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Método de Pago</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reporteData.ventasRecientes.map((venta) => (
                <tr key={venta.id}>
                  <td>#{venta.id}</td>
                  <td>{venta.cliente_nombre}</td>
                  <td>{formatearFecha(venta.fecha_creacion)}</td>
                  <td>{formatearPrecio(venta.total)}</td>
                  <td>{venta.metodo_pago}</td>
                  <td>
                    <span className={`estado-badge ${venta.estado.toLowerCase()}`}>{venta.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ReportesVentas
