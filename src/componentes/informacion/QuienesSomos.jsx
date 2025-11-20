"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import "./QuienesSomos.css"
import misionImg from "../../assets/mision.jpg"
import visionImg from "../../assets/vision.jpg"
import comunidadImg from "../../assets/c9.jpg"

const QuienesSomos = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [modoOffline, setModoOffline] = useState(false)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/perfil-empresa", {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Error al obtener perfil")

        const data = await response.json()
        setPerfil(data)
        localStorage.setItem("perfil_empresa_cache", JSON.stringify(data))
      } catch (error) {
        console.warn("⚠️ Error o sin conexión, usando datos guardados:", error.message)
        const cache = localStorage.getItem("perfil_empresa_cache")
        if (cache) {
          setPerfil(JSON.parse(cache))
          setModoOffline(true)
        } else {
          setPerfil(null)
        }
      } finally {
        setCargando(false)
      }
    }

    cargarPerfil()
  }, [])

  if (cargando) {
    return (
      <div className={`quienes-somos-container ${theme}`}>
        <HeaderH />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando información de la empresa...</p>
        </div>
        <FooterH />
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className={`quienes-somos-container ${theme}`}>
        <HeaderH />
        <main className="error-container">
          <h2>No se pudo obtener la información de la empresa.</h2>
          <button onClick={() => window.location.reload()} className="retry-button">
            Reintentar
          </button>
        </main>
        <FooterH />
      </div>
    )
  }

  return (
    <div className={`quienes-somos-container ${theme}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="quienes-somos-content">
        {modoOffline && (
          <div className="offline-warning">
            ⚠️ Estás viendo información guardada localmente (sin conexión o sin login)
          </div>
        )}

        {/* Hero */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">¿Quiénes Somos?</h1>
            <div className="hero-slogan">
              <span className="slogan-text">{perfil.slogan || "Beatbox: Energía, Comunidad y Superación"}</span>
            </div>
          </div>
        </section>

        {/* Misión */}
        <section className="mission-section">
          <div className="section-container">
            <div className="content-split">
              <div className="text-content">
                <h2 className="section-title-modern">MISIÓN</h2>
                <p className="main-text">{perfil.mision || "Sin misión registrada"}</p>
              </div>
              <div className="image-content">
                <img src={misionImg} alt="Misión Beatbox" className="section-image" />
              </div>
            </div>
          </div>
        </section>

        {/* Visión */}
        <section className="vision-section">
          <div className="section-container">
            <div className="content-split reverse">
              <div className="image-content">
                <img src={visionImg} alt="Visión Beatbox" className="section-image" />
              </div>
              <div className="text-content">
                <h2 className="section-title-modern">VISIÓN</h2>
                <p className="main-text">{perfil.vision || "Sin visión registrada"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="cta-title">¿Listo para unirte a nuestra comunidad?</h2>
              <p className="cta-subtitle">Descubre cómo Beatbox puede transformar tu experiencia</p>
              <button className="cta-button" onClick={() => navigate("/contactanos")}>
                Contáctanos
              </button>
            </div>
            <div className="cta-image">
              <img src={comunidadImg} alt="Únete a Beatbox" className="cta-img" />
            </div>
          </div>
        </section>
      </div>

      <FooterH />
    </div>
  )
}

export default QuienesSomos
