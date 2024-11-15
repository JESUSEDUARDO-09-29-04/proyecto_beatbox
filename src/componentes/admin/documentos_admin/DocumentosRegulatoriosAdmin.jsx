import React, { useState, useEffect  } from 'react';
import '../../home/Home.css';
import './DocumentosRegulatoriosAdmin.css'; // Asegúrate de crear este archivo CSS para los estilos específicos
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../adminMenu';

const DocumentosRegulatoriosAdmin = () => {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [documentoId, setDocumentoId] = useState(null);

  const [formDataCrear, setFormDataCrear] = useState({ tipo: '', descripcion: '' });
  const [formDataEditar, setFormDataEditar] = useState({ descripcion: '' });

  useEffect(() => {
    const cargarDocumentos = async () => {
      try {
        const response = await fetch('https://beatbox-blond.vercel.app/documentos', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setDocumentos(data);
      } catch (error) {
        console.error('Error al cargar documentos:', error);
      }
    };
    cargarDocumentos();
  }, []);
  
  // Abrir el modal de creación
  const abrirModalCrear = () => {
    setFormDataCrear({ tipo: '', descripcion: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  // Abrir el modal de edición
  const abrirModalEditar = (documento) => {
    setFormDataEditar({ descripcion: documento.descripcion });
    setDocumentoId(documento._id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setFormDataCrear({ tipo: '', descripcion: '' });
    setFormDataEditar({ descripcion: '' });
  };

  // Manejar cambios en el formulario de creación
  const handleChangeCrear = (e) => {
    setFormDataCrear({ ...formDataCrear, [e.target.name]: e.target.value });
  };

  // Manejar cambios en el formulario de edición
  const handleChangeEditar = (e) => {
    setFormDataEditar({ ...formDataEditar, [e.target.name]: e.target.value });
  };

  // Enviar el formulario de creación
  const handleFormSubmitCrear = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://beatbox-blond.vercel.app/documentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataCrear),
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setDocumentos([...documentos, data]);
        cerrarModal();
      } else {
        console.error('Error en el servidor:', data);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  // Enviar el formulario de edición
  const handleFormSubmitEditar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/documentos/${documentoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataEditar),
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setDocumentos(documentos.map((doc) => (doc._id === documentoId ? data : doc)));
        cerrarModal();
      } else {
        console.error('Error en el servidor:', data);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const eliminarDocumento = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este documento?');
    if (!confirmar) return;

    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/documentos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setDocumentos((prevDocs) => prevDocs.filter((doc) => doc._id !== id));
      } else {
        console.error('Error al eliminar documento');
      }
    } catch (error) {
      console.error('Error de red al eliminar documento:', error);
    }
  };

  return (
    <div className="contenedor">
      <AdminMenu />

      {/* Contenido principal */}
      <main className="contenido-principal">
        <div className="deslinde-admin-contenedor">
          <header className="deslinde-admin-header">
            <h1>Filtro de documentos por tipo o vigentes</h1>
            <button className="btn-agregar" onClick={abrirModalCrear}>Agregar nuevo documento</button>
          </header>

          {/* Tabla de documentos */}
          <table className="deslinde-tabla">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Versión</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Vigente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((documento) => (
                <tr key={documento._id}>
                  <td>{documento.tipo}</td>
                  <td>{documento.descripcion}</td>
                  <td>{documento.version}</td>
                  <td>{new Date(documento.fechaInicio).toLocaleDateString()}</td>
                  <td>{documento.fechaFin ? new Date(documento.fechaFin).toLocaleDateString() : 'N/A'}</td>
                  <td>{documento.vigente ? 'Sí' : 'No'}</td>
                  <td>
                    <button className="btn-modificar" onClick={() => abrirModalEditar(documento)}>
                      Modificar
                    </button>
                    <button className="btn-eliminar" onClick={() => eliminarDocumento(documento._id)}>
                      Eliminar
                    </button>
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
            <h2>{isEditing ? 'Modificar Documento' : 'Agregar Documento'}</h2>
            <form onSubmit={isEditing ? handleFormSubmitEditar : handleFormSubmitCrear}>
              {!isEditing && (
                <>
                  <label>
                    Tipo
                    <select name="tipo" value={formDataCrear.tipo} onChange={handleChangeCrear} required>
                      <option value="">Seleccione un tipo</option>
                      <option value="Políticas de privacidad">Políticas de privacidad</option>
                      <option value="Deslinde">Deslinde</option>
                      <option value="Perfil de la Empresa">Perfil de la Empresa</option>
                      <option value="Términos y condiciones">Términos y condiciones</option>
                    </select>
                  </label>
                </>
              )}
              <label>
                Descripción
                <textarea
                  name="descripcion"
                  value={isEditing ? formDataEditar.descripcion : formDataCrear.descripcion}
                  onChange={isEditing ? handleChangeEditar : handleChangeCrear}
                  required
                />
              </label>
              <div className="button-group">
                <button type="submit" className="btn-guardar">
                  {isEditing ? 'Guardar Cambios' : 'Agregar Documento'}
                </button>
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default DocumentosRegulatoriosAdmin;
