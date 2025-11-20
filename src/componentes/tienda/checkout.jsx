"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
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
  FaStore,
  FaMapMarkerAlt,
  FaClock,
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
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [userDataError, setUserDataError] = useState(null)

  // PayPal Client ID
  const PAYPAL_CLIENT_ID = "AVwq6BqkQgEKkLWDyn_U8Ldz5Q8o-GRDktH1Gw1Ma9TQL0MtKcxRyFR_cUttApGKJsDVlQSAMa5UyV1I"

  // Verificar autenticación y obtener ID del usuario
  useEffect(() => {
    const verificarUsuario = async () => {
      try {
        console.log("🔍 Verificando usuario autenticado...")
        const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/validate-user", {
          method: "GET",
          credentials: "include",
        })

        console.log("📡 Respuesta de validación:", response.status, response.statusText)

        if (!response.ok) {
          console.log("❌ Usuario no autenticado, redirigiendo al login")
          navigate("/iniciar-sesion")
          return
        }

        const authData = await response.json()
        console.log("✅ Usuario autenticado - Datos completos:", authData)

        // Intentar obtener el ID del usuario de diferentes campos posibles
        const userId = authData.id || authData.usuario_id || authData.userId || authData.user_id
        console.log("🆔 ID del usuario extraído:", userId)

        if (userId) {
          setCurrentUserId(userId)
          // Cargar datos completos del usuario usando la nueva ruta
          await cargarDatosUsuario(userId)
        } else {
          console.warn("⚠️ No se pudo obtener el ID del usuario de la respuesta de autenticación")
          // Usar los datos de autenticación como fallback
          setUserData({
            nombre: authData.nombre || authData.username || "Usuario",
            email: authData.email || authData.correo || "No especificado",
            telefono: authData.telefono || authData.telefono || "No especificado",
          })
        }
      } catch (error) {
        console.error("❌ Error al verificar usuario:", error)
        navigate("/iniciar-sesion")
      } finally {
        setLoading(false)
      }
    }

    verificarUsuario()
  }, [navigate])

  // Cargar datos completos del usuario
  const cargarDatosUsuario = async (userId) => {
    try {
      console.log("👤 Cargando datos del usuario con ID:", userId)

      const response = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/usuario/${userId}`, {
        method: "GET",
        credentials: "include",
      })

      console.log("📡 Respuesta de datos de usuario:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Error en respuesta:", errorText)
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const userData = await response.json()
      console.log("✅ Datos del usuario cargados:", userData)

      // Verificar que los datos no estén vacíos
      if (userData && typeof userData === "object") {
        setUserData(userData)
        setUserDataError(null)
      } else {
        console.warn("⚠️ Datos de usuario vacíos o inválidos")
        throw new Error("Datos de usuario inválidos")
      }
    } catch (error) {
      console.error("❌ Error al cargar datos del usuario:", error)
      setUserDataError(error.message)

      // Fallback: intentar obtener datos básicos del endpoint de validación
      try {
        console.log("🔄 Intentando obtener datos básicos del endpoint de validación...")
        const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/validate-user", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          const authData = await response.json()
          console.log("📋 Usando datos de autenticación como fallback:", authData)
          setUserData({
            nombre: authData.nombre || authData.username || "Usuario",
            email: authData.email || authData.correo || "No especificado",
            telefono: authData.telefono || authData.telefono || "No especificado",
          })
        }
      } catch (fallbackError) {
        console.error("❌ Error en fallback:", fallbackError)
        // Último recurso: datos por defecto
        setUserData({
          nombre: "Usuario",
          email: "No especificado",
          telefono: "No especificado",
        })
      }
    }
  }

  // Cargar PayPal SDK
  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) {
        setPaypalLoaded(true)
        return
      }

      const script = document.createElement("script")
      script.src = `http://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=MXN`
      script.onload = () => setPaypalLoaded(true)
      script.onerror = () => {
        setPaymentError("Error al cargar PayPal. Por favor, recarga la página.")
      }
      document.body.appendChild(script)
    }

    if (!loading) {
      loadPayPalScript()
    }
  }, [loading])

  // Inicializar botones de PayPal
  useEffect(() => {
    if (paypalLoaded && window.paypal && !paymentSuccess && cartItems.length > 0) {
      const paypalButtonContainer = document.getElementById("paypal-button-container")
      if (paypalButtonContainer) {
        paypalButtonContainer.innerHTML = "" // Limpiar contenedor

        window.paypal
          .Buttons({
            style: {
              color: "blue",
              shape: "pill",
              label: "pay",
              height: 50,
            },
            createOrder: (data, actions) => {
              console.log("Creando orden PayPal con total:", getTotal().toFixed(2))
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: getTotal().toFixed(2),
                      currency_code: "MXN",
                    },
                    description: `Compra en Beatbox Gym - ${cartItems.length} productos`,
                  },
                ],
              })
            },
            onApprove: (data, actions) => {
              console.log("PayPal onApprove iniciado")
              setProcessingPayment(true)
              setPaymentError("") // Limpiar errores previos

              return actions.order
                .capture()
                .then(async (detalles) => {
                  console.log("Pago completado por PayPal:", detalles)

                  try {
                    // Verificar que aún tenemos items en el carrito
                    if (cartItems.length === 0) {
                      throw new Error("El carrito está vacío")
                    }

                    // Crear venta en el backend
                    const venta = await crearOrden({
                      orderID: detalles.id,
                      payerID: detalles.payer.payer_id,
                      status: detalles.status,
                      amount: detalles.purchase_units[0].amount.value,
                    })

                    console.log("Venta creada exitosamente:", venta)
                    setOrderData(venta)
                    setPaymentSuccess(true)

                    // Limpiar carrito local después del éxito
                    clearCart()
                  } catch (error) {
                    console.error("Error al crear venta:", error)
                    setPaymentError(`Error al procesar la venta: ${error.message}`)
                  } finally {
                    setProcessingPayment(false)
                  }
                })
                .catch((error) => {
                  console.error("Error en captura de PayPal:", error)
                  setPaymentError("Error al capturar el pago de PayPal")
                  setProcessingPayment(false)
                })
            },
            onCancel: (data) => {
              console.log("Pago cancelado:", data)
              setPaymentError("Pago cancelado por el usuario.")
              setProcessingPayment(false)
            },
            onError: (err) => {
              console.error("Error de PayPal:", err)
              setPaymentError("Error en el procesamiento del pago. Por favor, intente nuevamente.")
              setProcessingPayment(false)
            },
          })
          .render("#paypal-button-container")
      }
    }
  }, [paypalLoaded, cartItems, paymentSuccess])

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (!loading && cartItems.length === 0 && !paymentSuccess) {
      navigate("/carrito")
    }
  }, [cartItems, loading, navigate, paymentSuccess])

  const formatearPrecio = (precio) => {
    return `$${precio.toFixed(2)} MXN`
  }

  // Crear orden en el backend (sin localStorage)
  const crearOrden = async (paymentData) => {
    try {
      console.log("Iniciando creación de venta...")
      console.log("Datos de pago:", paymentData)
      console.log("Items en carrito:", cartItems.length)

      // Solo usar credentials: "include" para autenticación por cookies
     const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/ventas/procesar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Autenticación por cookies
      body: JSON.stringify({
        metodo_pago: "paypal",
        monto_total: getTotal(), // total real desde el carrito
        paypal_order_id: paymentData.orderID,
        estado_pago: paymentData.status,
        productos: cartItems.map((item) => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precioNumerico, // ya viene como número
        })),
      }),
    })

      console.log("Respuesta del servidor:", response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = "Error al procesar la venta"

        try {
          const errorData = await response.json()
          console.error("Error del servidor:", errorData)

          if (response.status === 401) {
            errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          } else if (response.status === 400) {
            errorMessage = errorData.message || "Datos de la venta inválidos"
          } else if (response.status === 404) {
            errorMessage = "El carrito está vacío o no se encontró"
          } else {
            errorMessage = errorData.message || errorData.error || errorMessage
          }
        } catch (parseError) {
          console.error("Error al parsear respuesta de error:", parseError)
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }

        throw new Error(errorMessage)
      }

      const ventaCreada = await response.json()
      console.log("Venta creada en backend:", ventaCreada)

      // Intentar actualizar con el ID de PayPal (opcional)
      try {
        await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/ventas/${ventaCreada.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            paypal_order_id: paymentData.orderID,
            estado_pago: "COMPLETADO",
          }),
        })
        console.log("PayPal ID actualizado")
      } catch (updateError) {
        console.warn("No se pudo actualizar el PayPal ID:", updateError)
      }

      return {
        id: ventaCreada.id,
        total: ventaCreada.monto_total,
        metodoPago: "PayPal",
        estado: ventaCreada.estado_pago,
        fecha: ventaCreada.fecha_venta,
        items: ventaCreada.items,
        paypalOrderId: paymentData.orderID,
      }
    } catch (error) {
      console.error("Error completo al crear venta:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="contenedor-checkout">
        <HeaderH />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando información del usuario...</p>
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
            <h1>¡Compra Realizada con Éxito!</h1>
            <p className="success-message">Tu pago ha sido procesado correctamente y tu pedido está confirmado.</p>

            {orderData && (
              <div className="order-details">
                <h3>Detalles de tu Venta</h3>
                <div className="order-info">
                  <p>
                    <strong>Número de Venta:</strong> #{orderData.id}
                  </p>
                  <p>
                    <strong>Total Pagado:</strong> {formatearPrecio(orderData.total)}
                  </p>
                  <p>
                    <strong>Método de Pago:</strong> {orderData.metodoPago}
                  </p>
                  <p>
                    <strong>Estado:</strong> <span className="status-paid">{orderData.estado}</span>
                  </p>
                  <p>
                    <strong>Fecha:</strong> {new Date(orderData.fecha).toLocaleDateString("es-MX")}
                  </p>
                  {orderData.paypalOrderId && (
                    <p>
                      <strong>ID PayPal:</strong> {orderData.paypalOrderId}
                    </p>
                  )}
                </div>

                {/* Mostrar items de la venta */}
                {orderData.items && orderData.items.length > 0 && (
                  <div className="venta-items">
                    <h4>Productos Comprados:</h4>
                    {orderData.items.map((item, index) => (
                      <div key={index} className="venta-item">
                        <span>{item.producto.nombre}</span>
                        <span>Cantidad: {item.cantidad}</span>
                        <span>Precio: ${item.precio_unitario} MXN</span>
                        <span>Subtotal: ${item.subtotal} MXN</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pickup-info">
              <div className="pickup-header">
                <FaStore className="pickup-icon" />
                <h3>Información de Recolección</h3>
              </div>

              <div className="pickup-details">
                <div className="pickup-item">
                  <FaMapMarkerAlt className="pickup-detail-icon" />
                  <div>
                    <strong>Dirección de la Sucursal:</strong>
                    <p>
                      Beatbox Gym - Sucursal Principal
                      <br />
                      Av. Revolución #123, Col. Centro
                      <br />
                      Ciudad de México, CDMX 06000
                    </p>
                  </div>
                </div>

                <div className="pickup-item">
                  <FaClock className="pickup-detail-icon" />
                  <div>
                    <strong>Horarios de Atención:</strong>
                    <p>
                      Lunes a Viernes: 6:00 AM - 10:00 PM
                      <br />
                      Sábados y Domingos: 8:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>

                <div className="pickup-item">
                  <FaUser className="pickup-detail-icon" />
                  <div>
                    <strong>Para recoger tu pedido:</strong>
                    <p>
                      • Presenta una identificación oficial
                      <br />• Menciona tu número de orden: <strong>#{orderData?.id}</strong>
                      <br />• Tu pedido estará listo en 24-48 horas
                    </p>
                  </div>
                </div>
              </div>

              <div className="pickup-notice">
                <FaExclamationTriangle className="notice-icon" />
                <p>
                  <strong>Importante:</strong> Tienes 30 días para recoger tu pedido. Después de este tiempo, se
                  procesará el reembolso automáticamente.
                </p>
              </div>
            </div>

            <div className="success-actions">
              <button className="btn-primary" onClick={() => navigate("/perfil/ventas")}>
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
            <div className="error-details">
              <strong>Error en el procesamiento:</strong>
              <span>{paymentError}</span>
            </div>
            <button className="btn-retry" onClick={() => setPaymentError("")}>
              Reintentar
            </button>
          </div>
        )}

        <div className="checkout-grid">
          {/* Información del Usuario */}
          <div className="user-info-section">
            <h2>
              <FaUser /> Información de Contacto
            </h2>

            {/* Debug info - remover en producción */}
            {userDataError && (
              <div className="debug-info error">
                <strong>Error cargando datos:</strong> {userDataError}
              </div>
            )}

            {currentUserId && (
              <div className="debug-info">
                <strong>ID Usuario:</strong> {currentUserId}
              </div>
            )}

            <div className="user-details">
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <span>
                  {userData?.nombre || userData?.name || userData?.usuario || "Usuario"}
                  {!userData && " (Cargando...)"}
                </span>
              </div>

              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <span>
                  {userData?.email || userData?.correo || userData?.mail || "No especificado"}
                  {!userData && " (Cargando...)"}
                </span>
              </div>

              <div className="detail-item">
                <FaPhone className="detail-icon" />
                <span>
                  {userData?.telefono || userData?.phone || userData?.celular || "No especificado"}
                  {!userData && " (Cargando...)"}
                </span>
              </div>

              {/* Información adicional del usuario si está disponible */}
              {userData?.direccion && (
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span>{userData.direccion}</span>
                </div>
              )}

              {/* Debug: mostrar todos los campos disponibles */}
              {userData && (
                <div className="debug-info">
                  <strong>Campos disponibles:</strong> {Object.keys(userData).join(", ")}
                </div>
              )}
            </div>

            <div className="delivery-info">
              <h3>
                <FaStore /> Método de Entrega
              </h3>
              <div className="delivery-option selected">
                <input type="radio" checked readOnly />
                <label>
                  <strong>Recolección en Sucursal</strong>
                  <span>Recoge tu pedido en nuestra sucursal principal</span>
                </label>
              </div>
            </div>
          </div>

          {/* Resumen de la Orden */}
          <div className="order-summary">
            <h2>
              <FaShoppingCart /> Resumen de tu Pedido
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
                <span>Total a Pagar:</span>
                <span className="total-amount">{formatearPrecio(getTotal())}</span>
              </div>
            </div>
          </div>

          {/* Métodos de Pago */}
          <div className="payment-section">
            <h2>
              <FaPaypal /> Pagar con PayPal
            </h2>

            <div className="payment-info">
              <p>Paga de forma segura con tu cuenta de PayPal o tarjeta de crédito/débito.</p>
            </div>

            {processingPayment ? (
              <div className="processing-payment">
                <div className="loading-spinner"></div>
                <p>Procesando tu pago...</p>
                <small>No cierres esta ventana</small>
              </div>
            ) : (
              <div className="paypal-container">
                <div id="paypal-button-container"></div>
                {!paypalLoaded && (
                  <div className="loading-paypal">
                    <div className="loading-spinner"></div>
                    <p>Cargando PayPal...</p>
                  </div>
                )}
              </div>
            )}

            <div className="payment-security">
              <p className="security-text">
                <FaCheckCircle className="security-icon" />
                Pago 100% seguro y protegido por PayPal
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterH />
    </div>
  )
}

export default Checkout
