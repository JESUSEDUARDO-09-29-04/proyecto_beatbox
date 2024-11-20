import React, { useState, useEffect } from 'react';
import '../../home/Home.css';
import './RedesSocialesAdmin.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../adminMenu';
import { FaFacebook, FaInstagram, FaTwitter,  } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; 
import FooterH from '../../FooterH';

const RedesSocialesAdmin = () => {
  const navigate = useNavigate();
  const [redesSociales, setRedesSociales] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ tipo: '', link: '' });
  const [selectedRed, setSelectedRed] = useState(null);

  // Verificar si el usuario tiene el rol de admin
  useEffect(() => {
    const verificarRol = async () => {
      try {
        const userResponse = await fetch('https://beatbox-blond.vercel.app/auth/validate-user', {
          method: 'GET',
          credentials: 'include',
        });

        if (!userResponse.ok) {
          navigate('/iniciar-sesion');
          return;
        }

        const userData = await userResponse.json();
        const userRole = userData.role;
        if (userRole !== 'admin') {
          navigate('/iniciar-sesion');
        }
      } catch (error) {
        console.error('Error al verificar usuario:', error);
      }
    };

    verificarRol();
  }, [navigate]);

  // Cargar redes sociales
  useEffect(() => {
    const cargarRedesSociales = async () => {
      try {
        const response = await fetch('https://beatbox-blond.vercel.app/social/listar-todos', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setRedesSociales(data);
      } catch (error) {
        console.error('Error al cargar redes sociales:', error);
      }
    };

    cargarRedesSociales();
  }, []);

  // Abrir modal para agregar o modificar
  const abrirModal = (red = null) => {
    setModalVisible(true);
    setIsEditing(!!red);
    setSelectedRed(red);
    setFormData(red ? { tipo: red.tipo, link: red.link } : { tipo: '', link: '' });
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalVisible(false);
    setFormData({ tipo: '', link: '' });
    setSelectedRed(null);
  };

  // Manejar cambio de input en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Guardar red social (agregar o actualizar)
  const guardarRedSocial = async () => {
    try {
      const url = isEditing
        ? `https://beatbox-blond.vercel.app/social/agregar`
        : `https://beatbox-blond.vercel.app/social/agregar`;
      const method = 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const nuevaRedSocial = await response.json();
        setRedesSociales((prev) =>
          isEditing
            ? prev.map((red) => (red.tipo === selectedRed.tipo ? nuevaRedSocial : red))
            : [...prev, nuevaRedSocial]
        );
        cerrarModal();
      } else {
        console.error('Error al guardar la red social');
      }
    } catch (error) {
      console.error('Error de red al guardar la red social:', error);
    }
  };

  // Eliminar red social
  const eliminarRedSocial = async (tipo) => {
    const confirmacion = window.confirm(`¿Estás seguro de eliminar la red social ${tipo}?`);
    if (!confirmacion) return;

    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/social/eliminar/${tipo}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setRedesSociales((prev) => prev.filter((red) => red.tipo !== tipo));
      } else {
        console.error('Error al eliminar la red social');
      }
    } catch (error) {
      console.error('Error de red al eliminar la red social:', error);
    }
  };

  // Obtener el ícono según el tipo
  const obtenerIcono = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'facebook':
        return <FaFacebook />;
      case 'instagram':
        return <FaInstagram />;
      case 'x': 
        return <FaXTwitter />;
      default:
        return null;
    }
  };

  return (
    <div className="contenedor">
      <AdminMenu />
      <main className="contenido-principal">
        <h1>Gestión de Redes Sociales</h1>
        <button className="btn-agregar" onClick={() => abrirModal()}>Agregar Red Social</button>
        
        <table className="redes-sociales-tabla">
          <thead>
            <tr>
              <th>ÍCONO</th>
              <th>TIPO</th>
              <th>ENLACE</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {redesSociales.map((red) => (
              <tr key={red._id} data-tipo={red.tipo.toLowerCase()}>
                <td data-label="Ícono">{obtenerIcono(red.tipo.toLowerCase())}</td>
                <td data-label="Tipo">{red.tipo}</td>
                <td data-label="Enlace">
                  <a href={red.link} target="_blank" rel="noopener noreferrer">
                    {red.link}
                  </a>
                </td>
                <td data-label="Acciones">
                  <button className="btn-modificar" onClick={() => abrirModal(red)}>Modificar</button>
                  <button className="btn-eliminar" onClick={() => eliminarRedSocial(red.tipo)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={cerrarModal}>&times;</button>
            <h2>{isEditing ? 'Modificar Red Social' : 'Agregar Red Social'}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Tipo:
                {isEditing ? (
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    disabled // Tipo no puede cambiar en edición
                  />
                ) : (
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="X">X</option> {/* Actualizado */}
                    </select>
                )}
              </label>
              <label>
                Enlace:
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  className="input-grande"
                  onChange={handleChange}
                  required
                />
              </label>
              <div className="button-group">
                <button className="btn-guardar" onClick={guardarRedSocial}>
                  {isEditing ? 'Guardar Cambios' : 'Agregar'}
                </button>
                <button className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    <FooterH />
    </div>
  );
};

export default RedesSocialesAdmin;
