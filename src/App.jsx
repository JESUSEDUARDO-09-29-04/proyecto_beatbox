"use client"

// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./componentes/home/Home"
import InicioSesion from "./componentes/inicio_sesion/InicioSesion"
import Registro from "./componentes/registro/Registro"
import RecuperarContrasena from "./componentes/recuperar_contrasena/ReCorreo"
import RecuperarContrasenaPS from "./componentes/recuperar_contrasena/RePregunta"
import ResponderPreguntaSecreta from "./componentes/recuperar_contrasena/ResponderPreguntaSecreta"
import RecuperarContrasenaOpciones from "./componentes/recuperar_contrasena/Opciones"
import VerificarCorreo from "./componentes/verificar_correo/VerificarCorreo"
import CambiarContrasena from "./componentes/cambiar_contraseña/CambiarContrasena"
import { ThemeProvider } from "./context/ThemeContext" // Asegúrate que la ruta sea correcta
import DocumentosRegulatoriosAdmin from "./componentes/mod_admin/documentos_admin/DocumentosRegulatoriosAdmin"
import EmpresaAdmin from "./componentes/mod_admin/empresa_admin/EmpresaAdmin"
import IncidentesAdmin from "./componentes/mod_admin/incidentes_admin/IncidentesAdmin"
import RedesSocialesAdmin from "./componentes/mod_admin/redes_sociales_admin/RedesSocialesAdmin"
import UsuariosAdmin from "./componentes/mod_admin/usuarios_admin/UsuariosAdmin"
import ThemeToggle from "./componentes/ThemeToggle" // Importar el componente de toggle
// Reemplazar con la nueva importación
import DetalleProducto from "./componentes/tienda/DetalleProducto"
import AvisoPrivacidad from "./componentes/informacion/AvisoPrivacidad"
import QuienesSomos from "./componentes/informacion/QuienesSomos"
import Contactanos from "./componentes/informacion/Contactanos"
import "./App.css"
import { CartProvider } from "./context/CartContext" // Importar el CartProvider
import Error404 from "./componentes/errorres/Error404"
import Error400 from "./componentes/errorres/Error400"
import Error500 from "./componentes/errorres/Error500"
import PreguntasFrecuentes from "./componentes/informacion/PreguntasFrecuentes"
import Tienda from "./componentes/tienda/Tienda"
import FiltrosProductos from "./componentes/tienda/FiltrosProductos"
import Carrito from "./componentes/tienda/Carrito"
import Administrador from "./componentes/mod_admin/Administrador"
// Importar componentes de suscripción
import Suscripcion from "./componentes/suscripciones/Suscripcion"
import DatosSuscripcion from "./componentes/suscripciones/DatosSuscripcion"
import PagoSuscripcion from "./componentes/suscripciones/PagoSuscripcion"
import ConfirmacionSuscripcion from "./componentes/suscripciones/ConfirmacionSuscripcion"
// Importar el componente PerfilUsuario y sus subcomponentes
import PerfilUsuario from "./componentes/perfil_usuario/PerfilUsuario"

const App = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="app">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/iniciar-sesion" element={<InicioSesion />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/RecuperarContrasenaOpciones" element={<RecuperarContrasenaOpciones />} />
              <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
              <Route path="/recuperar-contrasenaPS" element={<RecuperarContrasenaPS />} />
              <Route path="/ResponderPreguntaSecreta" element={<ResponderPreguntaSecreta />} />
              <Route path="/verificar-correo" element={<VerificarCorreo />} />
              <Route path="/aviso_privacidad" element={<AvisoPrivacidad />} />
              <Route path="/quienes_somos" element={<QuienesSomos />} />
              <Route path="/contactanos" element={<Contactanos />} />
              <Route path="/cambiar_contraseña" element={<CambiarContrasena />} />
              <Route path="/usuario_admin" element={<UsuariosAdmin />} />
              <Route path="/redes_sociales_admin" element={<RedesSocialesAdmin />} />
              <Route path="/empresa_admin" element={<EmpresaAdmin />} />
              <Route path="/deslinde_admin" element={<DocumentosRegulatoriosAdmin />} />
              <Route path="/incidentes_admin" element={<IncidentesAdmin />} />
              <Route path="/detalle-producto/:id" element={<DetalleProducto />} />
              <Route path="/Preguntas_Frecuentes" element={<PreguntasFrecuentes />} />
              <Route path="/Tienda" element={<Tienda />} />
              {/* Ruta para categorías de la tienda */}
              <Route path="/tienda/:categoria" element={<Tienda />} />
              <Route path="/FiltrosProductos" element={<FiltrosProductos />} />
              {/* Ruta para el carrito de compras */}
              <Route path="/carrito" element={<Carrito />} />
              {/* Rutas para el perfil de usuario */}
              <Route path="/perfil" element={<PerfilUsuario />} />
              <Route path="/perfil/datos-personales" element={<PerfilUsuario />} />
              <Route path="/perfil/datos-fisicos" element={<PerfilUsuario />} />
              <Route path="/perfil/suscripciones" element={<PerfilUsuario />} />
              <Route path="/perfil/historial-compras" element={<PerfilUsuario />} />
              <Route path="/perfil/historial-actividad" element={<PerfilUsuario />} />
              <Route path="/perfil/configuracion" element={<PerfilUsuario />} />
              <Route path="/perfil/progreso-fisico" element={<PerfilUsuario />} />
              {/* Rutas para suscripciones */}
              <Route path="/suscripcion" element={<Suscripcion />} />
              <Route path="/suscripcion/datos" element={<DatosSuscripcion />} />
              <Route path="/suscripcion/pago" element={<PagoSuscripcion />} />
              <Route path="/suscripcion/confirmacion" element={<ConfirmacionSuscripcion />} />

              {/* Rutas para el panel de administración */}
              <Route path="/Administrador" element={<Administrador />} />
              <Route path="/administrador/dashboard" element={<Administrador />} />
              <Route path="/administrador/usuarios" element={<Administrador />} />
              <Route path="/administrador/suscripciones" element={<Administrador />} />
              <Route path="/administrador/tienda-categorias" element={<Administrador />} />
              <Route path="/administrador/tienda-productos" element={<Administrador />} />
              <Route path="/administrador/tienda-pedidos" element={<Administrador />} />
              <Route path="/administrador/entrenadores" element={<Administrador />} />
              <Route path="/administrador/clases" element={<Administrador />} />
              <Route path="/administrador/empresa" element={<Administrador />} />
              <Route path="/administrador/documentos" element={<Administrador />} />
              <Route path="/administrador/incidencias" element={<Administrador />} />
              <Route path="/administrador/redes-sociales" element={<Administrador />} />
              <Route path="/administrador/reportes-ventas" element={<Administrador />} />
              <Route path="/administrador/reportes-usuarios" element={<Administrador />} />
              <Route path="/administrador/reportes-asistencia" element={<Administrador />} />

              <Route path="*" element={<Error404 />} />
              <Route path="/error400" element={<Error400 />} />
              <Route path="/error500" element={<Error500 />} />
            </Routes>

            {/* Botón flotante para cambiar el tema */}
            <ThemeToggle />
          </Router>
        </div>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App

