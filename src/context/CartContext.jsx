"use client"

import { createContext, useState, useEffect } from "react"

// Crear el contexto del carrito
export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  // Estado para almacenar los productos del carrito
  const [cartItems, setCartItems] = useState([])

  // Cargar productos del carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems")
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error al cargar el carrito:", error)
        setCartItems([])
      }
    }
  }, [])

  // Guardar productos del carrito en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Si el producto ya existe, incrementar la cantidad
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          cantidad: updatedItems[existingItemIndex].cantidad + 1,
        }
        return updatedItems
      } else {
        // Si el producto no existe, agregarlo con cantidad 1
        return [
          ...prevItems,
          {
            ...product,
            cantidad: 1,
            // Asegurarse de que el precio numérico esté disponible
            precioNumerico: product.precioNumerico || Number.parseFloat(product.precio.replace(/[^0-9.-]+/g, "")),
          },
        ]
      }
    })
  }

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, cantidad: quantity } : item)))
  }

  // Función para eliminar un producto del carrito
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([])
  }

  // Función para obtener el número total de productos en el carrito
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0)
  }

  // Función para calcular el subtotal del carrito
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.precioNumerico * item.cantidad
    }, 0)
  }

  // Función para calcular los descuentos
  const getDiscounts = () => {
    let totalDiscounts = 0

    cartItems.forEach((item) => {
      if (item.descuento) {
        const percentage = Number.parseInt(item.descuento.replace("%", ""))
        totalDiscounts += item.precioNumerico * item.cantidad * (percentage / 100)
      }
    })

    return totalDiscounts
  }

  // Función para calcular el total del carrito
  const getTotal = () => {
    return getSubtotal() - getDiscounts()
  }

  // Valores y funciones que se proporcionarán a través del contexto
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
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

