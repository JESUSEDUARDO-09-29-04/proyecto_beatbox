import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
        'offline.html'
      ],
      manifest: {
        name: 'BeatBox Frona',
        short_name: 'BeatBox',
        description: 'Aplicación web progresiva de BeatBox Frona',
        theme_color: '#0d6efd',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable_icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-stylesheets' }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },

          // Imágenes
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },

          // CSS, JS y Workers
          {
            urlPattern: ({ request }) =>
              ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'assets' }
          },

          // API dinámica (productos y categorías) - Usar la URL completa del backend en producción
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin ||
              url.origin === 'https://backendbeat-serverbeat.586pa0.easypanel.host' ||
              url.pathname.startsWith('/productos') ||
              url.pathname.startsWith('/categorias') ||
              url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-dinamica',
              networkTimeoutSeconds: 10,
              fetchOptions: { mode: 'cors' },
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 3 }
            }
          },

          // Páginas accesibles sin conexión
          {
            urlPattern: ({ url }) =>
              [
                '/',                           // Home
                '/Tienda',
                '/tienda',
                '/detalle-producto',
                '/carrito',
                '/perfil',
                '/suscripcion',
                '/suscripcion/confirmacion',
                '/quienes_somos',
                '/aviso_privacidad',
                '/contactanos',
                '/Preguntas_Frecuentes',
                '/error404',
                '/error400',
                '/error500'
              ].some(path => url.pathname.startsWith(path)),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'paginas-offline',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 días
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },

          // App Shell (estructura SPA + fallback)
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-shell',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 10 },
              cacheableResponse: { statuses: [0, 200] },
              plugins: [
                {
                  handlerDidError: async () => {
                    return caches.match('/offline.html')
                  }
                }
              ]
            }
          }
        ]
      }
    })
  ],

  // Elimina la configuración del proxy, ya no es necesaria en producción
  server: {
    proxy: {}  // Elimina el proxy para producción
  },

  base: '/',
  build: { outDir: 'dist', assetsDir: 'assets' }
})
