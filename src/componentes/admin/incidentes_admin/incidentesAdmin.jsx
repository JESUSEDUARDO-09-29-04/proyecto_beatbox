import React, { useState, useEffect } from 'react';
import '../../home/Home.css';
import './IncidentesAdmin.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../adminMenu';

const IncidentesAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [incidencia, setIncidencia] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

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
        console.error('Error de red al verificar el rol:', error);
      }
    };

    verificarRol();
  }, [navigate]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await fetch('https://beatbox-blond.vercel.app/usuarios', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };

    cargarUsuarios();
  }, []);

  const verIncidencias = async (usuario) => {
    setUsuarioSeleccionado(usuario);
    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/incident/${usuario}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = response.ok ? await response.json() : null;
      setIncidencia(
        data || {
          failedAttempts: 0,
          isBlocked: false,
          lastAttempt: null,
          blockExpiresAt: null,
        }
      );
      setModalVisible(true);
    } catch (error) {
      console.error('Error al cargar incidencia:', error);
      setIncidencia({
        failedAttempts: 0,
        isBlocked: false,
        lastAttempt: null,
        blockExpiresAt: null,
      });
      setModalVisible(true);
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setUsuarioSeleccionado('');
    setIncidencia(null);
  };

  return (
    <div className="contenedor">
      <AdminMenu />
      <main className="contenido-principal">
        <h1>Gestión de Incidencias</h1>
        <table className="incidentes-tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td data-label="Nombre">{usuario.usuario}</td>
                <td data-label="Correo Electrónico">{usuario.correo_Electronico}</td>
                <td data-label="Rol" className={`rol ${usuario.role === 'admin' ? 'admin' : 'usuario'}`}>
  {usuario.role}
</td>
                <td >
                  <button
                    className="btn-ver-incidencias"
                    onClick={() => verIncidencias(usuario.usuario)}
                  >
                    Ver Incidencias
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={cerrarModal}>
              &times;
            </button>
            <h2>Incidencias de {usuarioSeleccionado}</h2>
            {incidencia ? (
              <div>
                <p><strong>Intentos fallidos:</strong> {incidencia.failedAttempts}</p>
                <p><strong>Estado:</strong> {incidencia.isBlocked ? 'Bloqueado' : 'No Bloqueado'}</p>
                {incidencia.lastAttempt && (
                  <p>
                    <strong>Último intento:</strong>{' '}
                    {new Date(incidencia.lastAttempt).toLocaleString()}
                  </p>
                )}
                {incidencia.blockExpiresAt && (
                  <p>
                    <strong>Desbloqueo programado:</strong>{' '}
                    {new Date(incidencia.blockExpiresAt).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <p>El usuario no tiene incidencias registradas.</p>
            )}
          </div>
        </div>
      )}

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

export default IncidentesAdmin;
