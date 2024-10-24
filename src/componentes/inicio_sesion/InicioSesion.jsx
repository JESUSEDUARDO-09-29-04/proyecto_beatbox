import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './InicioSesion.css';
import logo from '../../assets/logo.png';
import { FaEye, FaEyeSlash, FaChevronDown } from 'react-icons/fa';  // Importar los íconos de mostrar/ocultar contraseña.

const InicioSesion = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // Función para manejar el envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');

    const requestBody = {
      usuario: usuario,
      contraseña: contrasena,
      role: tipoUsuario  // Incluir el tipo de usuario en el cuerpo de la solicitud
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
        localStorage.setItem('token', data.token); // Suponiendo que la API devuelve un token
        localStorage.setItem('user', usuario);
        localStorage.setItem('role', tipoUsuario); // Almacenar el tipo de usuario también
  
        console.log('Login exitoso:', data);

        
        if(tipoUsuario == 'user') {
          navigate('/home-login'); // Redirigir al Home de usuarios logueados
        }else{
          navigate('/home-admin'); // Redirigir al Home de usuarios logueados
        }

      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de red al iniciar sesión');
    }
  };

  return (
    <div className="contenedor-inicio-sesion">
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

          <label htmlFor="usuario">Nombre de usuario</label>
          <input
            type="text"
            id="usuario"
            placeholder="Ingresa tu nombre"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          {/* Nuevo campo para seleccionar el tipo de usuario */}
          <label htmlFor="tipoUsuario">Tipo de Usuario</label>
          <div className="select-field" style={{ position: 'relative' }}>
            <select
              id="tipoUsuario"
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)} // Actualiza el estado con el valor seleccionado
              required
              style={{ width: '100%', paddingRight: '30px' }} // Aseguramos espacio para el ícono
            >
              <option value="user">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            <FaChevronDown className="icono-select" /> {/* Ícono dentro del select */}
          </div>

          <label htmlFor="contrasena">Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="contrasena"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className="btn-iniciar">Iniciar Sesión</button>

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
