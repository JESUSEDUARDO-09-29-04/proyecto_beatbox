import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RecuperarContrasena.css';
import logo from '../../assets/logo.png'; // Ruta del logo

const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState(''); // Estado para el correo electrónico
  const [error, setError] = useState(''); // Estado para manejar errores
  const [success, setSuccess] = useState(''); // Estado para manejar éxito
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const manejarRecuperacion = async (e) => {
    e.preventDefault();
    setError(''); // Reiniciar errores
    setSuccess(''); // Reiniciar éxito

    // Datos que se enviarán al servidor
    const datosRecuperacion = {
      correo_Electronico: correo,
    };

    try {
      // Hacer la solicitud POST al servidor
      const response = await fetch('https://beatbox-blond.vercel.app/auth/forgot/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosRecuperacion), // Enviar datos como JSON
      });

      const data = await response.json();

      if (response.ok) {
        // Si la solicitud fue exitosa
        setSuccess('Correo de recuperación enviado exitosamente.');
        // Redirige al inicio de sesión después de un breve retraso
        setTimeout(() => {
          navigate('/iniciar-sesion');
        }, 2000);
      } else {
        // Manejar errores del servidor
        setError(data.message || 'Error al enviar el correo de recuperación.');
      }
    } catch (err) {
      // Si ocurre un error de red o conexión
      setError('Error de red. Intenta nuevamente.');
    }
  };

  return (
    <div className="contenedor-inicio-sesion">
      {/* Header */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <button className="menu-icono" onClick={toggleMenu}>☰</button>
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
        <form className="formulario" onSubmit={manejarRecuperacion}>
          <h2>Recuperar Contraseña</h2>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)} // Actualiza el estado del correo
            required
          />

          <button type="submit" className="btn-recuperar">Enviar Correo de Recuperación</button>

          <div className="links">
            <a onClick={() => navigate('/iniciar-sesion')} className="iniciar-sesion">¿Ya tienes una cuenta? Iniciar sesión.</a>
            <a onClick={() => navigate('/registro')} className="registrarme">¿Aún no te registras? Regístrate aquí.</a>
          </div>
        </form>

        <div className="imagen-lateral">
          <p>Aquí irá una imagen decorativa</p>
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

export default RecuperarContrasena;
