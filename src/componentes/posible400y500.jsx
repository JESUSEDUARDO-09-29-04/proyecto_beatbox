import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 📌 Para redirigir si hay error

  useEffect(() => {
    fetch('http://api.ejemplo.com/productos')  // URL de tu API
      .then(response => {
        if (!response.ok) {
          if (response.status === 400) navigate('/error-400'); // 🚨 Error 400
          if (response.status === 500) navigate('/error-500'); // 🚨 Error 500
          throw new Error(`Error ${response.status}`);
        }
        return response.json();
      })
      .then(data => setProductos(data))
      .catch(error => console.error('Error al obtener productos:', error))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div>
      <h1>Lista de Productos</h1>
      {loading ? <p>Cargando...</p> : productos.map(p => <p key={p.id}>{p.nombre}</p>)}
    </div>
  );
};

export default Productos;
