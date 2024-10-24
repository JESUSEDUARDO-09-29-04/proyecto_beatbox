import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './componentes/home/Home';
import InicioSesion from './componentes/inicio_sesion/InicioSesion';
import Registro from './componentes/registro/Registro';
import RecuperarContrasena from './componentes/recuperar_contrasena/RecuperarContrasena'; // Importa el nuevo módulo
import VerificarCorreo from './componentes/verificar_correo/VerificarCorreo'; // Importar el formulario de verificación
import CambiarContrasena from './componentes/cambiar_contraseña/CambiarContrasena';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/iniciar-sesion" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} /> {/* Nueva ruta */}
        <Route path="/verificar-correo" element={<VerificarCorreo />} /> {/* Ruta para verificar correo */}
        <Route path="/cambiar_contraseña" element={<CambiarContrasena />} /> {/* Ruta para verificar correo */}

      </Routes>
    </Router>
  );
};

export default App;
