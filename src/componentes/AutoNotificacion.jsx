import { useEffect } from "react";

export default function AutoNotificacion() {
  useEffect(() => {
    console.log("🔔 AutoNotificacion montado");

    // Verificamos soporte
    if (!("Notification" in window)) {
      console.warn("🚫 Este navegador no soporta notificaciones.");
      return;
    }

    if (!navigator.serviceWorker) {
      console.warn("🚫 Service Worker no disponible.");
      return;
    }

    // Solicitamos permiso y luego enviamos notificación
    if (Notification.permission === "granted") {
      enviarNotificacion();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permiso) => {
        console.log("🧩 Permiso actual:", permiso);
        if (permiso === "granted") {
          enviarNotificacion();
        } else {
          console.warn("⚠️ Notificaciones denegadas por el usuario");
        }
      });
    }
  }, []);

  const enviarNotificacion = () => {
    console.log("📨 Preparando mensaje al SW...");

    // Esperar a que el SW esté listo antes de enviar
    navigator.serviceWorker.ready
      .then((registration) => {
        console.log("📬 Service Worker listo, enviando mensaje...");
        registration.active?.postMessage({
          type: "SHOW_NOTIFICATION",
          body: "¡Bienvenido a BeatBox Gym! 💪 Disfruta tu entrenamiento hoy.",
        });
      })
      .catch((err) => console.error("❌ Error enviando al SW:", err));
  };

  return null;
}
