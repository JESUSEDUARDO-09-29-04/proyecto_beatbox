import React, { useState, useEffect } from 'react';
import '../../home/Home.css';
import './EmpresaAdmin.css';
import AdminMenu from '../adminMenu';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { useNavigate } from 'react-router-dom';
import FooterH from '../../FooterH';

const EmpresaAdmin = () => {
  const [perfil, setPerfil] = useState([]);
  const [configuracion, setConfiguracion] = useState([]);
  const [campoSeleccionado, setCampoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoValor, setNuevoValor] = useState('');
  const [tituloModal, setTituloModal] = useState('');
  const [logoVigente, setLogoVigente] = useState(null);
  const [logos, setLogos] = useState([]);
  const [logosModalVisible, setLogosModalVisible] = useState(false);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const nombresCampos = {
    eslogan: 'Eslogan',
    mision: 'Misión',
    vision: 'Visión',
    maxFailedAttempts: 'Intentos Fallidos',
    lockTimeMinutes: 'Tiempo de Bloqueo (min)',
  };
 useEffect(() => {
    // Detectar si el body tiene la clase 'dark'
    const darkModeEnabled = document.body.classList.contains('dark');
    setIsDarkMode(darkModeEnabled);
  }, []);
  useEffect(() => {
    const verificarRol = async () => {
      try {
        const userResponse = await fetch('https://beatbox-blond.vercel.app/auth/validate-user', {
          method: 'GET',
          credentials: 'include',
        });

        if (!userResponse.ok) {
          navigate('/iniciar-sesion');
        } else {
          const userData = await userResponse.json();
          const userRole = userData.role;

          if (userRole !== 'admin') {
            navigate('/iniciar-sesion');
          }
        }
      } catch (error) {
        console.error('Error al verificar el rol:', error);
      }
    };

    verificarRol();
  }, [navigate]);

  useEffect(() => {
    const fetchLogoVigente = async () => {
      try {
        const response = await fetch('https://beatbox-blond.vercel.app/logos/vigente', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setLogoVigente(data.link);
        }
      } catch (error) {
        console.error('Error al cargar el logo vigente:', error);
      }
    };

    const fetchPerfil = async () => {
      try {
        const response = await fetch('https://beatbox-blond.vercel.app/perfil-empresa', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        const perfilSinId = Object.entries(data).filter(([campo]) => campo !== '_id' && campo !== 'updatedAt');
        setPerfil(perfilSinId);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    const fetchConfiguracion = async () => {
      try {
        const response = await fetch('https://beatbox-blond.vercel.app/configuracion', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setConfiguracion(Object.entries(data).filter(([campo]) => campo !== '_id'));
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      }
    };

    fetchLogoVigente();
    fetchPerfil();
    fetchConfiguracion();
  }, []);

  const abrirModal = (campo, valorActual, seccion) => {
    setCampoSeleccionado({ campo, seccion });
    setNuevoValor(valorActual);
    const nombreCampo = nombresCampos[campo] || campo;
    setTituloModal(`Modificar ${nombreCampo}`);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setCampoSeleccionado(null);
    setNuevoValor('');
    setModalVisible(false);
  };

  const actualizarCampo = async () => {
    const { campo, seccion } = campoSeleccionado;
    const url =
      seccion === 'perfil'
        ? `https://beatbox-blond.vercel.app/perfil-empresa/${campo}`
        : `https://beatbox-blond.vercel.app/configuracion/${campo}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ valor: nuevoValor }),
      });

      if (response.ok) {
        alert(`${nombresCampos[campo] || campo} actualizado exitosamente`);

        if (seccion === 'perfil') {
          setPerfil((prev) =>
            prev.map(([key, valor]) => (key === campo ? [key, nuevoValor] : [key, valor]))
          );
        } else {
          setConfiguracion((prev) =>
            prev.map(([key, valor]) => (key === campo ? [key, nuevoValor] : [key, valor]))
          );
        }

        cerrarModal();
      } else {
        alert('Error al actualizar el campo');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error de red al actualizar el campo');
    }
  };

  const handleUpload = async (url) => {
    try {
      const response = await fetch('https://beatbox-blond.vercel.app/logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ link: url }),
      });

      if (response.ok) {
        const newLogo = await response.json();
        setLogoVigente(newLogo.link);
        alert('Logo subido y configurado como vigente.');
      }
    } catch (error) {
      console.error('Error al subir el logo:', error);
    }
  };

  const fetchAllLogos = async () => {
    try {
      const response = await fetch('https://beatbox-blond.vercel.app/logos', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setLogos(data);
      }
    } catch (error) {
      console.error('Error al cargar los logos:', error);
    }
  };

  const setLogoAsVigente = async (id) => {
    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/logos/${id}/vigente`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        const updatedLogo = await response.json();
        setLogoVigente(updatedLogo.link);
        alert('Logo configurado como vigente.');
        fetchAllLogos();
      }
    
    } catch (error) {
      console.error('Error al establecer el logo vigente:', error);
    }
  };

  const deleteLogo = async (id) => {
    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/logos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Logo eliminado correctamente.');
        fetchAllLogos();
      }
    } catch (error) {
      console.error('Error al eliminar el logo:', error);
    }
  };

  return (
    <div className={`contenedor ${isDarkMode ? 'dark' : ''}`}>
      <AdminMenu />
      <main className="contenido-principal">
        <div className="cuadro-contenedor">
          <div className="cuadro">
            <h2>Subir Logotipo</h2>
            {logoVigente ? (
              <img src={logoVigente} alt="Logotipo Vigente" className="logo-preview" />
            ) : (
              <div className="logo-preview">No hay logotipo vigente</div>
            )}
            <CloudinaryUploadWidget onUpload={handleUpload} />
            <button
              className="btn-ver-todos"
              onClick={() => {
                fetchAllLogos();
                setLogosModalVisible(true);
              }}
            >
              Mostrar Todos los Logos
            </button>
          </div>

          <div className="row">
            <div className="cuadro">
              <h2>Perfil de la Empresa</h2>
              <table className="tabla-perfil">
                <tbody>
                  {perfil.map(([campo, valor]) => (
                    <tr key={campo}>
                      <td>{nombresCampos[campo] || campo}:</td>
                      <td>
                        <input type="text" value={valor} readOnly className="input-perfil" />
                      </td>
                      <td>
                        <button
                          className="btn-actualizar"
                          onClick={() => abrirModal(campo, valor, 'perfil')}
                        >
                          Modificar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cuadro">
              <h2>Configuración de Bloqueo</h2>
              <table className="tabla-configuracion">
                <tbody>
                  {configuracion.map(([campo, valor]) => (
                    <tr key={campo}>
                      <td>{nombresCampos[campo] || campo}:</td>
                      <td>
                        <input type="text" value={valor} readOnly className="input-configuracion" />
                      </td>
                      <td>
                        <button
                          className="btn-actualizar"
                          onClick={() => abrirModal(campo, valor, 'configuracion')}
                        >
                          Modificar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {modalVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="modal-close" onClick={cerrarModal}>
                &times;
              </button>
              <h2 className="h2-modal">
                Modificar {nombresCampos[campoSeleccionado?.campo] || campoSeleccionado?.campo}
              </h2>
              <textarea
                value={nuevoValor}
                onChange={(e) => setNuevoValor(e.target.value)}
                className="textarea-perfil"
              />
              <div className="button-group">
                <button className="btn-guardar" onClick={actualizarCampo}>
                  Guardar
                </button>
                <button className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {logosModalVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="modal-close" onClick={() => setLogosModalVisible(false)}>
                &times;
              </button>
              <h2>Todos los Logos</h2>
              <div className="logos-grid">
                {logos.map((logo) => (
                  <div key={logo._id} className="logo-item">
                    <img src={logo.link} alt="Logo" className="logo-thumbnail" />
                    <div className="logo-buttons">
                      <button
                        className="btn-vigente"
                        onClick={() => setLogoAsVigente(logo._id)}
                      >
                        Hacer Vigente
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => deleteLogo(logo._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <FooterH />
    </div>
  );
};

export default EmpresaAdmin;
