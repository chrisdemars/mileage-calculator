import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Mileage Calculator',
        short_name: 'MileCalc',
        theme_color: '#1d4ed8',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.openrouteservice\.org/,
            handler: 'NetworkFirst',
          },
          {
            urlPattern: /^https:\/\/api\.eia\.gov/,
            handler: 'NetworkFirst',
          },
          {
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org/,
            handler: 'NetworkFirst',
          },
        ],
      },
    }),
  ],
});
