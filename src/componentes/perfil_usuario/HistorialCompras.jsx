"use client"

import { useState, useEffect } from "react"
import {
  FaShoppingBag,
  FaReceipt,
  FaSearch,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaCreditCard,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaListAlt,
  FaPaypal,
} from "react-icons/fa"
import "./HistorialCompras.css"

const HistorialCompras = ({ userData }) => {
  const [compras, setCompras] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    cargarHistorialCompras()
  }, [])

  const cargarHistorialCompras = async () => {
    try {
      setCargando(true)
      setError("")

      const response = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/orders/user/${userData.id}`, {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Error al cargar el historial de compras")
      }

      const data = await response.json()

      // Formatear los datos para que coincidan con el formato esperado
      const comprasFormateadas = data.map((order) => ({
        id: order.id,
        fecha: new Date(order.fecha_creacion).toLocaleDateString(),
        total: order.total.toFixed(2),
        estado: order.estado,
        productos: order.items.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio.toFixed(2),
          imagen: "/placeholder.svg?height=80&width=80", // Podrías obtener esto de la base de datos
        })),
        metodoPago: order.metodo_pago === "PayPal" ? "PayPal" : order.metodo_pago,
        paypalOrderId: order.paypal_order_id,
      }))

      setCompras(comprasFormateadas)
    } catch (error) {
      console.error("Error al cargar historial:", error)
      setError("Error al cargar el historial de compras")
    } finally {
      setCargando(false)
    }
  }

  const filtrarCompras = () => {
    if (!compras) return []

    let comprasFiltradas = compras

    // Filtrar por estado
    if (filtro !== "todos") {
      comprasFiltradas = comprasFiltradas.filter((compra) => compra.estado.toLowerCase() === filtro.toLowerCase())
    }

    // Filtrar por búsqueda
    if (busqueda.trim() !== "") {
      const terminoBusqueda = busqueda.toLowerCase()
      comprasFiltradas = comprasFiltradas.filter(
        (compra) =>
          compra.id.toString().includes(terminoBusqueda) ||
          compra.productos.some((producto) => producto.nombre.toLowerCase().includes(terminoBusqueda)),
      )
    }

    return comprasFiltradas
  }

  const getIconoEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case "pagado":
      case "entregado":
        return <FaCheckCircle className="estado-icon entregado" />
      case "en camino":
        return <FaTruck className="estado-icon en-camino" />
      case "procesando":
        return <FaBox className="estado-icon procesando" />
      case "cancelado":
        return <FaExclamationTriangle className="estado-icon cancelado" />
      default:
        return <FaReceipt className="estado-icon" />
    }
  }

  const getIconoMetodoPago = (metodo) => {
    if (metodo === "PayPal") {
      return <FaPaypal />
    }
    return <FaCreditCard />
  }

  const verDetallePedido = (id) => {
    console.log(`Ver detalle del pedido ${id}`)
    // Aquí podrías navegar a una página de detalle o abrir un modal
  }

  if (cargando) {
    return (
      <div className="cargando-container">
        <div className="cargando-spinner"></div>
        <p>Cargando historial de compras...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <p>{error}</p>
        <button onClick={cargarHistorialCompras} className="btn-reintentar">
          Reintentar
        </button>
      </div>
    )
  }

  const comprasFiltradas = filtrarCompras()

  return (
    <div className="historial-compras-container">
      <div className="datos-header">
        <h1>Historial de Compras</h1>
        <p>
          Revisa todas tus compras realizadas en la tienda de Beatbox Gym. Puedes ver el estado de tus pedidos y revisar
          los detalles de cada compra.
        </p>
      </div>

      <div className="filtros-compras">
        <div className="busqueda-container">
          <div className="campo-busqueda">
            <FaSearch className="icono-busqueda" />
            <input
              type="text"
              placeholder="Buscar por número de pedido o producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="filtro-estados">
          <button className={filtro === "todos" ? "activo" : ""} onClick={() => setFiltro("todos")}>
            Todos
          </button>
          <button className={filtro === "pagado" ? "activo" : ""} onClick={() => setFiltro("pagado")}>
            Pagados
          </button>
          <button className={filtro === "entregado" ? "activo" : ""} onClick={() => setFiltro("entregado")}>
            Entregados
          </button>
          <button className={filtro === "en camino" ? "activo" : ""} onClick={() => setFiltro("en camino")}>
            En Camino
          </button>
          <button className={filtro === "procesando" ? "activo" : ""} onClick={() => setFiltro("procesando")}>
            Procesando
          </button>
          <button className={filtro === "cancelado" ? "activo" : ""} onClick={() => setFiltro("cancelado")}>
            Cancelados
          </button>
        </div>
      </div>

      <div className="compras-lista">
        {comprasFiltradas.length === 0 ? (
          <div className="no-compras">
            <FaShoppingBag className="no-compras-icon" />
            <p>No se encontraron compras con los filtros seleccionados</p>
            {filtro !== "todos" || busqueda !== "" ? (
              <button
                className="btn-limpiar-filtros"
                onClick={() => {
                  setFiltro("todos")
                  setBusqueda("")
                }}
              >
                Limpiar filtros
              </button>
            ) : (
              <p>¡Visita nuestra tienda para realizar tu primera compra!</p>
            )}
          </div>
        ) : (
          comprasFiltradas.map((compra) => (
            <div className="compra-card" key={compra.id}>
              <div className="compra-header">
                <div className="compra-id">
                  <h3>Pedido #{compra.id}</h3>
                  <span className="compra-fecha">
                    <FaCalendarAlt /> {compra.fecha}
                  </span>
                </div>
                <div className={`compra-estado ${compra.estado.toLowerCase().replace(" ", "-")}`}>
                  {getIconoEstado(compra.estado)}
                  <span>{compra.estado}</span>
                </div>
              </div>

              <div className="compra-productos">
                {compra.productos.map((producto) => (
                  <div className="producto-item" key={producto.id}>
                    <div className="producto-imagen">
                      <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} />
                    </div>
                    <div className="producto-info">
                      <h4>{producto.nombre}</h4>
                      <div className="producto-detalles">
                        <span className="producto-cantidad">Cantidad: {producto.cantidad}</span>
                        <span className="producto-precio">${producto.precio}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="compra-footer">
                <div className="compra-metodo">
                  {getIconoMetodoPago(compra.metodoPago)}
                  <span>{compra.metodoPago}</span>
                  {compra.paypalOrderId && <span className="paypal-id">ID: {compra.paypalOrderId}</span>}
                </div>
                <div className="compra-total">
                  <span className="total-label">Total:</span>
                  <span className="total-valor">${compra.total}</span>
                </div>
                <button className="btn-detalle" onClick={() => verDetallePedido(compra.id)}>
                  <FaListAlt /> Ver Detalle
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HistorialCompras
