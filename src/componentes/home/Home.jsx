"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import "./Home.css"
import c1 from "../../assets/c4.jpg"
import c2 from "../../assets/c5.jpg"
import c3 from "../../assets/c6.jpg"
import cert1 from "../../assets/cert1.jpeg"
import cert2 from "../../assets/cert2.jpeg"
import cert3 from "../../assets/cert3.jpeg"
import cert4 from "../../assets/cert4.jpeg"
import cert5 from "../../assets/cert5.jpeg"
import cert6 from "../../assets/cert6.jpeg"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)

  // Carrusel mejorado de Home2
  const slides = [
    {
      image: c1,
      title: "Bienvenidos a Beatbox Gym",
      subtitle: "El mejor lugar para mejorar tu salud y bienestar",
      cta: "Conócenos",
    },
    {
      image: c2,
      title: "Los mejores productos",
      subtitle: "Explora nuestra tienda y equipa tu entrenamiento",
      cta: "Ver Tienda", // ← SE QUEDA IGUAL
    },
    {
      image: c3,
      title: "Transforma tu Vida",
      subtitle: "Únete a nuestra comunidad y alcanza tus metas",
      cta: "Suscríbete",
    },
  ]

  // Auto-cambio del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  // Funciones del carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }


  // Certificados mejorados de Home2
  const certificados = [
    {
      id: 1,
      title: "NAFC Pro Instructor",
      organization: "National Academy of Fitness Certification",
      year: "2021",
      image: cert1,
      type: "Instructor Profesional",
    },
    {
      id: 2,
      title: "Functional Training Level 1",
      organization: "International Fitness Association",
      year: "2019",
      image: cert2,
      type: "Entrenamiento Funcional",
    },
    {
      id: 3,
      title: "Power Rebounder SGT",
      organization: "Strength Group Training",
      year: "2020",
      image: cert3,
      type: "Entrenamiento de Fuerza",
    },
    {
      id: 4,
      title: "Pro-Power Fitness Series",
      organization: "Professional Fitness Certification",
      year: "2022",
      image: cert4,
      type: "Fitness Profesional",
    },
    {
      id: 5,
      title: "Boxercise Official",
      organization: "International Boxing Fitness",
      year: "2021",
      image: cert5,
      type: "Boxeo Fitness",
    },
    {
      id: 6,
      title: "Martial Arts Certification",
      organization: "World Martial Arts Federation",
      year: "2020",
      image: cert6,
      type: "Artes Marciales",
    },
  ]

  // Membresías mejoradas de Home2
  const membresias = [
    {
      id: 1,
      tipo: "Semanal",
      precio: "199",
      periodo: "/semana",
      destacado: false,
      caracteristicas: [
        "Acceso a sala de pesas",
        "Horario limitado (8am - 5pm)",
        "2 clases grupales",
        "Casillero estándar",
        "Asesoría básica",
      ],
    },
    {
      id: 2,
      tipo: "Mensual",
      precio: "599",
      periodo: "/mes",
      destacado: true,
      caracteristicas: [
        "Acceso ilimitado 24/7",
        "Todas las clases grupales",
        "1 sesión con entrenador personal",
        "Casillero premium",
        "Acceso a sauna y spa",
      ],
    },
  ]

  // Testimonios
  const testimonios = [
    {
      name: "Miguel Sánchez",
      role: "Miembro desde 2021",
      avatar: "MS",
      testimonial:
        "Desde que me uní a Beatbox Gym, mi vida ha cambiado completamente. He perdido 15 kilos y me siento con más energía que nunca.",
    },
    {
      name: "Laura Rodríguez",
      role: "Miembro desde 2022",
      avatar: "LR",
      testimonial:
        "Los entrenadores son increíbles, siempre atentos y motivadores. Las instalaciones están impecables y el ambiente es muy amigable.",
    },
    {
      name: "Javier Martínez",
      role: "Miembro desde 2020",
      avatar: "JM",
      testimonial:
        "Las clases de CrossFit son desafiantes pero muy divertidas. He conocido personas increíbles y he superado mis límites.",
    },
  ]

  // Función para manejar la selección de membresía
const handleSeleccionarMembresia = (id) => {
  navigate(`/suscripcion?plan=${id}`)
}


  return (
    <div className={`contenedor ${theme === "dark" ? "dark" : ""}`}>
      {/* Navbar */}
      <HeaderH />

      {/* Contenido principal */}
      <main className="contenido-principal">
        {/* Carrusel mejorado de Home2 */}
        <section className="carousel-section">
          <div
            className="carousel-slide active"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            >
            <div className="carousel-overlay" />
            <div className="carousel-content">
                <h1 className="carousel-title">{slides[currentSlide].title}</h1>
                <p className="carousel-subtitle">{slides[currentSlide].subtitle}</p>
                <button
                className="btn btn-cta"
                onClick={() => {
                    const cta = slides[currentSlide].cta
                    if (cta === "Ver Tienda") {
                    navigate("/tienda")
                    } else if (cta === "Suscríbete") {
                    navigate("/suscripcion")
                    } else {
                    navigate("/quienes_somos")
                    }
                }}
                >
                {slides[currentSlide].cta}
                </button>
            </div>
            </div>
          {/* Controles del carrusel */}
          <button className="carousel-control prev" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="carousel-control next" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>

          {/* Indicadores */}
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* Sección de Certificados mejorada de Home2 */}
        <section className="certificates-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <i className="fas fa-award section-icon"></i>
              <h2 className="section-title">Certificados del Establecimiento</h2>
            </div>
            <div className="section-divider"></div>
            <p className="section-description">
              Nuestros instructores cuentan con las certificaciones más prestigiosas del sector fitness
            </p>
          </div>

          <div className="certificates-grid">
            {certificados.map((cert) => (
              <div key={cert.id} className="certificate-card">
                <div className="certificate-image">
                  <img src={cert.image || "/placeholder.svg"} alt={cert.title} />
                  <div className="certificate-badge">{cert.year}</div>
                </div>
                <div className="certificate-content">
                  <h3 className="certificate-title">{cert.title}</h3>
                  <p className="certificate-org">{cert.organization}</p>
                  <div className="certificate-footer">
                    <span className="certificate-type">{cert.type}</span>
                    <div className="certificate-verified">
                      <i className="fas fa-award"></i>
                      <span>Certificado</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Membresías mejorada de Home2 */}
        <section className="memberships-section">
          <div className="section-header">
            <h2 className="section-title">Nuestras Membresías</h2>
            <div className="section-divider"></div>
            <p className="section-description">Elige el plan que mejor se adapte a tu estilo de vida</p>
          </div>

          <div className="memberships-grid">
            {membresias.map((membresia) => (
              <div key={membresia.id} className={`membership-card ${membresia.destacado ? "featured" : ""}`}>
                {membresia.destacado && <div className="membership-badge">Popular</div>}

                <div className="membership-header">
                  <h3 className="membership-title">{membresia.tipo}</h3>
                  <div className="membership-price">
                    <span className="price">${membresia.precio}</span>
                    <span className="period">{membresia.periodo}</span>
                  </div>
                </div>

                <div className="membership-content">
                  <ul className="membership-features">
                    {membresia.caracteristicas.map((caracteristica, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i>
                        {caracteristica}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`btn btn-membership ${membresia.destacado ? "featured" : ""}`}
                   onClick={() => handleSeleccionarMembresia(membresia.id)}

                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Testimonios */}
        <section className="testimonios-section">
          <div className="section-header">
            <h2>Lo que dicen nuestros clientes</h2>
            <div className="section-divider"></div>
          </div>

          <div className="testimonios-container">
            {testimonios.map((testimonial, index) => (
              <div key={index} className="testimonio-card">
                <div className="testimonio-content">
                  <p>"{testimonial.testimonial}"</p>
                </div>
                <div className="testimonio-autor">
                  <div className="testimonio-avatar">{testimonial.avatar}</div>
                  <div className="testimonio-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Contacto Rápido */}
        <section className="contacto-rapido-section">
          <div className="contacto-content">
            <h2>¿Listo para comenzar tu transformación?</h2>
            <p>Únete a nuestra comunidad y comienza a ver resultados desde el primer día.</p>
            <div className="contacto-buttons">
              <button className="btn btn-contacto" onClick={() => navigate("/contactanos")}>
                Contáctanos
              </button>
              <button className="btn btn-contacto" onClick={() => navigate("/suscripcion")}>
                Suscríbete
              </button>
            </div>
          </div>
        </section>
      </main>

      <FooterH />
    </div>
  )
}

export default Home