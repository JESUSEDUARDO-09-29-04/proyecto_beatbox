// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import Home from './componentes/home/Home';
import HomeUsuarioLogueado from './componentes/home_login/HomeUsuarioLogueado';
import HomeUsuarioAdmin from "./componentes/admin/home_admin/Home_Admin";
import UsuarioAdmin from "./componentes/admin/usuarios_admin/UsuariosAdmin";
import InicioSesion from './componentes/inicio_sesion/InicioSesion';
import Registro from './componentes/registro/Registro';
import RecuperarContrasena from './componentes/recuperar_contrasena/RecuperarContrasena';
import VerificarCorreo from './componentes/verificar_correo/VerificarCorreo';
import CrudDeslinde from './componentes/Crud_Deslinde/CrudDeslinde';
import CambiarContrasena from './componentes/cambiar_contraseña/CambiarContrasena';
import { ThemeContext } from './context/ThemeContext'; // Asegúrate que la ruta sea correcta
import './App.css';

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`app ${theme}`}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home-login" element={<HomeUsuarioLogueado />} />
          <Route path="/home-admin" element={<HomeUsuarioAdmin />} />
          <Route path="/iniciar-sesion" element={<InicioSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/verificar-correo" element={<VerificarCorreo />} />
          <Route path="/cambiar_contraseña" element={<CambiarContrasena />} />
          <Route path="/crud_deslinde" element={<CrudDeslinde />} />
          <Route path="/usuario_admin" element={<UsuarioAdmin />} />
        </Routes>
      </Router>
      {/* Botón flotante para cambiar el tema */}
      <button id="theme-toggle-button" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default App;
