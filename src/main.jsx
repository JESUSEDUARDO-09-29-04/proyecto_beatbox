// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ThemeProvider from './context/ThemeContext'; // Importar el ThemeProvider
import { AuthProvider } from './context/AuthContext'; // Importa el proveedor de autenticación

ReactDOM.render(
  <ThemeProvider>
        <App />
  </ThemeProvider> ,
  document.getElementById('root')
);
