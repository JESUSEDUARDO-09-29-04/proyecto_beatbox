"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { FaSearch, FaChevronUp, FaChevronDown, FaThumbsUp, FaThumbsDown, FaLink, FaEnvelope } from "react-icons/fa"
import { ThemeContext } from "../../context/ThemeContext"
import "./PreguntasFrecuentes.css"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"

const PreguntasFrecuentes = () => {
  // Obtener el tema actual
  const { theme } = useContext(ThemeContext)

  // Categorías de preguntas
  const categorias = [
    { id: "general", nombre: "General" },
    { id: "membresias", nombre: "Membresías" },
    { id: "instalaciones", nombre: "Instalaciones" },
    { id: "entrenamiento", nombre: "Entrenamiento" },
  ]

  // Lista de preguntas y respuestas organizadas por categoría
  const preguntasPorCategoria = {
    general: [
      {
        id: "horarios",
        pregunta: "¿Cuáles son los horarios del gimnasio?",
        respuesta:
          "Nuestro gimnasio está abierto de lunes a viernes de 5:00 AM a 10:00 PM y los fines de semana de 7:00 AM a 8:00 PM.",
        popular: true,
      },
      {
        id: "reservas",
        pregunta: "¿Necesito reservar antes de ir al gimnasio?",
        respuesta:
          "No es necesario reservar para el acceso general, pero algunas clases y entrenamientos personalizados requieren cita previa.",
      },
      {
        id: "prueba",
        pregunta: "¿Puedo probar el gimnasio antes de inscribirme?",
        respuesta:
          "Sí, ofrecemos un día de prueba gratuito para que puedas conocer nuestras instalaciones antes de inscribirte.",
        popular: true,
      },
    ],
    membresias: [
      {
        id: "planes",
        pregunta: "¿Qué planes de membresía ofrecen?",
        respuesta:
          "Ofrecemos planes mensual, trimestral y anual con tarifas especiales para estudiantes y corporativos.",
        popular: true,
      },
      {
        id: "descuentos",
        pregunta: "¿Ofrecen descuentos para grupos o familiares?",
        respuesta:
          "Sí, tenemos descuentos especiales para parejas, familias y grupos corporativos. Pregunta en recepción para más información.",
      },
      {
        id: "cancelacion",
        pregunta: "¿Puedo cancelar mi membresía en cualquier momento?",
        respuesta:
          "Las membresías mensuales pueden cancelarse con 15 días de anticipación. Las membresías trimestrales y anuales tienen políticas específicas de cancelación que puedes consultar en tu contrato.",
      },
    ],
    instalaciones: [
      {
        id: "funcional",
        pregunta: "¿El gimnasio cuenta con zona de entrenamiento funcional?",
        respuesta:
          "Sí, disponemos de un área equipada con cuerdas, cajas pliométricas, kettlebells y bandas de resistencia para entrenamiento funcional.",
      },
      {
        id: "sauna",
        pregunta: "¿El gimnasio cuenta con sauna o spa?",
        respuesta: "Sí, ofrecemos sauna y zona de relajación para nuestros socios con membresías premium.",
      },
      {
        id: "lockers",
        pregunta: "¿Ofrecen lockers o debo traer mi propio candado?",
        respuesta: "Contamos con lockers disponibles. Puedes traer tu propio candado o rentar uno en recepción.",
      },
    ],
    entrenamiento: [
      {
        id: "entrenadores",
        pregunta: "¿Ofrecen entrenadores personales?",
        respuesta:
          "Sí, contamos con entrenadores personales certificados que pueden ayudarte con planes de entrenamiento personalizados. Pregunta en recepción para más detalles.",
        popular: true,
      },
      {
        id: "principiantes",
        pregunta: "¿Puedo entrenar si nunca he ido a un gimnasio antes?",
        respuesta:
          "¡Por supuesto! Nuestros entrenadores te guiarán desde el primer día con rutinas personalizadas para principiantes.",
      },
      {
        id: "clases",
        pregunta: "¿Qué tipos de clases grupales ofrecen?",
        respuesta:
          "Ofrecemos una amplia variedad de clases grupales como yoga, pilates, spinning, zumba, HIIT, boxeo y muchas más. Consulta nuestro horario de clases para más detalles.",
      },
    ],
  }

  // Estados
  const [categoriaActiva, setCategoriaActiva] = useState("general")
  const [preguntaActiva, setPreguntaActiva] = useState(null)
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])
  const [preguntasUtiles, setPreguntasUtiles] = useState({})
  const [mostrarMensajeCopiado, setMostrarMensajeCopiado] = useState(false)
  const [preguntaCopiada, setPreguntaCopiada] = useState(null)

  // Referencias para scroll
  const faqListRef = useRef(null)
  const preguntaRefs = useRef({})

  // Efecto para manejar el hash en la URL (para enlaces directos a preguntas)
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)

      // Buscar la pregunta y su categoría
      for (const [categoria, preguntas] of Object.entries(preguntasPorCategoria)) {
        const preguntaEncontrada = preguntas.find((p) => p.id === id)
        if (preguntaEncontrada) {
          setCategoriaActiva(categoria)
          setTimeout(() => {
            setPreguntaActiva(id)
            if (preguntaRefs.current[id]) {
              preguntaRefs.current[id].scrollIntoView({ behavior: "smooth", block: "center" })
            }
          }, 100)
          break
        }
      }
    }
  }, [])

  // Función para manejar el clic en una pregunta
  const toggleRespuesta = (id) => {
    setPreguntaActiva(preguntaActiva === id ? null : id)
  }

  // Función para cambiar de categoría
  const cambiarCategoria = (categoria) => {
    setCategoriaActiva(categoria)
    setPreguntaActiva(null)
    setTerminoBusqueda("")
    setResultadosBusqueda([])

    // Scroll suave al inicio de la lista
    if (faqListRef.current) {
      faqListRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Función para buscar preguntas
  const buscarPreguntas = (e) => {
    e.preventDefault()
    if (!terminoBusqueda.trim()) {
      setResultadosBusqueda([])
      return
    }

    const termino = terminoBusqueda.toLowerCase()
    const resultados = []

    // Buscar en todas las categorías
    Object.entries(preguntasPorCategoria).forEach(([categoria, preguntas]) => {
      preguntas.forEach((pregunta) => {
        if (pregunta.pregunta.toLowerCase().includes(termino) || pregunta.respuesta.toLowerCase().includes(termino)) {
          resultados.push({
            ...pregunta,
            categoria,
          })
        }
      })
    })

    setResultadosBusqueda(resultados)
    setPreguntaActiva(null)
  }

  // Función para marcar si una pregunta fue útil
  const marcarUtil = (id, util) => {
    setPreguntasUtiles((prev) => ({
      ...prev,
      [id]: util,
    }))

    // Aquí podrías enviar esta información a tu backend
    console.log(`Pregunta ${id} marcada como ${util ? "útil" : "no útil"}`)
  }

  // Función para copiar enlace a una pregunta
  const copiarEnlace = (id) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url).then(() => {
      setPreguntaCopiada(id)
      setMostrarMensajeCopiado(true)
      setTimeout(() => {
        setMostrarMensajeCopiado(false)
      }, 2000)
    })
  }

  // Obtener preguntas populares de todas las categorías
  const preguntasPopulares = Object.values(preguntasPorCategoria)
    .flat()
    .filter((pregunta) => pregunta.popular)
    .slice(0, 3)

  // Renderizar preguntas según el estado actual (búsqueda o categoría)
  const preguntasAMostrar = resultadosBusqueda.length > 0 ? resultadosBusqueda : preguntasPorCategoria[categoriaActiva]

  return (
    <div className={`faq-page ${theme === "dark" ? "dark" : ""}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="faq-container">
        <div className="faq-hero">
          <h1>Preguntas Frecuentes</h1>
          <p>Encuentra respuestas a las preguntas más comunes sobre nuestro gimnasio</p>

          <form className="faq-search-form" onSubmit={buscarPreguntas}>
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Buscar preguntas..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              <button type="submit">
                <FaSearch />
              </button>
            </div>
          </form>
        </div>

        {resultadosBusqueda.length === 0 && !terminoBusqueda && (
          <div className="faq-popular-section">
            <h2>Preguntas más populares</h2>
            <div className="faq-popular-grid">
              {preguntasPopulares.map((pregunta) => (
                <div
                  key={pregunta.id}
                  className="faq-popular-item"
                  onClick={() => {
                    // Encontrar la categoría de esta pregunta
                    for (const [cat, preguntas] of Object.entries(preguntasPorCategoria)) {
                      if (preguntas.some((p) => p.id === pregunta.id)) {
                        setCategoriaActiva(cat)
                        setTimeout(() => {
                          setPreguntaActiva(pregunta.id)
                          if (preguntaRefs.current[pregunta.id]) {
                            preguntaRefs.current[pregunta.id].scrollIntoView({ behavior: "smooth" })
                          }
                        }, 100)
                        break
                      }
                    }
                  }}
                >
                  <h3>{pregunta.pregunta}</h3>
                  <div className="popular-item-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="faq-main-content" ref={faqListRef}>
          {resultadosBusqueda.length > 0 ? (
            <div className="faq-search-results">
              <h2>Resultados de búsqueda para "{terminoBusqueda}"</h2>
              <p>
                {resultadosBusqueda.length}{" "}
                {resultadosBusqueda.length === 1 ? "resultado encontrado" : "resultados encontrados"}
              </p>
              <button
                className="btn-clear-search"
                onClick={() => {
                  setTerminoBusqueda("")
                  setResultadosBusqueda([])
                }}
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="faq-categories">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  className={`faq-category-btn ${categoriaActiva === categoria.id ? "active" : ""}`}
                  onClick={() => cambiarCategoria(categoria.id)}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          )}

          <div className="faq-list">
            {preguntasAMostrar.map((pregunta) => (
              <div
                key={pregunta.id}
                className={`faq-item ${preguntaActiva === pregunta.id ? "active" : ""}`}
                ref={(el) => (preguntaRefs.current[pregunta.id] = el)}
                id={pregunta.id}
              >
                <div className="faq-question" onClick={() => toggleRespuesta(pregunta.id)}>
                  <span>{pregunta.pregunta}</span>
                  <span className="arrow">{preguntaActiva === pregunta.id ? <FaChevronUp /> : <FaChevronDown />}</span>
                </div>

                {preguntaActiva === pregunta.id && (
                  <div className="faq-answer-container">
                    <div className="faq-answer">
                      <p>{pregunta.respuesta}</p>
                    </div>

                    <div className="faq-actions">
                      <div className="faq-utility">
                        <span>¿Te ha sido útil esta respuesta?</span>
                        <div className="utility-buttons">
                          <button
                            className={`btn-utility ${preguntasUtiles[pregunta.id] === true ? "active" : ""}`}
                            onClick={() => marcarUtil(pregunta.id, true)}
                            aria-label="Marcar como útil"
                          >
                            <FaThumbsUp />
                          </button>
                          <button
                            className={`btn-utility ${preguntasUtiles[pregunta.id] === false ? "active" : ""}`}
                            onClick={() => marcarUtil(pregunta.id, false)}
                            aria-label="Marcar como no útil"
                          >
                            <FaThumbsDown />
                          </button>
                        </div>
                      </div>

                      <button
                        className="btn-copy-link"
                        onClick={() => copiarEnlace(pregunta.id)}
                        aria-label="Copiar enlace a esta pregunta"
                      >
                        <FaLink />
                        <span
                          className={`tooltip ${mostrarMensajeCopiado && preguntaCopiada === pregunta.id ? "visible" : ""}`}
                        >
                          ¡Enlace copiado!
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="faq-contact-section">
          <h2>¿No encontraste lo que buscabas?</h2>
          <p>Estamos aquí para ayudarte. Contáctanos directamente y responderemos a tus preguntas.</p>
          <a href="/contactanos" className="btn-contact"> Contáctanos
          </a>
        </div>
      </div>

      <FooterH />
    </div>
  )
}

export default PreguntasFrecuentes

