import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './InicioSesion.css';
import '../home/Home.css';
import logo from '../../assets/logo.png';
import { FaEye, FaEyeSlash, FaChevronDown } from 'react-icons/fa';  // Importar los íconos de mostrar/ocultar contraseña.
import { jwtDecode } from 'jwt-decode';


const InicioSesion = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [bloqueado, setBloqueado] = useState(false); // Nuevo estado para saber si la cuenta está bloqueada
  const [tiempoRestante, setTiempoRestante] = useState(0); // Estado para controlar el tiempo restante del bloqueo

  const MAX_INTENTOS = 5;
  const TIEMPO_BLOQUEO = 5 * 60 * 1000; // 5 minutos en milisegundos

  useEffect(() => {
    const intentosFallidos = localStorage.getItem('intentosFallidos') || 0;
    const tiempoBloqueo = localStorage.getItem('tiempoBloqueo');
    const ahora = new Date().getTime();

    if (tiempoBloqueo && ahora < tiempoBloqueo) {
      setBloqueado(true);
      setTiempoRestante(Math.ceil((tiempoBloqueo - ahora) / 1000));
    }
  }, []);

  useEffect(() => {
    let interval = null;

    if (bloqueado && tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            setBloqueado(false);
            localStorage.removeItem('intentosFallidos');
            localStorage.removeItem('tiempoBloqueo');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [bloqueado, tiempoRestante]);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // Función para manejar el envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');

    if (bloqueado) {
      setError(`Cuenta bloqueada. Espera ${tiempoRestante} segundos antes de intentar nuevamente.`);
      return;
    }

    const requestBody = {
      usuario: usuario,
      contraseña: contrasena
    };

    try {
      const response = await fetch('https://beatbox-blond.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();


      if (response.ok) {
        //Se decodifica el token
        const decodeToken= jwtDecode(data.token);

        // Inicio de sesión exitoso, reiniciar intentos fallidos
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', usuario);
        

        // Redirigir según el tipo de usuario
        if(decodeToken.role === 'user') {
          navigate('/home-login');
        } else {
          navigate('/home-admin');
        }
      } else {
        manejarIntentoFallido(); // Solo se maneja un intento fallido si el login falla
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      manejarIntentoFallido(); // Manejar intento fallido en caso de error de red
      setError('Error de red al iniciar sesión');
    }
  };

  

  return (
    <div className="contenedor">
      {/* Navbar */}
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <div className="nav-enlaces">
          <button 
            className="btn-registrarse" 
            onClick={() => navigate('/registro')}
          >
            Registrarse
          </button>
          <button className="menu-icono" onClick={toggleMenu}>☰</button>
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

      {/* Formulario de inicio de sesión */}
      <div className="formulario-imagen">
        <form className="formulario" onSubmit={manejarEnvio}>
          <h2>Iniciar Sesión</h2>

          {bloqueado && (
            <p style={{ color: 'red' }}>
              Cuenta bloqueada. Espera {tiempoRestante} segundos antes de intentar nuevamente.
            </p>
          )}

          <label htmlFor="usuario">Nombre de usuario</label>
          <input
            type="text"
            id="usuario"
            placeholder="Ingresa tu nombre"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            disabled={bloqueado} // Desactivar los campos si la cuenta está bloqueada
          />

          <label htmlFor="contrasena">Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="contrasena"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              disabled={bloqueado} // Desactivar el campo si está bloqueado
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-btn"
              disabled={bloqueado} // Desactivar el botón si está bloqueado
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className="btn-iniciar" disabled={bloqueado}>
            Iniciar Sesión
          </button>

          <div className="links">
            <Link to="/recuperar-contrasena" className="olvidaste-contrasena">¿Olvidaste tu contraseña?</Link>
            <Link to="/registro" className="registrarme">Registrarme</Link>
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

export default InicioSesion;
