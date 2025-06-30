"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import "./QuienesSomos.css"

const QuienesSomos = () => {
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)

  return (
    <div className={`quienes-somos-container ${theme}`}>
      <HeaderH />

      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="quienes-somos-content">
        <div className="main-content">
          <h1 className="page-title">¿Quiénes Somos?</h1>

          <div className="slogan">
            <span className="emoji">💪</span> Beatbox: Energía, Comunidad y Superación <span className="emoji">💥</span>
          </div>

          <div className="section">
            <div className="section-header">
              <div className="icon-circle">
                <span className="section-icon">⊙</span>
              </div>
              <h2 className="section-title">Misión</h2>
            </div>
            <div className="section-content">
              <p>
                En Beatbox, nuestra misión es transformar la manera en que las personas experimentan el ejercicio,
                ofreciendo entrenamientos grupales de alta energía que combinan dinamismo, motivación y comunidad. Nos
                enfocamos en brindar experiencias únicas donde cada persona, sin importar su nivel de condición física,
                se sienta inspirada a superar sus límites y alcanzar sus objetivos de bienestar físico y mental.
              </p>
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <div className="icon-circle">
                <span className="section-icon">💡</span>
              </div>
              <h2 className="section-title">Visión</h2>
            </div>
            <div className="section-content">
              <p>
                Nuestra visión es convertirnos en la sala de entrenamiento grupal de referencia, siendo reconocidos por
                la calidad de nuestras sesiones, la innovación en nuestras metodologías y el impacto positivo en la vida
                de nuestros miembros. Aspiramos a ser mucho más que un espacio de ejercicio; buscamos construir una
                comunidad activa y unida, donde el bienestar y la superación personal sean pilares fundamentales.
              </p>
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <div className="icon-circle">
                <span className="section-icon">❤️</span>
              </div>
              <h2 className="section-title">Valores</h2>
            </div>
            <div className="section-content valores-grid">
              <div className="valor-item">
                <div className="valor-header">
                  <span className="valor-icon">❤️</span>
                  <h3>Pasión por el Movimiento:</h3>
                </div>
                <p>Creemos en el poder del ejercicio como herramienta de cambio físico y emocional.</p>
              </div>

              <div className="valor-item">
                <div className="valor-header">
                  <span className="valor-icon">👥</span>
                  <h3>Comunidad y Conexión:</h3>
                </div>
                <p>Fomentamos un ambiente de apoyo donde cada persona se sienta valorada y motivada.</p>
              </div>

              <div className="valor-item">
                <div className="valor-header">
                  <span className="valor-icon">⭐</span>
                  <h3>Compromiso con la Excelencia:</h3>
                </div>
                <p>Buscamos la mejora continua en la calidad de nuestras sesiones y atención.</p>
              </div>

              <div className="valor-item">
                <div className="valor-header">
                  <span className="valor-icon">💡</span>
                  <h3>Innovación Constante:</h3>
                </div>
                <p>Mantenemos nuestras rutinas actualizadas con las últimas tendencias.</p>
              </div>

              <div className="valor-item">
                <div className="valor-header">
                  <span className="valor-icon">💪</span>
                  <h3>Disciplina y Superación:</h3>
                </div>
                <p>Promovemos la constancia y el esfuerzo personal para lograr resultados duraderos.</p>
              </div>

              <div className="valor-item">
                <div className="valor-header">
                  <span className="valor-icon">🍃</span>
                  <h3>Bienestar Integral:</h3>
                </div>
                <p>Promovemos hábitos positivos que impacten en el bienestar general.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="cta-box">
            <h2>¿Listo para unirte a nuestra comunidad?</h2>
            <button className="cta-button" onClick={() => navigate("/contactanos")}>
              Contáctanos
            </button>
          </div>
        </div>
      </div>

      <FooterH />
    </div>
  )
}

export default QuienesSomos

