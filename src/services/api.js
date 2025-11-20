// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://proyecto-7mo.vercel.app/api'; // Tu URL base en Vercel

// Auth: Registrar usuario
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Auth: Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Usuarios: Obtener lista de usuarios
export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/usuarios`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Usuarios: Obtener un usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
