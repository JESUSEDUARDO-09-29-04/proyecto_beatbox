"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import { useEmpresa } from "../../context/EmpresaContext"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import "./QuienesSomos.css"

const QuienesSomos = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)
  const { perfilEmpresa, cargando } = useEmpresa()

  // Debug para verificar los datos
  console.log("Datos del perfil empresa:", perfilEmpresa)
  console.log("Misión:", perfilEmpresa.mision)
  console.log("Visión:", perfilEmpresa.vision)

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

  return (
    <div className={`quienes-somos-container ${theme}`}>
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="quienes-somos-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">¿Quiénes Somos?</h1>
            <div className="hero-slogan">
              <span className="slogan-text">Beatbox: Energía, Comunidad y Superación</span>
            </div>
          </div>
        </section>

        {/* Misión Section - Texto primero, imagen después */}
        <section className="mission-section">
          <div className="section-container">
            <div className="content-split">
              <div className="text-content">
                <div className="section-header-modern">
                  <h2 className="section-title-modern">MISIÓN</h2>
                </div>
                <div className="text-block">
                  <p className="main-text">
                    {perfilEmpresa.mision ||
                      `En Beatbox, nuestra misión es transformar la manera en que las personas experimentan el ejercicio, ofreciendo entrenamientos grupales de alta energía que combinan dinamismo, motivación y comunidad. Nos enfocamos en brindar experiencias únicas donde cada persona, sin importar su nivel de condición física, se sienta inspirada a superar sus límites y alcanzar sus objetivos de bienestar físico y mental.`}
                  </p>
                </div>
              </div>
              <div className="image-content">
                <div className="image-placeholder mission-image">
                  <img
                    src="\src\assets\mision.jpg"
                    alt="Misión Beatbox"
                    className="section-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visión Section - Imagen primero, texto después */}
        <section className="vision-section">
          <div className="section-container">
            <div className="content-split reverse">
              <div className="image-content">
                <div className="image-placeholder vision-image">
                  <img
                    src="\src\assets\vision.jpg"
                    alt="Visión Beatbox"
                    className="section-image"
                  />
                </div>
              </div>
              <div className="text-content">
                <div className="section-header-modern">
                  <h2 className="section-title-modern">VISIÓN</h2>
                </div>
                <div className="text-block">
                  <p className="main-text">
                    {perfilEmpresa.vision ||
                      `Nuestra visión es convertirnos en la sala de entrenamiento grupal de referencia, siendo reconocidos por la calidad de nuestras sesiones, la innovación en nuestras metodologías y el impacto positivo en la vida de nuestros miembros. Aspiramos a ser mucho más que un espacio de ejercicio; buscamos construir una comunidad activa y unida, donde el bienestar y la superación personal sean pilares fundamentales.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valores Section */}
        <section className="values-section">
          <div className="section-container">
            <div className="values-header">
              <div className="section-header-modern centered">
                <h2 className="section-title-modern">VALORES</h2>
              </div>
              <p className="values-subtitle">Los principios que guían cada una de nuestras acciones</p>
            </div>

            <div className="values-grid">
              <div className="value-card">
                <h3 className="itle">Pasión por el Movimiento</h3>
                <p className="value-description">
                  Creemos en el poder del ejercicio como herramienta de cambio físico y emocional.
                </p>
              </div>

              <div className="value-card">
                <h3 className="value-title">Comunidad y Conexión</h3>
                <p className="value-description">
                  Fomentamos un ambiente de apoyo donde cada persona se sienta valorada y motivada.
                </p>
              </div>

              <div className="value-card">
                <h3 className="value-title">Compromiso con la Excelencia</h3>
                <p className="value-description">
                  Buscamos la mejora continua en la calidad de nuestras sesiones y atención.
                </p>
              </div>

              <div className="value-card">
                <h3 className="value-title">Innovación Constante</h3>
                <p className="value-description">
                  Mantenemos nuestras rutinas actualizadas con las últimas tendencias.
                </p>
              </div>

              <div className="value-card">
                <h3 className="value-title">Disciplina y Superación</h3>
                <p className="value-description">
                  Promovemos la constancia y el esfuerzo personal para lograr resultados duraderos.
                </p>
              </div>

              <div className="value-card">
                <h3 className="value-title">Bienestar Integral</h3>
                <p className="value-description">Promovemos hábitos positivos que impacten en el bienestar general.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="cta-title">¿Listo para unirte a nuestra comunidad?</h2>
              <p className="cta-subtitle">Descubre cómo Beatbox puede transformar tu experiencia de ejercicio</p>
              <button className="cta-button" onClick={() => navigate("/contactanos")}>
                <span>Contáctanos</span>
                <span className="button-arrow"></span>
              </button>
            </div>
            <div className="cta-image">
              <img
                src="\src\assets\c9.jpg"
                alt="Únete a Beatbox"
                className="cta-img"
              />
            </div>
          </div>
        </section>
      </div>

      <FooterH />
    </div>
  )
}

export default QuienesSomos
