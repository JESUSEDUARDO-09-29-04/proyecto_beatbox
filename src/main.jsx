import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Ruta relativa a App.jsx
import './index.css';     // Asegúrate de que este archivo exista

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
