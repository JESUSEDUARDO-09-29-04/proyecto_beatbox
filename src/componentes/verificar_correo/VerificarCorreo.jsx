import React, { useState, useEffect} from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './VerificarCorreo.css';
import '../home/Home.css';
import logo from '../../assets/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../inicio_sesion/InicioSesion.css';
import jim from '../../assets/jim.png';
import FooterH from '../FooterH';

const VerificarCorreo = () => {
  const location = useLocation();
  const [codigo, setCodigo] = useState('');  // Estado para el OTP (código)
  const [correo, setCorreo] = useState(location.state?.correo || ''); // Inicializar con el correo recibido o vacío
  const [error, setError] = useState('');    // Estado para mostrar errores
  const [success, setSuccess] = useState(''); // Estado para mostrar éxito
  const [menuAbierto, setMenuAbierto] = useState(false);  // Estado del menú
  const navigate = useNavigate();

  useEffect(() => {
    if (!correo) {
      setError('No se detectó un correo electrónico. Por favor, regístrate primero.');
      setTimeout(() => {
        navigate('/registro'); // Redirigir a la página de registro
      }, 3000); // Redirigir después de 3 segundos
    }
  }, [correo, navigate]);

  // Función para sanitizar la entrada del usuario
  const sanitizeInput = (input) => {
    return input.replace(/<|>|&|\/|\\/g, ''); // Elimina caracteres peligrosos
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);  // Alternar el menú hamburguesa
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');   // Limpiar mensajes de error anteriores
    setSuccess(''); // Limpiar mensajes de éxito anteriores

    // Verificar que el campo del código esté lleno
    if (!codigo) {
      setError('Por favor, ingresa el código de verificación.');
      return;
    }

    // Verificar si el código contiene caracteres dañinos
    if (/[<>]/.test(codigo)) {
      setError('El código no debe contener caracteres peligrosos.');
      return;
    }

    // Crear los datos a enviar
    const datosVerificacion = {
      correo_Electronico: correo,
      otp: sanitizeInput(codigo)
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
        // Si el código es incorrecto
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
            <li><a href="#">Suscripciones</a></li>
            <li><a href="#">Horarios</a></li>
            <li><a href="#">Perfil de usuario</a></li>
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

          <label htmlFor="codigo">Código de verificación</label>
          <input
            type="text"
            id="codigo"
            placeholder="Ingresa el código de verificación"
            value={codigo}
            onChange={(e) => setCodigo(sanitizeInput(e.target.value))}  // Sanitizar la entrada
            required
          />

          <button type="submit" className="btn-verificar">Verificar</button>
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

export default VerificarCorreo;