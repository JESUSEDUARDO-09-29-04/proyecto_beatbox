import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './InicioSesion.css';
import '../home/Home.css';
import logo from '../../assets/logo.png';
import jim from '../../assets/jim.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import FooterH from '../FooterH';

const InicioSesion = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errorUsuario, setErrorUsuario] = useState(''); // Error específico del usuario
  const [cargando, setCargando] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // Función para sanitizar la entrada del usuario
  const sanitizeInput = (input) => {
    return input.replace(/<|>|&|\/|\\/g, ''); // Elimina caracteres peligrosos
  };

  const esCorreo = (texto) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setErrorUsuario('');
    setCargando(true);

    // Validación para evitar correos en el nombre de usuario
    if (esCorreo(usuario)) {
      setErrorUsuario('El nombre de usuario no puede ser un correo electrónico');
      setCargando(false);
      return;
    }

    if (bloqueado) {
      setError(`Cuenta bloqueada. Espera ${tiempoRestante} segundos.`);
      setCargando(false);
      return;
    }

    const requestBody = { usuario, contraseña: contrasena };

    try {
      const loginResponse = await fetch('https://beatbox-blond.vercel.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (loginResponse.ok) {
        // Usuario autenticado correctamente
        const userResponse = await fetch('https://beatbox-blond.vercel.app/auth/validate-user', {
          method: 'GET',
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userRole = userData.role;

          if (userRole === 'user') navigate('/home-login');
          else if (userRole === 'admin') navigate('/home-admin');
          else setError('Rol desconocido, acceso denegado');
        } else {
          setError('Error al obtener datos del usuario');
        }
      } else {
        // Credenciales incorrectas
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      }
    } catch (error) {
      setError('Error de red al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="contenedor">
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <div className="nav-enlaces">
          <button className="btn-registrarse" onClick={() => navigate('/registro')}>Registrarse</button>
          <button className="menu-icono" onClick={toggleMenu}>☰</button>
        </div>
      </header>

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

      <div className="formulario-imagen">
        <form className="formulario" onSubmit={manejarEnvio}>
          <h2>Iniciar Sesión</h2>

          {bloqueado && <p style={{ color: 'red' }}>Cuenta bloqueada. Espera {tiempoRestante} segundos.</p>}
          <label htmlFor="usuario">Nombre de Usuario</label>
          <input
            type="text"
            id="usuario"
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(sanitizeInput(e.target.value))}
            required
          />
          {errorUsuario && <p style={{ color: 'red' }}>{errorUsuario}</p>}

          <label htmlFor="contrasena">Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="contrasena"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(sanitizeInput(e.target.value))}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="show-password-btn">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {cargando ? (
            <p>Cargando...</p>
          ) : (
            <button type="submit" className="btn-iniciar">Iniciar Sesión</button>
          )}

          <div className="links">
            <Link to="/recuperar-contrasena" className="olvidaste-contrasena">¿Olvidaste tu contraseña?</Link>
            <Link to="/registro" className="registrarme">Registrarme</Link>
          </div>
        </form>

        <div className="imagen-lateral">
          <img src={jim} alt="Imagen decorativa" />
        </div>
      </div>

      <FooterH />
    </div>
  );
};

export default InicioSesion;
