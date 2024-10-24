import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProvider from './context/ThemeContext'; // Importa el ThemeProvider aquí

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>  {/* Envuelve toda tu aplicación */}
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>
);
