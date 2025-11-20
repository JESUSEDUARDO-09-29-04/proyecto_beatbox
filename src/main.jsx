// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ThemeProvider from './context/ThemeContext'; // Importar el ThemeProvider

// ✅ Renderizar la app con el contexto de tema
ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);

// ✅ Registrar el Service Worker para convertir en PWA
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    console.log('Hay una nueva versión disponible.');
  },
  onOfflineReady() {
    console.log('La app está lista para usarse sin conexión.');
  },
});
