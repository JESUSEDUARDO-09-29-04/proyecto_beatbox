/* eslint-disable no-restricted-globals */

// === INSTALACIÓN ===
self.addEventListener("install", (event) => {
  console.log("[SW] Instalado correctamente");
  self.skipWaiting(); // activa inmediatamente sin esperar al anterior
});

// === ACTIVACIÓN ===
self.addEventListener("activate", (event) => {
  console.log("[SW] Activado y listo para recibir eventos");
  return self.clients.claim();
});

// === FETCH (manejo básico de caché) ===
self.addEventListener("fetch", (event) => {
  // Si lo deseas, puedes agregar aquí políticas de cache
  // Ejemplo:
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return response || fetch(event.request);
  //   })
  // );
});

// === PUSH (notificaciones en segundo plano) ===
self.addEventListener("push", (event) => {
  console.log("[SW] Push recibido:", event.data?.text());
  const data = event.data ? event.data.json() : {};

  const title = data.title || "BeatBox 🏋️‍♀️";
  const options = {
    body: data.body || "¡Nueva clase o promoción disponible!",
    icon: "/logo192.png",
    badge: "/logo192.png",
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// === CLICK EN NOTIFICACIÓN ===
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
    clients.openWindow("/")
  );
});