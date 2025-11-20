// carrito.service.js
import axios from 'axios';

const API_URL = 'https://backendbeat-serverbeat.586pa0.easypanel.host/api/carrito'; // Ajusta según tu configuración

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Asume que el token JWT está almacenado así
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const obtenerCarrito = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    throw error;
  }
};

export const agregarProducto = async (productoId, cantidad) => {
  try {
    const response = await axios.post(
      `${API_URL}/agregar`,
      { productoId, cantidad },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    throw error;
  }
};

export const eliminarProducto = async (productoId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/eliminar/${productoId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    throw error;
  }
};

export const vaciarCarrito = async () => {
  try {
    const response = await axios.delete(`${API_URL}/vaciar`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    throw error;
  }
};