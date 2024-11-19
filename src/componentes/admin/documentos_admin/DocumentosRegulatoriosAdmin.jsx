import React, { useState, useEffect } from 'react';
import '../../home/Home.css';
import './DocumentosRegulatoriosAdmin.css';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../adminMenu';

const DocumentosRegulatoriosAdmin = () => {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState([]);
  const [filtro, setFiltro] = useState('vigentes'); // Default: "vigentes"
  const [tiposDisponibles, setTiposDisponibles] = useState([]); // Tipos de documentos para filtrar
  const [tipoSeleccionado, setTipoSeleccionado] = useState(''); // Tipo seleccionado
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [documentoId, setDocumentoId] = useState(null);
  const [formDataCrear, setFormDataCrear] = useState({ tipo: '', descripcion: '' });
  const [formDataEditar, setFormDataEditar] = useState({ descripcion: '' });
  const [disableDefaultOption, setDisableDefaultOption] = useState(false); 

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
    const cargarDocumentos = async () => {
      try {
        const response = await fetch('https://beatbox-blond.vercel.app/documentos', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setDocumentos(data);

        // Extraer tipos únicos
        const tipos = [...new Set(data.map((doc) => doc.tipo))];
        setTiposDisponibles(tipos);
      } catch (error) {
        console.error('Error al cargar documentos:', error);
      }
    };
    cargarDocumentos();
  }, []);

  const abrirModalCrear = () => {
    setFormDataCrear({ tipo: '', descripcion: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

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

  const handleChangeCrear = (e) => {
    setFormDataCrear({ ...formDataCrear, [e.target.name]: e.target.value });
  };

  const handleChangeEditar = (e) => {
    setFormDataEditar({ ...formDataEditar, [e.target.name]: e.target.value });
  };

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
        setDocumentos((prevDocs) =>
          prevDocs.map((doc) => (doc._id === id ? { ...doc, eliminado: true, fechaFin: new Date() } : doc))
        );
      } else {
        console.error('Error al eliminar documento');
      }
    } catch (error) {
      console.error('Error de red al eliminar documento:', error);
    }
  };

  const documentosFiltrados = () => {
    if (filtro === 'vigentes') {
      return documentos.filter((doc) => doc.vigente && !doc.eliminado);
    } else if (filtro === 'tipo' && tipoSeleccionado) {
      const documentosPorTipo = documentos.filter((doc) => doc.tipo === tipoSeleccionado);
      return documentosPorTipo.sort((a, b) => {
        if (a.vigente && !b.vigente) return -1;
        if (!a.vigente && b.vigente) return 1;
        if (a.eliminado && !b.eliminado) return 1;
        return b.version.localeCompare(a.version); // Orden descendente por versión
      });
    } else if (filtro === 'historial') {
      return documentos.sort((a, b) => {
        if (a.tipo !== b.tipo) return a.tipo.localeCompare(b.tipo);
        if (a.vigente && !b.vigente) return -1;
        if (!a.vigente && b.vigente) return 1;
        if (a.eliminado && !b.eliminado) return 1;
        return b.version.localeCompare(a.version); // Orden descendente por versión
      });
    }
    return [];
  };

  return (
    <div className="contenedor">
      <AdminMenu />

      <main className="contenido-principal">
        <div className="deslinde-admin-contenedor">
          <header className="deslinde-admin-header">
            <h1>Gestión de Documentos Regulatorios</h1>
            <button className="btn-agregar" onClick={abrirModalCrear}>
              Agregar nuevo documento
            </button>
          </header>

          <div className="filtro-container">
            <label htmlFor="filtro">Filtrar por:</label>
            <select
              id="filtro"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="vigentes">Vigentes</option>
              <option value="tipo">Por tipo</option>
              <option value="historial">Historial completo</option>
            </select>

            {filtro === 'tipo' && (
              <select
                id="tipo"
                value={tipoSeleccionado}
                onChange={(e) => {
                  setTipoSeleccionado(e.target.value);
                  setDisableDefaultOption(true); // Deshabilita la opción por defecto
                }}
              >
                <option value="" disabled={disableDefaultOption}>
                  Seleccione un tipo
                </option>
                {tiposDisponibles.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            )}
          </div>

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
              {documentosFiltrados().map((documento) => (
                <tr
                  key={documento._id}
                  style={{ backgroundColor: documento.eliminado ? 'yellow' : 'transparent' }}
                >
                  <td data-label="Tipo">{documento.tipo}</td>
                  <td data-label="Descripción">{documento.descripcion}</td>
                  <td data-label="Versión">{documento.version}</td>
                  <td data-label="Fecha de inicio">{new Date(documento.fechaInicio).toLocaleDateString()}</td>
                  <td data-label="Fecha fin">
                    {documento.fechaFin
                      ? new Date(documento.fechaFin).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td data-label="Vigencia">{documento.vigente ? 'Sí' : 'No'}</td>
                  <td data-label="Acciones">
                    {!documento.eliminado && documento.vigente && (
                      <button
                        className="btn-modificar"
                        onClick={() => abrirModalEditar(documento)}
                      >
                        Modificar
                      </button>
                    )}
                    {!documento.vigente && !documento.eliminado && (
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarDocumento(documento._id)}
                      >
                        Eliminar
                      </button>
                    )}
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
                    <select
                      name="tipo"
                      value={formDataCrear.tipo}
                      onChange={handleChangeCrear}
                      required
                    >
                      <option value="">Seleccione un tipo</option>
                      <option value="Políticas de privacidad">
                        Políticas de privacidad
                      </option>
                      <option value="Deslinde">Deslinde</option>
                      <option value="Términos y condiciones">
                        Términos y condiciones
                      </option>
                    </select>
                  </label>
                </>
              )}
              <label>
                Descripción
                <textarea
                  name="descripcion"
                  value={
                    isEditing ? formDataEditar.descripcion : formDataCrear.descripcion
                  }
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

      <footer className="footer">
        <img src={logo} alt="Logo Beatbox" className="logo-footer" />
        <div className="linea-separacion"></div>
        <h2>Síguenos</h2>
        <div className="redes-sociales">
          <a href="#">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
        <div className="linea-separacion"></div>
        <div className="footer-secciones">
          <div>
            <h3>Beatbox</h3>
            <ul>
              <li>
                <a href="#">Quiénes somos</a>
              </li>
              <li>
                <a href="#">Contáctanos</a>
              </li>
              <li>
                <a href="#">Aviso de Privacidad</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentosRegulatoriosAdmin;
