// src/utils/verificarSesion.js

export const verificarSesion = async () => {
    try {
      const res = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/validate-user", {
        method: "GET",
        credentials: "include",
      })
  
      if (res.ok) {
        const user = await res.json()
        return user
      }
  
      return null
    } catch (error) {
      console.error("Error al verificar sesión:", error)
      return null
    }
  }
  