import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { VitePWA } from 'vite-plugin-pwa'
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        theme_color: '#274801',
        background_color: '#152601',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        name: 'Field Manager',
        short_name: 'Field Manager',
        description: 'Manage Youth Soccer FIelds',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
