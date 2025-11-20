"use client"

import { createContext, useState, useEffect } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // 1️⃣ Cargar carrito desde el backend
  const fetchCart = async () => {
    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/carrito", {
        credentials: "include",
      })

      if (!response.ok) throw new Error("Error al obtener el carrito")

      const data = await response.json()
      // MODIFICACIÓN: Formatear los ítems del carrito al cargarlos
      setCartItems(
        data.items.map((item) => {
          const precio = Number.parseFloat(item.producto.precio) || 0

          return {
            itemId: item.id,
            id: item.producto.id,
            nombre: item.producto.nombre,
            precio: `$${precio.toFixed(2)}`,
            precioNumerico: precio,
            cantidad: item.cantidad,
            imagen: item.producto.imagen,
            descuento: item.producto.descuento,
            stock: item.producto.stock || item.producto.existencia, // Asegurar que el stock esté disponible
            existencia: item.producto.existencia || item.producto.stock,
          }
        }),
      )
    } catch (error) {
      console.error("Error al cargar carrito desde backend:", error)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  // 2️⃣ Agregar producto al carrito (backend)
  const addToCart = async (product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.id === product.id)
    const finalQuantity = existingItem ? existingItem.cantidad + quantity : quantity

    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/carrito/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ NECESARIO para que se envíe el JWT de la cookie
        body: JSON.stringify({
          productoId: product.id,
          cantidad: finalQuantity,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al agregar al carrito")
      }

      const data = await response.json()
      setCartItems(
        data.items.map((item) => {
          const precio = Number.parseFloat(item.producto.precio) || 0

          return {
            id: item.producto.id,
            nombre: item.producto.nombre,
            precio: `$${precio.toFixed(2)}`,
            precioNumerico: precio,
            cantidad: item.cantidad,
            imagen: item.producto.imagen,
            descuento: item.producto.descuento,
            stock: item.producto.stock || item.producto.existencia, // Asegurar que el stock esté disponible
            existencia: item.producto.existencia || item.producto.stock,
          }
        }),
      )
    } catch (error) {
      console.error("Error al agregar producto:", error)
    }
  }

  // 3️⃣ Actualizar cantidad de un producto (equivale a re-agregar con nueva cantidad)
  const updateQuantity = async (itemId, cantidad) => {
    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/carrito/actualizar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // por JWT en cookies
        body: JSON.stringify({
          itemId,      // <--- este es el nuevo nombre correcto
          cantidad,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar cantidad");
      }

      await fetchCart(); // volver a cargar carrito
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  // 4️⃣ Eliminar producto del carrito
  const removeFromCart = async (productoId) => {
    try {
      const response = await fetch(`https://backendbeat-serverbeat.586pa0.easypanel.host/carrito/eliminar/${productoId}`, {
        method: "DELETE",
        credentials: "include", // <- Muy importante si usas JWT en cookies
      })

      if (!response.ok) throw new Error("Error al eliminar producto")

      await fetchCart() // Actualiza el carrito tras eliminar
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error)
    }
  }

  // 5️⃣ Vaciar carrito (si tienes un endpoint específico, cámbialo)
  const clearCart = async () => {
    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/carrito/vaciar", {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Error al vaciar carrito")

      await fetchCart()
    } catch (error) {
      console.error("Error al vaciar carrito:", error)
    }
  }

  // 6️⃣ Utilidades de cálculo
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0)
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const precio = item.precioNumerico || Number.parseFloat(item.precio?.replace(/[^0-9.]+/g, "") || "0")
      return total + precio * item.cantidad
    }, 0)
  }

  const getDiscounts = () => {
    return cartItems.reduce((total, item) => {
      if (item.descuento) {
        const porcentaje = Number.parseInt(item.descuento.replace("%", ""))
        const precio = item.precioNumerico || Number.parseFloat(item.precio?.replace(/[^0-9.]+/g, "") || "0")
        return total + precio * item.cantidad * (porcentaje / 100)
      }
      return total
    }, 0)
  }

  const getTotal = () => getSubtotal() - getDiscounts()

  const hasEnoughStock = (productId, requestedQuantity) => {
    const item = cartItems.find((i) => i.id === productId)
    const stock = item?.stock || item?.existencia || 999
    return requestedQuantity <= stock
  }

  const getAvailableStock = (productId) => {
    const item = cartItems.find((i) => i.id === productId)
    return item?.stock || item?.existencia || 999
  }

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    getSubtotal,
    getDiscounts,
    getTotal,
    hasEnoughStock,
    getAvailableStock,
    fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
