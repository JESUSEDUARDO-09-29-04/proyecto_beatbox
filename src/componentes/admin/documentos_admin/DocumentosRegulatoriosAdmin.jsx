import React, { useState } from 'react';
import '../../home/Home.css';
import './DocumentosRegulatoriosAdmin.css'; // Asegúrate de crear este archivo CSS para los estilos específicos
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../adminMenu';

const DocumentosRegulatoriosAdmin = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Estado para los documentos
  const [documentos, setDocumentos] = useState([
    { id: 1, tipo: "Políticas de privacidad", descripcion: "Descripción del documento de Políticas de Privacidad", version: "1.0", fechaInicio: "2024-10-10", fechaFin: null, vigente: true },
    { id: 2, tipo: "Deslinde", descripcion: "Descripción del documento de Deslinde", version: "1.0", fechaInicio: "2024-10-10", fechaFin: null, vigente: false },
    { id: 3, tipo: "Aviso de privacidad", descripcion: "Descripción del documento de aviso de privacidad", version: "1.0", fechaInicio: "2024-10-10", fechaFin: null, vigente: false },
    // Más documentos
  ]);

  // Función para agregar un nuevo documento
  const agregarDocumento = () => {
    // Lógica para agregar un nuevo documento
    alert("Agregar nuevo documento");
  };

  // Función para modificar un documento
  const modificarDocumento = (id) => {
    // Lógica para modificar el documento con el ID proporcionado
    alert(`Modificar documento con ID: ${id}`);
  };

  // Función para eliminar un documento
  const eliminarDocumento = (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este documento?");
    if (confirmar) {
      setDocumentos(documentos.filter((doc) => doc.id !== id));
      alert(`Documento con ID: ${id} eliminado`);
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
            <button className="btn-agregar" onClick={agregarDocumento}>Agregar nuevo documento</button>
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
                <tr key={documento.id}>
                  <td>{documento.tipo}</td>
                  <td>{documento.descripcion}</td>
                  <td>{documento.version}</td>
                  <td>{documento.fechaInicio}</td>
                  <td>{documento.fechaFin || "N/A"}</td>
                  <td>{documento.vigente ? "Sí" : "No"}</td>
                  <td>
                    <button
                      className="btn-modificar"
                      onClick={() => modificarDocumento(documento.id)}
                    >
                      Modificar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarDocumento(documento.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
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

export default DocumentosRegulatoriosAdmin;
