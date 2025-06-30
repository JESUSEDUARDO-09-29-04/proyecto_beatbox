"use client"

import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { FaSun, FaMoon } from "react-icons/fa"
import "./ThemeToggle.css"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
    >
      {theme === "light" ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
    </button>
  )
}

export default ThemeToggle

