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
} from "react-icons/fa"
import { CartContext } from "../../context/CartContext" // Importar el contexto del carrito
import "./carrito.css"

const Carrito = () => {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(true)

  // Obtener el contexto del carrito
  const { cartItems, updateQuantity, removeFromCart, clearCart, getSubtotal, getDiscounts, getTotal } =
    useContext(CartContext)

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => {
      setCargando(false)
    }, 800)
  }, [])

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
    // Aquí normalmente guardarías el estado del carrito y redirigirías a la página de pago
    navigate("/checkout")
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

              {cartItems.map((producto) => (
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
                    </div>
                  </div>

                  <div className="columna-precio">{producto.precio}</div>

                  <div className="columna-cantidad">
                    <div className="control-cantidad">
                      <button
                        className="btn-cantidad"
                        onClick={() => updateQuantity(producto.id, producto.cantidad - 1)}
                        disabled={producto.cantidad <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="cantidad-actual">{producto.cantidad}</span>
                      <button
                        className="btn-cantidad"
                        onClick={() => updateQuantity(producto.id, producto.cantidad + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="columna-subtotal">{formatearPrecio(producto.precioNumerico * producto.cantidad)}</div>

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
              ))}

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

              <button className="btn-proceder-pago" onClick={procederAlPago}>
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

