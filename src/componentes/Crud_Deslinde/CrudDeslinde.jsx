import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CrudDeslinde.css';
import '../home/Home.css';
import logo from '../../assets/logo.png';  // Usamos tu logo

const CrudDeslinde = () => {
  const [documentos, setDocumentos] = useState([]);
  const [nuevoDocumento, setNuevoDocumento] = useState({
    tipo: '',
    descripcion: '',
    version: '',
    fechaInicio: '',
    fechaFin: '',
    vigente: true,
    eliminado: false,
  });
  const [editando, setEditando] = useState(null);  // Para gestionar la edición de un documento
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Función para obtener documentos del servidor
  const obtenerDocumentos = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://beatbox-blond.vercel.app/documento-regulatorio', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDocumentos(data);
    } catch (error) {
      console.error('Error al obtener los documentos:', error);
    }
  };

  // Ejecutar cuando el componente se monte
  useEffect(() => {
    obtenerDocumentos();
  }, []);

  // Añadir nuevo documento
  const agregarDocumento = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://beatbox-blond.vercel.app/documento-regulatorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoDocumento),
      });
      if (response.ok) {
        obtenerDocumentos(); // Actualizar la lista
        setNuevoDocumento({
          tipo: '',
          descripcion: '',
          version: '',
          fechaInicio: '',
          fechaFin: '',
          vigente: true,
          eliminado: false,
        });
      }
    } catch (error) {
      console.error('Error al agregar el documento:', error);
    }
  };

  // Editar un documento
  const editarDocumento = async (documentoId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/documento-regulatorio/${documentoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoDocumento),
      });
      if (response.ok) {
        obtenerDocumentos(); // Actualizar la lista
        setEditando(null); // Finalizar edición
      }
    } catch (error) {
      console.error('Error al editar el documento:', error);
    }
  };

  // Eliminar un documento
  const eliminarDocumento = async (documentoId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://beatbox-blond.vercel.app/documento-regulatorio/${documentoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        obtenerDocumentos(); // Actualizar la lista
      }
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
    }
  };

  // Cambiar modo de edición
  const comenzarEdicion = (documento) => {
    setNuevoDocumento(documento);
    setEditando(documento.id);
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <div className="contenedor">
      <header className="navbar">
        <img src={logo} alt="Logo Beatbox" className="logo" />
        <div className="nav-enlaces">
          <button className="menu-icono" onClick={toggleMenu}>☰</button>
        </div>
      </header>

      {/* Menú Desplegable */}
      <div className={`menu-desplegable ${menuAbierto ? 'activo' : ''}`}>
        <button className="btn-cerrar" onClick={toggleMenu}>✖</button>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/gimnasios">Gimnasios</Link></li>
          <li><Link to="/planes">Planes</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/contacto">Contáctanos</Link></li>
        </ul>
      </div>

      <div className="crud-content">
        <h2>CRUD de Documentos Deslinde</h2>

        {/* Listado de documentos */}
        <table className="crud-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Versión</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documentos.map((documento) => (
              <tr key={documento.id}>
                <td>{documento.tipo}</td>
                <td>{documento.descripcion}</td>
                <td>{documento.version}</td>
                <td>{documento.fechaInicio}</td>
                <td>{documento.fechaFin || 'N/A'}</td>
                <td>
                  <button onClick={() => comenzarEdicion(documento)}>Editar</button>
                  <button onClick={() => eliminarDocumento(documento.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Formulario de agregar/editar */}
        <div className="crud-form">
          <h3>{editando ? 'Editar Documento' : 'Agregar Nuevo Documento'}</h3>
          <input
            type="text"
            placeholder="Tipo"
            value={nuevoDocumento.tipo}
            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, tipo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoDocumento.descripcion}
            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, descripcion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Versión"
            value={nuevoDocumento.version}
            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, version: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha Inicio"
            value={nuevoDocumento.fechaInicio}
            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, fechaInicio: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha Fin"
            value={nuevoDocumento.fechaFin}
            onChange={(e) => setNuevoDocumento({ ...nuevoDocumento, fechaFin: e.target.value })}
          />
          <button onClick={editando ? () => editarDocumento(editando) : agregarDocumento}>
            {editando ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
      </div>

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

export default CrudDeslinde;
