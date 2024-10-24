import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './CambiarContrasena.css';
import logo from '../../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Para los iconos de contraseña
import '@fortawesome/fontawesome-free/css/all.min.css';

const CambiarContrasena = () => {
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(''); // Fortaleza de la contraseña
  const [recommendations, setRecommendations] = useState([]); // Recomendaciones para mejorar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el token de la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setContrasena(password);
    
    // Evaluar fortaleza de la contraseña
    const strength = evaluarFortalezaContrasena(password);
    setPasswordStrength(strength); 
  };

  const handleConfirmPasswordChange = (e) => setConfirmarContrasena(e.target.value);
  const toggleMenu = () => setMenuAbierto(!menuAbierto); 

  // Evaluar la fortaleza de la contraseña
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
    } else if (recomendaciones.length <= 2) {
      return 'Débil';
    } else {
      return 'Muy débil';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://beatbox-blond.vercel.app/auth/reset/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          new_password: contrasena
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Contraseña actualizada exitosamente');
        navigate('/iniciar-sesion');
      } else {
        setError(data.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
    }

    setLoading(false);
  };

  return (
    <div className="contenedor-cambiar-contrasena">
      {/* Header */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <div className="nav-enlaces">
          <button className="menu-icono" onClick={toggleMenu}>☰</button>
        </div>
      </header>

      {/* Menú Hamburguesa */}
      <div className={`menu-desplegable ${menuAbierto ? 'activo' : ''}`}>
        <button className="btn-cerrar" onClick={toggleMenu}>✖</button>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Inicio</Link></li>
          <li><Link to="/gimnasios" onClick={toggleMenu}>Gimnasios</Link></li>
          <li><Link to="/planes" onClick={toggleMenu}>Planes</Link></li>
          <li><Link to="/sustentabilidad" onClick={toggleMenu}>Sustentabilidad</Link></li>
          <li><Link to="/blog" onClick={toggleMenu}>Blog</Link></li>
          <li><Link to="/contacto" onClick={toggleMenu}>Contáctanos</Link></li>
        </ul>
      </div>

      {/* Formulario */}
      <form className="formulario" onSubmit={handleSubmit}>
        <h2>Cambiar Contraseña</h2>
        {error && <p className="error">{error}</p>}

        <label htmlFor="contrasena">Nueva Contraseña</label>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            id="contrasena"
            placeholder="Ingrese la nueva contraseña"
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

        {/* Mostrar fortaleza de la contraseña */}
        {contrasena && (
          <div>
            <p style={{ color: passwordStrength === 'Fuerte' ? 'green' : passwordStrength === 'Débil' ? 'orange' : 'red' }}>
              Fortaleza de la contraseña: {passwordStrength}
            </p>
            <ul>
              {recommendations.map((rec, index) => (
                <li key={index} style={{ color: 'red' }}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <label htmlFor="confirmarContrasena">Confirmar Nueva Contraseña</label>
        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmarContrasena"
            placeholder="Confirma tu nueva contraseña"
            value={confirmarContrasena}
            onChange={handleConfirmPasswordChange}
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

        <button type="submit" className="btn-cambiar" disabled={loading}>
          {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
        </button>
      </form>

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
          <ul>
            <li><a href="#">Quiénes somos</a></li>
            <li><a href="#">Contáctanos</a></li>
            <li><a href="#">Aviso de Privacidad</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default CambiarContrasena;
