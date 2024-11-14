import React, { useState, useEffect } from 'react';
import '../../home/Home.css';
import './EmpresaAdmin.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminMenu from '../adminMenu';

const EmpresaAdmin = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Estado para los datos de la empresa con valores iniciales
  const [empresa, setEmpresa] = useState({
    logo: logo || "", // Usar logo o una cadena vacía
    eslogan: "",
    mision: "",
    vision: "",
    tiempoBloqueo: 0,
  });

  // Cargar datos de la empresa desde el backend
  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await axios.get('/api/empresa');
        setEmpresa({
          logo: response.data.logo || "", // Logo o cadena vacía
          eslogan: response.data.eslogan || "", // Cadena vacía si es undefined
          mision: response.data.mision || "",
          vision: response.data.vision || "",
          tiempoBloqueo: response.data.tiempoBloqueo ?? 0, // 0 si es undefined o null
        });
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchEmpresaData();
  }, []);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      [name]: value,
    }));
  };

  // Actualizar un campo específico en el backend
  const actualizarCampo = async (campo) => {
    try {
      await axios.put(`/api/empresa/${campo}`, { [campo]: empresa[campo] });
      alert(`${campo.charAt(0).toUpperCase() + campo.slice(1)} actualizado exitosamente`);
    } catch (error) {
      console.error(`Error updating ${campo}:`, error);
      alert(`Hubo un error al actualizar ${campo}`);
    }
  };

  // Guardar todos los cambios
  const guardarCambios = async () => {
    try {
      await axios.put('/api/empresa', empresa);
      alert('Todos los cambios han sido guardados exitosamente');
    } catch (error) {
      console.error("Error saving all changes:", error);
      alert('Hubo un error al guardar los cambios');
    }
  };

  // Alternar el menú
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <div className="contenedor">
      <AdminMenu />

      {/* Contenido principal de la empresa */}
      <main className="contenido-principal">
        <div className="empresa-admin-contenedor">
          <header className="empresa-admin-header">
            <h1>Administración de la Empresa</h1>
            <button className="btn-guardar" onClick={guardarCambios}>Guardar Cambios</button>
          </header>

          <table className="empresa-tabla">
            <tbody>
              {/* Logo */}
              <tr className="empresa-item">
                <td><label>Logotipo de la empresa:</label></td>
                <td>
                  <img src={empresa.logo} alt="Logotipo de la empresa" className="logo-empresa" />
                </td>
                <td>
                  <button className="btn-actualizar" onClick={() => actualizarCampo('logo')}>Actualizar</button>
                </td>
              </tr>

              {/* Eslogan */}
              <tr className="empresa-item">
                <td><label>Eslogan:</label></td>
                <td>
                  <input
                    type="text"
                    name="eslogan"
                    value={empresa.eslogan || ""}
                    onChange={handleInputChange}
                    className="input-empresa"
                  />
                </td>
                <td>
                  <button className="btn-actualizar" onClick={() => actualizarCampo('eslogan')}>Actualizar</button>
                </td>
              </tr>

              {/* Misión */}
              <tr className="empresa-item">
                <td><label>Misión:</label></td>
                <td>
                  <textarea
                    name="mision"
                    value={empresa.mision || ""}
                    onChange={handleInputChange}
                    className="input-empresa"
                  />
                </td>
                <td>
                  <button className="btn-actualizar" onClick={() => actualizarCampo('mision')}>Actualizar</button>
                </td>
              </tr>

              {/* Visión */}
              <tr className="empresa-item">
                <td><label>Visión:</label></td>
                <td>
                  <textarea
                    name="vision"
                    value={empresa.vision || ""}
                    onChange={handleInputChange}
                    className="input-empresa"
                  />
                </td>
                <td>
                  <button className="btn-actualizar" onClick={() => actualizarCampo('vision')}>Actualizar</button>
                </td>
              </tr>

              {/* Tiempo de Bloqueo */}
              <tr className="empresa-item">
                <td><label>Tiempo de Bloqueo de Usuarios (días):</label></td>
                <td>
                  <input
                    type="number"
                    name="tiempoBloqueo"
                    value={empresa.tiempoBloqueo ?? 0}
                    onChange={handleInputChange}
                    className="input-empresa"
                  />
                </td>
                <td>
                  <button className="btn-actualizar" onClick={() => actualizarCampo('tiempoBloqueo')}>Actualizar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

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

export default EmpresaAdmin;
