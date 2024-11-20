import React, { useState, useEffect } from 'react';
import '../../home/Home.css';
import './UsuariosAdmin.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../adminMenu';
import FooterH from '../../FooterH';

const UsuariosAdmin = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {

    const verificarRol = async () => {
  
      try {
        //ruta local const userResponse = await fetch('http://localhost:3000/auth/validate-user', {
 
        const userResponse = await fetch('https://beatbox-blond.vercel.app/auth/validate-user', {
          method: 'GET',
          credentials: 'include', // Incluye las cookies en la solicitud
        });

        if (!userResponse.ok) {
          navigate('/iniciar-sesion');
            
          if(navigate('/iniciar-sesion') === ""){
            alert('Error al verificar usuario');
          }
        }

          if (userResponse.ok){
          const userData = await userResponse.json();
          const userRole = userData.role;

          if (userRole !== 'admin' ) {
            navigate('/iniciar-sesion');
          }
        }
      
    
    
    } catch (error) {
      console.error('Error de red al iniciar sesión', error);

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

  const cerrarModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const eliminarUsuario = async (userId, userName) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar a ${userName}?`);
    if (!confirmacion) return;

    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/usuarios/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario._id !== userId));
        setModalMessage(`El usuario ${userName} ha sido eliminado exitosamente.`);
        setModalVisible(true);
      } else {
        console.error('Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error de red al eliminar usuario:', error);
    }
  };

  const toggleBloqueoUsuario = async (userId, bloqueado) => {
    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/usuarios/bloquear/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bloquear: !bloqueado }), // Cambiar el estado de bloqueo
      });
  
      if (response.ok) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario._id === userId ? { ...usuario, bloqueado: !usuario.bloqueado } : usuario
          )
        );
        setModalMessage(`El usuario ha sido ${!bloqueado ? 'bloqueado' : 'desbloqueado'} exitosamente.`);
        setModalVisible(true);
      } else {
        console.error('Error al cambiar estado de bloqueo');
      }
    } catch (error) {
      console.error('Error de red al cambiar estado de bloqueo:', error);
    }
  };

  return (
    <div className="contenedor">
      <AdminMenu />

      <main className="contenido-principal">
        <div className="usuarios-admin-contenedor">
          <header className="usuarios-admin-header">
            <h1>Gestión de Usuarios</h1>
          </header>
          
          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
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
                  <td data-label="Acciones">
                    <div className="button-group">
                      <button
                        className={`btn-estado ${usuario.bloqueado ? 'bloqueado' : 'activo'}`}
                        onClick={() => toggleBloqueoUsuario(usuario._id, usuario.bloqueado)}
                      >
                        {usuario.bloqueado ? 'Desbloquear' : 'Bloquear'}
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarUsuario(usuario._id, usuario.usuario)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={cerrarModal}>
              &times;
            </button>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}

<FooterH />
    </div>
  );
};

export default UsuariosAdmin;
