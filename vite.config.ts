import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Publicado en GitHub Pages bajo /apptraino/
  base: '/apptraino/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Incluye las imágenes de ejercicios para que funcione sin internet
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg}'],
        // La tipografía Inter queda guardada para usar la app sin conexión
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'fuentes', expiration: { maxEntries: 20, maxAgeSeconds: 31_536_000 } },
          },
        ],
      },
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Apptraino',
        short_name: 'Apptraino',
        description: 'Rutina principiante de calistenia: tren superior + tren inferior',
        lang: 'es',
        theme_color: '#181a1d',
        background_color: '#181a1d',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
