"use client"

import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Intentar obtener el tema guardado en localStorage, o usar 'light' por defecto
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("app-theme")
      return savedTheme || "light"
    }
    return "light"
  })

  // Efecto para aplicar la clase 'dark' al elemento html cuando el tema cambia
  useEffect(() => {
    const root = window.document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Guardar el tema en localStorage
    localStorage.setItem("app-theme", theme)
  }, [theme])

  // Función para alternar entre temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  // Función para establecer un tema específico
  const setThemeMode = (mode) => {
    setTheme(mode)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode }}>{children}</ThemeContext.Provider>
}

export default ThemeProvider

