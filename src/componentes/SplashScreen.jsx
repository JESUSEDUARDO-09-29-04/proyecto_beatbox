import React, { useEffect } from "react";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500); // muestra por 2.5 segundos
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        backgroundColor: "#ffffff", // Fondo blanco
        color: "#000000", // Texto negro
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <img
        src="/icons/icon-192x192.png" // o la ruta de tu logo
        alt="logo"
        width="120"
        style={{ marginBottom: "20px" }}
      />
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>BeatBox Web App</h1>
      <p style={{ fontSize: "1rem" }}>Cargando...</p>
    </div>
  );
};

export default SplashScreen;
