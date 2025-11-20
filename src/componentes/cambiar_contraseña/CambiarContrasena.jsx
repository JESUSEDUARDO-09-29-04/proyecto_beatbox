"use client"

import { useState, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./CambiarContrasena.css"
import "../home/Home.css"
import { FaEye, FaEyeSlash, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa"
import "@fortawesome/fontawesome-free/css/all.min.css"
import FooterH from "../FooterH"
import HeaderH from "../HeaderH"
import Breadcrumbs from "../Breadcrumbs"
import { ThemeContext } from "../../context/ThemeContext" // Importamos el contexto del tema

const CambiarContrasena = () => {
  const [contrasena, setContrasena] = useState("")
  const [confirmarContrasena, setConfirmarContrasena] = useState("")
  const [passwordStrength, setPasswordStrength] = useState("") // Fortaleza de la contraseña
  const [recommendations, setRecommendations] = useState([]) // Recomendaciones para mejorar contraseña
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useContext(ThemeContext) // Obtenemos el tema actual del contexto

  // Obtener el token de la URL
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get("token")

  const sanitizeInput = (input) => {
    return input.replace(/<|>|&|\/|\\/g, "") // Eliminar caracteres peligrosos
  }

  const handlePasswordChange = (e) => {
    const password = sanitizeInput(e.target.value)
    setContrasena(password)

    // Evaluar fortaleza de la contraseña
    const strength = evaluarFortalezaContrasena(password)
    setPasswordStrength(strength)
  }

  const handleConfirmPasswordChange = (e) => setConfirmarContrasena(sanitizeInput(e.target.value))

  const toggleMenu = () => setMenuAbierto(!menuAbierto)

  const evaluarFortalezaContrasena = (password) => {
    const patronesInseguros = [
      // Contraseñas numéricas comunes
      "123456",
      "123456789",
      "12345678",
      "1234567",
      "1234567890",
      "123123",
      "000000",
      "111111",
      "222222",
      "333333",
      "444444",
      "555555",
      "666666",
      "777777",
      "888888",
      "999999",
      "1234",
      "12345",
      "987654321",
      "121212",
      "112233",
      // Contraseñas basadas en letras comunes
      "password",
      "password1",
      "passw0rd",
      "password123",
      "admin",
      "welcome",
      "letmein",
      "sunshine",
      "master",
      "shadow",
      "login",
      "default",
      "guest",
      "root",
      // Frases y palabras comunes
      "iloveyou",
      "monkey",
      "football",
      "baseball",
      "dragon",
      "superman",
      "batman",
      "michael",
      "soccer",
      "charlie",
      "buster",
      "tigger",
      "jordan",
      "buster123",
      "hello",
      "freedom",
      "whatever",
      "princess",
      "qwerty",
      "qwerty123",
      "asdfgh",
      "zxcvbn",
      "zxcvb",
      // Contraseñas con patrones en teclado
      "1q2w3e",
      "1q2w3e4r",
      "1qaz2wsx",
      "qwertyuiop",
      "asdfghjkl",
      "zxcvbnm",
      "poiuytrewq",
      "lkjhgfdsa",
      "mnbvcxz",
      "qazwsx",
      "wsxedc",
      "edcrfv",
      // Nombres y fechas comunes
      "john",
      "john123",
      "michael",
      "michael123",
      "david",
      "david123",
      "jessica",
      "jessica123",
      "1990",
      "1991",
      "1992",
      "1993",
      "1994",
      "1995",
      "1996",
      "2000",
      "2001",
      "2002",
      "2022",
      "2023",
      "abcd1234",
      // Variantes comunes de palabras
      "pass123",
      "mypassword",
      "mypassword123",
      "trustno1",
      "letmein123",
      "password!",
      "password@",
      "password#",
      "password$",
      "passw0rd!",
      "passw0rd@",
      "pass1234",
      "securepassword",
      "abc123456",
      "1234abcd",
      "1q2w3e4r5t",
      "qwerty1234",
      "asdfgh1234",
      // Palabras cortas inseguras
      "love",
      "baby",
      "angel",
      "sex",
      "god",
      "money",
      "hero",
      "secret",
      "star",
      "test",
      // Variantes de contraseñas inseguras
      "p@ssw0rd",
      "p@ssword123",
      "P@ssw0rd",
      "P@ssword!",
      "123qwe",
      "123asd",
      "1qazxsw2",
      "qweasd",
      "admin123",
      "admin@123",
      "qwerty@123",
      "pass1234!",
      "password2023",
      "spring2023",
      // Secuencias y repeticiones
      "abcd1234",
      "aaa111",
      "abcabc",
      "aaaaaa",
      "bbbbbb",
      "cccccc",
      "asdfasdf",
      "123abc",
      "654321",
      "qweqwe",
      "xyz123",
      "xy1234",
      "abcdabcd",
      "12341234",
      // Simples con caracteres especiales
      "password!",
      "admin!",
      "qwerty!",
      "123456!",
      "pass@123",
      "welcome@2023",
      "letmein@123",
      // Palabras de uso común
      "family",
      "love123",
      "friend",
      "freedom123",
      "hello123",
      "team",
      "sports",
      "football123",
      // Patrones complejos pero predecibles
      "123456A@",
      "abcdef1!",
      "1234abcd!",
      "password!@",
      "Pass123!",
      "Qwerty123!",
      "Admin123$",
      // Combinaciones alfanuméricas simples
      "1A2B3C",
      "ABC123",
      "123ABC",
      "A1B2C3",
      "111aaa",
      "aaa111",
      "123456Aa@",
      "Aa123456!",
      "123456",
      "123456789",
      "12345678",
      "1234567",
      "1234567890",
      "123123",
      "000000",
      "111111",
      "222222",
      "333333",
      "444444",
      "555555",
      "666666",
      "777777",
      "888888",
      "999999",
      "abcd1234",
      "P@ssword1",
      "Welcome2023!",
      "Admin@1234",
      "Qwerty123!",
      "Aa12345!",
      "AaAaAa123!",
      "1!1!1!AaBb",
      "Aa@123123",
      "111Aa!@",
      "1234Qwe!",
      "QWEasd123!",
      "ASDFghjkl@123",
      "ZXCVbnm123!",
      "1234abcdABCD@",
      "1qaz!QAZ",
      "2wsx@WSX",
      "3edc#EDC",
      "4rfv$RFV",
      "5tgb%TGB",
      // Contraseñas alfanuméricas simples
      "ABC123",
      "123ABC",
      "A1B2C3",
      "a1b2c3",
      "111aaa",
      "aaa111",
      "123aaa",
      "aaa123",
      "abc123",
      "123abc",
      "1A2B3C",
      "3C2B1A",
      "1234ABcd",
      "ABCD1234",
      "abcdABCD1!",
      "1a2b3c4d",
      "1A2b3C!@",
      "AaBbCc123",
      "123AaBbCc",

      // Uso de símbolos con patrones predecibles
      "123456Aa@",
      "Aa123456!",
      "1!1!1!AaBb",
      "Aa@123123",
      "111Aa!@",
      "Aa!@#$123",
      "!@#123ABC",
      "ABC!@#123",
      "@@@111aaa",
      "aaa@@@111",
      "123$%^ABC",
      "ABC$%^123",

      // Contraseñas comunes con ligeras variaciones
      "P@ssword1",
      "P@ssw0rd!",
      "P@ssword123",
      "Passw0rd!",
      "Admin123!",
      "Admin@2023",
      "Welcome2023!",
      "Qwerty123!",
      "Password2023!",
      "Pass@word!",
      "123Password!",
      "Passw@rd1!",

      // Secuencias alfanuméricas cortas repetitivas
      "AaAaAa123!",
      "BbBbBb123@",
      "123AaAaBb",
      "1234BbBbAa",
      "A1A1A1Bb!",
      "BbBb123!",
      "AbAbAb123!",
      "AbcAbc123",
      "1A1B1C!",
      "1a1b1c!",
      "123AaBb!",
      "BbAa123!",

      // Contraseñas basadas en nombres o fechas
      "John123!",
      "Jane2023!",
      "Michael@123",
      "David@123",
      "Jessica!2022",
      "1990Aa@",
      "2000Aa@",
      "Admin!2023",
      "Admin@2022",
      "Root123!",
      "User123!",
      "Test@123",

      // Variantes cortas inseguras
      "Test123!",
      "Test@123",
      "Password!@",
      "Abc@1234",
      "1qaz2wsx!",
      "2wsx3edc!",
      "Qaz!@123",
      "Qwe@1234",
      "Asd@1234",
      "Zxc@1234",
      "123Asd!",
      "Asd!123",

      // Combinaciones predecibles con teclado en zigzag
      "1qaz!QAZ",
      "2wsx@WSX",
      "3edc#EDC",
      "4rfv$RFV",
      "5tgb%TGB",
      "6yhn^YHN",
      "7ujm&UJM",
      "8ik,<IK<",
      "9ol.>OL>",
      "0p;/[P;/",
      "qazwsx123!",
      "edcrfv@2023",

      // Contraseñas con caracteres alternados
      "A1B2C3D4!",
      "a1b2c3d4!",
      "Z1X2C3V4!",
      "z1x2c3v4!",
      "M1N2B3V4!",
      "1A1a2B2b!",
      "123AaBbCc",
      "A1aB2bC3c!",
      "1Q1q2W2w!",
      "Aa123Bb!",
      "1234AaBb!",
      "AaBbCc123!",

      // Combinaciones de palabras inseguras
      "Hello123!",
      "Family2023!",
      "Freedom!2023",
      "Sports123!",
      "Love@2023",
      "Angel123!",
      "Superman2023!",
      "Batman2023!",
      "Soccer123!",
      "Football123!",
      "Music2023!",

      // Repeticiones de teclas y combinaciones numéricas básicas
      "123321Aa!",
      "321123Aa!",
      "112233Aa!",
      "Aa123321!",
      "111222Aa!",
      "Aa@112233!",
      "1Q2W3E!",
      "2W3E4R!",
      "Q1W2E3!",
      "1A1B1C!",
      "1a2b3c!",
      "123abcABC!",

      // Palabras cortas con caracteres especiales
      "Test!123",
      "Pass!2023",
      "Qwerty!2023",
      "Test@2023!",
      "Root!1234",
      "AaBb123!",
      "Test@Password!",
      "Password!Test@",
      "Abc@1234!",
      "1234Test!@#",

      // Otras combinaciones inseguras
      "QWErty@123!",
      "123Asdfgh!",
      "Asdf123Qwe!",
      "123Zxcvb!",
      "AsdfZxcvb123!",
      "Aa@123Qwerty",
      "Aa@123Asdf!",
      "Zxcvbn123!",
      "Zxcvbn@123!",
      "Qwert123!@#",
      "Admin123@2023!",
      "Welcome@1234!",
      "Secure@1234!",
      "Default@1234!",
      "Qwerty@2023!",
    ]

    const recomendaciones = []

    // Validaciones generales
    if (password.length < 6) {
      recomendaciones.push("Debe tener al menos 6 caracteres")
    }
    if (!/[A-Z]/.test(password)) {
      recomendaciones.push("Debe tener al menos una letra mayúscula")
    }
    if (!/[a-z]/.test(password)) {
      recomendaciones.push("Debe tener al menos una letra minúscula")
    }
    if (!/[0-9]/.test(password)) {
      recomendaciones.push("Debe tener al menos un número")
    }
    if (!/[!@#$%^&*]/.test(password)) {
      recomendaciones.push("Debe tener al menos un carácter especial (!@#$%^&*)")
    }

    // Validación contra patrones inseguros
    for (const pattern of patronesInseguros) {
      if (password.toLowerCase().includes(pattern)) {
        recomendaciones.push("No debe contener patrones inseguros como contraseñas comunes")
        break
      }
    }

    // Validación de repeticiones de caracteres
    if (/(\w)\1\1/.test(password)) {
      recomendaciones.push("No debe tener tres o más caracteres repetidos consecutivamente")
    }

    setRecommendations(recomendaciones)

    if (recomendaciones.length === 0) {
      return "Fuerte"
    } else if (recomendaciones.length <= 2) {
      return "Débil"
    } else {
      return "Muy débil"
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (passwordStrength !== "Fuerte") {
      setError("La contraseña no cumple con los requisitos de seguridad")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("https://backendbeat-serverbeat.586pa0.easypanel.host/auth/reset/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: contrasena,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        alert("Contraseña actualizada exitosamente")
        navigate("/iniciar-sesion")
      } else {
        setError(data.message || "Error al actualizar la contraseña")
      }
    } catch (error) {
      setError("Error al conectar con el servidor")
    }

    setLoading(false)
  }

  // Función para determinar la clase del indicador de fortaleza
  const getStrengthClass = () => {
    if (!contrasena) return ""
    switch (passwordStrength) {
      case "Muy débil":
        return "very-weak"
      case "Débil":
        return "weak"
      case "Fuerte":
        return "very-strong"
      default:
        return ""
    }
  }

  return (
    <div className={`contenedor ${theme}`}>
      <HeaderH />
      <div className="breadcrumb-container">
        <Breadcrumbs />
      </div>

      <form className="formulario" onSubmit={handleSubmit}>
        <div className="form-header">
          <FaShieldAlt
            style={{
              fontSize: "32px",
              color: theme === "dark" ? "#ff9933" : "#ff8800",
              marginBottom: "15px",
            }}
          />
          <h2>Cambiar Contraseña</h2>
        </div>

        {error && (
          <div className="error">
            <FaExclamationTriangle style={{ marginRight: "8px" }} /> {error}
          </div>
        )}

        <div className="form-group">
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
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {contrasena && (
            <>
              <div className={`strength-indicator ${getStrengthClass()}`}></div>
              <p
                style={{
                  color:
                    passwordStrength === "Fuerte"
                      ? theme === "dark"
                        ? "#81c784"
                        : "#27ae60"
                      : passwordStrength === "Débil"
                        ? theme === "dark"
                          ? "#ffb74d"
                          : "#e67e22"
                        : theme === "dark"
                          ? "#e57373"
                          : "#e74c3c",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {passwordStrength === "Fuerte" ? <FaCheckCircle /> : <FaInfoCircle />}
                Fortaleza de la contraseña: {passwordStrength}
              </p>

              {recommendations.length > 0 && (
                <ul>
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        <div className="form-group">
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
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {confirmarContrasena && contrasena === confirmarContrasena && (
            <p
              style={{
                color: theme === "dark" ? "#81c784" : "#27ae60",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <FaCheckCircle /> Las contraseñas coinciden
            </p>
          )}

          {confirmarContrasena && contrasena !== confirmarContrasena && (
            <p
              style={{
                color: theme === "dark" ? "#e57373" : "#e74c3c",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <FaExclamationTriangle /> Las contraseñas no coinciden
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn-cambiar"
          disabled={
            loading ||
            !contrasena ||
            !confirmarContrasena ||
            contrasena !== confirmarContrasena ||
            passwordStrength !== "Fuerte"
          }
        >
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
      </form>

      <FooterH />
    </div>
  )
}

export default CambiarContrasena

