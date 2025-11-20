/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);
console.log("✅ [SW] Service Worker personalizado cargado");

// === Instalación y activación ===
self.addEventListener("install", () => {
  console.log("⚡ [SW] Instalado correctamente");
});

self.addEventListener("activate", (event) => {
  console.log("🔥 [SW] Activado y listo");
  event.waitUntil(self.clients.claim());
});

// === Notificaciones automáticas ===
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    console.log("📨 [SW] Recibido mensaje para mostrar notificación");
    self.registration.showNotification("🏋️ BeatBox Gym", {
      body: event.data.body || "¡Bienvenido! Prepárate para tu entrenamiento 💪",
      icon: "/icons/icon-512x512.png",
      badge: "/icons/icon-192x192.png",
      requireInteraction: false,
    });
  }
});


self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      const hadWindow = clientsArr.some((client) => {
        if (client.url.includes("/") && "focus" in client) {
          client.focus();
          return true;
        }
        return false;
      });
      if (!hadWindow && clients.openWindow) clients.openWindow("/");
    })
  );
});
