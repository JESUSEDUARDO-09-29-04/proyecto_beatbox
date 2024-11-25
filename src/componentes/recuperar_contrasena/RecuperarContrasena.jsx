import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RecuperarContrasena.css';
import '../home/Home.css';
import logo from '../../assets/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../inicio_sesion/InicioSesion.css';
import jim from '../../assets/jim.png';
import FooterH from '../FooterH';

const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState(''); // Estado para el correo electrónico
  const [error, setError] = useState(''); // Estado para manejar errores
  const [success, setSuccess] = useState(''); // Estado para manejar éxito
  const [correoSugerencias, setCorreoSugerencias] = useState([]); // Sugerencias para correos
  const [menuAbierto, setMenuAbierto] = useState(false);

  const dominiosSugeridos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // Función para sanitizar la entrada del usuario
  const sanitizeInput = (input) => {
    return input.replace(/<|>|&|\/|\\/g, ''); // Elimina caracteres peligrosos
  };

  const evaluarCorreo = (correo) => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sugerencias = [];

    if (!correoRegex.test(correo)) {
      dominiosSugeridos.forEach((dominio) => {
        if (correo.includes('@')) {
          const [localPart, domainPart] = correo.split('@');
          if (!dominio.startsWith(domainPart)) {
            sugerencias.push(`${localPart}@${dominio}`);
          }
        } else {
          sugerencias.push(`${correo}@${dominio}`);
        }
      });
      setError('Formato de correo inválido.');
    } else {
      setError('');
    }

    setCorreoSugerencias(sugerencias);
  };

  const manejarRecuperacion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación adicional antes de enviar el formulario
    if (!correo) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    if (error) {
      return; // No enviar el formulario si hay errores
    }

    const datosRecuperacion = {
      correo_Electronico: sanitizeInput(correo),
    };

    try {
      const response = await fetch('https://beatbox-blond.vercel.app/auth/forgot/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosRecuperacion),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Correo de recuperación enviado exitosamente.');
        setTimeout(() => {
          navigate('/iniciar-sesion');
        }, 2000);
      } else {
        setError(data.message || 'Error al enviar el correo de recuperación.');
      }
    } catch (err) {
      setError('Error de red. Intenta nuevamente.');
    }
  };

  const handleCorreoChange = (e) => {
    const value = sanitizeInput(e.target.value);
    setCorreo(value);
    evaluarCorreo(value);
  };

  return (
    <div className="contenedor">
      {/* Header */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <button className="menu-icono" onClick={toggleMenu}>☰</button>
        {/* Menú Hamburguesa */}
        <div className={`menu-desplegable ${menuAbierto ? 'activo' : ''}`}>
          <button className="btn-cerrar" onClick={toggleMenu}>✖</button>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><a href="#">Suscripciones</a></li>
            <li><a href="#">Horarios</a></li>
            <li><a href="#">Perfil de usuario</a></li>
            <li><a href="#">Contáctanos</a></li>
          </ul>
        </div>
      </header>

      {/* Contenedor del Formulario e Imagen */}
      <div className="formulario-imagen">
        <form className="formulario" onSubmit={manejarRecuperacion}>
          <h2>Recuperar Contraseña</h2>

          {/* Mensajes de Error y Éxito */}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={handleCorreoChange} // Actualiza el estado del correo
            required
          />

          {/* Retroalimentación con Sugerencias */}
          {correoSugerencias.length > 0 && (
            <ul style={{ color: 'red' }}>
              Sugerencias:
              {correoSugerencias.map((sugerencia, index) => (
                <li key={index}>{sugerencia}</li>
              ))}
            </ul>
          )}

          <button type="submit" className="btn-recuperar" disabled={!!error}>
            Enviar Correo de Recuperación
          </button>

          <div className="links">
            <a onClick={() => navigate('/iniciar-sesion')} className="iniciar-sesion">¿Ya tienes una cuenta? Iniciar sesión.</a>
            <a onClick={() => navigate('/registro')} className="registrarme">¿Aún no te registras? Regístrate aquí.</a>
          </div>
        </form>

        <div className="imagen-lateral">
          <img src={jim} alt="Imagen decorativa" />
        </div>
      </div>

      {/* Footer */}
      <FooterH />
    </div>
  );
};

export default RecuperarContrasena;
