import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Registro.css'; 
import logo from '../../assets/logo.png';
import axios from 'axios';
import { Link } from 'react-router-dom';  
import { FaEye, FaEyeSlash } from 'react-icons/fa';  
import ReCAPTCHA from 'react-google-recaptcha'; // Importar reCAPTCHA

const Registro = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);  
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null); // Estado para el token de reCAPTCHA

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar que las contraseñas coincidan
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar fortaleza de la contraseña
    if (passwordStrength !== 'Fuerte') {
      setError('La contraseña no es lo suficientemente fuerte');
      return;
    }

    // Verificar que el CAPTCHA haya sido completado
    if (!recaptchaToken) {
      setError('Por favor, completa el CAPTCHA');
      return;
    }

    // Crear los datos de usuario que se enviarán al servidor
    const datosUsuario = {
      correo_Electronico: correo,
      usuario: usuario,
      contraseña: contrasena
    };

    // Imprimir los datos enviados para depuración
    console.log('Enviando datos de registro:', datosUsuario);

    try {
      // Enviar la solicitud al servidor
      const response = await fetch('https://beatbox-blond.vercel.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
      });
      const data = await response.json();

      // Si el registro es exitoso
      if (response.ok) {
        console.log('registro exitoso:', data);
        navigate('/verificar-correo');
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (error) {
      setError('Error de red al registrarse');
    }
  };

  const evaluarFortalezaContrasena = (password) => {
    const recomendaciones = [];

    if (password.length < 8) {
      recomendaciones.push('Debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      recomendaciones.push('Debe tener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      recomendaciones.push('Debe tener al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      recomendaciones.push('Debe tener al menos un número');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      recomendaciones.push('Debe tener al menos un carácter especial (!@#$%^&*)');
    }

    setRecommendations(recomendaciones);

    if (recomendaciones.length === 0) {
      return 'Fuerte';
    } else if (password.length >= 4) {
      return 'Débil';
    } else {
      return 'Muy débil';
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setContrasena(password);
    const strength = evaluarFortalezaContrasena(password);
    setPasswordStrength(strength);
  };

  // Manejar el token generado por el CAPTCHA
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Guardar el token del CAPTCHA
  };

  return (
    <div className="registro-contenedor">
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <div className="nav-enlaces">
          <button className="btn btn-inicio" onClick={() => navigate('/iniciar-sesion')}>
            Iniciar sesión
          </button>
          <button className="menu-icono" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </header>

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

      {/* Contenedor del Formulario e Imagen */}
      <div className="formulario-imagen">
        <form className="formulario" onSubmit={manejarEnvio}>
          <h2>Registro</h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label htmlFor="usuario">Nombre de usuario</label>
          <input
            type="text"
            id="usuario"
            placeholder="Ingresa tu nombre"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="contrasena"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-btn"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Muestra la fortaleza de la contraseña */}
          {contrasena && (
            <div>
              <p style={{ color: passwordStrength === 'Fuerte' ? 'green' : 'red' }}>
                Fortaleza de la contraseña: {passwordStrength}
              </p>
              <ul>
                {recommendations.map((rec, index) => (
                  <li key={index} style={{ color: 'red' }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmarContrasena"
              placeholder="Confirma tu contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="show-password-btn"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Integrar reCAPTCHA */}
          <div className="recaptcha-container">
            <ReCAPTCHA
              sitekey="6LewRWkqAAAAANUGc0gdQDNf-KScA4ZZuZRIe6sE" // Cambia esto por tu clave de sitio de reCAPTCHA
              onChange={handleRecaptchaChange} // Llamar a la función cuando el reCAPTCHA cambia
            />
          </div>

          <button type="submit" className="btn-registrar" disabled={passwordStrength !== 'Fuerte' || contrasena !== confirmarContrasena || !recaptchaToken}>
            Registrar
          </button>
          <div className="links">
            <a className="iniciar-sesion">¿Ya tienes una cuenta? Iniciar sesión.</a>
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

export default Registro;
