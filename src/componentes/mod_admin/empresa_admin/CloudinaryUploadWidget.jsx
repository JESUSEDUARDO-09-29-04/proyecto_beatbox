import React, { useEffect } from 'react';
import './CloudinaryUploadWidget.css';

const CloudinaryUploadWidget = ({ onUpload }) => {
  useEffect(() => {
    // Verifica si el script de Cloudinary ya está cargado
    const existingScript = document.querySelector(
      'script[src="http://widget.cloudinary.com/v2.0/global/all.js"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'http://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;

      script.onload = () => {
        console.log('Cloudinary script ha cargado correctamente.');
      };

      script.onerror = () => {
        console.error('Error al cargar el script de Cloudinary.');
      };

      document.body.appendChild(script);
    } else {
      console.log('El script de Cloudinary ya está cargado.');
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary no está disponible. Verifique que el script esté cargado correctamente.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dxvuv6exn', // Tu Cloud Name
        uploadPreset: 'BeatBox', // Tu Upload Preset
        sources: ['local', 'url'], // Fuentes disponibles
        folder: 'empresa_assets', // Carpeta opcional
        cropping: true, // Habilitar recorte
        croppingAspectRatio: 1, // Relación de aspecto del recorte
        multiple: false, // No permitir múltiples imágenes
        clientAllowedFormats: ['webp','png', 'jpg', 'jpeg'], // Formatos permitidos
        maxImageFileSize: 2000000, // Tamaño máximo del archivo (2 MB)
        resourceType: 'image', // Tipo de recurso
        transformation: [{ width: 300, height: 300, crop: 'limit' }], // Transformación de la imagen
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          console.log('Imagen subida con éxito. URL:', imageUrl);
          if (onUpload) {
            onUpload(imageUrl); // Notificar al padre
          }
        } else if (error) {
          console.error('Error al subir la imagen:', error);
        }
      }
    );

    widget.open(); // Abrir el widget de Cloudinary
  };

  return (
    <button onClick={openCloudinaryWidget} className="btn-cloudinary">
      Subir Logotipo
    </button>
  );
};

export default CloudinaryUploadWidget;
