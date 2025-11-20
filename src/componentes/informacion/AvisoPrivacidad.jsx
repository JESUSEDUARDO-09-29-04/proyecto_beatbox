"use client";

import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import FooterH from "../FooterH";
import HeaderH from "../HeaderH";
import Breadcrumbs from "../Breadcrumbs";
import "./AvisoPrivacidad.css";

const AvisoPrivacidad = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [modoOffline, setModoOffline] = useState(false);

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    setCargando(true);
    setError("");
    setModoOffline(false);

    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/documentos/publicos", {
        method: "GET",
        credentials: "include",
      });

      // Si el backend requiere token, puede responder 401, lo manejamos:
      if (response.status === 401) {
        console.warn("⚠️ No autorizado — usando versión guardada local");
        const cache = localStorage.getItem("documentos_legales_cache");
        if (cache) {
          setDocumentos(JSON.parse(cache));
          setModoOffline(true);
          return;
        } else {
          throw new Error("No hay documentos guardados localmente.");
        }
      }

      if (!response.ok) throw new Error("Error al cargar documentos del servidor.");

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const vigentes = data.filter((d) => d.vigente && !d.eliminado);
        setDocumentos(vigentes);
        localStorage.setItem("documentos_legales_cache", JSON.stringify(vigentes));
      } else {
        throw new Error("La API no devolvió documentos válidos.");
      }
    } catch (error) {
      console.warn("⚠️ Error o sin conexión. Revisando caché local:", error.message);

      const cache = localStorage.getItem("documentos_legales_cache");
      if (cache) {
        setDocumentos(JSON.parse(cache));
        setModoOffline(true);
      } else {
        setError("No se pudieron cargar los documentos ni hay datos guardados.");
      }
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible";
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const obtener = (tipo) =>
    documentos.find((d) => d.tipo.toLowerCase() === tipo.toLowerCase());

  if (cargando) {
    return (
      <div className={`aviso-privacidad-container ${theme}`}>
        <HeaderH />
        <div className="breadcrumb-container">
          <Breadcrumbs />
        </div>
        <main className="privacidad-contenedor">
          <h2>Cargando documentos legales...</h2>
        </main>
        <FooterH />
      </div>
    );
  }

  if (error && documentos.length === 0) {
    return (
      <div className={`aviso-privacidad-container ${theme}`}>
        <HeaderH />
        <div className="breadcrumb-container">
          <Breadcrumbs />
        </div>
        <main className="privacidad-contenedor">
          <div className="error-container">
            <h2>Error al cargar documentos</h2>
            <p>{error}</p>
            <button className="retry-button" onClick={cargarDocumentos}>
              Reintentar
            </button>
          </div>
        </main>
        <FooterH />
      </div>
    );
  }

  const priv = obtener("Políticas de privacidad");
  const term = obtener("Términos y condiciones");
  const desl = obtener("Deslinde");

  return (
    <div className={`aviso-privacidad-container ${theme}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <main className="privacidad-contenedor">
        <h1 className="main-title">Documentos Legales</h1>
        <p className="subtitle">
          Consulta nuestros documentos regulatorios y políticas actualizadas
        </p>

        {modoOffline && (
          <div className="offline-warning">
            ⚠️ Estás viendo una versión guardada (sin conexión o sin login)
          </div>
        )}

        {documentos.map((doc) => (
          <div key={doc.id} className="documento-item">
            <div className="documento-header">
              <h2>{doc.tipo}</h2>
              <div className="documento-meta">
                <span className="version">Versión {doc.version}</span>
                <span className="fecha">
                  Última actualización: {formatearFecha(doc.updatedAt)}
                </span>
              </div>
            </div>
            <div className="documento-content">
              <div className="content-text">{doc.descripcion}</div>
            </div>
          </div>
        ))}

        {documentos.length === 0 && (
          <div className="no-documentos">
            <h3>No hay documentos disponibles</h3>
            <p>Los documentos legales estarán disponibles próximamente.</p>
          </div>
        )}

        <div className="contact-section">
          <p>¿Tienes preguntas sobre nuestros documentos legales?</p>
          <button className="contact-button" onClick={() => navigate("/contactanos")}>
            Contáctanos
          </button>
        </div>
      </main>

      <FooterH />
    </div>
  );
};

export default AvisoPrivacidad;
