import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Caminho base da publicação.
 *
 * GitHub Pages serve o app em /<repo>/, então o CI passa BASE_PATH=/Reinoup/.
 * Em domínio próprio (ou Cloudflare Pages) fica '/' — o padrão.
 * Sempre com barra no fim: o manifest e os ícones concatenam em cima dele.
 */
const base = process.env.BASE_PATH ?? '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ReinoUp — Aprender a Bíblia brincando',
        short_name: 'ReinoUp',
        description: 'Fé, progresso e descobertas. Histórias bíblicas interativas, jogos e desafios para crianças.',
        theme_color: '#14213D',
        background_color: '#FFFBF0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        lang: 'pt-BR',
        icons: [
          { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
          { src: `${base}icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        importScripts: [`${base}retire-narration-cache.js`],
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,woff2}'],
        runtimeCaching: [{
          urlPattern: /\/audio\/stories\/.*\.(?:mp3|json)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'story-narration-v2',
            expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] },
          },
        }],
      },
    }),
  ],
})
