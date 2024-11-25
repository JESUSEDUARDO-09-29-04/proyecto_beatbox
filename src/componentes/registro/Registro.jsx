import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Registro.css'; 
import '../home/Home.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';  
import { FaEye, FaEyeSlash } from 'react-icons/fa';  
import ReCAPTCHA from 'react-google-recaptcha'; 
import jim from '../../assets/jim.png';
import FooterH from '../FooterH';

const Registro = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [correoError, setCorreoError] = useState('');
  const [correoSugerencias, setCorreoSugerencias] = useState([]);
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);  
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const dominiosSugeridos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const sanitizeInput = (input) => {
    return input.replace(/<|>|&|\/|\\/g, ''); // Sanitiza caracteres peligrosos
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');

    if (!correo || correoError) {
      setError('Por favor, ingresa un correo válido');
      return;
    }
    if (!usuario || /[<>]/.test(usuario)) {
      setError('El nombre de usuario no debe contener caracteres peligrosos');
      return;
    }
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

    const datosUsuario = {
      correo_Electronico: correo,
      usuario: usuario,
      contraseña: contrasena,
    };

    try {
      const response = await fetch('https://beatbox-blond.vercel.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
      });
      const data = await response.json();

      if (response.ok) {
        navigate('/verificar-correo');
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (error) {
      setError('Error de red al registrarse');
    }
  };

  const evaluarFortalezaContrasena = (password) => {
    const patronesInseguros = [
      // Contraseñas numéricas comunes
      '123456', '123456789', '12345678', '1234567', '1234567890', '123123', '000000','111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999','1234', '12345', '987654321', '121212', '112233',
      // Contraseñas basadas en letras comunes
      'password', 'password1', 'passw0rd', 'password123', 'admin', 'welcome', 'letmein','sunshine', 'master', 'shadow', 'login', 'default', 'guest', 'root',
      // Frases y palabras comunes
      'iloveyou', 'monkey', 'football', 'baseball', 'dragon', 'superman', 'batman','michael', 'soccer', 'charlie', 'buster', 'tigger', 'jordan', 'buster123', 'hello','freedom', 'whatever', 'princess', 'qwerty', 'qwerty123', 'asdfgh', 'zxcvbn', 'zxcvb',
      // Contraseñas con patrones en teclado
      '1q2w3e', '1q2w3e4r', '1qaz2wsx', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm','poiuytrewq', 'lkjhgfdsa', 'mnbvcxz', 'qazwsx', 'wsxedc', 'edcrfv',  
      // Nombres y fechas comunes
      'john', 'john123', 'michael', 'michael123', 'david', 'david123', 'jessica', 'jessica123',
      '1990', '1991', '1992', '1993', '1994', '1995', '1996', '2000', '2001', '2002',
      '2022', '2023', 'abcd1234',
      // Variantes comunes de palabras
      'pass123', 'mypassword', 'mypassword123', 'trustno1', 'letmein123', 'password!', 'password@',
      'password#', 'password$', 'passw0rd!', 'passw0rd@', 'pass1234', 'securepassword', 'abc123456',
      '1234abcd', '1q2w3e4r5t', 'qwerty1234', 'asdfgh1234',
      // Palabras cortas inseguras
      'love', 'baby', 'angel', 'sex', 'god', 'money', 'hero', 'secret', 'star', 'test',
      // Variantes de contraseñas inseguras
      'p@ssw0rd', 'p@ssword123', 'P@ssw0rd', 'P@ssword!', '123qwe', '123asd', '1qazxsw2',
      'qweasd', 'admin123', 'admin@123', 'qwerty@123', 'pass1234!', 'password2023', 'spring2023',
      // Secuencias y repeticiones
      'abcd1234', 'aaa111', 'abcabc', 'aaaaaa', 'bbbbbb', 'cccccc', 'asdfasdf',
      '123abc', '654321', 'qweqwe', 'xyz123', 'xy1234', 'abcdabcd', '12341234',
      // Simples con caracteres especiales
      'password!', 'admin!', 'qwerty!', '123456!', 'pass@123', 'welcome@2023', 'letmein@123',
      // Palabras de uso común
      'family', 'love123', 'friend', 'freedom123', 'hello123', 'team', 'sports', 'football123',
      // Patrones complejos pero predecibles
      '123456A@', 'abcdef1!', '1234abcd!', 'password!@', 'Pass123!', 'Qwerty123!', 'Admin123$',
      // Combinaciones alfanuméricas simples
      '1A2B3C', 'ABC123', '123ABC', 'A1B2C3', '111aaa', 'aaa111', '123456Aa@', 'Aa123456!'
      ,'123456', '123456789', '12345678', '1234567', '1234567890', '123123', '000000',
        '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999',
        'abcd1234', 'P@ssword1', 'Welcome2023!', 'Admin@1234', 'Qwerty123!', 'Aa12345!',
        'AaAaAa123!', '1!1!1!AaBb', 'Aa@123123', '111Aa!@', '1234Qwe!',
        'QWEasd123!', 'ASDFghjkl@123', 'ZXCVbnm123!', '1234abcdABCD@',
        '1qaz!QAZ', '2wsx@WSX', '3edc#EDC', '4rfv$RFV', '5tgb%TGB',
      // Contraseñas alfanuméricas simples
      'ABC123', '123ABC', 'A1B2C3', 'a1b2c3', '111aaa', 'aaa111', '123aaa', 'aaa123',
      'abc123', '123abc', '1A2B3C', '3C2B1A', '1234ABcd', 'ABCD1234', 'abcdABCD1!',
      '1a2b3c4d', '1A2b3C!@', 'AaBbCc123', '123AaBbCc',

      // Uso de símbolos con patrones predecibles
      '123456Aa@', 'Aa123456!', '1!1!1!AaBb', 'Aa@123123', '111Aa!@', 'Aa!@#$123',
      '!@#123ABC', 'ABC!@#123', '@@@111aaa', 'aaa@@@111', '123$%^ABC', 'ABC$%^123',

      // Contraseñas comunes con ligeras variaciones
      'P@ssword1', 'P@ssw0rd!', 'P@ssword123', 'Passw0rd!', 'Admin123!', 'Admin@2023',
      'Welcome2023!', 'Qwerty123!', 'Password2023!', 'Pass@word!', '123Password!', 'Passw@rd1!',

      // Secuencias alfanuméricas cortas repetitivas
      'AaAaAa123!', 'BbBbBb123@', '123AaAaBb', '1234BbBbAa', 'A1A1A1Bb!', 'BbBb123!',
      'AbAbAb123!', 'AbcAbc123', '1A1B1C!', '1a1b1c!', '123AaBb!', 'BbAa123!',

      // Contraseñas basadas en nombres o fechas
      'John123!', 'Jane2023!', 'Michael@123', 'David@123', 'Jessica!2022', '1990Aa@',
      '2000Aa@', 'Admin!2023', 'Admin@2022', 'Root123!', 'User123!', 'Test@123',

      // Variantes cortas inseguras
      'Test123!', 'Test@123', 'Password!@', 'Abc@1234', '1qaz2wsx!', '2wsx3edc!',
      'Qaz!@123', 'Qwe@1234', 'Asd@1234', 'Zxc@1234', '123Asd!', 'Asd!123',

      // Combinaciones predecibles con teclado en zigzag
      '1qaz!QAZ', '2wsx@WSX', '3edc#EDC', '4rfv$RFV', '5tgb%TGB', '6yhn^YHN',
      '7ujm&UJM', '8ik,<IK<', '9ol.>OL>', '0p;/[P;/', 'qazwsx123!', 'edcrfv@2023',

      // Contraseñas con caracteres alternados
      'A1B2C3D4!', 'a1b2c3d4!', 'Z1X2C3V4!', 'z1x2c3v4!', 'M1N2B3V4!', '1A1a2B2b!',
      '123AaBbCc', 'A1aB2bC3c!', '1Q1q2W2w!', 'Aa123Bb!', '1234AaBb!', 'AaBbCc123!',

      // Combinaciones de palabras inseguras
      'Hello123!', 'Family2023!', 'Freedom!2023', 'Sports123!', 'Love@2023', 'Angel123!',
      'Superman2023!', 'Batman2023!', 'Soccer123!', 'Football123!', 'Music2023!',

      // Repeticiones de teclas y combinaciones numéricas básicas
      '123321Aa!', '321123Aa!', '112233Aa!', 'Aa123321!', '111222Aa!', 'Aa@112233!',
      '1Q2W3E!', '2W3E4R!', 'Q1W2E3!', '1A1B1C!', '1a2b3c!', '123abcABC!',

      // Palabras cortas con caracteres especiales
      'Test!123', 'Pass!2023', 'Qwerty!2023', 'Test@2023!', 'Root!1234', 'AaBb123!',
      'Test@Password!', 'Password!Test@', 'Abc@1234!', '1234Test!@#',

      // Otras combinaciones inseguras
      'QWErty@123!', '123Asdfgh!', 'Asdf123Qwe!', '123Zxcvb!', 'AsdfZxcvb123!',
      'Aa@123Qwerty', 'Aa@123Asdf!', 'Zxcvbn123!', 'Zxcvbn@123!', 'Qwert123!@#',
      'Admin123@2023!', 'Welcome@1234!', 'Secure@1234!', 'Default@1234!', 'Qwerty@2023!'
];

    const recomendaciones = [];

    // Longitud mínima
    if (password.length < 8) {
      recomendaciones.push('Debe tener al menos 8 caracteres');
    }

    // Letras mayúsculas
    if (!/[A-Z]/.test(password)) {
      recomendaciones.push('Debe tener al menos una letra mayúscula');
    }

    // Letras minúsculas
    if (!/[a-z]/.test(password)) {
      recomendaciones.push('Debe tener al menos una letra minúscula');
    }

    // Números
    if (!/[0-9]/.test(password)) {
      recomendaciones.push('Debe tener al menos un número');
    }

    // Caracteres especiales
    if (!/[!@#$%^&*()_\-+=;:'",<.>?]/.test(password)) {
      recomendaciones.push('Debe tener al menos un carácter especial (!@#$%^&*)');
    }

    // Patrones inseguros
    for (const pattern of patronesInseguros) {
      if (password.toLowerCase().includes(pattern)) {
        recomendaciones.push('No debe contener patrones inseguros como contraseñas comunes');
        break;
      }
    }

    // Repeticiones de caracteres
    if (/(\w)\1\1/.test(password)) {
      recomendaciones.push('No debe tener tres o más caracteres repetidos consecutivamente');
    }

    // Secuencias de caracteres
    if (/012|123|234|345|456|567|678|789|890/.test(password) ||
        /abc|bcd|cde|def|efg|fgh|ghi|hij/.test(password.toLowerCase())) {
      recomendaciones.push('No debe contener secuencias comunes de números o letras');
    }

    setRecommendations(recomendaciones);

    if (recomendaciones.length === 0) {
      return 'Fuerte';
    } else if (password.length >= 6 && recomendaciones.length <= 2) {
      return 'Aceptable';
    } else {
      return 'Débil';
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setContrasena(password);
    const strength = evaluarFortalezaContrasena(password);
    setPasswordStrength(strength);
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
      setCorreoError('Formato de correo inválido');
    } else {
      setCorreoError('');
    }
  
    setCorreoSugerencias(sugerencias);
  };
  

  const handleCorreoChange = (e) => {
    const value = sanitizeInput(e.target.value);
    setCorreo(value);
    evaluarCorreo(value);
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="registro-contenedor">
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
          <h2>Registro</h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={handleCorreoChange}
            required
          />
          {correoError ? (
            <div className="retroalimentacion">
              <p className="error">Error: {correoError}</p>
              <ul>
                {correoSugerencias.map((sugerencia, index) => (
                  <li key={index} style={{ color: 'red' }}>{sugerencia}</li>
                ))}
              </ul>
            </div>
          ) : correo && (
            <p style={{ color: 'green', fontWeight: 'bold' }}>El correo es válido</p>
          )}


          <label htmlFor="usuario">Nombre de usuario</label>
          <input
            type="text"
            id="usuario"
            placeholder="Ingresa tu nombre"
            value={usuario}
            onChange={(e) => setUsuario(sanitizeInput(e.target.value))}
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

          <div className="recaptcha-container">
            <ReCAPTCHA
              sitekey="6LewRWkqAAAAANUGc0gdQDNf-KScA4ZZuZRIe6sE"
              onChange={handleRecaptchaChange}
            />
          </div>

          <button type="submit" className="btn-registrar" disabled={passwordStrength !== 'Fuerte' || contrasena !== confirmarContrasena || !recaptchaToken}>
            Registrar
          </button>
          <div className="links">
            <Link to="/iniciar-sesion" className="olvidaste-contrasena">¿Ya tienes una cuenta? Iniciar sesión.</Link>
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

export default Registro;
