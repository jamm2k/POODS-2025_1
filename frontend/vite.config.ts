import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate', // Mantém o PWA sempre atualizado
      // Inclui o manifest.json e os ícones
      manifest: {
        name: 'Sistema de Restaurante',
        short_name: 'RestauranteApp',
        description: 'Sistema de gerenciamento de pedidos para o restaurante.',
        theme_color: '#ffffff', // Cor da barra de ferramentas do app
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      // Configuração do Service Worker com Workbox
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'] // Define quais arquivos serão cacheados
      }
    })
  ],
})
