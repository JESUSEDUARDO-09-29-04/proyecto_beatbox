"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import HeaderH from "../HeaderH"
import FooterH from "../FooterH"
import Breadcrumbs from "../Breadcrumbs"
import {
  FaCreditCard,
  FaPaypal,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaShoppingCart,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa"
import { CartContext } from "../../context/CartContext"
import "./checkout.css"

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getTotal, clearCart } = useContext(CartContext)

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [orderData, setOrderData] = useState(null)

  // Verificar autenticación y cargar datos del usuario
  useEffect(() => {
    const verificarUsuario = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/validate-user", {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          navigate("/iniciar-sesion")
          return
        }

        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error("Error al verificar usuario:", error)
        navigate("/iniciar-sesion")
      } finally {
        setLoading(false)
      }
    }

    verificarUsuario()
  }, [navigate])

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      navigate("/carrito")
    }
  }, [cartItems, loading, navigate])

  const formatearPrecio = (precio) => {
    return `$${precio.toFixed(2)}`
  }

  // Crear orden en el backend
  const crearOrden = async (paymentData = null) => {
    try {
      const orderItems = cartItems.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precio: item.precioNumerico,
        nombre: item.nombre,
      }))

      const orderData = {
        items: orderItems,
        total: getTotal(),
        metodoPago: paymentData ? "PayPal" : "Pendiente",
        paypalOrderId: paymentData?.orderID || null,
        paypalPayerId: paymentData?.payerID || null,
        estado: paymentData ? "Pagado" : "Pendiente",
      }

      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Error al crear la orden")
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error al crear orden:", error)
      throw error
    }
  }

  // Manejar aprobación de PayPal
  const handlePayPalApprove = async (data, actions) => {
    setProcessingPayment(true)

    try {
      const details = await actions.order.capture()

      // Crear orden en el backend con datos de PayPal
      const order = await crearOrden({
        orderID: details.id,
        payerID: details.payer.payer_id,
        status: details.status,
      })

      setOrderData(order)
      setPaymentSuccess(true)
      clearCart()
    } catch (error) {
      console.error("Error al procesar pago:", error)
      setPaymentError("Error al procesar el pago. Por favor, intente nuevamente.")
    } finally {
      setProcessingPayment(false)
    }
  }

  // Manejar error de PayPal
  const handlePayPalError = (error) => {
    console.error("Error de PayPal:", error)
    setPaymentError("Error en el procesamiento del pago. Por favor, intente nuevamente.")
  }

  if (loading) {
    return (
      <div className="contenedor-checkout">
        <HeaderH />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
        <FooterH />
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="contenedor-checkout">
        <HeaderH />
        <div className="breadcrumb-container">
          <Breadcrumbs />
        </div>

        <div className="success-container">
          <div className="success-card">
            <FaCheckCircle className="success-icon" />
            <h1>¡Pago Exitoso!</h1>
            <p>Tu orden ha sido procesada correctamente.</p>

            {orderData && (
              <div className="order-details">
                <h3>Detalles de la Orden</h3>
                <p>
                  <strong>Número de Orden:</strong> #{orderData.id}
                </p>
                <p>
                  <strong>Total:</strong> {formatearPrecio(orderData.total)}
                </p>
                <p>
                  <strong>Método de Pago:</strong> {orderData.metodoPago}
                </p>
              </div>
            )}

            <div className="success-actions">
              <button className="btn-primary" onClick={() => navigate("/perfil/historial-compras")}>
                Ver Mis Compras
              </button>
              <button className="btn-secondary" onClick={() => navigate("/tienda")}>
                Seguir Comprando
              </button>
            </div>
          </div>
        </div>

        <FooterH />
      </div>
    )
  }

  return (
    <div className="contenedor-checkout">
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="checkout-content">
        <h1 className="checkout-title">
          <FaCreditCard className="title-icon" />
          Finalizar Compra
        </h1>

        {paymentError && (
          <div className="error-message">
            <FaExclamationTriangle />
            <span>{paymentError}</span>
          </div>
        )}

        <div className="checkout-grid">
          {/* Información del Usuario */}
          <div className="user-info-section">
            <h2>
              <FaUser /> Información de Entrega
            </h2>

            <div className="user-details">
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <span>{userData?.nombre || "Usuario"}</span>
              </div>

              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <span>{userData?.email || "No especificado"}</span>
              </div>

              <div className="detail-item">
                <FaPhone className="detail-icon" />
                <span>{userData?.telefono || "No especificado"}</span>
              </div>
            </div>
          </div>

          {/* Resumen de la Orden */}
          <div className="order-summary">
            <h2>
              <FaShoppingCart /> Resumen de la Orden
            </h2>

            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.imagen || "/placeholder.svg"} alt={item.nombre} className="item-image" />
                  <div className="item-details">
                    <h4>{item.nombre}</h4>
                    <p>Cantidad: {item.cantidad}</p>
                    <p className="item-price">{formatearPrecio(item.precioNumerico * item.cantidad)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Total:</span>
                <span className="total-amount">{formatearPrecio(getTotal())}</span>
              </div>
            </div>
          </div>

          {/* Métodos de Pago */}
          <div className="payment-section">
            <h2>
              <FaPaypal /> Método de Pago
            </h2>

            {processingPayment ? (
              <div className="processing-payment">
                <div className="loading-spinner"></div>
                <p>Procesando pago...</p>
              </div>
            ) : (
              <PayPalScriptProvider
                options={{
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
                  currency: "USD",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "blue",
                    shape: "rect",
                    label: "paypal",
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: getTotal().toFixed(2),
                          },
                          description: `Compra en Beatbox Gym - ${cartItems.length} productos`,
                        },
                      ],
                    })
                  }}
                  onApprove={handlePayPalApprove}
                  onError={handlePayPalError}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      </div>

      <FooterH />
    </div>
  )
}

export default Checkout
