"use client"

import { createContext, useContext, useState, useEffect } from "react"

const EmpresaContext = createContext()

export const useEmpresa = () => {
  const context = useContext(EmpresaContext)
  if (!context) {
    throw new Error("useEmpresa debe ser usado dentro de EmpresaProvider")
  }
  return context
}

export const EmpresaProvider = ({ children }) => {
  const [logoVigente, setLogoVigente] = useState(null)
  const [perfilEmpresa, setPerfilEmpresa] = useState({
    mision: "",
    vision: "",
    eslogan: "",
  })
  const [cargando, setCargando] = useState(true)

  const fetchLogoVigente = async () => {
    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/logos/vigente", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setLogoVigente(data.link)
      }
    } catch (error) {
      console.error("Error al cargar el logo vigente:", error)
    }
  }

  const fetchPerfilEmpresa = async () => {
    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/perfil-empresa", {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setPerfilEmpresa({
          mision: data.mision || "",
          vision: data.vision || "",
          eslogan: data.eslogan || "",
        })
      }
    } catch (error) {
      console.error("Error al cargar el perfil de la empresa:", error)
    }
  }

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true)
      await Promise.all([fetchLogoVigente(), fetchPerfilEmpresa()])
      setCargando(false)
    }

    cargarDatos()
  }, [])

  const actualizarLogo = (nuevoLogo) => {
    setLogoVigente(nuevoLogo)
  }

  const actualizarPerfil = (nuevoPerfil) => {
    setPerfilEmpresa((prev) => ({ ...prev, ...nuevoPerfil }))
  }

  const value = {
    logoVigente,
    perfilEmpresa,
    cargando,
    actualizarLogo,
    actualizarPerfil,
    refrescarDatos: () => {
      fetchLogoVigente()
      fetchPerfilEmpresa()
    },
  }

  return <EmpresaContext.Provider value={value}>{children}</EmpresaContext.Provider>
}
