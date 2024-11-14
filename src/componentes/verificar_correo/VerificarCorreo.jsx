import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './VerificarCorreo.css';
import '../home/Home.css';
import logo from '../../assets/logo.png'; // Ruta del logo
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../inicio_sesion/InicioSesion.css';
import jim from '../../assets/jim.png';

const VerificarCorreo = () => {
  const [codigo, setCodigo] = useState('');  // Estado para el OTP (código)
  const [correo, setCorreo] = useState('');  // Estado para el correo electrónico
  const [error, setError] = useState('');    // Estado para mostrar errores
  const [success, setSuccess] = useState(''); // Estado para mostrar éxito
  const [menuAbierto, setMenuAbierto] = useState(false);  // Estado del menú
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);  // Alternar el menú hamburguesa
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');   // Limpiar mensajes de error anteriores
    setSuccess(''); // Limpiar mensajes de éxito anteriores

    // Verificar que ambos campos (correo y código) estén llenos
    if (!correo || !codigo) {
      setError('Por favor, ingresa el correo electrónico y el código de verificación.');
      return;
    }

    // Crear los datos a enviar
    const datosVerificacion = {
      correo_Electronico: correo,
      otp: codigo
    };

    try {
      // Hacer la solicitud POST al servidor
      const response = await fetch('https://beatbox-blond.vercel.app/auth/verify/otp/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosVerificacion),  // Enviar los datos como JSON
      });

      const data = await response.json();

      if (response.ok) {
        // Si la verificación es exitosa
        setSuccess('Verificación exitosa. Redirigiendo...');
        // Redirigir a la página principal o a la que desees
        setTimeout(() => {
          navigate('/iniciar-sesion');
        }, 2000);  // Redirigir después de 2 segundos
      } else {
        // Si el código o el correo son incorrectos
        setError(data.message || 'Error al verificar el código. Inténtalo de nuevo.');
      }
    } catch (err) {
      // Si hay un error de red o con la solicitud
      setError('Error de red. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="contenedor-verificar-correo">
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <button className="menu-icono" onClick={toggleMenu}>
          ☰
        </button>
        {/* Menú Hamburguesa */}
        <div className={`menu-desplegable ${menuAbierto ? 'activo' : ''}`}>
          <button className="btn-cerrar" onClick={toggleMenu}>✖</button>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><a href="#">Gimnasios</a></li>
            <li><a href="#">Planes</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contáctanos</a></li>
          </ul>
        </div>
      </header>

      {/* Contenedor del Formulario e Imagen */}
      <div className="formulario-imagen">
        <form className="formulario" onSubmit={manejarEnvio}>
          <h2>Verificación de Correo Electrónico</h2>
          <p>Ingresa el código que te enviamos a tu correo electrónico</p>

          {/* Mostrar error o éxito */}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            placeholder="Ingresa tu correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}  // Actualizar el estado del correo
            required
          />

          <label htmlFor="codigo">Código de verificación</label>
          <input
            type="text"
            id="codigo"
            placeholder="Ingresa el código de verificación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}  // Actualizar el estado del OTP
            required
          />

          <button type="submit" className="btn-verificar">Verificar</button>
        </form>

        <div className="imagen-lateral">
        <img src={jim} alt="Imagen decorativa" />
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <img src={logo} alt="Logo Beatbox" className="logo-footer" />
        <div className="linea-separacion"></div>

        <h2>Síguenos</h2>
        <div className="redes-sociales">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
        </div>

        <div className="linea-separacion"></div>

        <div className="footer-secciones">
          <div>
            <h3>Beatbox</h3>
            <ul>
              <li><a href="#">Quiénes somos</a></li>
              <li><a href="#">Contáctanos</a></li>
              <li><a href="#">Aviso de Privacidad</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VerificarCorreo;
