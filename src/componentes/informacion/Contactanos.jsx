"use client";

import { useState, useContext, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaPaperPlane,
  FaBuilding,
} from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import "./Contactanos.css";
import HeaderH from "../HeaderH";
import FooterH from "../FooterH";
import Breadcrumbs from "../Breadcrumbs";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Contactanos = () => {
  const { theme } = useContext(ThemeContext);

  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  // === GEOLOCALIZACIÓN ===
  const [posUsuario, setPosUsuario] = useState(null);
  const [distancia, setDistancia] = useState(null);
  const [ubicacionError, setUbicacionError] = useState(null);

  // === INFO EMPRESA ===
  const [infoEmpresa, setInfoEmpresa] = useState(null);
  const [cargandoInfo, setCargandoInfo] = useState(true);

  // Coordenadas fijas del gimnasio BeatBox
  const latGimnasio = 21.14538;
  const lonGimnasio = -98.42301;

  // Icono personalizado
  const icon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  });

  // Calcular distancia
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  // Obtener ubicación del usuario
 useEffect(() => {
  if (!("geolocation" in navigator)) {
    setUbicacionError("Tu navegador no soporta geolocalización.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setPosUsuario(coords);

      const dist = calcularDistancia(coords.lat, coords.lng, latGimnasio, lonGimnasio);
      setDistancia(dist);
    },
    (error) => {
      let msg = "";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          msg = "Debes permitir el acceso a tu ubicación para calcular la distancia.";
          break;
        case error.POSITION_UNAVAILABLE:
          msg = "No se pudo determinar tu ubicación actual.";
          break;
        case error.TIMEOUT:
          msg = "La solicitud de ubicación tardó demasiado.";
          break;
        default:
          msg = "Ocurrió un error al obtener tu ubicación.";
      }
      setUbicacionError(msg);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}, []);

  // Obtener información del backend o caché
  useEffect(() => {
    const obtenerInfo = async () => {
      try {
        setCargandoInfo(true);
        const res = await fetch("/empresa");
        if (!res.ok) throw new Error("Error al obtener información de contacto");
        const data = await res.json();
        setInfoEmpresa(data);
        localStorage.setItem("info_empresa_cache", JSON.stringify(data));
      } catch (error) {
        console.warn("Cargando datos de contacto desde caché local...");
        const cache = localStorage.getItem("info_empresa_cache");
        if (cache) {
          setInfoEmpresa(JSON.parse(cache));
        }
      } finally {
        setCargandoInfo(false);
      }
    };
    obtenerInfo();
  }, []);

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    setEnviando(true);

    setTimeout(() => {
      setEnviando(false);
      setMensajeEnviado(true);
      setFormulario({ nombre: "", correo: "", asunto: "", mensaje: "" });
      setTimeout(() => setMensajeEnviado(false), 5000);
    }, 1500);
  };

  return (
    <div className={`contacto-container ${theme}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <div className="contacto-wrapper">
        {/* === INFORMACIÓN DE CONTACTO === */}
        <div className="contacto-info">
          <h2 className="contacto-titulo">Información de Contacto</h2>
          {cargandoInfo ? (
            <p>Cargando información...</p>
          ) : (
            <>
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="info-content">
                    <h3>Dirección</h3>
                    <p>
                      {infoEmpresa?.direccion ||
                        "Prof. Toribio Reyes 33A, Huejutla, Hidalgo, 43000"}
                    </p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <FaUser />
                  </div>
                  <div className="info-content">
                    <h3>Contacto</h3>
                    <p>{infoEmpresa?.contacto || "Brenda Baltazar Santiago"}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-content">
                    <h3>Correo Electrónico</h3>
                    <a
                      href={`mailto:${infoEmpresa?.correo || "Brendabalt@hotmail.com"}`}
                    >
                      {infoEmpresa?.correo || "Brendabalt@hotmail.com"}
                    </a>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <FaPhone />
                  </div>
                  <div className="info-content">
                    <h3>Teléfono</h3>
                    <a href={`tel:${infoEmpresa?.telefono || "+525530478516"}`}>
                      {infoEmpresa?.telefono || "5530478516"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="horario-atencion">
                <div className="info-icon">
                  <FaBuilding />
                </div>
                <div className="info-content">
                  <h3>Horario de Atención</h3>
                  <p>
                    {infoEmpresa?.horario ||
                      "Lunes a Viernes: 8:00 AM - 8:00 PM"}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="distancia-usuario">
            <h3>Tu ubicación</h3>
            {distancia ? (
              <p>
                📍 Estás a <strong>{distancia} km</strong> de BeatBox 
              </p>
            ) : (
              <p>{ubicacionError || "Obteniendo tu ubicación..."}</p>
            )}
          </div>
        </div>

        {/* === MAPA INTERACTIVO + FORMULARIO === */}
        <div className="contacto-mapa-form">
          <div className="contacto-mapa">
            {posUsuario ? (
              <MapContainer
                center={{ lat: latGimnasio, lng: lonGimnasio }}
                zoom={14}
                style={{ height: "400px", width: "100%", borderRadius: "1rem" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={{ lat: latGimnasio, lng: lonGimnasio }} icon={icon}>
                  <Popup>🏋️‍♂️ BeatBox</Popup>
                </Marker>
                <Marker position={posUsuario} icon={icon}>
                  <Popup>📱 Tú estás aquí</Popup>
                </Marker>
                <Polyline
                  positions={[
                    { lat: latGimnasio, lng: lonGimnasio },
                    posUsuario,
                  ]}
                  color="blue"
                />
              </MapContainer>
            ) : (
              <p>🛰️ Esperando tu ubicación...</p>
            )}
          </div>

          {/* === FORMULARIO === */}
          <div className="contacto-form">
            <h2 className="contacto-titulo">Envíanos un Mensaje</h2>
            {mensajeEnviado && (
              <div className="mensaje-exito">
                <FaEnvelope className="icono-exito" />
                <p>
                  ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo
                  pronto.
                </p>
              </div>
            )}
            <form onSubmit={manejarEnvio}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">
                    <FaUser className="icono" /> <span>Nombre</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="correo">
                    <FaEnvelope className="icono" /> <span>Correo</span>
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formulario.correo}
                    onChange={manejarCambio}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="asunto">
                  <FaPaperPlane className="icono" /> <span>Asunto</span>
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formulario.asunto}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">
                  <span>Mensaje</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="5"
                  value={formulario.mensaje}
                  onChange={manejarCambio}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-enviar" disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <FooterH />
    </div>
  );
};

export default Contactanos;
