import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Registro.css'; 
import logo from '../../assets/logo.png';

const Registro = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordStrength !== 'Fuerte') {
      setError('La contraseña no es lo suficientemente fuerte');
      return;
    }

    try {
      const response = await registerUser(correo, contrasena);
      setSuccess('Registro exitoso');
      navigate('/verificar-correo');
    } catch (err) {
      setError(err.message || 'Error en el registro');
    }
  };

  // Función para evaluar la fortaleza de la contraseña y recomendaciones
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
    } else if (password.length >= 6) {
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

  return (
    <div className="registro-contenedor">
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <button className="menu-icono" onClick={toggleMenu}>
          ☰
        </button>
      </header>

      {/* Menú Hamburguesa */}
      <div className={`menu-desplegable ${menuAbierto ? 'activo' : ''}`}>
        <button className="btn-cerrar" onClick={toggleMenu}>✖</button>
        <ul>
          <li><a onClick={() => navigate('/')}>Inicio</a></li>
          <li><a href="#">Gimnasios</a></li>
          <li><a href="#">Planes</a></li>
          <li><a href="#">Sustentabilidad</a></li>
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

          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label htmlFor="apellidoPaterno">Apellido Paterno</label>
          <input
            type="text"
            id="apellidoPaterno"
            placeholder="Ingresa tu apellido paterno"
            value={apellidoPaterno}
            onChange={(e) => setApellidoPaterno(e.target.value)}
            required
          />

          <label htmlFor="apellidoMaterno">Apellido Materno</label>
          <input
            type="text"
            id="apellidoMaterno"
            placeholder="Ingresa tu apellido materno"
            value={apellidoMaterno}
            onChange={(e) => setApellidoMaterno(e.target.value)}
            required
          />

          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChange={handlePasswordChange}
            required
          />
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
          <input
            type="password"
            id="confirmarContrasena"
            placeholder="Confirma tu contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
          />

          {/* Botón de registro */}
          <button type="submit" className="btn-registrar" disabled={passwordStrength !== 'Fuerte' || contrasena !== confirmarContrasena}>
            Registrar
          </button>
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
