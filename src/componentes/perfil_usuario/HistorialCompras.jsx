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
} from "react-icons/fa"
import "./HistorialCompras.css"

const HistorialCompras = ({ userData }) => {
  const [compras, setCompras] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState("todos")
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    // Simular carga de datos desde una API
    setTimeout(() => {
      const comprasSimuladas = [
        {
          id: "ORD123456",
          fecha: "2023-05-10",
          total: "1,299.00",
          estado: "Entregado",
          productos: [
            {
              id: 1,
              nombre: "Proteína Whey - 1kg",
              cantidad: 1,
              precio: "599.00",
              imagen: "/placeholder.svg?height=80&width=80",
            },
            {
              id: 2,
              nombre: "Guantes de entrenamiento",
              cantidad: 1,
              precio: "349.00",
              imagen: "/placeholder.svg?height=80&width=80",
            },
            {
              id: 3,
              nombre: "Botella deportiva",
              cantidad: 2,
              precio: "179.00",
              imagen: "/placeholder.svg?height=80&width=80",
            },
          ],
          direccion: "Calle Principal 123, Ciudad",
          metodoPago: "Tarjeta terminada en 4532",
        },
        {
          id: "ORD123455",
          fecha: "2023-04-05",
          total: "899.00",
          estado: "Entregado",
          productos: [
            {
              id: 4,
              nombre: "Tenis para entrenamiento",
              cantidad: 1,
              precio: "899.00",
              imagen: "/placeholder.svg?height=80&width=80",
            },
          ],
          direccion: "Calle Principal 123, Ciudad",
          metodoPago: "PayPal",
        },
        {
          id: "ORD123454",
          fecha: "2023-03-20",
          total: "449.00",
          estado: "Cancelado",
          productos: [
            {
              id: 5,
              nombre: "Playera deportiva",
              cantidad: 1,
              precio: "249.00",
              imagen: "/placeholder.svg?height=80&width=80",
            },
            {
              id: 6,
              nombre: "Shorts deportivos",
              cantidad: 1,
              precio: "199.00",
              imagen: "/placeholder.svg?height=80&width=80",
            },
          ],
          direccion: "Calle Principal 123, Ciudad",
          metodoPago: "Tarjeta terminada en 4532",
        },
      ]

      setCompras(comprasSimuladas)
      setCargando(false)
    }, 800)
  }, [])

  const filtrarCompras = () => {
    if (!compras) return []

    let comprasFiltradas = compras

    // Filtrar por estado
    if (filtro !== "todos") {
      comprasFiltradas = comprasFiltradas.filter((compra) => compra.estado.toLowerCase() === filtro)
    }

    // Filtrar por búsqueda
    if (busqueda.trim() !== "") {
      const terminoBusqueda = busqueda.toLowerCase()
      comprasFiltradas = comprasFiltradas.filter(
        (compra) =>
          compra.id.toLowerCase().includes(terminoBusqueda) ||
          compra.productos.some((producto) => producto.nombre.toLowerCase().includes(terminoBusqueda)),
      )
    }

    return comprasFiltradas
  }

  const getIconoEstado = (estado) => {
    switch (estado.toLowerCase()) {
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

  const verDetallePedido = (id) => {
    console.log(`Ver detalle del pedido ${id}`)
    // Aquí iría la lógica para ver el detalle
  }

  if (cargando) {
    return (
      <div className="cargando-container">
        <div className="cargando-spinner"></div>
        <p>Cargando historial de compras...</p>
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
                  <FaCreditCard />
                  <span>{compra.metodoPago}</span>
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

