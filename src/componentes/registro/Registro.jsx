import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Registro.css';
import logo from '../../assets/logo.png'; // Ruta del logo

const Registro = () => {
  const navigate = useNavigate(); // Inicializa el hook para navegar
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado del menú
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto); // Alternar el menú hamburguesa
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    // Validación de contraseñas
    if (contrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Registro exitoso');
    // Redirige al formulario de verificación de correo
    navigate('/verificar-correo');
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
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmarContrasena"
            placeholder="Confirma tu contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
          />

          <button type="submit" className="btn-registrar">Registrar</button>
        </form>

        <div className="imagen-lateral">
          <p>Aquí irá una imagen decorativa</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <img src={logo} alt="Logo Beatbox" className="logo-footer" />
        <div className="linea-separacion"></div> {/* Línea debajo del logo */}

        <h2>Síguenos</h2>
        <div className="redes-sociales">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
        </div>

        <div className="linea-separacion"></div> {/* Línea debajo de las redes sociales */}

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
