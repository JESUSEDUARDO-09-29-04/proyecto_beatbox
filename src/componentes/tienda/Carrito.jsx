"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import {
  FaTrash,
  FaArrowLeft,
  FaCreditCard,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaExclamationCircle,
  FaExclamationTriangle,
} from "react-icons/fa"
import { CartContext } from "../../context/CartContext" // Importar el contexto del carrito
import "./Carrito.css"

const Carrito = () => {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(true)
  const [stockWarnings, setStockWarnings] = useState({}) // Para mostrar advertencias de stock

  // Obtener el contexto del carrito
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getDiscounts,
    getTotal,
    getAvailableStock,
  } = useContext(CartContext)

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => {
      setCargando(false)
    }, 800)
  }, [])

  // Verificar stock al cargar el componente
  useEffect(() => {
    const warnings = {}
    cartItems.forEach((item) => {
      const availableStock = getAvailableStock(item.id)
      if (item.cantidad > availableStock) {
        warnings[item.id] = `Solo hay ${availableStock} unidades disponibles`
      }
    })
    setStockWarnings(warnings)
  }, [cartItems, getAvailableStock])

  // Formatear precio
  const formatearPrecio = (precio) => {
    return `$${precio.toFixed(2)} MXN`
  }

  // Vaciar carrito
  const vaciarCarrito = () => {
    if (window.confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
      clearCart()
    }
  }

  // Proceder al pago
  const procederAlPago = () => {
    // Verificar que no haya problemas de stock antes de proceder
    const hasStockIssues = Object.keys(stockWarnings).length > 0
    if (hasStockIssues) {
      alert("Por favor, ajusta las cantidades de los productos que exceden el stock disponible antes de continuar.")
      return
    }

    navigate("/checkout")
  }

  const actualizarCantidad = (itemId, productId, newQuantity) => {
    const quantityToUpdate = Math.max(1, newQuantity)
    const availableStock = getAvailableStock(productId)

    if (quantityToUpdate > availableStock) {
      setStockWarnings((prev) => ({
        ...prev,
        [productId]: `Solo hay ${availableStock} unidades disponibles. Se ajustó la cantidad.`,
      }))
      updateQuantity(itemId, availableStock)

      setTimeout(() => {
        setStockWarnings((prev) => {
          const newWarnings = { ...prev }
          delete newWarnings[productId]
          return newWarnings
        })
      }, 3000)
    } else {
      setStockWarnings((prev) => {
        const newWarnings = { ...prev }
        delete newWarnings[productId]
        return newWarnings
      })
      updateQuantity(itemId, quantityToUpdate)
    }
  }

  return (
    <div className="contenedor-carrito">
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="carrito-principal">
        <h1 className="titulo-carrito">
          <FaShoppingCart className="icono-titulo" /> Mi Carrito de Compras
        </h1>

        {cargando ? (
          <div className="cargando-carrito">
            <div className="spinner"></div>
            <p>Cargando tu carrito...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="carrito-vacio">
            <FaExclamationCircle className="icono-carrito-vacio" />
            <h2>Tu carrito está vacío</h2>
            <p>Parece que aún no has añadido productos a tu carrito</p>
            <button className="btn-seguir-comprando" onClick={() => navigate("/tienda")}>
              <FaArrowLeft /> Ir a la tienda
            </button>
          </div>
        ) : (
          <div className="contenido-carrito">
            <div className="productos-carrito">
              <div className="encabezado-tabla">
                <div className="columna-producto">Producto</div>
                <div className="columna-precio">Precio</div>
                <div className="columna-cantidad">Cantidad</div>
                <div className="columna-subtotal">Subtotal</div>
                <div className="columna-acciones">Acciones</div>
              </div>

              {cartItems.map((producto) => {
                const availableStock = getAvailableStock(producto.id)
                const hasStockWarning = stockWarnings[producto.id]

                return (
                  <div key={producto.id} className="fila-producto">
                    <div className="columna-producto">
                      <img
                        src={producto.imagen || "/placeholder.svg"}
                        alt={producto.nombre}
                        className="imagen-producto-carrito"
                      />
                      <div className="detalles-producto">
                        <h3 className="nombre-producto-carrito">{producto.nombre}</h3>
                        {producto.descuento && (
                          <span className="etiqueta-descuento-carrito">{producto.descuento} de descuento</span>
                        )}
                        <div className="stock-info">
                          <span className="stock-disponible">Stock disponible: {availableStock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="columna-precio">{producto.precio}</div>

                    <div className="columna-cantidad">
                      <div className="control-cantidad">
                        <button
                          className="btn-cantidad"
                          onClick={() =>actualizarCantidad(producto.itemId, producto.id, producto.cantidad - 1)
}
                          disabled={producto.cantidad <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="cantidad-actual">{producto.cantidad}</span>
                        <button
                          className="btn-cantidad"
                          onClick={() =>     actualizarCantidad(producto.itemId, producto.id, producto.cantidad + 1)}
                          disabled={producto.cantidad >= availableStock}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      {/* Mostrar advertencia de stock si existe */}
                      {hasStockWarning && (
                        <div className="stock-warning">
                          <FaExclamationTriangle className="warning-icon" />
                          <span className="warning-text">{hasStockWarning}</span>
                        </div>
                      )}
                    </div>

                    <div className="columna-subtotal">
                      {formatearPrecio(producto.precioNumerico * producto.cantidad)}
                    </div>

                    <div className="columna-acciones">
                      <button
                        className="btn-eliminar"
                        onClick={() => removeFromCart(producto.id)}
                        title="Eliminar producto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )
              })}

              <div className="acciones-carrito">
                <button className="btn-seguir-comprando" onClick={() => navigate("/tienda")}>
                  <FaArrowLeft /> Seguir comprando
                </button>

                <button className="btn-vaciar-carrito" onClick={vaciarCarrito}>
                  <FaTrash /> Vaciar carrito
                </button>
              </div>
            </div>

            <div className="resumen-carrito">
              <h2 className="titulo-resumen">Resumen de compra</h2>

              <div className="detalle-resumen">
                <div className="fila-resumen">
                  <span>Subtotal:</span>
                  <span>{formatearPrecio(getSubtotal())}</span>
                </div>

                {getDiscounts() > 0 && (
                  <div className="fila-resumen descuento">
                    <span>Descuentos:</span>
                    <span>-{formatearPrecio(getDiscounts())}</span>
                  </div>
                )}

                <div className="fila-resumen total">
                  <span>Total:</span>
                  <span>{formatearPrecio(getTotal())}</span>
                </div>
              </div>

              {/* Mostrar advertencia general si hay problemas de stock */}
              {Object.keys(stockWarnings).length > 0 && (
                <div className="stock-alert">
                  <FaExclamationTriangle className="alert-icon" />
                  <span>Algunos productos exceden el stock disponible. Ajusta las cantidades para continuar.</span>
                </div>
              )}

              <button
                className="btn-proceder-pago"
                onClick={procederAlPago}
                disabled={Object.keys(stockWarnings).length > 0}
              >
                <FaCreditCard /> Proceder al pago
              </button>
            </div>
          </div>
        )}
      </div>

      <FooterH />
    </div>
  )
}

export default Carrito
